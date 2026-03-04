from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import QueryRequest, QueryResponse, UserSignup, UserLogin, TokenResponse, UserResponse, CodeExecutionRequest, CodeExecutionResponse, TestCaseResult
from graph import app_graph
from auth import create_user, get_user_by_email, verify_password, create_access_token
from executor import PythonExecutor, CppExecutor, JavaExecutor
from leetcode_service import LeetCodeService
import uvicorn
import os
import sys

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
        avatar=user["avatar"],
        recentActivity=user.get("recentActivity", []),
        skillDistribution=user.get("skillDistribution", [])
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
        avatar=user["avatar"],
        recentActivity=user.get("recentActivity", []),
        skillDistribution=user.get("skillDistribution", [])
    )
    
    return TokenResponse(token=token, user=user_response)

# Chat Endpoint
@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    try:
        inputs = {
            "question": request.query,
            "chat_history": request.chat_history
        }
        result = app_graph.invoke(inputs)
        return QueryResponse(answer=result["answer"])
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Code Execution Endpoints
executors = {
    "python": PythonExecutor(),
    "cpp": CppExecutor(),
    "java": JavaExecutor()
}

@app.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """Execute user code against test cases using the appropriate executor."""
    executor = executors.get(request.language)
    if not executor:
        return CodeExecutionResponse(success=False, error=f"Language '{request.language}' is not supported yet.")

    try:
        results = executor.execute(request.code, request.test_cases, request.method_name)
        all_passed = all(r.passed for r in results)
        
        # Calculate metrics
        total_runtime = sum(r.runtime for r in results)
        total_memory = sum(r.memory for r in results)
        count = len(results) if results else 1
        
        return CodeExecutionResponse(
            success=all_passed, 
            results=results,
            metric_runtime_ms=round(total_runtime / count, 2),
            metric_memory_kb=round(total_memory / count, 2)
        )
    except Exception as e:
        return CodeExecutionResponse(success=False, error=str(e))

# LeetCode Fetching Endpoint
leetcode_service = LeetCodeService()

@app.post("/api/problems/fetch")
async def fetch_leetcode_problem(request: dict):
    """Fetch problem from LeetCode by title slug."""
    title_slug = request.get("title_slug")
    print(f"Fetching problem for slug: {title_slug}")
    if not title_slug:
        raise HTTPException(status_code=400, detail="title_slug is required")
    
    lc_data = leetcode_service.fetch_problem_details(title_slug)
    if not lc_data:
        raise HTTPException(status_code=404, detail=f"Problem '{title_slug}' not found on LeetCode")
    
    transformed_problem = leetcode_service.transform_to_app_format(lc_data)
    
    # Optionally generate MCQs (mocked for now in the service)
    mcqs = await leetcode_service.generate_mcqs_with_ai(transformed_problem['description'])
    transformed_problem['mcqs'] = mcqs
    
    return {"success": True, "problem": transformed_problem}

# Prediction Endpoint
from prediction_service import prediction_service
from models import PredictionRequest, PredictionResponse

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_success(request: PredictionRequest):
    """Predict user success probability for a problem."""
    result = await prediction_service.predict_success(request.userId, request.problemId)
    return PredictionResponse(
        success_probability=result.get("success_probability", 0.0),
        recommendation=result.get("recommendation", "No recommendation available."),
        confidence=result.get("confidence", "Low"),
        error=result.get("error")
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5002, reload=True)
