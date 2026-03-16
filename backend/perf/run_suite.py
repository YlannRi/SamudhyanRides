from __future__ import annotations

import argparse
import csv
import json
import shutil
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable


ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT / "backend"
PERF_DIR = BACKEND_DIR / "perf"
DEFAULT_RESULTS_DIR = PERF_DIR / "results"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _parse_duration_to_seconds(value: str) -> float:
    raw = value.strip().lower()
    if raw.endswith("ms"):
        return float(raw[:-2]) / 1000.0
    if raw.endswith("s"):
        return float(raw[:-1])
    if raw.endswith("m"):
        return float(raw[:-1]) * 60.0
    if raw.endswith("h"):
        return float(raw[:-1]) * 3600.0
    return float(raw)


def _parse_size_to_mb(value: str) -> float:
    raw = value.strip().upper()
    unit_multipliers = [
        ("GIB", 1024.0),
        ("GB", 1000.0),
        ("MIB", 1.0),
        ("MB", 1.0),
        ("KIB", 1 / 1024),
        ("KB", 1 / 1000),
        ("B", 1 / (1024 * 1024)),
    ]
    for unit, multiplier in unit_multipliers:
        if raw.endswith(unit):
            number = raw[: -len(unit)].strip()
            return float(number) * multiplier
    raise ValueError(f"Unsupported memory unit: {value}")


def _read_aggregated_stats(csv_path: Path) -> dict[str, float]:
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            if row.get("Name") != "Aggregated":
                continue
            request_count = int(float(row.get("Request Count") or 0))
            failure_count = int(float(row.get("Failure Count") or 0))
            return {
                "request_count": request_count,
                "failure_count": failure_count,
                "failure_rate_pct": (failure_count / request_count * 100.0) if request_count else 0.0,
                "avg_response_time_ms": float(row.get("Average Response Time") or 0.0),
                "median_response_time_ms": float(row.get("Median Response Time") or 0.0),
                "p95_response_time_ms": float(row.get("95%") or 0.0),
                "max_response_time_ms": float(row.get("Max Response Time") or 0.0),
                "requests_per_second": float(row.get("Requests/s") or 0.0),
            }
    raise RuntimeError(f"Could not find aggregated stats row in {csv_path}")


def _read_max_history_rps(csv_path: Path) -> float:
    if not csv_path.exists():
        return 0.0
    max_rps = 0.0
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            if row.get("Name") != "Aggregated":
                continue
            max_rps = max(max_rps, float(row.get("Requests/s") or 0.0))
    return max_rps


@dataclass
class MemorySnapshot:
    timestamp: str
    rss_mb: float


class MemoryMonitor:
    def __init__(self, sampler: Callable[[], float], source: str, interval_seconds: float) -> None:
        self._sampler = sampler
        self.source = source
        self.interval_seconds = interval_seconds
        self.samples: list[MemorySnapshot] = []
        self.errors: list[str] = []
        self._stop_event = threading.Event()
        self._thread = threading.Thread(target=self._run, daemon=True)

    def start(self) -> None:
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        self._thread.join(timeout=max(self.interval_seconds * 2, 2.0))

    def summary(self) -> dict[str, object]:
        if not self.samples:
            return {
                "source": self.source,
                "available": False,
                "sample_count": 0,
                "peak_mb": None,
                "average_mb": None,
                "errors": self.errors,
            }
        values = [sample.rss_mb for sample in self.samples]
        return {
            "source": self.source,
            "available": True,
            "sample_count": len(self.samples),
            "peak_mb": round(max(values), 2),
            "average_mb": round(sum(values) / len(values), 2),
            "errors": self.errors,
        }

    def _run(self) -> None:
        while not self._stop_event.is_set():
            try:
                value = self._sampler()
                self.samples.append(MemorySnapshot(timestamp=_now_iso(), rss_mb=round(value, 2)))
            except Exception as exc:  # pragma: no cover - best-effort telemetry
                self.errors.append(str(exc))
                break
            if self._stop_event.wait(self.interval_seconds):
                break


def _build_pid_sampler(pid: int) -> Callable[[], float]:
    try:
        import psutil
    except ImportError as exc:  # pragma: no cover - import is runtime-environment specific
        raise RuntimeError("psutil is required for PID-based memory monitoring") from exc

    process = psutil.Process(pid)

    def sample() -> float:
        return process.memory_info().rss / (1024 * 1024)

    return sample


def _docker_container_running(container_name: str) -> bool:
    docker_binary = shutil.which("docker")
    if not docker_binary:
        return False
    result = subprocess.run(
        [docker_binary, "inspect", "-f", "{{.State.Running}}", container_name],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.returncode == 0 and result.stdout.strip().lower() == "true"


def _build_docker_sampler(container_name: str) -> Callable[[], float]:
    docker_binary = shutil.which("docker")
    if not docker_binary:
        raise RuntimeError("docker is not installed or not on PATH")

    def sample() -> float:
        result = subprocess.run(
            [docker_binary, "stats", "--no-stream", "--format", "{{.MemUsage}}", container_name],
            capture_output=True,
            text=True,
            check=True,
        )
        used_value = result.stdout.strip().split("/", 1)[0].strip()
        return _parse_size_to_mb(used_value)

    return sample


def _select_memory_monitor(args: argparse.Namespace) -> tuple[MemoryMonitor | None, list[str]]:
    errors: list[str] = []
    if args.pid is not None:
        try:
            return (
                MemoryMonitor(
                    sampler=_build_pid_sampler(args.pid),
                    source=f"pid:{args.pid}",
                    interval_seconds=args.memory_interval_seconds,
                ),
                errors,
            )
        except Exception as exc:
            errors.append(f"PID memory monitor unavailable: {exc}")
    if args.container_name and _docker_container_running(args.container_name):
        try:
            return (
                MemoryMonitor(
                    sampler=_build_docker_sampler(args.container_name),
                    source=f"docker:{args.container_name}",
                    interval_seconds=args.memory_interval_seconds,
                ),
                errors,
            )
        except Exception as exc:
            errors.append(f"Docker memory monitor unavailable: {exc}")
    return None, errors


def _render_markdown(summary: dict[str, object]) -> str:
    perf = summary["performance"]
    memory = summary["memory"]
    return "\n".join(
        [
            "# Backend Performance Summary",
            "",
            f"- Generated: {summary['generated_at']}",
            f"- Host: {summary['host']}",
            f"- Duration: {summary['run_time']}",
            f"- Configured concurrency: {summary['configured_users']} users",
            f"- Spawn rate: {summary['spawn_rate']} users/s",
            f"- Requests: {perf['request_count']}",
            f"- Failures: {perf['failure_count']} ({perf['failure_rate_pct']}%)",
            f"- Average response time: {perf['avg_response_time_ms']} ms",
            f"- Median response time: {perf['median_response_time_ms']} ms",
            f"- P95 response time: {perf['p95_response_time_ms']} ms",
            f"- Max response time: {perf['max_response_time_ms']} ms",
            f"- Throughput: {perf['requests_per_second']} req/s",
            f"- Peak throughput: {perf['peak_requests_per_second']} req/s",
            f"- Memory source: {memory['source']}",
            f"- Memory available: {memory['available']}",
            f"- Peak memory: {memory['peak_mb']} MB",
            f"- Average memory: {memory['average_mb']} MB",
        ]
    )


def _check_thresholds(summary: dict[str, object], args: argparse.Namespace) -> list[str]:
    perf = summary["performance"]
    memory = summary["memory"]
    failures: list[str] = []

    if args.max_p95_ms is not None and perf["p95_response_time_ms"] > args.max_p95_ms:
        failures.append(
            f"p95 response time {perf['p95_response_time_ms']} ms exceeded threshold {args.max_p95_ms} ms"
        )
    if args.min_rps is not None and perf["requests_per_second"] < args.min_rps:
        failures.append(
            f"throughput {perf['requests_per_second']} req/s was below threshold {args.min_rps} req/s"
        )
    if args.max_failure_rate_pct is not None and perf["failure_rate_pct"] > args.max_failure_rate_pct:
        failures.append(
            f"failure rate {perf['failure_rate_pct']}% exceeded threshold {args.max_failure_rate_pct}%"
        )
    if args.max_peak_memory_mb is not None and memory.get("peak_mb") is not None:
        if float(memory["peak_mb"]) > args.max_peak_memory_mb:
            failures.append(
                f"peak memory {memory['peak_mb']} MB exceeded threshold {args.max_peak_memory_mb} MB"
            )
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run a headless backend performance suite and summarize response time, throughput, concurrency, and memory."
    )
    parser.add_argument("--host", default="http://127.0.0.1:8000", help="Target backend base URL")
    parser.add_argument("--scenario-name", default="single-run", help="Scenario label written into the summary")
    parser.add_argument("--users", type=int, default=20, help="Target concurrent users")
    parser.add_argument("--spawn-rate", type=float, default=5.0, help="User ramp-up rate per second")
    parser.add_argument("--run-time", default="30s", help="Locust run time, e.g. 30s, 2m")
    parser.add_argument(
        "--results-dir",
        default=str(DEFAULT_RESULTS_DIR),
        help="Directory to write CSV, HTML, JSON, and Markdown reports",
    )
    parser.add_argument(
        "--container-name",
        default="samudhyan_backend",
        help="Docker container name to sample for memory if --pid is not supplied",
    )
    parser.add_argument("--pid", type=int, default=None, help="Backend process PID for direct memory sampling")
    parser.add_argument(
        "--memory-interval-seconds",
        type=float,
        default=1.0,
        help="Sampling interval for memory metrics",
    )
    parser.add_argument("--max-p95-ms", type=float, default=None, help="Optional performance gate for p95 latency")
    parser.add_argument("--min-rps", type=float, default=None, help="Optional performance gate for throughput")
    parser.add_argument(
        "--max-failure-rate-pct",
        type=float,
        default=None,
        help="Optional performance gate for failure rate percentage",
    )
    parser.add_argument(
        "--max-peak-memory-mb",
        type=float,
        default=None,
        help="Optional performance gate for peak memory usage",
    )
    args = parser.parse_args()

    results_dir = Path(args.results_dir).resolve()
    results_dir.mkdir(parents=True, exist_ok=True)
    prefix = results_dir / "backend_perf"
    csv_prefix = str(prefix)
    html_path = prefix.with_suffix(".html")

    command = [
        sys.executable,
        "-m",
        "locust",
        "-f",
        str(PERF_DIR / "locustfile.py"),
        "--headless",
        "--host",
        args.host,
        "-u",
        str(args.users),
        "-r",
        str(args.spawn_rate),
        "-t",
        args.run_time,
        "--csv",
        csv_prefix,
        "--html",
        str(html_path),
        "--only-summary",
    ]

    monitor, memory_setup_errors = _select_memory_monitor(args)
    if monitor:
        monitor.start()

    started_at = _now_iso()
    run_result = subprocess.run(command, cwd=str(ROOT), text=True, capture_output=True, check=False)
    finished_at = _now_iso()

    if monitor:
        monitor.stop()

    stdout_path = results_dir / "backend_perf_stdout.log"
    stderr_path = results_dir / "backend_perf_stderr.log"
    stdout_path.write_text(run_result.stdout, encoding="utf-8")
    stderr_path.write_text(run_result.stderr, encoding="utf-8")

    stats_path = Path(f"{csv_prefix}_stats.csv")
    history_path = Path(f"{csv_prefix}_stats_history.csv")
    if run_result.returncode != 0:
        raise SystemExit(
            f"Locust exited with code {run_result.returncode}. See {stdout_path} and {stderr_path} for details."
        )
    if not stats_path.exists():
        raise SystemExit(f"Expected stats CSV was not generated at {stats_path}")

    performance = _read_aggregated_stats(stats_path)
    performance["peak_requests_per_second"] = round(
        max(_read_max_history_rps(history_path), performance["requests_per_second"]),
        2,
    )
    for key in list(performance.keys()):
        if isinstance(performance[key], float):
            performance[key] = round(performance[key], 2)

    memory_summary = (
        monitor.summary()
        if monitor
        else {
            "source": "unavailable",
            "available": False,
            "sample_count": 0,
            "peak_mb": None,
            "average_mb": None,
            "errors": memory_setup_errors or ["No PID or running Docker container was available for memory sampling."],
        }
    )

    summary = {
        "generated_at": finished_at,
        "started_at": started_at,
        "finished_at": finished_at,
        "scenario_name": args.scenario_name,
        "host": args.host,
        "run_time": args.run_time,
        "run_time_seconds": round(_parse_duration_to_seconds(args.run_time), 2),
        "configured_users": args.users,
        "spawn_rate": args.spawn_rate,
        "performance": performance,
        "memory": memory_summary,
        "artifacts": {
            "html_report": str(html_path),
            "stats_csv": str(stats_path),
            "history_csv": str(history_path),
            "stdout_log": str(stdout_path),
            "stderr_log": str(stderr_path),
        },
    }

    threshold_failures = _check_thresholds(summary, args)
    summary["threshold_failures"] = threshold_failures

    summary_path = results_dir / "backend_perf_summary.json"
    markdown_path = results_dir / "backend_perf_summary.md"
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    markdown_path.write_text(_render_markdown(summary), encoding="utf-8")

    print(json.dumps(summary, indent=2))

    if threshold_failures:
        for failure in threshold_failures:
            print(f"THRESHOLD FAILED: {failure}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
