from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Calculation(Base):
    __tablename__ = "calculations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    fecha: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    coeficiente_c: Mapped[float] = mapped_column(Float, nullable=False)
    intensidad: Mapped[float] = mapped_column(Float, nullable=False)
    area: Mapped[float] = mapped_column(Float, nullable=False)
    duracion: Mapped[float] = mapped_column(Float, nullable=False)
    periodo_retorno: Mapped[str] = mapped_column(String(50), nullable=False)
    tipo_superficie: Mapped[str] = mapped_column(String(100), nullable=False)
    caudal_maximo: Mapped[float] = mapped_column(Float, nullable=False)

    user: Mapped["User"] = relationship(back_populates="calculations")
