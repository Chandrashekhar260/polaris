"""
Quiz Route - Generate and retrieve quizzes
"""
from fastapi import APIRouter, Query
from typing import List, Dict, Optional
from services.ai_agent import get_ai_agent
from services.vector_store import get_vector_store

router = APIRouter()

@router.get("/quiz")
async def get_quiz(
    topics: Optional[str] = Query(None, description="Comma-separated topics"),
    session_id: Optional[str] = Query(None, description="Session ID to generate quiz for"),
    num_questions: int = Query(5, ge=1, le=20, description="Number of questions")
) -> Dict:
    """
    Generate quiz questions based on topics or recent session
    
    Args:
        topics: Comma-separated list of topics
        session_id: Session ID to generate quiz for
        num_questions: Number of questions to generate (1-20)
    
    Returns:
        Dictionary with quiz questions
    """
    # Get topics from parameter or session
    quiz_topics = []
    content_summary = ""
    
    if topics:
        quiz_topics = [t.strip() for t in topics.split(",") if t.strip()]
    elif session_id:
        # Get session data
        vector_store = get_vector_store()
        sessions = vector_store.get_recent_sessions(limit=100)
        session = next((s for s in sessions if s.get("id") == session_id), None)
        
        if session:
            quiz_topics = session.get("topics", [])
            content_summary = session.get("summary", "")
    else:
        # Use recent sessions
        vector_store = get_vector_store()
        recent_sessions = vector_store.get_recent_sessions(limit=5)
        if recent_sessions:
            all_topics = []
            summaries = []
            for session in recent_sessions:
                all_topics.extend(session.get("topics", []))
                summaries.append(session.get("summary", ""))
            
            # Get unique topics
            quiz_topics = list(set(all_topics))[:5]
            content_summary = ". ".join(summaries[:3])
    
    if not quiz_topics:
        return {
            "questions": [],
            "message": "No topics available. Upload a file or start coding to generate quizzes!"
        }
    
    # Generate quiz
    ai_agent = get_ai_agent()
    quiz = await ai_agent.generate_quiz(
        topics=quiz_topics,
        content_summary=content_summary,
        num_questions=num_questions
    )
    
    return quiz

@router.get("/quiz/session/{session_id}")
async def get_quiz_for_session(
    session_id: str,
    num_questions: int = Query(5, ge=1, le=20)
) -> Dict:
    """
    Generate quiz for a specific session
    
    Args:
        session_id: Session ID
        num_questions: Number of questions
    
    Returns:
        Quiz questions
    """
    vector_store = get_vector_store()
    sessions = vector_store.get_recent_sessions(limit=100)
    session = next((s for s in sessions if s.get("id") == session_id), None)
    
    if not session:
        return {
            "questions": [],
            "message": f"Session {session_id} not found"
        }
    
    topics = session.get("topics", [])
    summary = session.get("summary", "")
    
    ai_agent = get_ai_agent()
    quiz = await ai_agent.generate_quiz(
        topics=topics,
        content_summary=summary,
        num_questions=num_questions
    )
    
    return quiz

