"""
Personal Learning AI Agent - FastAPI Backend
Main entry point for the application
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import stream, insights, recommendations, summary, upload, quiz

# Load environment variables
load_dotenv()

# Check if Google API key is present
if not os.getenv("GOOGLE_API_KEY"):
    print("⚠️  Warning: GOOGLE_API_KEY not configured - running in mock mode")
    print("   Set GOOGLE_API_KEY environment variable for full AI functionality")

# Initialize FastAPI app
app = FastAPI(
    title="Personal Learning AI Agent",
    description="Real-time learning analysis powered by Gemini AI",
    version="1.0.0"
)

# Initialize services on startup
@app.on_event("startup")
async def startup_event():
    """Initialize services when app starts"""
    from services.ai_agent import get_ai_agent
    from services.vector_store import get_vector_store
    import services.ai_agent as ai_module
    import services.vector_store as vs_module
    
    # Initialize singletons
    ai_module.ai_agent = get_ai_agent()
    vs_module.vector_store = get_vector_store()
    
    print("✅ Services initialized successfully")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stream.router, prefix="/api", tags=["Stream"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(summary.router, prefix="/api", tags=["Summary"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(quiz.router, prefix="/api", tags=["Quiz"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "Personal Learning AI Agent",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "gemini_api_configured": bool(os.getenv("GOOGLE_API_KEY")),
        "vector_store": "chromadb",
        "endpoints": ["/api/ws/stream", "/api/insights", "/api/recommendations", "/api/summary", "/api/upload", "/api/quiz"]
    }

@app.get("/api/rate-limit")
async def get_rate_limit_status():
    """Get current API rate limit status"""
    from services.rate_limiter import get_rate_limiter
    rate_limiter = get_rate_limiter()
    status = rate_limiter.get_status()
    return {
        "count": status["count"],
        "limit": status["limit"],
        "remaining": status["remaining"],
        "can_request": status["can_request"],
        "last_date": status["last_date"],
        "message": f"{status['remaining']} API calls remaining today (out of {status['limit']})"
    }

@app.post("/api/rate-limit/reset")
async def reset_rate_limit():
    """Reset the rate limit counter (useful when switching API keys or for testing)"""
    from services.rate_limiter import get_rate_limiter
    rate_limiter = get_rate_limiter()
    rate_limiter.reset()
    status = rate_limiter.get_status()
    return {
        "success": True,
        "message": "Rate limit reset successfully",
        "count": status["count"],
        "limit": status["limit"],
        "remaining": status["remaining"],
        "last_date": status["last_date"]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
