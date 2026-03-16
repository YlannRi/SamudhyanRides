import json
import os
import sys
from pathlib import Path

os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "test-key-placeholder")

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from openapi_spec_validator import validate_spec

from main import app


def main() -> None:
    spec = app.openapi()
    validate_spec(spec)

    output_path = ROOT / "openapi.generated.json"
    output_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")

    print(
        f"Validated OpenAPI {spec['openapi']} with "
        f"{len(spec.get('paths', {}))} paths and wrote {output_path.name}"
    )


if __name__ == "__main__":
    main()
