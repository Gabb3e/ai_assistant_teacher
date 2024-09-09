from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import os
from models.models import Base




load_dotenv()

# echo = True to see the SQL queries

engine = create_engine(os.getenv("TEST_DB_URL"), echo=True)

async def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    with Session(engine, expire_on_commit=False) as session:
        yield session 