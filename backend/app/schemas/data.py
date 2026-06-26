from pydantic import BaseModel
from datetime import datetime
from typing import Any


class UploadResponse(BaseModel):
    id: int
    filename: str
    row_count: int
    headers: list[str]
    upload_date: datetime
    message: str = "Archivo importado exitosamente"

    model_config = {"from_attributes": True}


class StationDataPage(BaseModel):
    upload_id: int
    filename: str
    headers: list[str]
    total: int
    page: int
    page_size: int
    data: list[dict[str, Any]]


class UploadSummary(BaseModel):
    id: int
    filename: str
    upload_date: datetime
    row_count: int

    model_config = {"from_attributes": True}
