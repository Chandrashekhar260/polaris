"""
Summary Route - Get learning progress summaries
"""
from fastapi import APIRouter, Query
from typing import Dict
from datetime import datetime, timedelta
from services.vector_store import vector_store
from services.ai_agent import ai_agent

router = APIRouter()

@router.get("/summary")
async def get_summary(
    period: str = Query("weekly", regex="^(daily|weekly|monthly)$")
) -> Dict:
    """
    Get AI-generated learning summary
    
    Args:
        period: Time period for summary (daily/weekly/monthly)
    
    Returns:
        Summary of learning progress, topics covered, and areas of focus
    """
    # Get all sessions (we'll filter by time in a real implementation)
    all_sessions = vector_store.get_recent_sessions(limit=100)
    
    if not all_sessions:
        return {
            "period": period,
            "summary": "No learning activity to summarize yet. Start coding and the AI will track your progress!",
            "topics_learned": [],
            "struggling_topics": [],
            "total_sessions": 0,
            "date_range": {
                "start": datetime.utcnow().isoformat(),
                "end": datetime.utcnow().isoformat()
            }
        }
    
    # Filter sessions by period (simplified - in production, use actual timestamps)
    filtered_sessions = all_sessions
    
    if period == "daily":
        filtered_sessions = all_sessions[:10]
    elif period == "weekly":
        filtered_sessions = all_sessions[:30]
    else:  # monthly
        filtered_sessions = all_sessions
    
    # Generate AI summary
    summary_data = await ai_agent.generate_summary(
        sessions=filtered_sessions,
        period=period
    )
    
    # Add date range
    summary_data["period"] = period
    summary_data["date_range"] = {
        "start": filtered_sessions[-1].get("timestamp", "") if filtered_sessions else "",
        "end": filtered_sessions[0].get("timestamp", "") if filtered_sessions else ""
    }
    
    return summary_data

@router.get("/summary/stats")
async def get_summary_stats() -> Dict:
    """
    Get statistical overview of learning progress
    """
    sessions = vector_store.get_recent_sessions(limit=100)
    
    # Calculate stats
    all_topics = []
    difficulties = []
    
    for session in sessions:
        all_topics.extend(session.get("topics", []))
        difficulties.append(session.get("difficulty", "intermediate"))
    
    # Topic counts
    topic_counts = {}
    for topic in all_topics:
        if topic and topic != "":
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
    
    return {
        "total_sessions": len(sessions),
        "unique_topics": len(set(all_topics)),
        "top_topics": sorted(
            topic_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10],
        "difficulty_breakdown": {
            "beginner": difficulties.count("beginner"),
            "intermediate": difficulties.count("intermediate"),
            "advanced": difficulties.count("advanced")
        },
        "current_streak": 0  # TODO: Calculate actual streak from timestamps
    }
