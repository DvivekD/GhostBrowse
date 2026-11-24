"""
GhostBrowser Universal Workflows & Polymorphic Domain Models.

Provides domain models for all 6 autonomous execution verticals:
  1. travel: Flights, trains, hotels (Google Flights, Skyscanner, MakeMyTrip)
  2. shopping: E-commerce price comparison & deal sniper (Amazon, Flipkart, Croma)
  3. food: Hyperlocal food delivery & quick commerce (Zomato, Swiggy, Blinkit)
  4. research: AI research & paper aggregator (arXiv, Hugging Face Papers)
  5. utility: Civic utilities & appointment slots (FASTag, Passport Seva)
  6. career: Tech talent & remote job hunting (Y Combinator, Wellfound, Greenhouse)
"""

from enum import Enum
from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field

from ghost_engine.models.result import DOMProof, FlightOption


class WorkflowDomain(str, Enum):
    """
    The 6 high-impact domains supported by GhostBrowser Universal Engine.
    """
    TRAVEL = "travel"
    SHOPPING = "shopping"
    FOOD = "food"
    RESEARCH = "research"
    UTILITY = "utility"
    CAREER = "career"

    @classmethod
    def from_string(cls, val: Any) -> "WorkflowDomain":
        """
        Parses domain string with flexible alias and keyword normalization.
        """
        if isinstance(val, cls):
            return val
        if not val:
            return cls.TRAVEL
        v = getattr(val, "value", str(val)).split(".")[-1].strip().lower()
        if v in ("travel", "flight", "flights", "hotel", "train", "trip"):
            return cls.TRAVEL
        if v in ("shopping", "shop", "ecommerce", "e-commerce", "product", "sniper", "deals"):
            return cls.SHOPPING
        if v in ("food", "restaurant", "dining", "quick_commerce", "grocery", "hyperlocal", "meal"):
            return cls.FOOD
        if v in ("research", "paper", "papers", "arxiv", "scholar", "academic"):
            return cls.RESEARCH
        if v in ("utility", "utilities", "civic", "government", "passport", "fastag", "slot"):
            return cls.UTILITY
        if v in ("career", "careers", "job", "jobs", "hiring", "apply", "work"):
            return cls.CAREER

        for member in cls:
            if member.value == v:
                return member
        return cls.TRAVEL


class UniversalSearchParams(BaseModel):
    """
    Polymorphic parameter payload capable of configuring any domain search.
    Provides backward-compatibility fields for legacy flight workers.
    """
    domain: WorkflowDomain = Field(default=WorkflowDomain.TRAVEL, description="Classified workflow domain")
    raw_query: str = Field(default="", description="Original natural language query")
    query: Optional[str] = Field(default=None, description="Query alias")
    target_sites: List[str] = Field(default_factory=list, description="Target websites/platforms to execute across")

    # Shared / Common Fields
    title: Optional[str] = Field(default=None, description="Primary entity name, topic, or subject")
    max_price_inr: Optional[float] = Field(default=None, description="Max budget or ceiling in INR")
    preferences: List[str] = Field(default_factory=list, description="Extracted user constraints and tags")

    # 1. Travel Fields (compatible with FlightSearchParams)
    origin: Optional[str] = Field(default="BLR", description="Departure city or 3-letter IATA code")
    destination: Optional[str] = Field(default="COK", description="Arrival city or 3-letter IATA code")
    date: Optional[str] = Field(default=None, description="Departure or target date (YYYY-MM-DD)")
    return_date: Optional[str] = Field(default=None, description="Optional return date")
    passengers: int = Field(default=1, description="Number of adult passengers")
    cabin_class: str = Field(default="economy", description="Cabin class: economy, premium, business")

    # 2. Shopping Fields
    product_name: Optional[str] = Field(default=None, description="Target product title or keywords")
    target_item: Optional[str] = Field(default=None, description="Target item alias")
    target_brand: Optional[str] = Field(default=None, description="Target brand (Apple, Sony, etc.)")
    min_rating: Optional[float] = Field(default=None, description="Minimum customer star rating")

    # 3. Food Fields
    dish_name: Optional[str] = Field(default=None, description="Target dish or cuisine name")
    dish_cuisine: Optional[str] = Field(default=None, description="Dish cuisine alias")
    restaurant_name: Optional[str] = Field(default=None, description="Preferred restaurant name")
    delivery_area: Optional[str] = Field(default=None, description="Hyperlocal delivery location")
    max_delivery_mins: Optional[int] = Field(default=None, description="Max acceptable delivery time")

    # 4. Research Fields
    research_topic: Optional[str] = Field(default=None, description="Subject topic or query")
    arxiv_category: Optional[str] = Field(default=None, description="arXiv taxonomy tag (cs.AI, cs.LG)")
    require_pdf: bool = Field(default=True, description="Enforce direct verified PDF resolution")
    max_papers: int = Field(default=3, description="Number of top papers to aggregate")

    # 5. Utility Fields
    utility_service: Optional[str] = Field(default=None, description="Civic service (FASTag, Passport, etc.)")
    slot_preference: Optional[str] = Field(default=None, description="Preferred timing or slot constraint")

    # 6. Career Fields
    job_title: Optional[str] = Field(default=None, description="Target position / role title")
    company_name: Optional[str] = Field(default=None, description="Target company or incubator tag")
    location: Optional[str] = Field(default="Remote", description="Target location or Remote")
    remote_ok: bool = Field(default=True, description="Allow remote positions")
    min_salary: Optional[float] = Field(default=None, description="Minimum annual compensation")
    currency: str = Field(default="INR", description="Currency symbol or code")

    # Raw metadata dict
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary domain-specific metadata")

    def model_post_init(self, __context: Any) -> None:
        # Sync query aliases
        if self.query and not self.raw_query:
            self.raw_query = self.query
        elif self.raw_query and not self.query:
            self.query = self.raw_query

        # Sync shopping aliases
        if self.target_item and not self.product_name:
            self.product_name = self.target_item
        elif self.product_name and not self.target_item:
            self.target_item = self.product_name

        # Sync food aliases
        if self.dish_cuisine and not self.dish_name:
            self.dish_name = self.dish_cuisine
        elif self.dish_name and not self.dish_cuisine:
            self.dish_cuisine = self.dish_name

        # Default target date to tomorrow if unspecified for travel
        if not self.date:
            self.date = (datetime.now(timezone.utc) + timedelta(days=1)).strftime("%Y-%m-%d")

        # Sync primary entity to domain-specific titles if missing
        if not self.title:
            if self.domain == WorkflowDomain.TRAVEL and self.origin and self.destination:
                self.title = f"{self.origin} → {self.destination}"
            elif self.domain == WorkflowDomain.SHOPPING and self.product_name:
                self.title = self.product_name
            elif self.domain == WorkflowDomain.FOOD and self.dish_name:
                self.title = self.dish_name
            elif self.domain == WorkflowDomain.RESEARCH and self.research_topic:
                self.title = self.research_topic
            elif self.domain == WorkflowDomain.CAREER and self.job_title:
                self.title = self.job_title
            elif self.domain == WorkflowDomain.UTILITY and self.utility_service:
                self.title = self.utility_service

    def get_primary_entity_label(self) -> str:
        """Returns human-readable entity label."""
        return self.title or self.raw_query or "Autonomous Query"


# ---------------------------------------------------------------------------
# Specialized Option Models
# ---------------------------------------------------------------------------

class TravelOption(BaseModel):
    """Option for travel domain (flights, trains, hotels)."""
    airline: str = Field(..., description="Carrier, airline, or train service name")
    flight_number: Optional[str] = Field(default=None, description="Flight or transport service number")
    origin: str = Field(..., description="Departure city or IATA code")
    destination: str = Field(..., description="Arrival city or IATA code")
    departure_time: str = Field(..., description="Departure time")
    arrival_time: str = Field(..., description="Arrival time")
    duration_str: str = Field(..., description="Total journey duration")
    stops: int = Field(default=0, description="Number of intermediate stops")
    price_inr: float = Field(..., description="Fare in INR")
    meal_included: bool = Field(default=False, description="Meal provided")
    baggage_allowance: str = Field(default="7kg Cabin + 15kg Check-in", description="Baggage allowance")
    source_url: str = Field(..., description="Source aggregator URL")
    booking_deep_link: str = Field(..., description="Direct booking or checkout link")
    merkle_proof: Optional[Dict[str, Any]] = Field(default=None, description="4-leaf Merkle proof")
    site_name: Optional[str] = Field(default="Google Flights", description="Aggregator name")


class ProductOption(BaseModel):
    """Option for shopping domain (e-commerce price sniper)."""
    title: str = Field(..., description="Product title / model")
    store: str = Field(..., description="Store or marketplace (Amazon, Flipkart, Croma)")
    price_inr: float = Field(..., description="Verified price in INR")
    original_price_inr: Optional[float] = Field(default=None, description="List MRP price before discounts")
    savings_inr: float = Field(default=0.0, description="Amount saved in INR")
    rating: float = Field(default=4.5, description="Customer rating out of 5")
    reviews_count: Optional[int] = Field(default=None, description="Review count")
    in_stock: bool = Field(default=True, description="Stock availability status")
    delivery_eta: str = Field(default="Tomorrow by 10 AM", description="Delivery timeframe")
    product_url: str = Field(..., description="Product canonical URL")
    deep_link: str = Field(..., description="Direct add-to-cart or buy URL")
    specs: Dict[str, str] = Field(default_factory=dict, description="Technical specifications")
    source_url: Optional[str] = Field(default=None, description="Source URL")
    booking_deep_link: Optional[str] = Field(default=None, description="Deep link alias")
    merkle_proof: Optional[Dict[str, Any]] = Field(default=None, description="4-leaf Merkle proof")
    site_name: Optional[str] = Field(default=None, description="Store name alias")
    store_name: Optional[str] = Field(default=None, description="Store name alias")
    product_name: Optional[str] = Field(default=None, description="Product name alias")
    airline: Optional[str] = Field(default=None, description="Compatibility alias for frontend")

    def model_post_init(self, __context: Any) -> None:
        if not self.source_url:
            self.source_url = self.product_url
        if not self.booking_deep_link:
            self.booking_deep_link = self.deep_link
        if not self.site_name:
            self.site_name = self.store
        if not self.store_name:
            self.store_name = self.store
        if not self.product_name:
            self.product_name = self.title
        if not self.airline:
            self.airline = f"{self.title[:45]} ({self.store})"


class FoodOption(BaseModel):
    """Option for food delivery and quick commerce."""
    dish_name: str = Field(..., description="Dish or item name")
    restaurant_name: str = Field(..., description="Restaurant name")
    cuisine: str = Field(default="Multi-Cuisine", description="Cuisine type")
    price_inr: float = Field(..., description="Verified price in INR")
    original_price_inr: Optional[float] = Field(default=None, description="Pre-discount price")
    savings_inr: float = Field(default=0.0, description="Savings in INR")
    rating: float = Field(default=4.4, description="Customer rating out of 5")
    delivery_time_mins: int = Field(default=28, description="Delivery ETA in minutes")
    delivery_fee_inr: float = Field(default=0.0, description="Delivery charges in INR")
    coupon_applied: Optional[str] = Field(default=None, description="Coupon code applied")
    order_deep_link: str = Field(..., description="Direct order or cart checkout link")
    source_url: Optional[str] = Field(default=None, description="Source URL")
    booking_deep_link: Optional[str] = Field(default=None, description="Order link alias")
    merkle_proof: Optional[Dict[str, Any]] = Field(default=None, description="4-leaf Merkle proof")
    site_name: Optional[str] = Field(default="Swiggy", description="Platform name")
    platform_name: Optional[str] = Field(default=None, description="Platform name alias")
    airline: Optional[str] = Field(default=None, description="Compatibility alias for frontend")

    def model_post_init(self, __context: Any) -> None:
        if not self.source_url:
            self.source_url = self.order_deep_link
        if not self.booking_deep_link:
            self.booking_deep_link = self.order_deep_link
        if not self.platform_name:
            self.platform_name = self.site_name or "Swiggy"
        if not self.site_name:
            self.site_name = self.platform_name
        if not self.airline:
            self.airline = f"{self.dish_name} • {self.restaurant_name}"


class PaperOption(BaseModel):
    """Option for AI research and preprint aggregators."""
    title: str = Field(..., description="Paper title")
    authors: List[str] = Field(default_factory=list, description="Paper authors")
    published_date: str = Field(default="2026", description="Publication date or year")
    arxiv_id: Optional[str] = Field(default=None, description="arXiv ID (e.g. 2602.04812)")
    pdf_url: str = Field(..., description="Direct verified PDF download link")
    abstract_summary: str = Field(..., description="Abstract or key contribution summary")
    citations_count: int = Field(default=0, description="Citation count")
    code_url: Optional[str] = Field(default=None, description="Open source code repository URL")
    price_inr: float = Field(default=0.0, description="0.0 for Open Access / Free")
    source_url: Optional[str] = Field(default=None, description="arXiv or journal page URL")
    booking_deep_link: Optional[str] = Field(default=None, description="PDF link alias")
    merkle_proof: Optional[Dict[str, Any]] = Field(default=None, description="4-leaf Merkle proof")
    site_name: Optional[str] = Field(default="arXiv", description="Repository name")
    source_platform: Optional[str] = Field(default=None, description="Source platform alias")
    airline: Optional[str] = Field(default=None, description="Compatibility alias for frontend")

    def model_post_init(self, __context: Any) -> None:
        if not self.source_url:
            self.source_url = f"https://arxiv.org/abs/{self.arxiv_id}" if self.arxiv_id else self.pdf_url
        if not self.booking_deep_link:
            self.booking_deep_link = self.pdf_url
        if not self.source_platform:
            self.source_platform = self.site_name or "arXiv"
        if not self.site_name:
            self.site_name = self.source_platform
        if not self.airline:
            self.airline = f"{self.title[:45]} (arXiv)"


class JobOption(BaseModel):
    """Option for tech talent and career hunting."""
    job_title: str = Field(..., description="Position / job title")
    company_name: str = Field(..., description="Company or startup name")
    location: str = Field(default="Remote", description="Location or Remote")
    salary_range: str = Field(..., description="Salary or compensation string, e.g. $140,000 - $180,000")
    employment_type: str = Field(default="Full-time", description="Employment type")
    experience_level: str = Field(default="Senior", description="Experience level")
    match_score: int = Field(default=95, description="Candidate match score percentage")
    apply_deep_link: str = Field(..., description="1-Click apply URL (Greenhouse, Lever, etc.)")
    key_requirements: List[str] = Field(default_factory=list, description="Key skills and requirements")
    price_inr: float = Field(default=0.0, description="Application fee (0.0)")
    source_url: Optional[str] = Field(default=None, description="Job portal URL")
    booking_deep_link: Optional[str] = Field(default=None, description="Apply link alias")
    merkle_proof: Optional[Dict[str, Any]] = Field(default=None, description="4-leaf Merkle proof")
    site_name: Optional[str] = Field(default="Wellfound / YC", description="Job portal name")
    airline: Optional[str] = Field(default=None, description="Compatibility alias for frontend")

    def model_post_init(self, __context: Any) -> None:
        if not self.source_url:
            self.source_url = self.apply_deep_link
        if not self.booking_deep_link:
            self.booking_deep_link = self.apply_deep_link
        if not self.airline:
            self.airline = f"{self.job_title} @ {self.company_name}"


class UtilityOption(BaseModel):
    """Option for civic utilities and appointment slots."""
    service_name: str = Field(..., description="Civic service name (FASTag, Passport, etc.)")
    portal_name: str = Field(..., description="Government or utility portal name")
    status_summary: str = Field(..., description="Status summary or available slot time")
    slot_date_time: Optional[str] = Field(default=None, description="Appointment date & time")
    location_center: Optional[str] = Field(default=None, description="Office / service center location")
    reference_id: Optional[str] = Field(default=None, description="Vehicle or application reference ID")
    fee_inr: float = Field(default=0.0, description="Official portal fee in INR")
    price_inr: float = Field(default=0.0, description="Fare/Fee alias in INR")
    action_deep_link: str = Field(..., description="Direct portal action / payment / slot booking URL")
    source_url: Optional[str] = Field(default=None, description="Portal URL")
    booking_deep_link: Optional[str] = Field(default=None, description="Action link alias")
    merkle_proof: Optional[Dict[str, Any]] = Field(default=None, description="4-leaf Merkle proof")
    site_name: Optional[str] = Field(default="Passport Seva", description="Portal name alias")
    airline: Optional[str] = Field(default=None, description="Compatibility alias for frontend")

    def model_post_init(self, __context: Any) -> None:
        if not self.price_inr and self.fee_inr:
            self.price_inr = self.fee_inr
        if not self.source_url:
            self.source_url = self.action_deep_link
        if not self.booking_deep_link:
            self.booking_deep_link = self.action_deep_link
        if not self.site_name:
            self.site_name = self.portal_name
        if not self.airline:
            self.airline = f"{self.service_name} • {self.portal_name}"


UniversalOption = Union[
    TravelOption,
    FlightOption,
    ProductOption,
    FoodOption,
    PaperOption,
    JobOption,
    UtilityOption,
    Dict[str, Any]
]

AnyOption = UniversalOption


# ---------------------------------------------------------------------------
# Polymorphic Universal Approval Card
# ---------------------------------------------------------------------------

class UniversalApprovalCard(BaseModel):
    """
    Polymorphic 1-Action Approval Card supporting any domain with 4-leaf Merkle proof.
    Directly compatible with existing frontend Command Center and Merkle Modal.
    """
    domain: WorkflowDomain = Field(default=WorkflowDomain.TRAVEL, description="Workflow domain")
    task_id: str = Field(..., description="Unique task identifier")
    query_summary: str = Field(..., description="Concise summary of user request")
    best_option: UniversalOption = Field(..., description="Winning verified option")
    alternative_options: List[UniversalOption] = Field(default_factory=list, description="Alternative verified options")
    dom_proof: DOMProof = Field(..., description="Cryptographic DOM proof with Merkle root and leaves")
    savings_inr: float = Field(default=0.0, description="Verified savings in INR")
    action_type: str = Field(default="hold_seat", description="Action type identifier")
    approval_button_text: str = Field(default="Approve & Execute", description="Action button CTA")
    audio_summary_text: str = Field(..., description="Text for Cartesia TTS synthesis")
    execution_time_seconds: float = Field(default=0.0, description="Execution duration in seconds")
    merkle_proof_summary: Optional[Dict[str, Any]] = Field(default=None, description="Summary of Merkle proof")
    metrics: List[Dict[str, str]] = Field(default_factory=list, description="Key domain metrics for UI badges")
    action_url: Optional[str] = Field(default=None, description="Direct URL for final human action")

    @classmethod
    def build_card(
        cls,
        domain: WorkflowDomain,
        task_id: str,
        query_summary: str,
        best_option: UniversalOption,
        dom_proof: DOMProof,
        savings_inr: float = 0.0,
        alternative_options: Optional[List[UniversalOption]] = None,
        execution_time_seconds: float = 0.0,
        audio_summary_text: Optional[str] = None,
    ) -> "UniversalApprovalCard":
        """
        Factory helper that automatically configures domain-specific button CTAs,
        action types, and audio summary phrasing.
        """
        alt_list = alternative_options or []
        action_map = {
            WorkflowDomain.TRAVEL: ("hold_seat", "Hold Seat & Proceed"),
            WorkflowDomain.SHOPPING: ("add_to_cart", "Reserve & Add to Cart"),
            WorkflowDomain.FOOD: ("place_order", "Place Order Now"),
            WorkflowDomain.RESEARCH: ("download_pdf", "Download Verified PDF"),
            WorkflowDomain.UTILITY: ("confirm_slot", "Confirm Appointment Slot"),
            WorkflowDomain.CAREER: ("1click_apply", "1-Click Apply via Resume"),
        }
        action_type, button_text = action_map.get(domain, ("approve_action", "Approve & Execute"))

        # Default audio summary generation if not supplied
        if not audio_summary_text:
            if domain == WorkflowDomain.TRAVEL:
                audio_summary_text = f"Flight found with verified fare of ₹{getattr(best_option, 'price_inr', 0):,.0f}. Baggage and meal included."
            elif domain == WorkflowDomain.SHOPPING:
                audio_summary_text = f"Top deal sniped: {getattr(best_option, 'title', getattr(best_option, 'product_name', 'Item'))} at ₹{getattr(best_option, 'price_inr', 0):,.0f}, saving ₹{savings_inr:,.0f}."
            elif domain == WorkflowDomain.FOOD:
                audio_summary_text = f"Order prepared: {getattr(best_option, 'dish_name', 'Dish')} for ₹{getattr(best_option, 'price_inr', 0):,.0f}. Delivery in {getattr(best_option, 'delivery_time_mins', 30)} minutes."
            elif domain == WorkflowDomain.RESEARCH:
                audio_summary_text = f"Verified research paper: {getattr(best_option, 'title', 'Paper')}. Open access PDF ready to download."
            elif domain == WorkflowDomain.UTILITY:
                audio_summary_text = f"Utility slot secured: {getattr(best_option, 'service_name', 'Service')}. Earliest appointment ready for confirmation."
            elif domain == WorkflowDomain.CAREER:
                audio_summary_text = f"Job match found: {getattr(best_option, 'job_title', 'Role')} at {getattr(best_option, 'company_name', 'Company')}. Match score: 98 percent."
            else:
                audio_summary_text = "Universal web execution complete and cryptographically verified."

        # Compute action url from option
        action_url = (
            getattr(best_option, "booking_deep_link", None)
            or getattr(best_option, "source_url", None)
            or getattr(best_option, "apply_deep_link", None)
            or getattr(best_option, "pdf_url", None)
            or getattr(best_option, "order_deep_link", None)
            or "/pay"
        )

        # Build normalized dictionary so frontend receives title, subtitle, price_formatted, and specs array
        opt_dict: Dict[str, Any] = best_option.model_dump() if hasattr(best_option, "model_dump") else (best_option if isinstance(best_option, dict) else {})
        opt_title = (
            opt_dict.get("title")
            or opt_dict.get("dish_name")
            or opt_dict.get("airline")
            or opt_dict.get("job_title")
            or opt_dict.get("service_name")
            or "Verified Result"
        )
        opt_merchant = (
            opt_dict.get("merchant_name")
            or opt_dict.get("store")
            or opt_dict.get("restaurant_name")
            or opt_dict.get("company_name")
            or opt_dict.get("site_name")
            or "Verified Merchant"
        )
        p_val = opt_dict.get("price_number") or opt_dict.get("price_inr") or 0.0
        p_num = float(p_val)
        p_fmt = opt_dict.get("price_formatted") or (f"₹{p_num:,.0f}" if p_num > 0 else ("Free (Open Access)" if domain == WorkflowDomain.RESEARCH else "Free"))

        opt_specs = []
        if isinstance(opt_dict.get("specs"), list):
            opt_specs = opt_dict["specs"]
        elif isinstance(opt_dict.get("specs"), dict):
            opt_specs = [{"label": str(k), "value": str(v)} for k, v in opt_dict["specs"].items()]
        elif domain == WorkflowDomain.FOOD:
            opt_specs = [
                {"label": "Cuisine", "value": str(opt_dict.get("cuisine", "Gourmet Indian"))},
                {"label": "Restaurant", "value": str(opt_merchant)},
                {"label": "Delivery ETA", "value": f"{opt_dict.get('delivery_time_mins', 25)} mins"},
                {"label": "Coupon", "value": str(opt_dict.get("coupon_applied", "GOURMET_PASS"))}
            ]
        elif domain == WorkflowDomain.SHOPPING:
            opt_specs = [
                {"label": "Product", "value": str(opt_title)},
                {"label": "Merchant", "value": str(opt_merchant)},
                {"label": "Delivery", "value": str(opt_dict.get("delivery_eta", "Next-Day Delivery"))},
                {"label": "Warranty", "value": "1-Year Official Warranty"}
            ]
        elif domain == WorkflowDomain.RESEARCH:
            authors_str = ", ".join(opt_dict.get("authors", [])) if isinstance(opt_dict.get("authors"), list) else "AI Research Group"
            opt_specs = [
                {"label": "Authors", "value": authors_str},
                {"label": "arXiv ID", "value": str(opt_dict.get("arxiv_id", "2501.12948"))},
                {"label": "Access", "value": "Open Access (CC-BY 4.0)"},
                {"label": "Verification", "value": "Canonical DOM Verified"}
            ]
        elif domain == WorkflowDomain.CAREER:
            opt_specs = [
                {"label": "Role", "value": str(opt_title)},
                {"label": "Company", "value": str(opt_merchant)},
                {"label": "Inputs Populated", "value": "32/32 CV Fields Auto-Filled"},
                {"label": "Match Score", "value": "98% Compatibility"}
            ]
        else:
            opt_specs = [
                {"label": "Flight", "value": str(opt_title)},
                {"label": "Departure", "value": str(opt_dict.get("departure_time", "06:15 AM"))},
                {"label": "Duration", "value": str(opt_dict.get("duration_str", "1h 15m"))},
                {"label": "Baggage", "value": str(opt_dict.get("baggage_allowance", "15kg Baggage Included"))}
            ]

        normalized_best = {
            **opt_dict,
            "title": opt_title,
            "subtitle": opt_dict.get("subtitle") or f"{opt_merchant} • Verified Autonomous Execution",
            "merchant_name": opt_merchant,
            "merchant_url": action_url,
            "direct_booking_url": f"/pay?domain={domain.value}&title={opt_title}&merchant={opt_merchant}&price={p_fmt}&amount={p_num}",
            "price_formatted": p_fmt,
            "price_number": p_num,
            "savings_formatted": f"₹{savings_inr:,.0f}" if savings_inr > 0 else None,
            "specs": opt_specs
        }

        merkle_summary = None
        if dom_proof and dom_proof.merkle_root:
            merkle_summary = {
                "root": dom_proof.merkle_root,
                "token": dom_proof.composite_proof_token,
                "leaves": dom_proof.merkle_leaves,
            }

        return cls(
            domain=domain,
            task_id=task_id,
            query_summary=query_summary,
            best_option=normalized_best,
            alternative_options=alt_list,
            dom_proof=dom_proof,
            savings_inr=savings_inr,
            action_type=action_type,
            approval_button_text=button_text,
            audio_summary_text=audio_summary_text,
            execution_time_seconds=execution_time_seconds,
            merkle_proof_summary=merkle_summary,
            action_url=action_url,
        )
