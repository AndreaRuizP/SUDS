from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import User, StationUpload, StationRecord, Calculation  # noqa: F401 — registers models
from app.database import Base, SessionLocal
from app.routers import auth, data, calculations, analysis
from app.services.auth_service import create_default_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        create_default_user(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="SUDS API",
    description="Sistema de Análisis Hidrometeorológico — Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
app.include_router(data.router, prefix="/data", tags=["Datos de estación"])
app.include_router(calculations.router, prefix="/calculations", tags=["Cálculos"])
app.include_router(analysis.router, prefix="/analysis", tags=["Análisis"])


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "SUDS API", "version": "1.0.0"}
