import io
import pandas as pd
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.station_data import StationUpload, StationRecord
from app.models.user import User

PRECIPITATION_KEYWORDS = ["precipit", "lluvia", "rainfall", "precip", "rain"]
DATE_KEYWORDS = ["fecha", "date", "tiempo", "time", "timestamp"]


def _find_column(headers: list[str], keywords: list[str]) -> str | None:
    for col in headers:
        if any(kw in col.lower() for kw in keywords):
            return col
    return None


def process_csv_upload(
    file_bytes: bytes,
    filename: str,
    user: User,
    db: Session,
) -> StationUpload:
    try:
        text = file_bytes.decode("utf-8", errors="replace")
        df = pd.read_csv(io.StringIO(text))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"No se pudo leer el CSV: {e}")

    if df.empty:
        raise HTTPException(status_code=422, detail="El archivo CSV está vacío")

    headers = df.columns.tolist()
    fecha_col = _find_column(headers, DATE_KEYWORDS)
    precip_col = _find_column(headers, PRECIPITATION_KEYWORDS)

    upload = StationUpload(
        user_id=user.id,
        filename=filename,
        row_count=len(df),
        headers=headers,
    )
    db.add(upload)
    db.flush()

    records = []
    for i, row in df.iterrows():
        raw = {col: (None if pd.isna(row[col]) else row[col]) for col in headers}

        fecha = str(raw.get(fecha_col, "")) if fecha_col else None
        try:
            precipitation = float(raw[precip_col]) if precip_col and raw.get(precip_col) is not None else None
        except (ValueError, TypeError):
            precipitation = None

        records.append(
            StationRecord(
                upload_id=upload.id,
                row_index=int(i),
                fecha=fecha,
                precipitation=precipitation,
                data=raw,
            )
        )

    db.bulk_save_objects(records)
    db.commit()
    db.refresh(upload)
    return upload


def get_upload_page(
    upload_id: int,
    user: User,
    db: Session,
    page: int = 1,
    page_size: int = 10,
) -> dict:
    upload = (
        db.query(StationUpload)
        .filter(StationUpload.id == upload_id, StationUpload.user_id == user.id)
        .first()
    )
    if not upload:
        raise HTTPException(status_code=404, detail="Importación no encontrada")

    offset = (page - 1) * page_size
    records = (
        db.query(StationRecord)
        .filter(StationRecord.upload_id == upload_id)
        .order_by(StationRecord.row_index)
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "upload_id": upload.id,
        "filename": upload.filename,
        "headers": upload.headers,
        "total": upload.row_count,
        "page": page,
        "page_size": page_size,
        "data": [r.data for r in records],
    }
