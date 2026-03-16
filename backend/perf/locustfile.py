import os

from locust import HttpUser, between, task


def _flag_enabled(name: str, default: str = "true") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}


class BackendSmokeUser(HttpUser):
    wait_time = between(0.1, 0.5)
    network_timeout = 10.0
    connection_timeout = 10.0

    @task(5)
    def health(self) -> None:
        self.client.get("/health", name="GET /health")

    @task(3)
    def root(self) -> None:
        self.client.get("/", name="GET /")

    @task(1)
    def openapi(self) -> None:
        if _flag_enabled("PERF_ENABLE_OPENAPI", "true"):
            self.client.get("/openapi.json", name="GET /openapi.json")
