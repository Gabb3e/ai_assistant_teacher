from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import os
from database.models import Base
from sqlalchemy.exc import OperationalError
import asyncio
import psycopg2



load_dotenv()

# echo = True to see the SQL queries

engine = create_engine(os.getenv("DB_URL"), echo=True)

async def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    with Session(engine, expire_on_commit=False) as session:
        yield session 