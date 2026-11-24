"""
Verification test suite for GhostBrowser 2026 stack.
Tests config, planner cascade, c14n canonicalization, merkle proofs, steel cloud connection, and FastAPI endpoints.
"""

import asyncio
import json
import os
import unittest
from fastapi.testclient import TestClient

from ghost_engine.config import settings
from ghost_engine.ai.planner import planner, AIPlanner
from ghost_engine.crypto.c14n import MerkleProofEngine, canonicalize_dom
from ghost_engine.browser.pool import browser_pool
from ghost_engine.main import app


class TestGhostBrowserMission(unittest.TestCase):

    def test_01_config_keys(self):
        """1. Verify new keys in Settings."""
        self.assertTrue(hasattr(settings, "sambanova_api_key"), "Missing sambanova_api_key")
        self.assertTrue(hasattr(settings, "steel_api_key"), "Missing steel_api_key")
        self.assertTrue(hasattr(settings, "deepgram_api_key"), "Missing deepgram_api_key")
        self.assertTrue(hasattr(settings, "cartesia_api_key"), "Missing cartesia_api_key")
        self.assertTrue(len(settings.sambanova_api_key) > 10, "SambaNova key not populated from env")
        self.assertTrue(len(settings.steel_api_key) > 10, "Steel key not populated from env")
        self.assertTrue(len(settings.deepgram_api_key) > 10, "Deepgram key not populated from env")
        self.assertTrue(len(settings.cartesia_api_key) > 10, "Cartesia key not populated from env")

    def test_02_c14n_canonicalization(self):
        """2. Verify W3C C14N DOM canonicalization including void tags and body preservation."""
        raw_dirty_html = """
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="styles.css">
            <title>Flight Search Results</title>
            <script>alert('malicious')</script>
            <style>.card { color: red; }</style>
        </head>
        <body>
            <div id="target" class="card" z-index="10">
                <!-- Volatile comment to discard -->
                <noscript>Turn on JS</noscript>
                <span class="price" data-id="42">  ₹2,850.00  </span>
                <br>
                <img src="airline.png" alt="IndiGo">
            </div>
        </body>
        </html>
        """
        canonical = canonicalize_dom(raw_dirty_html)
        # Check script, style, comments, and head elements are discarded
        self.assertNotIn("alert", canonical)
        self.assertNotIn("color: red", canonical)
        self.assertNotIn("Volatile comment", canonical)
        self.assertNotIn("styles.css", canonical)
        self.assertNotIn("Flight Search Results", canonical)
        # Check attributes are sorted lexicographically (class < id < z-index)
        self.assertIn('<div class="card" id="target" z-index="10">', canonical)
        self.assertIn('<span class="price" data-id="42">₹2,850.00</span>', canonical)
        # Check body content is preserved despite preceding <meta> and <link> void tags
        self.assertIn('<body>', canonical)
        self.assertIn('</body>', canonical)

    def test_03_merkle_proof_engine(self):
        """3. Verify MerkleProofEngine 4-leaf proof construction, preimage validity, and tamper resistance."""
        import copy
        html = '<div class="booking" id="f1"><span class="price">2850</span></div>'
        proof = MerkleProofEngine.build_4leaf_proof(
            price=2850.0,
            flight="IndiGo 6E-243",
            itinerary="BLR → COK on 2026-11-24",
            raw_html=html
        )
        self.assertIn("merkle_root", proof)
        self.assertIn("leaves", proof)
        self.assertIn("composite_proof_token", proof)
        self.assertEqual(len(proof["merkle_root"]), 64)
        self.assertTrue(proof["composite_proof_token"].startswith("GB-C14N-"))

        # Verify all 4 leaves exist
        leaves = proof["leaves"]
        self.assertIn("price_claim", leaves)
        self.assertIn("flight_identity", leaves)
        self.assertIn("itinerary", leaves)
        self.assertIn("canonical_dom", leaves)

        # Verify each leaf's hash exactly matches sha256(leaf["data"])
        for leaf_name, leaf_obj in leaves.items():
            expected_hash = MerkleProofEngine._sha256(leaf_obj["data"])
            self.assertEqual(
                leaf_obj["hash"], expected_hash,
                f"Leaf '{leaf_name}' hash does not match sha256(data)"
            )

        # Cryptographically verify authentic proof
        self.assertTrue(MerkleProofEngine.verify_proof(proof), "Merkle proof verification failed on valid proof")

        # Attack: Tamper Leaf 0 (price claim) -> must fail
        tampered_p0 = copy.deepcopy(proof)
        tampered_p0["leaves"]["price_claim"]["data"] = "CLAIM_PRICE: ₹1,000.00"
        self.assertFalse(MerkleProofEngine.verify_proof(tampered_p0), "Tampered price was not caught!")

        # Attack: Tamper Leaf 3 (canonical DOM) -> must fail
        tampered_p3 = copy.deepcopy(proof)
        tampered_p3["leaves"]["canonical_dom"]["data"] = "CANONICAL_DOM:<div>tampered</div>"
        if "full_canonical_dom" in tampered_p3["leaves"]["canonical_dom"]:
            tampered_p3["leaves"]["canonical_dom"]["full_canonical_dom"] = "<div>tampered</div>"
        self.assertFalse(MerkleProofEngine.verify_proof(tampered_p3), "Tampered DOM was not caught!")

        # Attack: Tamper Merkle Root -> must fail
        tampered_root = copy.deepcopy(proof)
        tampered_root["merkle_root"] = "0" * 64
        self.assertFalse(MerkleProofEngine.verify_proof(tampered_root), "Tampered root was not caught!")

    def test_04_planner_export_and_cascade(self):
        """4. Verify AIPlanner export and cascade execution."""
        self.assertIsInstance(planner, AIPlanner)

        # Run query through planner cascade
        loop = asyncio.new_event_loop()
        try:
            res = loop.run_until_complete(
                planner.parse_query("Find flight from Bangalore to Kochi tomorrow under 3500 with dinner")
            )
            self.assertIsNotNone(res.origin)
            self.assertIsNotNone(res.destination)
            self.assertIsNotNone(planner.last_active_tier)
            print(f"\n[AIPlanner Live Test] Resolved via {planner.last_active_tier}: {res.origin} -> {res.destination}, Date: {res.date}, Budget: {res.max_price_inr}")
        finally:
            loop.close()

    def test_05_fastapi_endpoints(self):
        """5. Verify FastAPI /health, /voice/speak (Cartesia), and /voice/transcribe (Deepgram)."""
        client = TestClient(app)

        # Health
        h = client.get("/health")
        self.assertEqual(h.status_code, 200)
        vitals = h.json()["vitals"]
        self.assertTrue(vitals["sambanova_cloud_llama33"])
        self.assertTrue(vitals["steel_dev_stealth_cloud"])
        self.assertTrue(vitals["deepgram_nova_3"])
        self.assertTrue(vitals["cartesia_sonic"])
        pool_status = h.json()["browser_pool"]
        self.assertTrue(pool_status["is_steel_cloud"])

        # Voice Speak (Cartesia Sonic TTS)
        s = client.get("/voice/speak?text=GhostBrowser+Flight+Confirmed")
        self.assertEqual(s.status_code, 200)
        self.assertEqual(s.headers.get("content-type"), "audio/wav")
        self.assertTrue(len(s.content) > 1000, "Audio response too small")

        # Voice Transcribe (Deepgram Nova-3 STT roundtrip with Cartesia audio)
        t = client.post("/voice/transcribe", files={"file": ("speech.wav", s.content, "audio/wav")})
        self.assertEqual(t.status_code, 200)
        t_json = t.json()
        self.assertIn("text", t_json)
        self.assertEqual(t_json["provider"], "Deepgram Nova-3")
        self.assertIn("flight", t_json["text"].lower())


if __name__ == "__main__":
    unittest.main()
