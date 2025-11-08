"""
Recommendations Route - Get AI-generated learning recommendations
"""
from fastapi import APIRouter
from typing import List, Dict
from services.vector_store import vector_store
from services.ai_agent import ai_agent

router = APIRouter()

@router.get("/recommendations")
async def get_recommendations() -> List[Dict]:
    """
    Get personalized learning recommendations
    
    Returns AI-generated recommendations based on recent learning activity
    """
    # Get recent sessions to analyze
    recent_sessions = vector_store.get_recent_sessions(limit=10)
    
    if not recent_sessions:
        return [{
            "title": "Start Learning!",
            "description": "Begin your learning journey by working on code projects. The AI will analyze your activity and provide personalized recommendations.",
            "reason": "No learning activity detected yet",
            "estimated_time": "ongoing",
            "difficulty": "beginner",
            "resource_type": "getting-started",
            "topics": []
        }]
    
    # Extract topics and potential struggles
    all_topics = []
    all_struggles = []
    summaries = []
    
    for session in recent_sessions:
        all_topics.extend(session.get("topics", []))
        summaries.append(session.get("summary", ""))
    
    # Get unique topics
    unique_topics = list(set(all_topics))[:5]
    
    # Generate fresh recommendations based on recent activity
    recent_summary = ". ".join(summaries[:3])
    
    try:
        recommendations = await ai_agent.generate_recommendations(
            topics=unique_topics,
            struggles=all_struggles,
            recent_code_summary=recent_summary
        )
        
        return recommendations
    except Exception as e:
        # Fallback recommendations
        return [{
            "title": "Continue Learning",
            "description": f"Keep practicing with {', '.join(unique_topics[:3])}",
            "reason": "Based on your recent activity",
            "estimated_time": "ongoing",
            "difficulty": "intermediate",
            "resource_type": "practice",
            "topics": unique_topics[:3]
        }]

@router.get("/recommendations/stored")
async def get_stored_recommendations(limit: int = 10) -> List[Dict]:
    """
    Get previously stored recommendations from vector database
    """
    return vector_store.get_recommendations(limit=limit)
