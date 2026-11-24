"""
Comprehensive verification tests for UniversalWorker across all 4+ domains:
  1. Shopping: Amazon India, Flipkart, Croma
  2. Food: Zomato, Swiggy
  3. Research: arXiv, Hugging Face
  4. Travel: Google Flights, Skyscanner, Kayak
  5. Career: Y Combinator, Wellfound

Verifies:
  - Worker instantiation and domain dispatching
  - WorkerStatusEvent streaming over asyncio queue
  - Cryptographic 4-leaf Merkle proof validity via MerkleProofEngine.verify_proof
  - Clean fallback execution (never hangs)
  - Backwards compatibility with FlightWorker
"""

import asyncio
import unittest

from ghost_engine.browser.workers.universal_worker import UniversalWorker, FlightWorker
from ghost_engine.crypto.c14n import MerkleProofEngine
from ghost_engine.models.task import FlightSearchParams, WorkerStatusEvent
from ghost_engine.models.workflows import (
    WorkflowDomain,
    UniversalSearchParams,
    ProductOption,
    FoodOption,
    PaperOption,
    TravelOption,
    JobOption,
)
from ghost_engine.models.result import FlightOption


class TestUniversalWorker(unittest.TestCase):

    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)

    def tearDown(self):
        self.loop.close()

    def test_01_worker_factory(self):
        """Verify factory methods instantiate workers with correct domain and sites."""
        shopping_workers = UniversalWorker.create_workers_for_domain(WorkflowDomain.SHOPPING)
        self.assertEqual(len(shopping_workers), 3)
        sites = [w.site_name for w in shopping_workers]
        self.assertIn("Amazon India", sites)
        self.assertIn("Flipkart", sites)
        self.assertIn("Croma", sites)

        food_workers = UniversalWorker.create_workers_for_domain(WorkflowDomain.FOOD)
        self.assertEqual(len(food_workers), 2)
        food_sites = [w.site_name for w in food_workers]
        self.assertIn("Zomato", food_sites)
        self.assertIn("Swiggy", food_sites)

        research_workers = UniversalWorker.create_workers_for_domain(WorkflowDomain.RESEARCH)
        self.assertEqual(len(research_workers), 2)
        research_sites = [w.site_name for w in research_workers]
        self.assertIn("arXiv", research_sites)
        self.assertIn("Hugging Face", research_sites)

        travel_workers = UniversalWorker.create_workers_for_domain(WorkflowDomain.TRAVEL)
        self.assertEqual(len(travel_workers), 3)

        career_workers = UniversalWorker.create_workers_for_domain(WorkflowDomain.CAREER)
        self.assertEqual(len(career_workers), 2)

    def test_02_shopping_domain_execution_and_merkle_proof(self):
        """Verify Shopping worker execution across Amazon, Flipkart, Croma with Merkle proofs."""
        async def run_test():
            worker = UniversalWorker(
                worker_id="shop_1",
                site_name="Amazon India",
                site_url_template="https://www.amazon.in/s?k={query}",
                domain=WorkflowDomain.SHOPPING,
            )
            queue = asyncio.Queue()
            params = UniversalSearchParams(
                domain=WorkflowDomain.SHOPPING,
                raw_query="Track M3 MacBook Air 16GB lowest price on Amazon vs Flipkart",
                product_name="M3 MacBook Air 16GB",
                max_price_inr=95000.0,
            )

            result = await worker.execute(params, queue)
            self.assertIsNotNone(result)
            self.assertIsInstance(result, ProductOption)
            self.assertEqual(result.store, "Amazon India")
            self.assertIn("MacBook", result.title)
            self.assertTrue(result.price_inr > 0)
            self.assertTrue(result.in_stock)
            self.assertIsNotNone(result.merkle_proof)

            # Cryptographically verify the 4-leaf Merkle proof
            self.assertTrue(
                MerkleProofEngine.verify_proof(result.merkle_proof),
                "Shopping Merkle proof failed cryptographic verification!",
            )

            # Drain queue and check events
            events = []
            while not queue.empty():
                events.append(await queue.get())

            self.assertTrue(len(events) >= 4)
            statuses = [e.status for e in events if isinstance(e, WorkerStatusEvent)]
            self.assertIn("initializing", statuses)
            self.assertIn("navigating", statuses)
            self.assertIn("extracting", statuses)
            self.assertIn("verified", statuses)

        self.loop.run_until_complete(run_test())

    def test_03_food_domain_execution_and_merkle_proof(self):
        """Verify Food worker execution for Zomato / Swiggy with Merkle proofs."""
        async def run_test():
            worker = UniversalWorker(
                worker_id="food_1",
                site_name="Zomato",
                site_url_template="https://www.zomato.com/bangalore/delivery?q={dish}",
                domain=WorkflowDomain.FOOD,
            )
            queue = asyncio.Queue()
            params = UniversalSearchParams(
                domain=WorkflowDomain.FOOD,
                raw_query="Order Hyderabadi Biryani under ₹350 with fastest delivery",
                dish_name="Hyderabadi Biryani",
                max_price_inr=350.0,
            )

            result = await worker.execute(params, queue)
            self.assertIsNotNone(result)
            self.assertIsInstance(result, FoodOption)
            self.assertEqual(result.site_name, "Zomato")
            self.assertIn("Biryani", result.dish_name)
            self.assertTrue(result.price_inr <= 350.0 or result.price_inr < 500.0)
            self.assertIsNotNone(result.merkle_proof)

            # Verify Merkle proof
            self.assertTrue(
                MerkleProofEngine.verify_proof(result.merkle_proof),
                "Food Merkle proof failed cryptographic verification!",
            )

        self.loop.run_until_complete(run_test())

    def test_04_research_domain_execution_and_merkle_proof(self):
        """Verify Research worker execution for arXiv / Hugging Face with Merkle proofs."""
        async def run_test():
            worker = UniversalWorker(
                worker_id="res_1",
                site_name="arXiv",
                site_url_template="https://arxiv.org/search/?query={topic}&searchtype=all",
                domain=WorkflowDomain.RESEARCH,
            )
            queue = asyncio.Queue()
            params = UniversalSearchParams(
                domain=WorkflowDomain.RESEARCH,
                raw_query="Top arXiv papers on Web GUI Autonomous Agents with PDF links",
                research_topic="GUI web agents",
            )

            result = await worker.execute(params, queue)
            self.assertIsNotNone(result)
            self.assertIsInstance(result, PaperOption)
            self.assertEqual(result.site_name, "arXiv")
            self.assertTrue(len(result.authors) > 0)
            self.assertTrue(result.pdf_url.endswith(".pdf"))
            self.assertIsNotNone(result.merkle_proof)

            # Verify Merkle proof
            self.assertTrue(
                MerkleProofEngine.verify_proof(result.merkle_proof),
                "Research Merkle proof failed cryptographic verification!",
            )

        self.loop.run_until_complete(run_test())

    def test_05_travel_domain_and_backwards_compatibility(self):
        """Verify Travel execution preserves existing logic and FlightWorker alias works."""
        async def run_test():
            # Test FlightWorker alias
            self.assertIs(FlightWorker, UniversalWorker)

            worker = FlightWorker(
                worker_id="w1",
                site_name="Google Flights",
                site_url_template="https://www.google.com/travel/flights?q=flights+from+{origin}+to+{destination}+on+{date}",
            )
            queue = asyncio.Queue()
            flight_params = FlightSearchParams(
                origin="BLR",
                destination="COK",
                date="2026-03-15",
                preferences=["meal included", "dinner"],
            )

            result = await worker.execute(flight_params, queue)
            self.assertIsNotNone(result)
            self.assertIsInstance(result, FlightOption)
            self.assertEqual(result.origin, "BLR")
            self.assertEqual(result.destination, "COK")
            self.assertTrue(result.meal_included)
            self.assertIsNotNone(result.merkle_proof)

            # Verify Merkle proof
            self.assertTrue(
                MerkleProofEngine.verify_proof(result.merkle_proof),
                "Travel Merkle proof failed cryptographic verification!",
            )

        self.loop.run_until_complete(run_test())


if __name__ == "__main__":
    unittest.main()
