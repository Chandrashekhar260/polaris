"""
Stream Route - WebSocket endpoint for real-time code streaming
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
import uuid

from services.websocket_manager import ws_manager
from services.ai_agent import get_ai_agent
from services.vector_store import get_vector_store

router = APIRouter()

@router.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    """
    WebSocket endpoint for real-time code streaming
    
    Accepts code updates from local file watcher and returns AI analysis
    """
    await ws_manager.connect(websocket)
    
    try:
        # Send welcome message
        await ws_manager.send_message(websocket, {
            "type": "connected",
            "message": "Connected to Learning AI Agent",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        while True:
            # Receive data from client
            data = await websocket.receive_json()
            
            # Extract file information
            filename = data.get("filename", "unknown.txt")
            filepath = data.get("filepath", "")
            content = data.get("content", "")
            
            # Send acknowledgment
            await ws_manager.send_message(websocket, {
                "type": "received",
                "filename": filename,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            # Analyze code with AI
            try:
                ai_agent = get_ai_agent()
                analysis = await ai_agent.analyze_code(
                    code_content=content,
                    filename=filename,
                    filepath=filepath
                )
                
                # Generate session ID
                session_id = str(uuid.uuid4())
                
                # Store in vector database
                vector_store = get_vector_store()
                await vector_store.store_session(
                    session_id=session_id,
                    code_content=content,
                    analysis=analysis
                )
                
                # Send analysis back to client
                await ws_manager.send_message(websocket, {
                    "type": "analysis",
                    "session_id": session_id,
                    "analysis": analysis,
                    "timestamp": datetime.utcnow().isoformat()
                })
                
                # Generate recommendations if there are struggles
                if analysis.get("potential_struggles"):
                    recommendations = await ai_agent.generate_recommendations(
                        topics=analysis.get("topics", []),
                        struggles=analysis.get("potential_struggles", []),
                        recent_code_summary=analysis.get("summary", "")
                    )
                    
                    # Store recommendations
                    for i, rec in enumerate(recommendations):
                        rec_id = f"{session_id}-rec-{i}"
                        await vector_store.store_recommendation(rec_id, rec)
                    
                    # Send recommendations
                    await ws_manager.send_message(websocket, {
                        "type": "recommendations",
                        "recommendations": recommendations,
                        "timestamp": datetime.utcnow().isoformat()
                    })
                
            except Exception as e:
                # Send error message
                await ws_manager.send_message(websocket, {
                    "type": "error",
                    "message": f"Analysis error: {str(e)}",
                    "timestamp": datetime.utcnow().isoformat()
                })
    
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)
