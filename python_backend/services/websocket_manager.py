"""
WebSocket Manager
Handles real-time connections from local file watcher
"""
from typing import Dict, Set
from fastapi import WebSocket
import json

class WebSocketManager:
    """Manage WebSocket connections for real-time streaming"""
    
    def __init__(self):
        """Initialize connection manager"""
        self.active_connections: Set[WebSocket] = set()
    
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
        print(f"WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection"""
        self.active_connections.discard(websocket)
        print(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_message(self, websocket: WebSocket, message: Dict):
        """Send message to specific connection"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            error_str = str(e).lower()
            # Check if connection is closed/disconnected
            if any(keyword in error_str for keyword in [
                "closed", "disconnect", "connection closed", 
                "websocket is closed", "cannot call send"
            ]):
                print(f"⚠️ Connection closed, removing from active connections")
                self.disconnect(websocket)
            else:
                print(f"⚠️ Error sending message to client: {e}")
    
    async def broadcast(self, message: Dict):
        """Broadcast message to all connections"""
        disconnected = set()
        for connection in list(self.active_connections):  # Create a copy to iterate
            try:
                await connection.send_json(message)
            except Exception as e:
                error_str = str(e).lower()
                # Only mark as disconnected if it's a connection error
                if any(keyword in error_str for keyword in [
                    "closed", "disconnect", "connection closed",
                    "websocket is closed", "cannot call send"
                ]):
                    disconnected.add(connection)
                else:
                    # Other errors - log but don't disconnect
                    print(f"⚠️ Error broadcasting to client: {e}")
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

# Singleton instance
ws_manager = WebSocketManager()
