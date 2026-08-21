from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.calculation import HydroDataResponse
from app.schemas.dashboard import DashboardResponse
from app.services.hydro_service import get_hydro_chart_data, get_dashboard_data
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/hydro-data", response_model=HydroDataResponse)
def hydro_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_hydro_chart_data(db, current_user.id)


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_dashboard_data(db, current_user.id)
