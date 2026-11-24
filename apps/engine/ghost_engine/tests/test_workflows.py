"""
Unit tests for Universal Workflows, Polymorphic Models, and AIPlanner Classification.
"""

import unittest
from ghost_engine.models.workflows import (
    WorkflowDomain,
    UniversalSearchParams,
    TravelOption,
    ProductOption,
    FoodOption,
    PaperOption,
    JobOption,
    UtilityOption,
    UniversalApprovalCard,
    UniversalOption,
)
from ghost_engine.models.result import DOMProof
from ghost_engine.ai.planner import planner


class TestUniversalWorkflows(unittest.TestCase):

    def test_01_workflow_domain_parsing(self):
        """Test domain enum parsing and aliases."""
        self.assertEqual(WorkflowDomain.from_string("travel"), WorkflowDomain.TRAVEL)
        self.assertEqual(WorkflowDomain.from_string("flight"), WorkflowDomain.TRAVEL)
        self.assertEqual(WorkflowDomain.from_string("shopping"), WorkflowDomain.SHOPPING)
        self.assertEqual(WorkflowDomain.from_string("deals"), WorkflowDomain.SHOPPING)
        self.assertEqual(WorkflowDomain.from_string("food"), WorkflowDomain.FOOD)
        self.assertEqual(WorkflowDomain.from_string("research"), WorkflowDomain.RESEARCH)
        self.assertEqual(WorkflowDomain.from_string("arxiv"), WorkflowDomain.RESEARCH)
        self.assertEqual(WorkflowDomain.from_string("utility"), WorkflowDomain.UTILITY)
        self.assertEqual(WorkflowDomain.from_string("utilities"), WorkflowDomain.UTILITY)
        self.assertEqual(WorkflowDomain.from_string("passport"), WorkflowDomain.UTILITY)
        self.assertEqual(WorkflowDomain.from_string("career"), WorkflowDomain.CAREER)
        self.assertEqual(WorkflowDomain.from_string("jobs"), WorkflowDomain.CAREER)

    def test_02_universal_search_params_aliases(self):
        """Test polymorphic search params field resolution and aliases."""
        p1 = UniversalSearchParams(
            domain=WorkflowDomain.SHOPPING,
            query="Track M3 MacBook Air",
            target_item="M3 MacBook Air 16GB",
            max_price_inr=95000.0,
        )
        self.assertEqual(p1.raw_query, "Track M3 MacBook Air")
        self.assertEqual(p1.product_name, "M3 MacBook Air 16GB")
        self.assertEqual(p1.get_primary_entity_label(), "M3 MacBook Air 16GB")

        p2 = UniversalSearchParams(
            domain=WorkflowDomain.TRAVEL,
            origin="BLR",
            destination="COK",
        )
        self.assertEqual(p2.origin, "BLR")
        self.assertEqual(p2.destination, "COK")
        self.assertIsNotNone(p2.date)

    def test_03_specialized_options_instantiation(self):
        """Test each specialized option model."""
        prod = ProductOption(
            title='MacBook Air M3',
            store='Amazon India',
            price_inr=94990.0,
            original_price_inr=114900.0,
            savings_inr=19910.0,
            rating=4.8,
            reviews_count=1240,
            in_stock=True,
            delivery_eta='Tomorrow 10 AM',
            product_url='https://amazon.in/dp/example',
            deep_link='https://amazon.in/buy/example',
        )
        self.assertEqual(prod.store_name, 'Amazon India')
        self.assertEqual(prod.product_name, 'MacBook Air M3')
        self.assertTrue(prod.airline.startswith('MacBook Air M3'))

        food = FoodOption(
            dish_name='Hyderabadi Biryani',
            restaurant_name='Meghana Foods',
            price_inr=349.0,
            order_deep_link='https://swiggy.com/order/example',
        )
        self.assertEqual(food.platform_name, 'Swiggy')
        self.assertEqual(food.price_inr, 349.0)

        paper = PaperOption(
            title='WebAgent-V: Grounded Execution',
            authors=['Researcher A', 'Researcher B'],
            published_date='2026',
            arxiv_id='2602.04812',
            pdf_url='https://arxiv.org/pdf/2602.04812.pdf',
            abstract_summary='Autonomous Web GUI agents with multimodal reasoning.',
        )
        self.assertEqual(paper.source_platform, 'arXiv')
        self.assertEqual(paper.arxiv_id, '2602.04812')

        job = JobOption(
            job_title='Staff AI Engineer',
            company_name='Anthropic / YC',
            salary_range='$180,000 - $220,000',
            apply_deep_link='https://greenhouse.io/apply/example',
        )
        self.assertEqual(job.job_title, 'Staff AI Engineer')
        self.assertEqual(job.location, 'Remote')

        util = UtilityOption(
            service_name='Tatkal Passport Renewal',
            portal_name='Passport Seva',
            status_summary='Slot Available: Friday 10:15 AM',
            action_deep_link='https://passportindia.gov.in/slot/example',
            fee_inr=1500.0,
        )
        self.assertEqual(util.fee_inr, 1500.0)
        self.assertEqual(util.price_inr, 1500.0)

    def test_04_universal_approval_card(self):
        """Test polymorphic approval card construction across domains."""
        mock_proof = DOMProof(
            source_site="Amazon India",
            timestamp_utc="2026-11-24T12:00:00Z",
            canonical_url="https://amazon.in",
            dom_sha256="a" * 64,
            screenshot_sha256="b" * 64,
            verified_price_text="₹94,990",
            verified_entity_text="MacBook Air M3",
            merkle_root="c" * 64,
            composite_proof_token="GB-C14N-test-token",
        )

        card = UniversalApprovalCard.build_card(
            domain=WorkflowDomain.SHOPPING,
            task_id="task-1234",
            query_summary="Lowest price on M3 MacBook Air",
            best_option=ProductOption(
                title='MacBook Air M3',
                store='Amazon India',
                price_inr=94990.0,
                product_url='https://amazon.in',
                deep_link='https://amazon.in/buy',
            ),
            dom_proof=mock_proof,
            savings_inr=19910.0,
            execution_time_seconds=1.85,
        )

        self.assertEqual(card.domain, WorkflowDomain.SHOPPING)
        self.assertEqual(card.action_type, "add_to_cart")
        self.assertEqual(card.approval_button_text, "Reserve & Add to Cart")
        self.assertIn("saving", card.audio_summary_text)
        self.assertEqual(card.action_url, "https://amazon.in/buy")

    def test_05_planner_domain_classification(self):
        """Verify planner heuristic domain classification on all 6 verticals."""
        c1 = planner.classify_domain("Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner")
        self.assertEqual(c1, WorkflowDomain.TRAVEL)

        c2 = planner.classify_domain("Track M3 MacBook Air 16GB lowest price on Amazon vs Flipkart with card discount")
        self.assertEqual(c2, WorkflowDomain.SHOPPING)

        c3 = planner.classify_domain("Order Hyderabadi Mutton Biryani under ₹450 with fastest 30-min delivery")
        self.assertEqual(c3, WorkflowDomain.FOOD)

        c4 = planner.classify_domain("Extract top 3 arXiv papers on Web GUI Autonomous Agents with verified PDF extracts")
        self.assertEqual(c4, WorkflowDomain.RESEARCH)

        c5 = planner.classify_domain("Check FASTag balance & find earliest tatkal passport renewal slot in Bangalore")
        self.assertEqual(c5, WorkflowDomain.UTILITY)

        c6 = planner.classify_domain("Remote React 19 / AI Engineer roles > $130k on Y Combinator")
        self.assertEqual(c6, WorkflowDomain.CAREER)


if __name__ == "__main__":
    unittest.main()
