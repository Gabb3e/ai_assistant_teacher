from sqlalchemy import create_engine, Integer, String, Boolean, BigInteger, TIMESTAMP, Text, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
class Base(DeclarativeBase):
    pass

# User Model
class User(Base):
    __tablename__ = 'users'

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    gender: Mapped[bool] = mapped_column(Boolean, nullable=False)
    age: Mapped[int] = mapped_column(BigInteger, nullable=False)
    activated: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    phone_nr: Mapped[str] = mapped_column(String(20), nullable=True)
    member_since: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # relationships
    test_attempts: Mapped[list["TestAttempt"]] = relationship("TestAttempt", back_populates="user")

    def __repr__(self):
        return f"<User ={self.first_name} {self.last_name} aka {self.email}>"

# Subject Model
class Subject(Base):
    __tablename__ = 'subjects'

    subject_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text)

    # relationships
    tests: Mapped[list["Test"]] = relationship("Test", back_populates="subject")

# Test Model
class Test(Base):
    __tablename__ = 'tests'

    test_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey('subjects.subject_id'), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50))
    time_limit: Mapped[int] = mapped_column(Integer)  # Time in minutes
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    # relationships
    subject: Mapped["Subject"] = relationship("Subject", back_populates="tests")
    questions: Mapped[list["Question"]] = relationship("Question", back_populates="test")
    test_attempts: Mapped[list["TestAttempt"]] = relationship("TestAttempt", back_populates="test")

# Question Model
class Question(Base):
    __tablename__ = 'questions'

    question_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    test_id: Mapped[int] = mapped_column(ForeignKey('tests.test_id'), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    correct_answer: Mapped[str] = mapped_column(Text)
    points: Mapped[float] = mapped_column(Numeric, nullable=False)

    # relationships
    test: Mapped["Test"] = relationship("Test", back_populates="questions")
    options: Mapped[list["QuestionOption"]] = relationship("QuestionOption", back_populates="question")
    submitted_answers: Mapped[list["SubmittedAnswer"]] = relationship("SubmittedAnswer", back_populates="question")

# Question Option Model
class QuestionOption(Base):
    __tablename__ = 'question_options'

    option_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    question_id: Mapped[int] = mapped_column(ForeignKey('questions.question_id'), nullable=False)
    option_text: Mapped[str] = mapped_column(Text, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)

    # relationships
    question: Mapped["Question"] = relationship("Question", back_populates="options")

# Test Attempt Model
class TestAttempt(Base):
    __tablename__ = 'test_attempts'

    attempt_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.user_id'), nullable=False)
    test_id: Mapped[int] = mapped_column(ForeignKey('tests.test_id'), nullable=False)
    start_time: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
    end_time: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
    score: Mapped[float] = mapped_column(Numeric)

    # relationships
    user: Mapped["User"] = relationship("User", back_populates="test_attempts")
    test: Mapped["Test"] = relationship("Test", back_populates="test_attempts")
    submitted_answers: Mapped[list["SubmittedAnswer"]] = relationship("SubmittedAnswer", back_populates="test_attempt")

# Submitted Answer Model
class SubmittedAnswer(Base):
    __tablename__ = 'submitted_answers'

    answer_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    attempt_id: Mapped[int] = mapped_column(ForeignKey('test_attempts.attempt_id'), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey('questions.question_id'), nullable=False)
    submitted_option_id: Mapped[int] = mapped_column(ForeignKey('question_options.option_id'))
    submitted_text: Mapped[str] = mapped_column(Text)

    # relationships
    test_attempt: Mapped["TestAttempt"] = relationship("TestAttempt", back_populates="submitted_answers")
    question: Mapped["Question"] = relationship("Question", back_populates="submitted_answers")

# Quiz Model
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

# Quiz Question Model
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

# Chat Request Model
class ChatRequest(Base):
    __tablename__ = "chat_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_input: Mapped[str] = mapped_column(Text, nullable=False)

# Chat Response Model
class ChatResponse(Base):
    __tablename__ = "chat_responses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ai_response: Mapped[str] = mapped_column(Text, nullable=False)
