from fastapi import APIRouter, Depends, File, UploadFile, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.data import UploadResponse, StationDataPage, UploadSummary
from app.services.csv_service import process_csv_upload, get_upload_page
from app.utils.security import get_current_user
from app.models.user import User
from app.models.station_data import StationUpload

router = APIRouter()


@router.post("/upload-csv", response_model=UploadResponse)
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contents = await file.read()
    upload = process_csv_upload(contents, file.filename or "datos.csv", current_user, db)
    return upload


@router.get("/uploads", response_model=list[UploadSummary])
def list_uploads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(StationUpload)
        .filter(StationUpload.user_id == current_user.id)
        .order_by(StationUpload.upload_date.desc())
        .all()
    )


@router.get("/uploads/{upload_id}", response_model=StationDataPage)
def get_upload(
    upload_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_upload_page(upload_id, current_user, db, page, page_size)


@router.delete("/uploads/{upload_id}", status_code=204)
def delete_upload(
    upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    upload = (
        db.query(StationUpload)
        .filter(StationUpload.id == upload_id, StationUpload.user_id == current_user.id)
        .first()
    )
    if upload:
        db.delete(upload)
        db.commit()
