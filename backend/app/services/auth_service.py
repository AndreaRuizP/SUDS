from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token
from app.config import settings


def register_user(db: Session, email: str, password: str) -> User:
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cuenta con ese correo",
        )
    user = User(email=email, hashed_password=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
        )
    return user


def build_token_response(user: User) -> dict:
    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
    }


def create_default_user(db: Session) -> None:
    exists = db.query(User).filter(User.email == settings.DEFAULT_ADMIN_EMAIL).first()
    if not exists:
        admin = User(
            email=settings.DEFAULT_ADMIN_EMAIL,
            hashed_password=hash_password(settings.DEFAULT_ADMIN_PASSWORD),
        )
        db.add(admin)
        db.commit()
