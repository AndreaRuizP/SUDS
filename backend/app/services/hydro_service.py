"""
Hydrology calculation engine for SUDS.

Rational Method: Q = C × I × A
IDF Curves: Empirical formula I = a·T^b / (t + c)^d
  Default parameters calibrated for the Caribbean Colombia region (Santa Marta).
  If ≥2 years of precipitation data are available, Gumbel extreme-value fitting is used.
"""

from __future__ import annotations
import numpy as np
from typing import Any
from sqlalchemy.orm import Session
from app.models.station_data import StationUpload, StationRecord

DURATIONS_MIN = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240]
RETURN_PERIODS = [10, 20, 50]

IDF_COLORS = {
    10: ("#f87171", "#f8717133"),
    20: ("#fb923c", "#fb923c33"),
    50: ("#4ade80", "#4ade8033"),
}

# Regional IDF parameters for Caribbean Colombia (Santa Marta area)
# I [mm/h] = A_coef * T^b / (t + c)^d
_REGIONAL_PARAMS = {"a": 700.0, "b": 0.22, "c": 10.0, "d": 0.68}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def rational_method(C: float, I: float, A: float) -> float:
    return round(C * I * A, 4)


def get_idf_curves(db: Session, user_id: int) -> dict[str, Any]:
    """
    Return IDF curve data for the Chart.js IDFChart component.
    Uses Gumbel fitting if enough station data exists; otherwise falls back to
    regional parametric curves.
    """
    precipitation_values = _load_precipitation(db, user_id)
    if len(precipitation_values) >= 730:  # ~2 years of daily readings
        return _idf_from_gumbel(precipitation_values)
    return _idf_regional()


def get_hydro_chart_data(db: Session, user_id: int) -> dict[str, Any]:
    """Return time-series data for the HydroVisual component."""
    upload = (
        db.query(StationUpload)
        .filter(StationUpload.user_id == user_id)
        .order_by(StationUpload.upload_date.desc())
        .first()
    )
    if not upload:
        return _empty_hydro_data()

    records = (
        db.query(StationRecord)
        .filter(StationRecord.upload_id == upload.id)
        .order_by(StationRecord.row_index)
        .limit(500)
        .all()
    )

    labels, precip, intensidad, duracion = [], [], [], []
    for r in records:
        labels.append(r.fecha or str(r.row_index))
        p = r.precipitation or 0.0
        precip.append(round(p, 2))
        intensidad.append(round(p * 6, 2))    # approximate: mm × 6 → mm/h (10-min interval)
        duracion.append(10.0)                  # placeholder duration per reading

    precip_arr = np.array(precip)
    intens_arr = np.array(intensidad)

    return {
        "labels": labels,
        "precipitacion": precip,
        "intensidad": intensidad,
        "duracion": duracion,
        "max_precipitacion": float(precip_arr.max()) if len(precip_arr) else 0.0,
        "avg_precipitacion": round(float(precip_arr.mean()), 2) if len(precip_arr) else 0.0,
        "max_intensidad": float(intens_arr.max()) if len(intens_arr) else 0.0,
        "avg_intensidad": round(float(intens_arr.mean()), 2) if len(intens_arr) else 0.0,
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _load_precipitation(db: Session, user_id: int) -> list[float]:
    upload = (
        db.query(StationUpload)
        .filter(StationUpload.user_id == user_id)
        .order_by(StationUpload.upload_date.desc())
        .first()
    )
    if not upload:
        return []
    rows = (
        db.query(StationRecord.precipitation)
        .filter(
            StationRecord.upload_id == upload.id,
            StationRecord.precipitation.isnot(None),
        )
        .all()
    )
    return [r.precipitation for r in rows]


def _idf_regional() -> dict[str, Any]:
    """Parametric IDF for Caribbean Colombia."""
    p = _REGIONAL_PARAMS
    datasets = []
    for T in RETURN_PERIODS:
        intensities = [
            round(p["a"] * (T ** p["b"]) / ((t + p["c"]) ** p["d"]), 2)
            for t in DURATIONS_MIN
        ]
        border, bg = IDF_COLORS[T]
        datasets.append(
            {
                "label": f"T = {T} años",
                "data": intensities,
                "borderColor": border,
                "backgroundColor": bg,
                "tension": 0.4,
                "fill": False,
            }
        )
    return {"labels": DURATIONS_MIN, "datasets": datasets}


def _idf_from_gumbel(precipitation: list[float]) -> dict[str, Any]:
    """
    Fit a Gumbel distribution to annual precipitation maxima and derive
    intensity for each duration using the ratio method.
    Intensities are scaled from the fitted annual maximum.
    """
    arr = np.array(precipitation)
    # Estimate annual max from groups of 365 readings
    n_years = len(arr) // 365
    annual_max = [arr[i * 365:(i + 1) * 365].max() for i in range(n_years)]
    mu = float(np.mean(annual_max))
    sigma = float(np.std(annual_max, ddof=1)) if n_years > 1 else mu * 0.3

    # Gumbel parameters
    alpha = sigma * np.sqrt(6) / np.pi
    u = mu - 0.5772 * alpha

    datasets = []
    for T in RETURN_PERIODS:
        y_T = -np.log(-np.log(1 - 1 / T))
        x_T = u + alpha * y_T                # annual max precipitation [mm]
        intensities = [
            round(float(x_T * 60 / t), 2)    # scale: mm → mm/h equivalent
            for t in DURATIONS_MIN
        ]
        border, bg = IDF_COLORS[T]
        datasets.append(
            {
                "label": f"T = {T} años",
                "data": intensities,
                "borderColor": border,
                "backgroundColor": bg,
                "tension": 0.4,
                "fill": False,
            }
        )
    return {"labels": DURATIONS_MIN, "datasets": datasets}


def _empty_hydro_data() -> dict[str, Any]:
    return {
        "labels": [],
        "precipitacion": [],
        "intensidad": [],
        "duracion": [],
        "max_precipitacion": 0.0,
        "avg_precipitacion": 0.0,
        "max_intensidad": 0.0,
        "avg_intensidad": 0.0,
    }
