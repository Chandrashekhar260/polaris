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
            try:
                # Receive data from client
                data = await websocket.receive_json()
            except WebSocketDisconnect:
                print("✅ WebSocket client disconnected normally")
                break
            except Exception as e:
                error_str = str(e).lower()
                # Check for disconnect-related errors - these mean connection is closed
                if any(keyword in error_str for keyword in [
                    "disconnect", "closed", "cannot call receive", 
                    "connection closed", "websocket is closed"
                ]):
                    print(f"✅ WebSocket disconnected: {e}")
                    break
                
                # For other errors, try to receive as text
                print(f"⚠️ Error receiving JSON: {e}")
                try:
                    text_data = await websocket.receive_text()
                    import json
                    data = json.loads(text_data)
                except WebSocketDisconnect:
                    print("✅ WebSocket disconnected during text receive")
                    break
                except Exception as parse_error:
                    parse_error_str = str(parse_error).lower()
                    # Check if it's a disconnect error
                    if any(keyword in parse_error_str for keyword in [
                        "disconnect", "closed", "cannot call receive",
                        "connection closed", "websocket is closed"
                    ]):
                        print(f"✅ WebSocket disconnected: {parse_error}")
                        break
                    # Otherwise, it's a parse error - skip this message
                    print(f"❌ Could not parse message: {parse_error}, skipping...")
                    continue
            
            # Extract file information
            filename = data.get("filename", "unknown.txt")
            filepath = data.get("filepath", "")
            content = data.get("content", "")
            
            # Send immediate acknowledgment (non-blocking)
            await ws_manager.send_message(websocket, {
                "type": "received",
                "filename": filename,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            # Process AI analysis in background (non-blocking)
            # This prevents WebSocket timeout during long AI processing
            async def process_analysis():
                """Process AI analysis in background"""
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
                    
                    # Broadcast analysis to ALL connected clients (file watcher + frontend)
                    analysis_message = {
                        "type": "analysis",
                        "session_id": session_id,
                        "analysis": analysis,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    await ws_manager.broadcast(analysis_message)
                    
                    # Generate documentation suggestions if there are errors or weak areas
                    errors = analysis.get("errors", [])
                    weak_areas = analysis.get("weak_areas", [])
                    
                    if errors or weak_areas:
                        doc_suggestions = await ai_agent.generate_documentation_suggestions(
                            errors=errors,
                            weak_areas=weak_areas,
                            topics=analysis.get("topics", []),
                            code_content=content
                        )
                        
                        if doc_suggestions:
                            # Broadcast documentation suggestions to all clients
                            await ws_manager.broadcast({
                                "type": "documentation",
                                "suggestions": doc_suggestions,
                                "errors": errors,
                                "weak_areas": weak_areas,
                                "timestamp": datetime.utcnow().isoformat()
                            })
                    
                    # Generate recommendations if there are struggles
                    if analysis.get("potential_struggles") or weak_areas:
                        recommendations = await ai_agent.generate_recommendations(
                            topics=analysis.get("topics", []),
                            struggles=analysis.get("potential_struggles", []) + weak_areas,
                            recent_code_summary=analysis.get("summary", "")
                        )
                        
                        # Store recommendations
                        for i, rec in enumerate(recommendations):
                            rec_id = f"{session_id}-rec-{i}"
                            await vector_store.store_recommendation(rec_id, rec)
                        
                        # Broadcast recommendations to all clients
                        await ws_manager.broadcast({
                            "type": "recommendations",
                            "recommendations": recommendations,
                            "timestamp": datetime.utcnow().isoformat()
                        })
                    
                    # Generate quiz based on weak areas if they exist
                    if weak_areas:
                        try:
                            quiz = await ai_agent.generate_quiz(
                                topics=weak_areas[:3],  # Focus on weak areas
                                content_summary=analysis.get("summary", ""),
                                num_questions=5
                            )
                            
                            if quiz and quiz.get("questions"):
                                await ws_manager.broadcast({
                                    "type": "quiz",
                                    "quiz": quiz,
                                    "focus_areas": weak_areas,
                                    "timestamp": datetime.utcnow().isoformat()
                                })
                        except Exception as e:
                            print(f"Error generating quiz: {e}")
                
                except Exception as e:
                    # Send error message but keep connection alive
                    print(f"⚠️ Error analyzing code: {e}")
                    import traceback
                    traceback.print_exc()
                    try:
                        await ws_manager.broadcast({
                            "type": "error",
                            "message": f"Analysis error: {str(e)}",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                    except:
                        pass  # If we can't send, connection might be dead
            
            # Start background task (non-blocking)
            import asyncio
            asyncio.create_task(process_analysis())
    
    except WebSocketDisconnect:
        print("WebSocket client disconnected normally")
        ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
        import traceback
        traceback.print_exc()
        try:
            ws_manager.disconnect(websocket)
        except:
            pass
