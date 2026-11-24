from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class FlightOption(BaseModel):
    airline: str
    flight_number: Optional[str] = None
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
    duration_str: str
    stops: int = 0
    price_inr: float
    meal_included: bool = False
    baggage_allowance: str = "7kg Cabin + 15kg Check-in"
    source_url: str
    booking_deep_link: str
    merkle_proof: Optional[Dict[str, Any]] = None
    site_name: Optional[str] = "Google Flights"

class DOMProof(BaseModel):
    source_site: str
    timestamp_utc: str
    canonical_url: str
    dom_sha256: str
    screenshot_sha256: str
    verified_price_text: str
    verified_airline_text: Optional[str] = "Verified Option"
    verified_entity_text: Optional[str] = None
    merkle_root: Optional[str] = None
    composite_proof_token: Optional[str] = None
    merkle_leaves: Optional[Dict[str, Any]] = None
    intermediate_hashes: Optional[Dict[str, str]] = None

    def model_post_init(self, __context: Any) -> None:
        if not self.verified_entity_text and self.verified_airline_text:
            self.verified_entity_text = self.verified_airline_text
        elif not self.verified_airline_text and self.verified_entity_text:
            self.verified_airline_text = self.verified_entity_text

class ApprovalCardPayload(BaseModel):
    task_id: str
    query_summary: str
    best_option: Union[FlightOption, Any]
    alternative_options: List[Union[FlightOption, Any]] = Field(default_factory=list)
    dom_proof: DOMProof
    savings_inr: float = 0.0
    action_type: str = "hold_seat"
    approval_button_text: str = "Hold Seat & Proceed"
    audio_summary_text: str
    execution_time_seconds: float
    merkle_proof_summary: Optional[Dict[str, Any]] = None
