from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.calculation import CalculationRequest, CalculationResponse, IDFResponse
from app.services.hydro_service import rational_method, get_idf_curves
from app.utils.security import get_current_user
from app.models.user import User
from app.models.calculation import Calculation

router = APIRouter()


@router.post("/rational-method", response_model=CalculationResponse, status_code=201)
def calculate_runoff(
    body: CalculationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    caudal = rational_method(body.coeficiente_c, body.intensidad, body.area)

    record = Calculation(
        user_id=current_user.id,
        coeficiente_c=body.coeficiente_c,
        intensidad=body.intensidad,
        area=body.area,
        duracion=body.duracion,
        periodo_retorno=body.periodo_retorno,
        tipo_superficie=body.tipo_superficie,
        caudal_maximo=caudal,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/history", response_model=list[CalculationResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Calculation)
        .filter(Calculation.user_id == current_user.id)
        .order_by(Calculation.fecha.desc())
        .all()
    )


@router.delete("/history", status_code=204)
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Calculation).filter(Calculation.user_id == current_user.id).delete()
    db.commit()


@router.delete("/history/{calc_id}", status_code=204)
def delete_calculation(
    calc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Calculation).filter(
        Calculation.id == calc_id, Calculation.user_id == current_user.id
    ).delete()
    db.commit()


@router.get("/idf-curves", response_model=IDFResponse)
def idf_curves(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_idf_curves(db, current_user.id)
