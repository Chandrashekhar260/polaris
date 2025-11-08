"""
Personal Learning AI Agent - FastAPI Backend
Main entry point for the application
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import stream, insights, recommendations, summary

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
        "endpoints": ["/api/ws/stream", "/api/insights", "/api/recommendations", "/api/summary"]
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
