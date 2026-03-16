from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PERF_DIR = ROOT / "backend" / "perf"
DEFAULT_RESULTS_DIR = PERF_DIR / "results" / "matrix"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass(frozen=True)
class Scenario:
    name: str
    users: int
    spawn_rate: float
    run_time: str


def _load_summary(summary_path: Path) -> dict[str, object]:
    return json.loads(summary_path.read_text(encoding="utf-8"))


def _run_scenario(
    scenario: Scenario,
    args: argparse.Namespace,
    suite_results_dir: Path,
) -> dict[str, object]:
    command = [
        sys.executable,
        str(PERF_DIR / "run_suite.py"),
        "--host",
        args.host,
        "--scenario-name",
        scenario.name,
        "--users",
        str(scenario.users),
        "--spawn-rate",
        str(scenario.spawn_rate),
        "--run-time",
        scenario.run_time,
        "--results-dir",
        str(suite_results_dir),
    ]

    if args.pid is not None:
        command.extend(["--pid", str(args.pid)])
    elif args.container_name:
        command.extend(["--container-name", args.container_name])

    if args.memory_interval_seconds is not None:
        command.extend(["--memory-interval-seconds", str(args.memory_interval_seconds)])
    if args.max_p95_ms is not None:
        command.extend(["--max-p95-ms", str(args.max_p95_ms)])
    if args.min_rps is not None:
        command.extend(["--min-rps", str(args.min_rps)])
    if args.max_failure_rate_pct is not None:
        command.extend(["--max-failure-rate-pct", str(args.max_failure_rate_pct)])
    if args.max_peak_memory_mb is not None:
        command.extend(["--max-peak-memory-mb", str(args.max_peak_memory_mb)])

    completed = subprocess.run(command, cwd=str(ROOT), text=True, capture_output=True, check=False)
    stdout_path = suite_results_dir / "matrix_runner_stdout.log"
    stderr_path = suite_results_dir / "matrix_runner_stderr.log"
    stdout_path.write_text(completed.stdout, encoding="utf-8")
    stderr_path.write_text(completed.stderr, encoding="utf-8")

    if completed.returncode != 0:
        raise RuntimeError(
            f"Scenario {scenario.name} failed with exit code {completed.returncode}. "
            f"See {stdout_path} and {stderr_path}."
        )

    return _load_summary(suite_results_dir / "backend_perf_summary.json")


def _detect_degradation(summaries: list[dict[str, object]]) -> dict[str, object]:
    if not summaries:
        return {
            "first_failure_or_latency_regression": None,
            "reason": "No scenarios executed.",
        }

    baseline = summaries[0]["performance"]
    baseline_p95 = float(baseline["p95_response_time_ms"])
    first_degraded: dict[str, object] | None = None

    for summary in summaries:
        perf = summary["performance"]
        if float(perf["failure_rate_pct"]) > 0:
            first_degraded = {
                "scenario_name": summary["scenario_name"],
                "reason": "Failures observed",
                "failure_rate_pct": perf["failure_rate_pct"],
                "p95_response_time_ms": perf["p95_response_time_ms"],
            }
            break
        if baseline_p95 > 0 and float(perf["p95_response_time_ms"]) >= baseline_p95 * 2:
            first_degraded = {
                "scenario_name": summary["scenario_name"],
                "reason": "P95 latency doubled relative to the baseline scenario",
                "failure_rate_pct": perf["failure_rate_pct"],
                "p95_response_time_ms": perf["p95_response_time_ms"],
            }
            break

    return {
        "first_failure_or_latency_regression": first_degraded,
        "reason": "No degradation trigger met." if first_degraded is None else None,
    }


def _render_markdown(report: dict[str, object]) -> str:
    lines = [
        "# Backend Performance Matrix",
        "",
        f"- Generated: {report['generated_at']}",
        f"- Host: {report['host']}",
        "",
        "| Scenario | Users | Runtime | Avg ms | P95 ms | Fail % | RPS | Peak MB |",
        "| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |",
    ]

    for summary in report["scenarios"]:
        perf = summary["performance"]
        memory = summary["memory"]
        lines.append(
            "| {name} | {users} | {runtime} | {avg} | {p95} | {fail} | {rps} | {peak_mb} |".format(
                name=summary["scenario_name"],
                users=summary["configured_users"],
                runtime=summary["run_time"],
                avg=perf["avg_response_time_ms"],
                p95=perf["p95_response_time_ms"],
                fail=perf["failure_rate_pct"],
                rps=perf["requests_per_second"],
                peak_mb=memory["peak_mb"] if memory["peak_mb"] is not None else "n/a",
            )
        )

    degradation = report["degradation"]
    lines.extend(["", "## Degradation"])
    if degradation["first_failure_or_latency_regression"] is None:
        lines.append(f"- {degradation['reason']}")
    else:
        item = degradation["first_failure_or_latency_regression"]
        lines.append(
            f"- First degraded scenario: {item['scenario_name']} ({item['reason']}, "
            f"p95={item['p95_response_time_ms']} ms, fail={item['failure_rate_pct']}%)"
        )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run a soak scenario and stepped-load scenarios, then aggregate the results."
    )
    parser.add_argument("--host", default="http://127.0.0.1:8000", help="Target backend base URL")
    parser.add_argument("--results-dir", default=str(DEFAULT_RESULTS_DIR), help="Base output directory")
    parser.add_argument("--pid", type=int, default=None, help="Backend PID for memory monitoring")
    parser.add_argument(
        "--container-name",
        default="samudhyan_backend",
        help="Docker container name for memory monitoring when --pid is not supplied",
    )
    parser.add_argument("--memory-interval-seconds", type=float, default=5.0)
    parser.add_argument("--soak-duration", default="5m", help="Duration for the soak scenario, e.g. 5m or 15m")
    parser.add_argument("--soak-users", type=int, default=20, help="Concurrent users for the soak scenario")
    parser.add_argument("--soak-spawn-rate", type=float, default=5.0, help="Spawn rate for the soak scenario")
    parser.add_argument(
        "--step-users",
        default="50,100",
        help="Comma-separated user counts for stepped load scenarios",
    )
    parser.add_argument("--step-duration", default="2m", help="Duration for each stepped-load scenario")
    parser.add_argument("--step-spawn-rate", type=float, default=10.0, help="Spawn rate for stepped scenarios")
    parser.add_argument("--max-p95-ms", type=float, default=None)
    parser.add_argument("--min-rps", type=float, default=None)
    parser.add_argument("--max-failure-rate-pct", type=float, default=None)
    parser.add_argument("--max-peak-memory-mb", type=float, default=None)
    args = parser.parse_args()

    step_user_counts = [int(item.strip()) for item in args.step_users.split(",") if item.strip()]
    scenarios = [
        Scenario(
            name=f"soak-{args.soak_duration}",
            users=args.soak_users,
            spawn_rate=args.soak_spawn_rate,
            run_time=args.soak_duration,
        ),
        *[
            Scenario(
                name=f"step-{users}-users",
                users=users,
                spawn_rate=args.step_spawn_rate,
                run_time=args.step_duration,
            )
            for users in step_user_counts
        ],
    ]

    results_dir = Path(args.results_dir).resolve()
    results_dir.mkdir(parents=True, exist_ok=True)

    summaries: list[dict[str, object]] = []
    for scenario in scenarios:
        scenario_dir = results_dir / scenario.name
        scenario_dir.mkdir(parents=True, exist_ok=True)
        summaries.append(_run_scenario(scenario, args, scenario_dir))

    report = {
        "generated_at": _now_iso(),
        "host": args.host,
        "scenarios": summaries,
        "degradation": _detect_degradation(summaries),
    }

    summary_path = results_dir / "backend_perf_matrix_summary.json"
    markdown_path = results_dir / "backend_perf_matrix_summary.md"
    summary_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    markdown_path.write_text(_render_markdown(report), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
