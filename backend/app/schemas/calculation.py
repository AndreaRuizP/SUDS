from pydantic import BaseModel, field_validator
from datetime import datetime


class CalculationRequest(BaseModel):
    coeficiente_c: float
    intensidad: float
    area: float
    duracion: float
    periodo_retorno: str
    tipo_superficie: str

    @field_validator("coeficiente_c")
    @classmethod
    def validate_c(cls, v: float) -> float:
        if not 0 < v <= 1:
            raise ValueError("El coeficiente C debe estar entre 0 y 1")
        return v

    @field_validator("intensidad", "area", "duracion")
    @classmethod
    def validate_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("El valor debe ser mayor que cero")
        return v


class CalculationResponse(BaseModel):
    id: int
    fecha: datetime
    coeficiente_c: float
    intensidad: float
    area: float
    duracion: float
    periodo_retorno: str
    tipo_superficie: str
    caudal_maximo: float

    model_config = {"from_attributes": True}


class IDFDataset(BaseModel):
    label: str
    data: list[float]
    borderColor: str
    backgroundColor: str
    tension: float = 0.4
    fill: bool = False


class IDFResponse(BaseModel):
    labels: list[int]
    datasets: list[IDFDataset]


class HydroDataResponse(BaseModel):
    labels: list[str]
    precipitacion: list[float]
    intensidad: list[float]
    duracion: list[float]
    max_precipitacion: float
    avg_precipitacion: float
    max_intensidad: float
    avg_intensidad: float
