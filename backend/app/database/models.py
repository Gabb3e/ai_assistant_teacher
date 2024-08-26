from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, Boolean, ForeignKey, DateTime, func, UniqueConstraint
from datetime import datetime

# Base class for all models
class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

# Define a request model for incoming data
class ChatRequest(Base):
    __tablename__ = "chat_requests"

    user_input: Mapped[str] = mapped_column(Text, nullable=False)

# Define a response model
class ChatResponse(Base):
    __tablename__ = "chat_responses"

    ai_response: Mapped[str] = mapped_column(Text, nullable=False)


class User(Base):
    __tablename__ = "users"
    
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    user_name: Mapped[str] = mapped_column(String(50), unique=True)
    password: Mapped[str] = mapped_column(String(1000))
    email: Mapped[str] = mapped_column(String(50), unique=True)
    member_since: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    phone_nr: Mapped[str] = mapped_column(String(20), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    # relationships
    # pets: Mapped[list[Pet]] = relationship("Pet", back_populates="user")
    
    def __repr__(self):
        return f"<User ={self.first_name} {self.last_name} aka {self.user_name}>"

