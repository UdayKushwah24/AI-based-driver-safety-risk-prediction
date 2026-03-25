"""Pydantic schemas for risk prediction and analytics APIs."""

from enum import Enum

from pydantic import BaseModel, Field


class DriverState(str, Enum):
    DROWSY = "drowsy"
    ALERT = "alert"


class RiskPredictRequest(BaseModel):
    speed: float = Field(ge=0, le=260)
    visibility: float = Field(ge=0, le=100)
    driver_state: DriverState


class RiskSignal(BaseModel):
    type: str
    severity: str
    value: float | str | bool


class RiskPredictResponse(BaseModel):
    riskScore: float
    accidentProbability: float
    signals: list[RiskSignal]


class AnalyticsHistoryItem(BaseModel):
    id: str
    userId: str
    riskScore: float
    accidentProbability: float
    signals: list[RiskSignal]
    timestamp: str


class AnalyticsHistoryResponse(BaseModel):
    history: list[AnalyticsHistoryItem]
