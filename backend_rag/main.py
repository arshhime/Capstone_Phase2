from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import QueryRequest, QueryResponse, UserSignup, UserLogin, TokenResponse, UserResponse
from graph import app_graph
from auth import create_user, get_user_by_email, verify_password, create_access_token
import uvicorn
import os

app = FastAPI(title="Kshitij Capstone AI Agent")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Kshitij Capstone AI Agent API is running"}

# Authentication Endpoints
@app.post("/api/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    # Check if user already exists
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    # Create new user
    user = create_user(user_data.name, user_data.email, user_data.password)
    
    # Create JWT token
    token = create_access_token({"id": user["id"], "email": user["email"]})
    
    # Return user without password
    user_response = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        avatar=user["avatar"]
    )
    
    return TokenResponse(token=token, user=user_response)

@app.post("/api/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    # Find user by email
    user = get_user_by_email(credentials.email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials.")
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials.")
    
    # Create JWT token
    token = create_access_token({"id": user["id"], "email": user["email"]})
    
    # Return user without password
    user_response = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        avatar=user["avatar"]
    )
    
    return TokenResponse(token=token, user=user_response)

# Chat Endpoint
@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    try:
        inputs = {"question": request.query}
        result = app_graph.invoke(inputs)
        return QueryResponse(answer=result["answer"])
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

