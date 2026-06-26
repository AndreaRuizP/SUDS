from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Integer, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class StationUpload(Base):
    __tablename__ = "station_uploads"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    upload_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    row_count: Mapped[int] = mapped_column(Integer, default=0)
    headers: Mapped[list] = mapped_column(JSON, default=list)

    user: Mapped["User"] = relationship(back_populates="uploads")
    records: Mapped[list["StationRecord"]] = relationship(
        back_populates="upload", cascade="all, delete-orphan"
    )


class StationRecord(Base):
    __tablename__ = "station_records"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    upload_id: Mapped[int] = mapped_column(ForeignKey("station_uploads.id"), nullable=False)
    row_index: Mapped[int] = mapped_column(Integer, nullable=False)
    fecha: Mapped[str | None] = mapped_column(String(100), nullable=True)
    precipitation: Mapped[float | None] = mapped_column(Float, nullable=True)
    data: Mapped[dict] = mapped_column(JSON, default=dict)

    upload: Mapped["StationUpload"] = relationship(back_populates="records")
