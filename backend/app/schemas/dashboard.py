from pydantic import BaseModel
from datetime import datetime


class DashboardKPIs(BaseModel):
    total_estaciones: int
    total_registros: int
    total_calculos: int
    precipitacion_promedio: float
    precipitacion_maxima: float
    caudal_promedio: float
    caudal_maximo: float


class UploadBrief(BaseModel):
    id: int
    filename: str
    upload_date: datetime
    row_count: int

    model_config = {"from_attributes": True}


class CalculosSeries(BaseModel):
    labels: list[str]
    caudal_maximo: list[float]


class Distribution(BaseModel):
    labels: list[str]
    valores: list[int]


class DashboardResponse(BaseModel):
    kpis: DashboardKPIs
    uploads_recientes: list[UploadBrief]
    calculos_series: CalculosSeries
    superficie_distribucion: Distribution
    periodo_distribucion: Distribution
