"""
Simple Mock Backend - No External AI Dependencies
Run this if you want the backend running quickly without API keys
"""
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime

app = FastAPI(title="Personal Learning AI Agent - Simple Mode")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
sessions = []
active_connections = []

@app.get("/")
async def root():
    return {"status": "running", "mode": "simple_mock"}

@app.get("/health")
async def health():
    return {"status": "healthy", "mode": "simple_mock"}

@app.get("/api/insights")
async def get_insights():
    return {
        "recent_sessions": sessions[:5],
        "top_topics": [
            {"topic": "Python", "count": 5},
            {"topic": "JavaScript", "count": 3},
            {"topic": "React", "count": 2}
        ],
        "difficulty_distribution": {"beginner": 2, "intermediate": 5, "advanced": 1},
        "total_sessions": len(sessions),
        "struggle_areas": []
    }

@app.get("/api/recommendations")
async def get_recommendations():
    return [{
        "title": "Continue Learning!",
        "description": "Start the file watcher to track your coding sessions",
        "reason": "Simple mock mode - Add GOOGLE_API_KEY for real AI",
        "estimated_time": "ongoing",
        "difficulty": "beginner",
        "resource_type": "tutorial",
        "topics": ["Programming"]
    }]

@app.get("/api/summary")
async def get_summary(period: str = "weekly"):
    return {
        "period": period,
        "summary": f"You've completed {len(sessions)} coding sessions this {period}.",
        "topics_learned": ["Python", "JavaScript"],
        "struggling_topics": [],
        "total_sessions": len(sessions),
        "date_range": {"start": "", "end": ""}
    }

@app.get("/api/summary/stats")
async def get_stats():
    return {
        "total_sessions": len(sessions),
        "unique_topics": 3,
        "top_topics": [["Python", 5], ["JavaScript", 3], ["React", 2]],
        "difficulty_breakdown": {"beginner": 2, "intermediate": 5, "advanced": 1},
        "current_streak": 0
    }

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    print("✅ WebSocket client connected")
    
    try:
        while True:
            data = await websocket.receive_json()
            
            # Simple mock analysis
            session = {
                "id": str(len(sessions) + 1),
                "filename": data.get("filename", "unknown"),
                "filepath": data.get("filepath", "unknown"),
                "topics": ["Programming"],
                "difficulty": "intermediate",
                "concepts": ["Code Structure"],
                "potential_struggles": [],
                "summary": f"Working on {data.get('filename', 'code')}",
                "timestamp": datetime.utcnow().isoformat()
            }
            sessions.append(session)
            
            # Broadcast to all connections
            for conn in active_connections:
                try:
                    await conn.send_json({
                        "type": "analysis",
                        "data": session
                    })
                except:
                    pass
                    
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
        print("WebSocket client disconnected")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Simple Mock Backend...")
    print("   No AI dependencies - Perfect for quick testing!")
    uvicorn.run(app, host="0.0.0.0", port=8000)
