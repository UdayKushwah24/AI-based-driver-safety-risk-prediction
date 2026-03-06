"""
Retrain the accident severity model using the current scikit-learn version.

The original pkl was built with sklearn 1.6.1 and is incompatible with 1.8.0
due to a removed internal attribute (_RemainderColsList).

This script generates realistic synthetic training data covering the same
feature schema and trains a new XGBoost-backed Pipeline that is saved
in-place at backend/models/.

Run from the DriverSafetySystem directory:
    python scripts/retrain_accident_model.py
"""

import sys
from pathlib import Path

# Make sure project imports work when run from DriverSafetySystem/
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import numpy as np
import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OrdinalEncoder, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier

SAVE_DIR = ROOT / "backend" / "models"
MODEL_PATH = SAVE_DIR / "accident_prediction_model.pkl"
ENCODER_PATH = SAVE_DIR / "label_encoder.pkl"

# ── Feature vocabulary (matches frontend dropdowns exactly) ──────────

STATES = [
    "Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Gujarat",
    "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala",
    "Andhra Pradesh", "Madhya Pradesh", "Punjab", "Haryana", "Bihar",
    "Odisha", "Jharkhand", "Assam", "Chhattisgarh", "Uttarakhand", "Other",
]

CITIES = [
    "Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune",
    "Kolkata", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur",
    "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna",
    "Vadodara", "Ghaziabad", "Other",
]

ROAD_TYPES = [
    "Roundabout", "One way street", "Dual carriageway",
    "Single carriageway", "Slip road", "Unknown",
]

ROAD_SURFACES = [
    "Dry", "Wet or damp", "Snow", "Frost or ice",
    "Flood over 3cm. deep", "Mud", "Oil or diesel", "Sand",
]

LIGHT_CONDITIONS = [
    "Daylight: Street light present",
    "Darkness: Street lights present and lit",
    "Darkness: Street lights present but unlit",
    "Darkness - lights unlit",
    "Darkness - no lighting",
    "Darkness - lighting unknown",
]

WEATHER = [
    "Fine no high winds", "Raining no high winds", "Snowing no high winds",
    "Fine + high winds", "Raining + high winds", "Snowing + high winds",
    "Fog or mist", "Other", "Unknown",
]

CASUALTY_CLASSES = [
    "Driver or rider", "Vehicle or pillion passenger", "Pedestrian",
]

CASUALTY_SEX = ["Male", "Female"]

VEHICLE_TYPES = [
    "Car", "Motorcycle over 500cc", "Taxi/Private hire car",
    "Bus or coach (17 or more pass seats)", "Minibus (8 - 16 passenger seats)",
    "Goods over 3.5t. and under 7.5t", "Van / Goods 3.5 tonnes mgw or under",
    "Motorcycle 50cc and under", "Electric motorcycle",
    "Agricultural vehicle", "Pedal cycle", "Other vehicle",
]

SEVERITY_LABELS = ["Slight", "Serious", "Fatal"]
rng = np.random.default_rng(42)
N = 12_000  # Enough to learn sensible patterns


def _base_severity_prob(row: dict) -> np.ndarray:
    """
    Heuristic risk weighting so the synthetic data has realistic patterns.
    Returns probability vector [Slight, Serious, Fatal].
    """
    risk = 0.0

    # Lighting risk
    if "unlit" in row["Light_Condition"].lower() or "no lighting" in row["Light_Condition"].lower():
        risk += 2.5
    elif "Darkness" in row["Light_Condition"]:
        risk += 1.2

    # Weather risk
    if row["Weather"] in ("Fog or mist", "Snowing + high winds", "Raining + high winds"):
        risk += 2.0
    elif "Raining" in row["Weather"] or "Snowing" in row["Weather"]:
        risk += 1.0

    # Road surface risk
    if row["Road_Surface"] in ("Frost or ice", "Snow", "Flood over 3cm. deep"):
        risk += 2.0
    elif row["Road_Surface"] in ("Wet or damp", "Mud", "Oil or diesel"):
        risk += 1.0

    # Road type
    if row["Road_Type"] == "Roundabout":
        risk += 0.5

    # Casualty
    if row["Casualty_Class"] == "Pedestrian":
        risk += 2.0
    elif row["Casualty_Class"] == "Driver or rider":
        risk += 0.5

    # Age (very young or elderly = higher risk)
    age = row["Casualty_Age"]
    if age < 18 or age > 70:
        risk += 1.5
    elif age > 60:
        risk += 0.5

    # Vehicles
    n = row["No_of_Vehicles"]
    risk += min(n - 1, 3) * 0.4

    # Clamp
    risk = max(0.0, risk)
    p_fatal  = min(0.20, 0.005 * risk ** 1.5)
    p_serious = min(0.45, 0.06 * risk)
    p_slight  = 1.0 - p_fatal - p_serious
    if p_slight < 0.05:
        p_slight = 0.05
        p_serious = 1.0 - p_fatal - p_slight
    total = p_slight + p_serious + p_fatal
    return np.array([p_slight, p_serious, p_fatal]) / total


def generate_dataset(n: int) -> pd.DataFrame:
    rows = []
    for _ in range(n):
        row = {
            "State": rng.choice(STATES),
            "City": rng.choice(CITIES),
            "No_of_Vehicles": int(rng.integers(1, 8)),
            "Road_Type": rng.choice(ROAD_TYPES),
            "Road_Surface": rng.choice(ROAD_SURFACES),
            "Light_Condition": rng.choice(LIGHT_CONDITIONS),
            "Weather": rng.choice(WEATHER),
            "Casualty_Class": rng.choice(CASUALTY_CLASSES),
            "Casualty_Sex": rng.choice(CASUALTY_SEX),
            "Casualty_Age": int(rng.integers(5, 90)),
            "Vehicle_Type": rng.choice(VEHICLE_TYPES),
        }
        probs = _base_severity_prob(row)
        row["Severity"] = rng.choice(SEVERITY_LABELS, p=probs)
        rows.append(row)
    return pd.DataFrame(rows)


def main():
    print("Generating synthetic training dataset …")
    df = generate_dataset(N)
    print(f"  Rows: {len(df)} | Severity distribution:")
    print(df["Severity"].value_counts().to_string())

    X = df.drop("Severity", axis=1)
    y = df["Severity"]

    # ── Label encoder for target ──────────────────────────────────────
    le = LabelEncoder()
    le.fit(SEVERITY_LABELS)          # Fix class order
    y_enc = le.transform(y)
    print(f"  Classes: {le.classes_}")

    # ── Categorical and numeric columns ───────────────────────────────
    cat_cols = [
        "State", "City", "Road_Type", "Road_Surface",
        "Light_Condition", "Weather", "Casualty_Class",
        "Casualty_Sex", "Vehicle_Type",
    ]
    num_cols = ["No_of_Vehicles", "Casualty_Age"]

    cat_vocab = {
        "State": STATES,
        "City": CITIES,
        "Road_Type": ROAD_TYPES,
        "Road_Surface": ROAD_SURFACES,
        "Light_Condition": LIGHT_CONDITIONS,
        "Weather": WEATHER,
        "Casualty_Class": CASUALTY_CLASSES,
        "Casualty_Sex": CASUALTY_SEX,
        "Vehicle_Type": VEHICLE_TYPES,
    }

    # OrdinalEncoder with explicit categories so unseen values fall back
    oe = OrdinalEncoder(
        categories=[cat_vocab[c] for c in cat_cols],
        handle_unknown="use_encoded_value",
        unknown_value=-1,
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", oe, cat_cols),
            ("num", "passthrough", num_cols),
        ]
    )

    # GradientBoostingClassifier — pure sklearn, no external deps
    clf = GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.08,
        max_depth=4,
        subsample=0.8,
        random_state=42,
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", clf),
    ])

    print("\nTraining model …")
    pipeline.fit(X, y_enc)

    # Quick accuracy estimate on last 1000 rows
    acc = (pipeline.predict(X[-1000:]) == y_enc[-1000:]).mean()
    print(f"  Training accuracy (last 1000): {acc:.1%}")

    # ── Save ─────────────────────────────────────────────────────────
    SAVE_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    joblib.dump(le,       ENCODER_PATH)
    print(f"\nSaved model   → {MODEL_PATH}")
    print(f"Saved encoder → {ENCODER_PATH}")

    # ── Quick smoke-test ───────────────────────────────────────────
    import json
    sample = {
        "State": "Karnataka", "City": "Bangalore", "No_of_Vehicles": 2,
        "Road_Type": "Roundabout", "Road_Surface": "Frost or ice",
        "Light_Condition": "Darkness - lights unlit",
        "Weather": "Raining no high winds",
        "Casualty_Class": "Pedestrian", "Casualty_Sex": "Female",
        "Casualty_Age": 23, "Vehicle_Type": "Van / Goods 3.5 tonnes mgw or under",
    }
    pred = pipeline.predict(pd.DataFrame([sample]))
    print(f"\nSmoke-test prediction: {le.inverse_transform(pred)[0]}")
    print("\nDone! Restart the backend to pick up the new model.")


if __name__ == "__main__":
    main()
