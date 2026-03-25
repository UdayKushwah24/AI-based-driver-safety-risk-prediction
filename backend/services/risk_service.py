"""Risk prediction service for API contract /api/risk/predict."""

from math import exp

from backend.models.risk import DriverState, RiskPredictRequest, RiskSignal


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _sigmoid(value: float) -> float:
    return 1.0 / (1.0 + exp(-value))


def predict_risk(payload: RiskPredictRequest) -> tuple[float, float, list[RiskSignal]]:
    """
    Compute risk score and accident probability from driving context.

    The score blends speed, visibility and driver state, then converts
    to accident probability using a logistic mapping.
    """
    speed_factor = _clamp(payload.speed / 120.0, 0.0, 1.0)
    visibility_factor = _clamp(1.0 - (payload.visibility / 100.0), 0.0, 1.0)
    driver_factor = 1.0 if payload.driver_state == DriverState.DROWSY else 0.0

    risk_score = (
        (speed_factor * 35.0)
        + (visibility_factor * 40.0)
        + (driver_factor * 25.0)
    )
    risk_score = round(_clamp(risk_score, 0.0, 100.0), 2)

    # Center around 50 to get a calibrated 0-1 probability.
    accident_probability = round(_sigmoid((risk_score - 50.0) / 9.0), 4)

    signals: list[RiskSignal] = [
        RiskSignal(type="speed", severity="medium" if payload.speed >= 80 else "low", value=payload.speed),
        RiskSignal(
            type="visibility",
            severity="high" if payload.visibility < 35 else ("medium" if payload.visibility < 60 else "low"),
            value=payload.visibility,
        ),
        RiskSignal(
            type="driver_state",
            severity="high" if payload.driver_state == DriverState.DROWSY else "low",
            value=payload.driver_state.value,
        ),
    ]

    return risk_score, accident_probability, signals
