from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PERF_DIR = ROOT / "backend" / "perf"
DEFAULT_RESULTS_DIR = PERF_DIR / "results" / "ramp"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _load_summary(summary_path: Path) -> dict[str, object]:
    return json.loads(summary_path.read_text(encoding="utf-8"))


def _render_markdown(report: dict[str, object]) -> str:
    lines = [
        "# Backend Ramp Summary",
        "",
        f"- Generated: {report['generated_at']}",
        f"- Host: {report['host']}",
        f"- Failure threshold: {report['failure_rate_threshold_pct']}%",
        "",
        "| Scenario | Users | Runtime | Fail % | Avg ms | P95 ms | RPS |",
        "| --- | ---: | --- | ---: | ---: | ---: | ---: |",
    ]

    for summary in report["scenarios"]:
        perf = summary["performance"]
        lines.append(
            "| {name} | {users} | {runtime} | {fail} | {avg} | {p95} | {rps} |".format(
                name=summary["scenario_name"],
                users=summary["configured_users"],
                runtime=summary["run_time"],
                fail=perf["failure_rate_pct"],
                avg=perf["avg_response_time_ms"],
                p95=perf["p95_response_time_ms"],
                rps=perf["requests_per_second"],
            )
        )

    lines.extend(["", "## Outcome"])
    if report["stop_reason"]:
        lines.append(f"- {report['stop_reason']}")
    else:
        lines.append("- Completed all configured ramp steps without crossing the failure threshold.")

    if report["failure_point"] is not None:
        failure_point = report["failure_point"]
        lines.append(
            f"- First threshold breach at {failure_point['configured_users']} users "
            f"with failure rate {failure_point['performance']['failure_rate_pct']}%."
        )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Increase concurrency step by step until the observed failure rate exceeds a threshold."
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
    parser.add_argument("--start-users", type=int, default=25, help="Initial concurrent users")
    parser.add_argument("--step-users", type=int, default=25, help="Users added per stage")
    parser.add_argument("--max-users", type=int, default=200, help="Maximum concurrent users to test")
    parser.add_argument("--run-time", default="2m", help="Duration of each ramp stage")
    parser.add_argument("--spawn-rate", type=float, default=10.0, help="User ramp-up rate per second")
    parser.add_argument(
        "--failure-rate-threshold-pct",
        type=float,
        default=1.0,
        help="Stop once failure rate exceeds this percentage",
    )
    parser.add_argument("--max-p95-ms", type=float, default=None)
    parser.add_argument("--min-rps", type=float, default=None)
    parser.add_argument("--max-peak-memory-mb", type=float, default=None)
    args = parser.parse_args()

    if args.start_users <= 0:
        raise SystemExit("--start-users must be greater than 0")
    if args.step_users <= 0:
        raise SystemExit("--step-users must be greater than 0")
    if args.max_users < args.start_users:
        raise SystemExit("--max-users must be greater than or equal to --start-users")

    results_dir = Path(args.results_dir).resolve()
    results_dir.mkdir(parents=True, exist_ok=True)

    summaries: list[dict[str, object]] = []
    failure_point: dict[str, object] | None = None
    stop_reason: str | None = None

    current_users = args.start_users
    while current_users <= args.max_users:
        scenario_name = f"ramp-{current_users}-users"
        scenario_dir = results_dir / scenario_name
        scenario_dir.mkdir(parents=True, exist_ok=True)

        command = [
            sys.executable,
            str(PERF_DIR / "run_suite.py"),
            "--host",
            args.host,
            "--scenario-name",
            scenario_name,
            "--users",
            str(current_users),
            "--spawn-rate",
            str(args.spawn_rate),
            "--run-time",
            args.run_time,
            "--results-dir",
            str(scenario_dir),
            "--max-failure-rate-pct",
            str(args.failure_rate_threshold_pct),
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
        if args.max_peak_memory_mb is not None:
            command.extend(["--max-peak-memory-mb", str(args.max_peak_memory_mb)])

        completed = subprocess.run(command, cwd=str(ROOT), text=True, capture_output=True, check=False)
        (scenario_dir / "ramp_runner_stdout.log").write_text(completed.stdout, encoding="utf-8")
        (scenario_dir / "ramp_runner_stderr.log").write_text(completed.stderr, encoding="utf-8")

        summary_path = scenario_dir / "backend_perf_summary.json"
        if not summary_path.exists():
            raise RuntimeError(
                f"Scenario {scenario_name} did not produce a summary. See {scenario_dir / 'ramp_runner_stderr.log'}."
            )

        summary = _load_summary(summary_path)
        summaries.append(summary)

        failure_rate = float(summary["performance"]["failure_rate_pct"])
        if failure_rate > args.failure_rate_threshold_pct:
            failure_point = summary
            stop_reason = (
                f"Stopped at {current_users} users because failure rate {failure_rate}% "
                f"exceeded the threshold of {args.failure_rate_threshold_pct}%."
            )
            break

        if completed.returncode not in {0, 1}:
            raise RuntimeError(
                f"Scenario {scenario_name} failed with exit code {completed.returncode}. "
                f"See {scenario_dir / 'ramp_runner_stderr.log'}."
            )

        current_users += args.step_users

    report = {
        "generated_at": _now_iso(),
        "host": args.host,
        "failure_rate_threshold_pct": args.failure_rate_threshold_pct,
        "start_users": args.start_users,
        "step_users": args.step_users,
        "max_users": args.max_users,
        "run_time": args.run_time,
        "spawn_rate": args.spawn_rate,
        "scenarios": summaries,
        "failure_point": failure_point,
        "stop_reason": stop_reason,
    }

    summary_path = results_dir / "backend_perf_ramp_summary.json"
    markdown_path = results_dir / "backend_perf_ramp_summary.md"
    summary_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    markdown_path.write_text(_render_markdown(report), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
