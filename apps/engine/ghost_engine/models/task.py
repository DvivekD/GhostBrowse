from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class TaskExecuteRequest(BaseModel):
    query: str = Field(..., description="Natural language user request, e.g. flights from BLR to COK")
    max_workers: int = Field(default=3, description="Maximum parallel browser workers to spawn")
    session_id: Optional[str] = Field(default=None, description="Optional client session identifier")
    enable_voice_response: bool = Field(default=True, description="Whether to generate TTS audio response")

class FlightSearchParams(BaseModel):
    origin: str = Field(..., description="Departure city or 3-letter IATA code, e.g. BLR")
    destination: str = Field(..., description="Destination city or IATA code, e.g. COK")
    date: str = Field(..., description="Departure date in YYYY-MM-DD format")
    return_date: Optional[str] = Field(default=None, description="Optional return date")
    max_price_inr: Optional[float] = Field(default=None, description="Maximum budget in INR")
    passengers: int = Field(default=1, description="Number of adult passengers")
    cabin_class: str = Field(default="economy", description="Cabin class: economy, premium, business")
    preferences: List[str] = Field(default_factory=list, description="User tags like 'meal included', 'carry-on only'")

class WorkerStatusEvent(BaseModel):
    worker_id: str
    target_site: str
    status: str  # 'initializing', 'navigating', 'interacting', 'extracting', 'verified', 'failed'
    progress: int  # 0 to 100
    current_action: str
    screenshot_base64: Optional[str] = None
    data_points_found: int = 0
