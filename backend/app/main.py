from fastapi import FastAPI, HTTPException, Depends, status, Request, Query
from app.db_setup import init_db, get_db
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select, update, delete, insert
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from app.database.models import ChatRequest, ChatResponse
from app.database.schemas import ChatRequestModel, ChatResponseModel
from openai import OpenAI
import httpx
from typing import List, Dict
from uuid import uuid4
import os

# from app.auth import get_current_user  # Assuming you have an auth dependency

# Dependency to load API key from environment variables


def load_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="API key not found")
    return api_key


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

# pass

app = FastAPI(lifespan=lifespan)
# app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"]
)

# In-memory store for conversations (for simplicity)
conversations: Dict[str, List[Dict[str, str]]] = {}

client = OpenAI()

#################################   endpoints   #################################

# This endpoint will receive the user's response from the front-end, send it to the LLM, and return the AI's response.


@app.post("/chat", response_model=ChatResponseModel, tags=["chat"])
async def chat_with_ai(
    request: ChatRequestModel,
    db: Session = Depends(get_db),  # Injecting DB session for consistency
    # Injecting API key using a dependency
    api_key: str = Depends(load_api_key)
):
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpfull geograph assistent."},
                {"role": "user",
                 "content": request.user_input},
            ]
        )

        ai_response = completion.choices[0].message.content
        print(ai_response)
        # Save the response to the database
        db_chat_response = ChatResponse(ai_response=ai_response)
        db.add(db_chat_response)
        db.commit()
        db.refresh(db_chat_response)

        return ChatResponseModel.from_orm(db_chat_response)

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# This endpoint will allow the user to continue the conversation with the AI. It will handle back-and-forth communication.
@app.post("/chat/continue", response_model=ChatResponseModel, tags=["chat"])
async def continue_chat_with_ai(
    request: ChatRequestModel,
    session_id: str = None,
    db: Session = Depends(get_db),
    api_key: str = Depends(load_api_key)
):
    if not session_id:
        session_id = str(uuid4())

    if session_id not in conversations:
        conversations[session_id] = []

    # Add user input to the conversation history
    conversations[session_id].append(
        {"role": "user", "content": request.user_input})

    try:
        # Call the OpenAI API with the entire conversation history
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=conversations[session_id]
        )

        ai_response = completion.choices[0].message.content
        # Add AI response to the conversation history
        conversations[session_id].append(
            {"role": "ai", "content": ai_response})

        # Save the response to the database
        db_chat_response = ChatResponse(ai_response=ai_response)
        db.add(db_chat_response)
        db.commit()
        db.refresh(db_chat_response)

        return ChatResponseModel.from_orm(db_chat_response)

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# If you want to maintain a chat history, this endpoint can fetch previous messages between the user and the AI.


@app.get("/chat/history", tags=["chat"])
async def chat_history(session_id: str):
    if session_id not in conversations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session ID not found")

    return {"session_id": session_id, "history": conversations[session_id]}
