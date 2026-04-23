from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = ROOT / "backend" / "perf" / "results" / "ramp" / "backend_perf_ramp_summary.json"
DEFAULT_OUTPUT = ROOT / "backend" / "perf" / "results" / "ramp" / "backend_perf_ramp_graph.png"


def _read_summary(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _extract_series(summary: dict[str, Any]) -> tuple[list[int], list[float], list[float], list[float]]:
    scenarios_raw = summary.get("scenarios", [])
    if not isinstance(scenarios_raw, list):
        raise SystemExit("Invalid ramp summary format: 'scenarios' must be a list.")
    scenarios = scenarios_raw

    users: list[int] = []
    avg_latency_ms: list[float] = []
    p95_latency_ms: list[float] = []
    throughput_rps: list[float] = []

    for item in scenarios:
        if not isinstance(item, dict):
            continue
        perf_obj = item.get("performance")
        if not isinstance(perf_obj, dict):
            continue
        perf: dict[str, Any] = perf_obj
        users.append(int(item["configured_users"]))
        avg_latency_ms.append(float(perf["avg_response_time_ms"]))
        p95_latency_ms.append(float(perf["p95_response_time_ms"]))
        throughput_rps.append(float(perf["requests_per_second"]))

    return users, avg_latency_ms, p95_latency_ms, throughput_rps


def _plot(
    users: list[int],
    avg_latency_ms: list[float],
    p95_latency_ms: list[float],
    throughput_rps: list[float],
    output_path: Path,
    host: str,
) -> None:
    fig, ax_latency = plt.subplots(figsize=(11, 6.5), dpi=140)

    avg_color = "#E11D48"
    p95_color = "#F97316"
    throughput_color = "#0F766E"

    ax_latency.plot(
        users,
        avg_latency_ms,
        marker="o",
        linewidth=2.2,
        color=avg_color,
        label="Avg Latency (ms)",
    )
    ax_latency.plot(
        users,
        p95_latency_ms,
        marker="D",
        linewidth=2.2,
        color=p95_color,
        label="P95 Latency (ms)",
    )
    ax_latency.set_xlim(0, 500)
    ax_latency.set_xlabel("Users")
    ax_latency.set_ylabel("Latency (ms)")
    ax_latency.grid(axis="y", linestyle="--", alpha=0.25)

    ax_throughput = ax_latency.twinx()
    ax_throughput.plot(
        users,
        throughput_rps,
        marker="s",
        linewidth=2.6,
        color=throughput_color,
        label="Throughput (RPS)",
    )
    ax_throughput.set_ylabel("Throughput (requests/sec)")

    handles_left, labels_left = ax_latency.get_legend_handles_labels()
    handles_right, labels_right = ax_throughput.get_legend_handles_labels()
    ax_latency.legend(
        handles_left + handles_right,
        labels_left + labels_right,
        loc="upper left",
        frameon=False,
    )

    fig.suptitle("Backend Performance Graph: Latency and Throughput vs Users", fontsize=13, fontweight="bold")
    ax_latency.set_title(f"Target: {host}", fontsize=10)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(output_path, bbox_inches="tight")
    plt.close(fig)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a combined latency/throughput graph from backend ramp summary data."
    )
    parser.add_argument("--input", default=str(DEFAULT_INPUT), help="Path to backend_perf_ramp_summary.json")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), help="Output path for the graph image")
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve()

    if not input_path.exists():
        raise SystemExit(f"Input summary not found: {input_path}")

    summary = _read_summary(input_path)
    users, avg_latency_ms, p95_latency_ms, throughput_rps = _extract_series(summary)

    if not users:
        raise SystemExit("No scenarios found in ramp summary; cannot build a graph.")

    _plot(
        users=users,
        avg_latency_ms=avg_latency_ms,
        p95_latency_ms=p95_latency_ms,
        throughput_rps=throughput_rps,
        output_path=output_path,
        host=str(summary.get("host", "unknown")),
    )

    print(f"Graph written to: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
