import os
from typing import Annotated
from dotenv import load_dotenv 
from db_setup import get_db
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from sqlalchemy import select, update, delete, insert
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from fastapi import FastAPI, HTTPException, Depends, status, APIRouter, Request
from schemas.schemas import Token, UserOutSchema, UserRegisterSchema, TokenWithStreak
from security import hash_password, verify_password, create_access_token, get_current_user
from models.models import User, LoginHistory

load_dotenv(override=True)


ALGORITHM = os.getenv("ALGORITHM")  # e.g HS256
SECRET_KEY = os.getenv("SECRET_KEY")  #openssl rand -hex 32
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv(
    "ACCESS_TOKEN_EXPIRE_MINUTES") 

auth_router = APIRouter(tags=["auth"])

@auth_router.post("/user", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegisterSchema, db: Session = Depends(get_db)) -> UserOutSchema:
    hashed_password: str = hash_password(user.password)
    user.password = hashed_password
    try:
        new_user = User(**user.model_dump())
        db.add(new_user)
        db.commit()
    except IntegrityError:
        raise HTTPException(detail="User already exists", status_code=status.HTTP_400_BAD_REQUEST) # Might not be secure
    return new_user

@auth_router.post("/user/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], http_request: Request, db: Session = Depends(get_db)) -> TokenWithStreak:
    user = db.scalars(select(User).where(User.email == form_data.username)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Passwords do not match",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get current date and compare with the last login date
    today = datetime.now().date()
    last_login = user.last_login.date() if user.last_login else None
    
    if last_login is not None:
        # Check if the last login was yesterday
        if last_login == today - timedelta(days=1):
            user.login_streak += 1  # Increment the streak
        else:
            user.login_streak = 1  # Reset streak if login was not consecutive
    else:
        user.login_streak = 1  # First login, initialize streak

    # Update last login date to today
    user.last_login = datetime.now()
    
    user_ip = http_request.client.host
    
    login_history = LoginHistory(user_id=user.id, ip_address=user_ip)
    db.add(login_history)
    db.commit()
    
    access_token_expires = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer", "ip": user_ip, "login_streak": user.login_streak}

@auth_router.get("/me")
def read_users_me(current_user: Annotated[User, Depends(get_current_user)]) -> UserOutSchema:
    return current_user
    