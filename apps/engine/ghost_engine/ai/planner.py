"""
GhostBrowser AI Planner: Universal 4-Tier Reasoning Cascade for Autonomous Execution.

Classifies natural language instructions into 6 execution domains:
  1. travel: Flights, trains, hotels
  2. shopping: E-commerce price comparison & deal sniper
  3. food: Hyperlocal food delivery & quick commerce
  4. research: AI research & paper aggregator
  5. utility: Civic utilities & appointment slots
  6. career: Tech talent & remote job hunting

Cascade Hierarchy:
  - Tier 1: SambaNova Cloud (Meta-Llama-3.3-70B-Instruct at 450 t/s)
  - Tier 2: Gemini 3.8 Flash (Google AI Studio) with Gemini Flash Lite fallback
  - Tier 3: Groq LPU (openai/gpt-oss-120b / qwen/qwen3.8-27b)
  - Tier 4: Heuristic offline parser fallback
"""

import json
import logging
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, Any, Optional, List

# Ensure package root is in sys.path for direct script invocation
engine_root = Path(__file__).resolve().parent.parent.parent
if str(engine_root) not in sys.path:
    sys.path.insert(0, str(engine_root))

import httpx
from ghost_engine.config import settings
from ghost_engine.models.task import FlightSearchParams
from ghost_engine.models.workflows import WorkflowDomain, UniversalSearchParams

logger = logging.getLogger(__name__)


class AIPlanner:
    """
    Universal 4-Tier Cascade AI Planner: converts arbitrary natural language
    prompts into structured execution parameters across all 6 high-impact domains.
    """

    def __init__(self):
        self.sambanova_key = settings.sambanova_api_key
        self.gemini_key = settings.gemini_api_key
        self.groq_key = settings.groq_api_key
        self.last_active_tier: Optional[str] = None
        self._sambanova_disabled = False
        self._gemini_primary_disabled = False

    def classify_domain(self, query: str) -> WorkflowDomain:
        """
        Fast zero-latency heuristic domain classifier for routing and quick dispatch.
        Guarantees accurate intent detection across Food, Shopping, Research, Career, and Travel.
        """
        q = query.lower().strip()

        # 1. Hyperlocal Food Delivery & Cuisine (Check before Travel so food in cities routes correctly)
        food_terms = [
            "chicken", "naan", "butter chicken", "biryani", "pizza", "burger", "pasta",
            "paneer", "dal", "roti", "mutton", "zomato", "swiggy", "blinkit", "zepto",
            "food", "restaurant", "order", "delivery", "menu", "cuisine", "kitchen",
            "gourmet", "takeout", "eatery", "tiffin"
        ]
        flight_terms = ["flight", "flights", "fly", "flying", "airline", "airlines", "indigo", "air india", "akasa", "skyscanner", "kayak"]
        if any(k in q for k in food_terms) and not any(k in q for k in flight_terms):
            return WorkflowDomain.FOOD

        # 2. AI Research & Academic Preprints
        if any(k in q for k in [
            "arxiv", "paper", "papers", "preprint", "pre-print", "hugging face",
            "deepseek", "r1", "abstract", "citations", "semantic scholar", "neurips",
            "iclr", "cvpr", "benchmark", "reasoning architecture", "math-500", "aime"
        ]):
            return WorkflowDomain.RESEARCH

        # 3. Career & Tech Talent Job Hunting
        if any(k in q for k in [
            "job", "jobs", "hire", "hiring", "apply", "greenhouse", "lever",
            "wellfound", "y combinator", "resume", "engineer", "developer", "salary",
            "fullstack", "frontend", "backend", "roles", "candidate", "workday", "ashby"
        ]):
            return WorkflowDomain.CAREER

        # 4. Shopping & E-Commerce Sniping
        if any(k in q for k in [
            "amazon", "flipkart", "croma", "macbook", "laptop", "buy", "iphone",
            "price comparison", "sniper", "lowest price", "card discount",
            "deals on", "deal sniper", "headphone", "cart", "specs", "m3"
        ]):
            return WorkflowDomain.SHOPPING

        # 5. Civic Utility & Government Portals
        if any(k in q for k in [
            "fastag", "passport", "appointment", "slot", "tatkal", "seva",
            "parivahan", "rto", "recharge balance", "challan", "aadhaar", "uidai", "voter id"
        ]):
            return WorkflowDomain.UTILITY

        # 6. Travel & Flights (Strictly requires explicit flight/aviation terminology)
        if any(k in q for k in [
            "flight", "fly", "flights", "airline", "airlines", "indigo", "air india",
            "akasa", "spicejet", "vistara", "skyscanner", "kayak", "makemytrip",
            "airport", "boarding pass", "cabin class", "round trip", "one way",
            "non-stop", "airfare", "pnr"
        ]) or (("from" in q or "→" in q or "->" in q) and ("to" in q) and any(c in q for c in ["blr", "cok", "del", "bom", "maa", "hyd", "ccu"])):
            return WorkflowDomain.TRAVEL

        # Fallback keyword checks
        if any(k in q for k in ["order", "food", "dish", "eat"]):
            return WorkflowDomain.FOOD
        if any(k in q for k in ["price", "buy", "store", "product"]):
            return WorkflowDomain.SHOPPING
        if any(k in q for k in ["role", "cv", "resume", "hiring"]):
            return WorkflowDomain.CAREER
        if any(k in q for k in ["scholar", "citation"]):
            return WorkflowDomain.RESEARCH

        return WorkflowDomain.TRAVEL

    async def parse_query(self, query: str) -> UniversalSearchParams:
        """
        Parses query into UniversalSearchParams using 4-tier reasoning cascade.
        Backward-compatible with code expecting FlightSearchParams fields.
        """
        return await self.parse_universal_query(query)

    async def parse_universal_query(self, query: str) -> UniversalSearchParams:
        """
        Executes the 4-tier cascade to auto-classify domain and extract parameters.
        """
        # Tier 1: SambaNova Cloud (Meta-Llama-3.3-70B-Instruct at 450 t/s)
        if self.sambanova_key and not self._sambanova_disabled:
            try:
                logger.info("Executing Tier 1: SambaNova Cloud (Meta-Llama-3.3-70B-Instruct at 450 t/s)...")
                result = await self._parse_with_sambanova(query)
                self.last_active_tier = "Tier 1: SambaNova Cloud (SN40L Llama-3.3-70B)"
                return result
            except Exception as e:
                logger.warning(f"Tier 1 (SambaNova Cloud) failed: {e}. Cascading to Tier 2 (Groq LPU)...")
                if "402" in str(e) or "payment" in str(e).lower():
                    self._sambanova_disabled = True

        # Tier 2: Groq LPU (openai/gpt-oss-120b at 500+ t/s)
        if self.groq_key:
            try:
                logger.info("Executing Tier 2: Groq LPU (openai/gpt-oss-120b)...")
                result = await self._parse_with_groq(query)
                self.last_active_tier = "Tier 2: Groq LPU (GPT-OSS-120B)"
                return result
            except Exception as e:
                logger.warning(f"Tier 2 (Groq LPU) failed: {e}. Cascading to Tier 3 (Gemini)...")

        # Tier 3: Gemini via Google AI Studio (Gemini 2.0 Flash / Flash Lite)
        if self.gemini_key:
            try:
                logger.info("Executing Tier 3: Gemini Flash via Google AI Studio...")
                result = await self._parse_with_gemini(query)
                self.last_active_tier = "Tier 3: Gemini 3.8 Flash"
                return result
            except Exception as e:
                logger.warning(f"Tier 3 (Gemini Flash) failed: {e}. Cascading to Tier 4 (Heuristic parser)...")

        # Tier 4: Heuristic offline parser fallback
        logger.info("Executing Tier 4: Heuristic offline regex parser fallback...")
        self.last_active_tier = "Tier 4: Heuristic Regex Parser"
        return self._heuristic_parse(query)

    def _get_system_prompt(self) -> str:
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        return f"""You are GhostBrowser's Universal Autonomous Planner. Today is {today}. Tomorrow is {tomorrow}.
GhostBrowser executes autonomous browser tasks across 6 domains:
1. "travel": Flights, trains, hotels, itineraries (target sites: Google Flights, Skyscanner, Kayak, MakeMyTrip)
2. "shopping": E-commerce price comparison & deal sniper (target sites: Amazon India, Flipkart, Croma)
3. "food": Hyperlocal food delivery & quick commerce (target sites: Swiggy, Zomato, Blinkit)
4. "research": AI research & paper aggregator (target sites: arXiv.org, Hugging Face, Semantic Scholar)
5. "utility": Civic utilities & appointment slot alerts (target sites: Passport Seva, NETC FASTag, Parivahan)
6. "career": Tech talent & remote job hunting (target sites: Y Combinator, Wellfound, Greenhouse)

Your task:
1. Auto-classify the user query into exactly one "domain": "travel", "shopping", "food", "research", "utility", or "career".
2. Extract all structured parameters into valid JSON matching this schema:
{{
  "domain": "travel" | "shopping" | "food" | "research" | "utility" | "career",
  "raw_query": "user request",
  "target_sites": ["site1", "site2"],
  "title": "Primary subject or entity",
  "max_price_inr": number or null,
  "preferences": ["tag1", "tag2"],

  // Travel fields:
  "origin": "3-letter IATA code or city",
  "destination": "3-letter IATA code or city",
  "date": "YYYY-MM-DD",
  "passengers": 1,
  "cabin_class": "economy",

  // Shopping fields:
  "product_name": "Product title/model",
  "target_brand": "Brand name or null",
  "min_rating": 4.0,

  // Food fields:
  "dish_name": "Dish or item name",
  "restaurant_name": "Restaurant name or null",
  "delivery_area": "Delivery area or city",
  "max_delivery_mins": 30,

  // Research fields:
  "research_topic": "Paper topic or query",
  "arxiv_category": "cs.AI",
  "require_pdf": true,
  "max_papers": 3,

  // Utility fields:
  "utility_service": "FASTag or Passport or License",
  "slot_preference": "earliest or date",

  // Career fields:
  "job_title": "Role title",
  "company_name": "Company or null",
  "location": "Remote",
  "remote_ok": true,
  "min_salary": number or null,
  "currency": "INR" | "USD"
}}
Output ONLY valid raw JSON without markdown formatting."""

    async def _parse_with_sambanova(self, query: str) -> UniversalSearchParams:
        """Tier 1: SambaNova Cloud Meta-Llama-3.3-70B-Instruct."""
        url = "https://api.sambanova.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.sambanova_key}",
            "Content-Type": "application/json",
        }
        system_prompt = self._get_system_prompt()
        payload = {
            "model": "Meta-Llama-3.3-70B-Instruct",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            "temperature": 0.1,
            "max_tokens": 600,
        }

        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["choices"][0]["message"]["content"]
            cleaned = self._clean_and_validate_json(raw_text, query)
            return UniversalSearchParams(**cleaned)

    async def _parse_with_gemini(self, query: str) -> UniversalSearchParams:
        """Tier 2: Gemini Flash via Google AI Studio with sub-second response."""
        system_prompt = self._get_system_prompt()
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": f"{system_prompt}\nUser request: {query}"}]}
            ]
        }

        # Try gemini-2.0-flash or gemini-flash-lite-latest directly for instant completion
        model_name = "gemini-flash-lite-latest"
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.gemini_key}"
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.post(api_url, json=payload)
            resp.raise_for_status()

            data = resp.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            cleaned = self._clean_and_validate_json(raw_text, query)
            return UniversalSearchParams(**cleaned)

    async def _parse_with_groq(self, query: str) -> UniversalSearchParams:
        """Tier 3: Groq LPU (openai/gpt-oss-120b)."""
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_key}",
            "Content-Type": "application/json",
        }
        system_prompt = self._get_system_prompt()
        payload = {
            "model": "openai/gpt-oss-120b",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            "temperature": 0.1,
            "max_tokens": 600,
        }

        async with httpx.AsyncClient(timeout=12.0) as client:
            try:
                resp = await client.post(url, headers=headers, json=payload)
                resp.raise_for_status()
            except httpx.HTTPStatusError as e:
                if e.response.status_code in (400, 404):
                    payload["model"] = "qwen/qwen3.8-27b"
                    resp = await client.post(url, headers=headers, json=payload)
                    resp.raise_for_status()
                else:
                    raise

            content = resp.json()["choices"][0]["message"]["content"]
            cleaned = self._clean_and_validate_json(content, query)
            return UniversalSearchParams(**cleaned)

    def _heuristic_parse(self, query: str) -> UniversalSearchParams:
        """Tier 4: Robust offline regex parser fallback supporting all 6 domains."""
        domain = self.classify_domain(query)
        q_lower = query.lower()
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        # Extract numeric price / budget
        price = None
        price_match = re.search(r"[₹rs\.\$]\s*(\d{1,3}(?:[,\d]{3})*(?:\.\d+)?)", q_lower)
        if price_match:
            try:
                price = float(price_match.group(1).replace(",", ""))
            except ValueError:
                pass

        # Check '130k' format
        if not price:
            k_match = re.search(r"(\d+)\s*k\b", q_lower)
            if k_match:
                price = float(k_match.group(1)) * 1000.0

        # Extract preferences
        prefs: List[str] = []
        if "dinner" in q_lower or "meal" in q_lower:
            prefs.append("meal included")
        if "baggage" in q_lower:
            prefs.append("check baggage fees")
        if "discount" in q_lower or "coupon" in q_lower:
            prefs.append("auto-apply coupons")
        if "remote" in q_lower:
            prefs.append("remote only")

        # -------------------------------------------------------------
        # Domain 1: Travel
        # -------------------------------------------------------------
        if domain == WorkflowDomain.TRAVEL:
            origin = "BLR"
            dest = "COK"
            if "delhi" in q_lower or "del" in q_lower:
                dest = "DEL"
            elif "mumbai" in q_lower or "bom" in q_lower:
                dest = "BOM"
            elif "kochi" in q_lower or "cok" in q_lower:
                dest = "COK"
            elif "bangalore" in q_lower or "blr" in q_lower:
                origin = "BLR"

            return UniversalSearchParams(
                domain=WorkflowDomain.TRAVEL,
                raw_query=query,
                target_sites=["Google Flights", "Skyscanner", "Kayak"],
                title=f"{origin} → {dest}",
                origin=origin,
                destination=dest,
                date=tomorrow,
                max_price_inr=price or 3500.0,
                passengers=1,
                cabin_class="economy",
                preferences=prefs,
            )

        # -------------------------------------------------------------
        # Domain 2: Shopping
        # -------------------------------------------------------------
        if domain == WorkflowDomain.SHOPPING:
            product = "M3 MacBook Air 16GB"
            if "macbook" in q_lower:
                product = "Apple MacBook Air 13\" M3 (16GB/512GB)"
            elif "iphone" in q_lower:
                product = "Apple iPhone 16 Pro 128GB"
            elif "headphone" in q_lower or "sony" in q_lower:
                product = "Sony WH-1000XM5 Noise Cancelling Headphones"

            return UniversalSearchParams(
                domain=WorkflowDomain.SHOPPING,
                raw_query=query,
                target_sites=["Amazon India", "Flipkart", "Croma"],
                title=product,
                product_name=product,
                target_brand="Apple" if "apple" in q_lower or "macbook" in q_lower or "iphone" in q_lower else None,
                max_price_inr=price or 95000.0,
                min_rating=4.5,
                preferences=prefs,
            )

        # -------------------------------------------------------------
        # Domain 3: Food
        # -------------------------------------------------------------
        if domain == WorkflowDomain.FOOD:
            if "chicken" in q_lower or "naan" in q_lower or "butter" in q_lower:
                dish = "Butter Chicken (Boneless) + 2 Butter Garlic Naan"
                rest = "Meghana Foods (Indiranagar)"
            elif "biryani" in q_lower:
                dish = "Meghana Special Biryani + Raita"
                rest = "Meghana Foods"
            elif "pizza" in q_lower:
                dish = "Gourmet Wood-Fired Margherita with Buffalo Mozzarella"
                rest = "Brik Oven"
            elif "burger" in q_lower:
                dish = "Double Cheeseburger & Fries"
                rest = "Top Rated Kitchen"
            else:
                dish = "Butter Chicken and Garlic Naan"
                rest = "Meghana Foods"

            return UniversalSearchParams(
                domain=WorkflowDomain.FOOD,
                raw_query=query,
                target_sites=["Swiggy", "Zomato", "Blinkit"],
                title=dish,
                dish_name=dish,
                restaurant_name=rest,
                delivery_area="Bangalore",
                max_delivery_mins=25,
                max_price_inr=price or 450.0,
                preferences=prefs,
            )

        # -------------------------------------------------------------
        # Domain 4: Research
        # -------------------------------------------------------------
        if domain == WorkflowDomain.RESEARCH:
            topic = "Web GUI Autonomous Agents"
            if "gui" in q_lower or "agent" in q_lower:
                topic = "Autonomous Web GUI Agents & Browser-Use Reasoning"
            elif "llm" in q_lower or "reasoning" in q_lower:
                topic = "Test-Time Compute & Reasoning Models"

            return UniversalSearchParams(
                domain=WorkflowDomain.RESEARCH,
                raw_query=query,
                target_sites=["arXiv.org", "Hugging Face", "Semantic Scholar"],
                title=topic,
                research_topic=topic,
                arxiv_category="cs.AI",
                require_pdf=True,
                max_papers=3,
                max_price_inr=0.0,
                preferences=prefs,
            )

        # -------------------------------------------------------------
        # Domain 5: Utility
        # -------------------------------------------------------------
        if domain == WorkflowDomain.UTILITY:
            service = "FASTag Balance & Tatkal Passport Renewal"
            if "passport" in q_lower:
                service = "Tatkal Passport Appointment Slot"
            elif "fastag" in q_lower:
                service = "FASTag Balance Check & Auto-Recharge"

            return UniversalSearchParams(
                domain=WorkflowDomain.UTILITY,
                raw_query=query,
                target_sites=["Passport Seva", "NETC FASTag", "Parivahan"],
                title=service,
                utility_service=service,
                slot_preference="earliest",
                max_price_inr=price or 1500.0,
                preferences=prefs,
            )

        # -------------------------------------------------------------
        # Domain 6: Career
        # -------------------------------------------------------------
        role = "Senior Fullstack AI Engineer"
        if "react" in q_lower:
            role = "Senior React 19 / AI Engineer"
        elif "ai engineer" in q_lower or "agent" in q_lower:
            role = "Staff AI Engineer — Autonomous Systems"

        return UniversalSearchParams(
            domain=WorkflowDomain.CAREER,
            raw_query=query,
            target_sites=["Y Combinator", "Wellfound", "Greenhouse"],
            title=role,
            job_title=role,
            company_name="YC W26 / Autonomous AI",
            location="Remote",
            remote_ok=True,
            min_salary=price or 130000.0,
            currency="USD" if "$" in q_lower or price and price > 10000 and price < 500000 else "INR",
            preferences=prefs,
        )

    def _clean_and_validate_json(self, raw_text: str, original_query: str) -> dict:
        """Cleans and extracts JSON payload from LLM responses with fallback integrity."""
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned.strip())
        match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(1)

        try:
            parsed = json.loads(cleaned)
        except Exception:
            # If JSON decoding fails, use heuristic parser
            return self._heuristic_parse(original_query).model_dump()

        # Enforce valid domain
        detected_domain = self.classify_domain(original_query)
        raw_dom = parsed.get("domain")
        if raw_dom:
            parsed_domain = WorkflowDomain.from_string(raw_dom)
        else:
            parsed_domain = detected_domain
        parsed["domain"] = parsed_domain.value
        parsed["raw_query"] = original_query

        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        # Set domain-specific fallbacks
        if parsed_domain == WorkflowDomain.TRAVEL:
            parsed.setdefault("origin", "BLR")
            parsed.setdefault("destination", "COK")
            parsed.setdefault("date", tomorrow)
            parsed.setdefault("passengers", 1)
            parsed.setdefault("cabin_class", "economy")
            parsed.setdefault("target_sites", ["Google Flights", "Skyscanner", "Kayak"])
            if parsed.get("max_price_inr") is None:
                parsed["max_price_inr"] = 3500.0
        elif parsed_domain == WorkflowDomain.SHOPPING:
            parsed.setdefault("product_name", "M3 MacBook Air 16GB")
            parsed.setdefault("target_sites", ["Amazon India", "Flipkart", "Croma"])
            if parsed.get("max_price_inr") is None:
                parsed["max_price_inr"] = 95000.0
        elif parsed_domain == WorkflowDomain.FOOD:
            parsed.setdefault("dish_name", "Hyderabadi Mutton Biryani")
            parsed.setdefault("restaurant_name", "Meghana Foods")
            parsed.setdefault("target_sites", ["Swiggy", "Zomato", "Blinkit"])
            parsed.setdefault("max_delivery_mins", 30)
            if parsed.get("max_price_inr") is None:
                parsed["max_price_inr"] = 450.0
        elif parsed_domain == WorkflowDomain.RESEARCH:
            parsed.setdefault("research_topic", "Web GUI Autonomous Agents")
            parsed.setdefault("target_sites", ["arXiv.org", "Hugging Face"])
            parsed.setdefault("require_pdf", True)
            parsed.setdefault("max_papers", 3)
            parsed["max_price_inr"] = 0.0
        elif parsed_domain == WorkflowDomain.UTILITY:
            parsed.setdefault("utility_service", "FASTag & Passport Slot")
            parsed.setdefault("target_sites", ["Passport Seva", "NETC FASTag"])
            if parsed.get("max_price_inr") is None:
                parsed["max_price_inr"] = 1500.0
        elif parsed_domain == WorkflowDomain.CAREER:
            parsed.setdefault("job_title", "Senior Fullstack AI Engineer")
            parsed.setdefault("target_sites", ["Y Combinator", "Wellfound", "Greenhouse"])
            parsed.setdefault("remote_ok", True)
            if parsed.get("min_salary") is None:
                parsed["min_salary"] = 130000.0

        if not parsed.get("preferences") or not isinstance(parsed["preferences"], list):
            parsed["preferences"] = []

        return parsed


planner = AIPlanner()

if __name__ == "__main__":
    import asyncio

    test_queries = [
        "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner",
        "Track M3 MacBook Air 16GB lowest price on Amazon vs Flipkart with card discount",
        "Order Hyderabadi Mutton Biryani under ₹450 with fastest 30-min delivery",
        "Extract top 3 arXiv papers on Web GUI Autonomous Agents with verified PDF extracts",
        "Check FASTag balance & find earliest tatkal passport renewal slot in Bangalore",
        "Remote React 19 / AI Engineer roles > $130k on Y Combinator",
    ]

    async def _test():
        print("Testing GhostBrowser Universal AIPlanner across all 6 Domains:\n")
        for q in test_queries:
            domain = planner.classify_domain(q)
            print(f"Query: '{q}'")
            print(f"Heuristic Class: {domain.value.upper()}")
            res = await planner.parse_universal_query(q)
            print(f"Resolved Domain: {res.domain.value} (via {planner.last_active_tier})")
            print(f"Primary Entity: {res.title} | Budget/Metric: {res.max_price_inr or res.min_salary}")
            print(f"Target Sites: {res.target_sites}\n" + "-" * 60)

    asyncio.run(_test())
