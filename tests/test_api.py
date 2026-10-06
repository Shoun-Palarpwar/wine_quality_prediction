import unittest

from wine_quality.api import ModelService
from wine_quality.config import FEATURES, ROOT
import pandas as pd


class ModelApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.service = ModelService()
        cls.sample = pd.read_csv(ROOT / "data/examples/wines.csv").iloc[0].to_dict()

    def test_prediction_matches_saved_model(self):
        result = self.service.predict(self.sample)
        expected = self.service.model.predict(pd.DataFrame([self.sample], columns=FEATURES))[0]
        self.assertEqual(result["rating"], int(expected))
        self.assertAlmostEqual(sum(p["probability"] for p in result["probabilities"]), 1)
        self.assertEqual(result["measurements"], self.sample)

    def test_invalid_http_payloads(self):
        for payload in [[], {}, {**self.sample, "alcohol": "13"},
                        {**self.sample, "pH": True}, {**self.sample, "density": float("nan")}]:
            with self.subTest(payload=payload):
                with self.assertRaises((ValueError, TypeError)):
                    self.service.predict(payload)

    def test_out_of_distribution_warning(self):
        result = self.service.predict({**self.sample, "alcohol": 16})
        self.assertTrue(any("alcohol" in warning for warning in result["warnings"]))

    def test_intelligence_is_consistent_with_artifacts(self):
        result = self.service.intelligence()
        self.assertEqual(sum(d["count"] for d in result["distribution"]), result["clean_rows"])
        self.assertEqual(result["train_rows"] + result["test_rows"], result["clean_rows"])
        self.assertEqual(len(result["correlations"]), 11)
        self.assertIn(result["selected_model"], [row["Model"] for row in result["metrics"]])
