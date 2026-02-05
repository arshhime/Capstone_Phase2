from pydantic import BaseModel, EmailStr
from typing import List, Optional

class QueryRequest(BaseModel):
    query: str
    chat_history: Optional[List[dict]] = []

class QueryResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []

# Authentication Models
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse
