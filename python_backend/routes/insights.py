"""
Insights Route - Get latest learning insights
"""
from fastapi import APIRouter
from typing import List, Dict
from services.vector_store import get_vector_store

router = APIRouter()

@router.get("/insights")
async def get_insights() -> Dict:
    """
    Get latest learning insights from recent sessions
    
    Returns analysis of recent learning activity including:
    - Recent topics
    - Difficulty trends
    - Key concepts
    - Potential struggle areas
    """
    # Get recent sessions
    vector_store = get_vector_store()
    recent_sessions = vector_store.get_recent_sessions(limit=10)
    
    if not recent_sessions:
        return {
            "message": "No learning sessions found yet",
            "recent_sessions": [],
            "top_topics": [],
            "difficulty_distribution": {},
            "struggle_areas": []
        }
    
    # Aggregate insights
    all_topics = []
    difficulties = []
    struggle_areas = []
    
    for session in recent_sessions:
        all_topics.extend(session.get("topics", []))
        difficulties.append(session.get("difficulty", "intermediate"))
    
    # Count topic frequencies
    topic_counts = {}
    for topic in all_topics:
        if topic and topic != "":
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
    
    # Sort topics by frequency
    top_topics = sorted(
        topic_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    
    # Difficulty distribution
    difficulty_dist = {
        "beginner": difficulties.count("beginner"),
        "intermediate": difficulties.count("intermediate"),
        "advanced": difficulties.count("advanced")
    }
    
    return {
        "recent_sessions": recent_sessions[:5],  # Return 5 most recent
        "top_topics": [{"topic": t[0], "count": t[1]} for t in top_topics],
        "difficulty_distribution": difficulty_dist,
        "total_sessions": len(recent_sessions),
        "struggle_areas": struggle_areas[:5]
    }

@router.get("/insights/search")
async def search_insights(query: str, limit: int = 5) -> List[Dict]:
    """
    Search for similar learning sessions
    
    Args:
        query: Search query (e.g., "React hooks", "authentication")
        limit: Maximum number of results
    """
    vector_store = get_vector_store()
    results = vector_store.search_similar_sessions(query, limit=limit)
    return results
