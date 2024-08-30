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



class QuizModel(Base):
    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=False)
    num_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # relationships
    questions: Mapped[list["QuizQuestionModel"]] = relationship("QuizQuestionModel", back_populates="quiz", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<QuizModel id={self.id} topic={self.topic} difficulty={self.difficulty}>"

class QuizQuestionModel(Base):
    __tablename__ = "quiz_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[str] = mapped_column(Text, nullable=False)  # Store options as JSON or delimited string
    correct_answer: Mapped[str] = mapped_column(String(100), nullable=False)

    # relationships
    quiz: Mapped["QuizModel"] = relationship("QuizModel", back_populates="questions")

    def __repr__(self):
        return f"<QuizQuestionModel id={self.id} quiz_id={self.quiz_id} question={self.question}>"