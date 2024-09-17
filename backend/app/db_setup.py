from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import os
from models.models import Base

load_dotenv()
print("Database URL:", os.getenv("TEST_DB_URL"))
engine = create_engine(os.getenv("TEST_DB_URL"), echo=True)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    with Session(engine, expire_on_commit=False) as session:
        yield session


if __name__ == "__main__":
    # This will create all tables based on your models in models.py
    init_db()
    print("Tables initialized successfully.")
