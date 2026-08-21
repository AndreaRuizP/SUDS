from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserOut
from app.services.auth_service import authenticate_user, build_token_response, register_user
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(db, body.email, body.password)
    return build_token_response(user)


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # Swagger envía "username"; lo usamos como email
    user = authenticate_user(db, form_data.username, form_data.password)
    return build_token_response(user)


@router.post("/login/json", response_model=TokenResponse)
def login_json(body: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, body.email, body.password)
    return build_token_response(user)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
