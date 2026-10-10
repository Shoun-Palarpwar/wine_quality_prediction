"""Local, read-only model API for the Cantina frontend.

Run `python -m wine_quality.api`. The Vite proxy keeps browser requests same-origin.
This binds to loopback by default and is a development adapter, not a public server.
"""
import argparse
import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from uuid import uuid4

import joblib
import pandas as pd

from .config import CLEAN, FEATURES, MODELS, RAW, TABLES
from .data import load_split, validate_features
from .evaluation import quality_predictions


class ModelService:
    def __init__(self):
        self.model = joblib.load(MODELS / "selected.joblib")
        self.metadata = json.loads((MODELS / "metadata.json").read_text())
        self.data = pd.read_csv(CLEAN)

    def predict(self, payload):
        if not isinstance(payload, dict):
            raise ValueError("Provide a JSON object containing the 11 chemical measurements.")
        # Reject strings and booleans at the HTTP boundary instead of silently coercing.
        if any(type(value) not in (int, float) for value in payload.values()):
            raise ValueError("Every measurement must be a JSON number.")
        frame = validate_features(pd.DataFrame([payload]))
        predicted = int(quality_predictions(self.model, frame)[0])
        probabilities = []
        if hasattr(self.model, "predict_proba"):
            probabilities = [
                {"label": int(label), "probability": float(probability)}
                for label, probability in zip(self.model.classes_, self.model.predict_proba(frame)[0])
            ]
        warnings = []
        outside = [name for name in FEATURES if not self.data[name].min() <= frame[name].iloc[0] <= self.data[name].max()]
        if outside:
            warnings.append("Outside the observed dataset range: " + ", ".join(outside) + ". Treat this prediction cautiously.")
        return {"rating": predicted, "model": self.metadata["selected_model"],
                "probabilities": probabilities, "id": uuid4().hex[:8].upper(),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "measurements": frame.iloc[0].to_dict(), "warnings": warnings}

    def intelligence(self):
        correlations = self.data[FEATURES + ["quality"]].corr()["quality"].drop("quality").sort_values(ascending=False)
        return {
            "raw_rows": len(pd.read_csv(RAW, sep=";")), "clean_rows": len(self.data),
            "train_rows": len(load_split("train")[0]), "test_rows": len(load_split("test")[0]),
            "correlations": [{"feature": name, "value": float(value)} for name, value in correlations.items()],
            "distribution": [{"label": int(label), "count": int(count)} for label, count in self.data.quality.value_counts().sort_index().items()],
            "metrics": pd.read_csv(TABLES / "model_comparison.csv").to_dict(orient="records"),
            "selected_model": self.metadata["selected_model"],
        }


def make_handler(service):
    class Handler(BaseHTTPRequestHandler):
        def send_json(self, code, payload):
            encoded = json.dumps(payload, allow_nan=False).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(encoded)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(encoded)

        def do_GET(self):
            if self.path == "/api/health":
                self.send_json(200, {"status": "ready", "model": service.metadata["selected_model"]})
            elif self.path == "/api/intelligence":
                try:
                    self.send_json(200, service.intelligence())
                except (OSError, ValueError, KeyError):
                    self.send_json(503, {"error": "Dataset reports are unavailable. Regenerate the pipeline artifacts."})
            else:
                self.send_json(404, {"error": "Endpoint not found."})

        def do_POST(self):
            if self.path != "/api/predict":
                self.send_json(404, {"error": "Endpoint not found."})
                return
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if not 0 < length <= 16384:
                    self.send_json(413, {"error": "Provide a JSON payload smaller than 16 KB."})
                    return
                if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
                    self.send_json(415, {"error": "Use application/json."})
                    return
                self.connection.settimeout(10)
                payload = json.loads(self.rfile.read(length))
                self.send_json(200, service.predict(payload))
            except (ValueError, TypeError, KeyError, UnicodeDecodeError) as error:
                self.send_json(400, {"error": str(error)})
            except TimeoutError:
                self.send_json(408, {"error": "Request timed out."})

    return Handler


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), make_handler(ModelService()))
    print(f"Cantina model API: http://127.0.0.1:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
