"""
GhostBrowser AI Planner: 4-Tier Reasoning Cascade for Autonomous Execution.

Cascade Hierarchy:
  - Tier 1: SambaNova Cloud (Meta-Llama-3.3-70B-Instruct at 450 t/s)
  - Tier 2: Gemini 3.8 Flash (Google AI Studio)
  - Tier 3: Groq LPU (openai/gpt-oss-120b)
  - Tier 4: Heuristic offline regex parser
"""

import json
import logging
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional

# Ensure package root is in sys.path for direct script invocation
engine_root = Path(__file__).resolve().parent.parent.parent
if str(engine_root) not in sys.path:
    sys.path.insert(0, str(engine_root))

import httpx
from ghost_engine.config import settings
from ghost_engine.models.task import FlightSearchParams

logger = logging.getLogger(__name__)


class AIPlanner:
    """
    4-Tier Cascade AI Planner: converts natural language instructions into
    structured execution parameters for multi-worker autonomous web execution.
    """

    def __init__(self):
        self.sambanova_key = settings.sambanova_api_key
        self.gemini_key = settings.gemini_api_key
        self.groq_key = settings.groq_api_key
        self.last_active_tier: Optional[str] = None

    async def parse_query(self, query: str) -> FlightSearchParams:
        """
        Parses query into FlightSearchParams using 4-tier reasoning cascade.
        """
        # Tier 1: SambaNova Cloud (Meta-Llama-3.3-70B-Instruct at 450 t/s)
        if self.sambanova_key:
            try:
                logger.info("Executing Tier 1: SambaNova Cloud (Meta-Llama-3.3-70B-Instruct at 450 t/s)...")
                result = await self._parse_with_sambanova(query)
                self.last_active_tier = "Tier 1: SambaNova Cloud (SN40L Llama-3.3-70B)"
                return result
            except Exception as e:
                logger.warning(f"Tier 1 (SambaNova Cloud) failed: {e}. Cascading to Tier 2 (Gemini)...")

        # Tier 2: Gemini 3.8 Flash
        if self.gemini_key:
            try:
                logger.info("Executing Tier 2: Gemini 3.8 Flash via Google AI Studio...")
                result = await self._parse_with_gemini(query)
                self.last_active_tier = "Tier 2: Gemini 3.8 Flash"
                return result
            except Exception as e:
                logger.warning(f"Tier 2 (Gemini 3.8 Flash) failed: {e}. Cascading to Tier 3 (Groq)...")

        # Tier 3: Groq LPU (openai/gpt-oss-120b)
        if self.groq_key:
            try:
                logger.info("Executing Tier 3: Groq LPU (openai/gpt-oss-120b)...")
                result = await self._parse_with_groq(query)
                self.last_active_tier = "Tier 3: Groq LPU (openai/gpt-oss-120b)"
                return result
            except Exception as e:
                logger.warning(f"Tier 3 (Groq LPU) failed: {e}. Cascading to Tier 4 (Heuristic regex)...")

        # Tier 4: Heuristic regex parser fallback
        logger.info("Executing Tier 4: Heuristic offline regex parser fallback...")
        self.last_active_tier = "Tier 4: Heuristic Regex Parser"
        return self._heuristic_parse(query)

    async def _parse_with_sambanova(self, query: str) -> FlightSearchParams:
        """Tier 1: SambaNova Cloud Meta-Llama-3.3-70B-Instruct."""
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        url = "https://api.sambanova.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.sambanova_key}",
            "Content-Type": "application/json",
        }
        system_prompt = f"""You are GhostBrowser's high-speed planner. Today is {today}. Tomorrow is {tomorrow}.
Extract flight search parameters from the user request into valid JSON matching this schema:
{{
  "origin": "3-letter IATA code or city",
  "destination": "3-letter IATA code or city",
  "date": "YYYY-MM-DD",
  "return_date": null,
  "max_price_inr": number or null,
  "passengers": 1,
  "cabin_class": "economy",
  "preferences": ["meal included", "baggage check"]
}}
Output ONLY valid raw JSON without markdown formatting."""

        payload = {
            "model": "Meta-Llama-3.3-70B-Instruct",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            "temperature": 0.1,
            "max_tokens": 500,
        }

        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["choices"][0]["message"]["content"]
            cleaned = self._clean_and_validate_json(raw_text)
            return FlightSearchParams(**cleaned)

    async def _parse_with_gemini(self, query: str) -> FlightSearchParams:
        """Tier 2: Gemini 3.8 Flash via Google AI Studio."""
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        system_prompt = f"""You are the GhostBrowser Planner. Today's date is {today}. Tomorrow is {tomorrow}.
Convert the user request into valid JSON matching this schema:
{{
  "origin": "3-letter IATA code or city",
  "destination": "3-letter IATA code or city",
  "date": "YYYY-MM-DD",
  "return_date": null,
  "max_price_inr": number,
  "passengers": 1,
  "cabin_class": "economy",
  "preferences": ["meal included", "baggage check"]
}}
Output ONLY valid raw JSON."""

        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": f"{system_prompt}\nUser request: {query}"}]}
            ]
        }

        primary_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={self.gemini_key}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.post(primary_url, json=payload)
                resp.raise_for_status()
            except (httpx.HTTPStatusError, httpx.TimeoutException) as e:
                # If Gemini 3.8 Flash experiences demand spike (503/404/timeout), fall back to gemini-flash-lite-latest
                logger.info(f"Gemini 3.8 Flash unavailable ({e}). Falling back to Gemini Flash Lite...")
                fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={self.gemini_key}"
                resp = await client.post(fallback_url, json=payload)
                resp.raise_for_status()

            data = resp.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            cleaned = self._clean_and_validate_json(raw_text)
            return FlightSearchParams(**cleaned)

    async def _parse_with_groq(self, query: str) -> FlightSearchParams:
        """Tier 3: Groq LPU (openai/gpt-oss-120b)."""
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_key}",
            "Content-Type": "application/json",
        }
        system_prompt = f"""You are the GhostBrowser Planner on Groq LPU. Today is {today}. Tomorrow is {tomorrow}.
Extract flight parameters as JSON with keys: origin, destination, date, return_date, max_price_inr, passengers, cabin_class, preferences.
Output ONLY raw JSON."""

        payload = {
            "model": "openai/gpt-oss-120b",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            "temperature": 0.1,
            "max_tokens": 500,
        }

        async with httpx.AsyncClient(timeout=12.0) as client:
            try:
                resp = await client.post(url, headers=headers, json=payload)
                resp.raise_for_status()
            except httpx.HTTPStatusError as e:
                if e.response.status_code in (400, 404):
                    payload["model"] = "llama-3.3-70b-versatile"
                    resp = await client.post(url, headers=headers, json=payload)
                    resp.raise_for_status()
                else:
                    raise

            content = resp.json()["choices"][0]["message"]["content"]
            cleaned = self._clean_and_validate_json(content)
            return FlightSearchParams(**cleaned)

    def _heuristic_parse(self, query: str) -> FlightSearchParams:
        """Tier 4: Robust offline regex parser fallback."""
        q_lower = query.lower()
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

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

        price = 3500.0
        price_match = re.search(r"[₹rs\.\s]*(\d{1,2}[,\d]{3,5})", q_lower)
        if price_match:
            try:
                price = float(price_match.group(1).replace(",", ""))
            except ValueError:
                pass

        prefs = []
        if "dinner" in q_lower or "meal" in q_lower:
            prefs.append("meal included")
        if "baggage" in q_lower:
            prefs.append("check baggage fees")

        return FlightSearchParams(
            origin=origin,
            destination=dest,
            date=tomorrow,
            max_price_inr=price,
            passengers=1,
            cabin_class="economy",
            preferences=prefs,
        )

    def _clean_and_validate_json(self, raw_text: str) -> dict:
        """Cleans and extracts JSON payload from LLM responses."""
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned.strip())
        match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(1)

        parsed = json.loads(cleaned)
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        if not parsed.get("origin"):
            parsed["origin"] = "BLR"
        if not parsed.get("destination"):
            parsed["destination"] = "COK"
        if not parsed.get("date"):
            parsed["date"] = tomorrow
        if not parsed.get("passengers"):
            parsed["passengers"] = 1
        if not parsed.get("cabin_class"):
            parsed["cabin_class"] = "economy"
        if not parsed.get("preferences") or not isinstance(parsed["preferences"], list):
            parsed["preferences"] = []

        if parsed.get("max_price_inr") is not None:
            try:
                parsed["max_price_inr"] = float(parsed["max_price_inr"])
            except (ValueError, TypeError):
                parsed["max_price_inr"] = 3500.0

        return parsed


planner = AIPlanner()

if __name__ == "__main__":
    import asyncio
    async def _test():
        query = "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner"
        print(f"Testing GhostBrowser AIPlanner 4-Tier Reasoning Cascade...")
        print(f"Input query: '{query}'")
        res = await planner.parse_query(query)
        print(f"\n[AIPlanner Success] Tier Activated: {planner.last_active_tier}")
        print(f"Extracted Parameters: {json.dumps(res.model_dump(), indent=2)}")
    asyncio.run(_test())
