import os
from typing import Annotated
from dotenv import load_dotenv 
from db_setup import get_db
from sqlalchemy.orm import Session
from datetime import timedelta
from sqlalchemy import select, update, delete, insert
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from schemas.schemas import Token, UserOutSchema, UserRegisterSchema
from security import hash_password, verify_password, create_access_token, get_current_user
from models.models import User

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
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)) -> Token:
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
    
    access_token_expires = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/me")
def read_users_me(current_user: Annotated[User, Depends(get_current_user)]) -> UserOutSchema:
    return current_user
    