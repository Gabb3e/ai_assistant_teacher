import os
from typing import Annotated
from sqlalchemy import select
from dotenv import load_dotenv
from db_setup import get_db
from sqlalchemy.orm import Session
from models.models import User
from pydantic import ValidationError
from passlib.context import CryptContext
from schemas.schemas import TokenPayload
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, status, HTTPException
from datetime import timedelta, datetime, timezone
from jose import JWTError, jwt, ExpiredSignatureError


load_dotenv(override=True)

ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")  # openssl rand -hex 32
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv(
    "ACCESS_TOKEN_EXPIRE_MINUTES")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token_access(token: str, credentials_exception: HTTPException):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        token_data = TokenPayload(**payload)
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token format validation failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        raise credentials_exception
    return token_data


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token_access(token, credentials_exception)
    user = db.scalars(select(User).where(User.id == token_data.sub)).first()
    return user
