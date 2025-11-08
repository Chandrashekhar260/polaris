"""
VS Code File Watcher - Streams code changes to Learning AI Agent backend
This script watches for file changes and sends them to the backend via WebSocket
"""
import asyncio
import websockets
import json
import os
import sys
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

# Configuration
# You can also use the Node.js proxy: "ws://localhost:5000/api/ws/stream"
BACKEND_WS_URL = os.getenv("WS_URL", "ws://localhost:8000/api/ws/stream")

# Watch directory configuration
# Option 1: Use WATCH_DIR environment variable
# Option 2: Use command line argument: python vscode_watcher.py "C:\path\to\your\code"
# Option 3: Default to current directory
if len(sys.argv) > 1:
    WATCH_DIRECTORY = sys.argv[1]
    print(f"📁 Using directory from command line: {WATCH_DIRECTORY}")
elif os.getenv("WATCH_DIR"):
    WATCH_DIRECTORY = os.getenv("WATCH_DIR")
    print(f"📁 Using directory from environment: {WATCH_DIRECTORY}")
else:
    WATCH_DIRECTORY = os.getcwd()
    print(f"📁 Using current directory: {WATCH_DIRECTORY}")
    print(f"💡 Tip: To watch a different folder, run:")
    print(f"   python vscode_watcher.py \"C:\\path\\to\\your\\code\"")
    print(f"   Or set WATCH_DIR environment variable")
IGNORE_PATTERNS = [
    "node_modules", ".git", "__pycache__", ".env", 
    "dist", "build", ".next", ".vscode", ".idea"
]
FILE_EXTENSIONS = [
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".cpp", ".c", 
    ".go", ".rs", ".html", ".css", ".sql", ".md", ".pdf"
]

class CodeFileHandler(FileSystemEventHandler):
    """Handle file system events for code files"""
    
    def __init__(self, websocket, event_loop):
        self.websocket = websocket
        self.event_loop = event_loop
        self.last_sent = {}  # Track last sent content to avoid duplicates
        self.debounce_time = 2  # Wait 2 seconds before sending
        self.pending_tasks = {}  # Track pending debounce tasks
    
    def should_ignore(self, file_path: str) -> bool:
        """Check if file should be ignored"""
        path_str = file_path.lower()
        for pattern in IGNORE_PATTERNS:
            if pattern.lower() in path_str:
                return True
        return False
    
    def is_code_file(self, file_path: str) -> bool:
        """Check if file is a code file"""
        ext = Path(file_path).suffix.lower()
        return ext in FILE_EXTENSIONS
    
    async def send_file(self, file_path: str):
        """Send file content to backend"""
        if self.should_ignore(file_path):
            return
        
        if not self.is_code_file(file_path):
            return
        
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Skip if content hasn't changed
            file_key = file_path
            if file_key in self.last_sent and self.last_sent[file_key] == content:
                return
            
            self.last_sent[file_key] = content
            
            # Prepare payload
            payload = {
                "filename": os.path.basename(file_path),
                "filepath": file_path,
                "content": content
            }
            
            # Send to backend
            await self.websocket.send(json.dumps(payload))
            print(f"📤 Sent: {os.path.basename(file_path)} ({len(content)} chars)")
            
        except Exception as e:
            print(f"❌ Error sending file {file_path}: {e}")
    
    def on_modified(self, event):
        """Handle file modification"""
        if event.is_directory:
            return
        
        file_path = event.src_path
        
        # Cancel previous pending task for this file
        if file_path in self.pending_tasks:
            try:
                self.pending_tasks[file_path].cancel()
            except:
                pass
        
        # Use threading to schedule async task (watchdog runs in separate thread)
        import threading
        def delayed_send():
            time.sleep(self.debounce_time)
            # Schedule the coroutine in the event loop
            asyncio.run_coroutine_threadsafe(
                self._debounced_send(file_path),
                self.event_loop
            )
        
        timer = threading.Timer(self.debounce_time, delayed_send)
        timer.daemon = True
        timer.start()
        self.pending_tasks[file_path] = timer
    
    async def _debounced_send(self, file_path: str):
        """Debounced file send"""
        await self.send_file(file_path)

async def connect_and_watch():
    """Connect to backend and start watching files"""
    print(f"🔌 Connecting to {BACKEND_WS_URL}...")
    print(f"📁 Watching directory: {WATCH_DIRECTORY}")
    
    while True:
        try:
            # Increase connection timeout for large file processing
            async with websockets.connect(
                BACKEND_WS_URL, 
                ping_interval=20, 
                ping_timeout=10,
                open_timeout=30,  # 30 second timeout for initial connection
                close_timeout=10
            ) as websocket:
                print("✅ Connected to Learning AI Agent backend!")
                
                # Get the event loop for async operations
                event_loop = asyncio.get_event_loop()
                
                # Create file handler with event loop reference
                event_handler = CodeFileHandler(websocket, event_loop)
                observer = Observer()
                observer.schedule(event_handler, WATCH_DIRECTORY, recursive=True)
                observer.start()
                
                print("👀 Watching for file changes...")
                print("   Press Ctrl+C to stop")
                
                # Listen for messages from backend
                try:
                    while True:
                        try:
                            message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                            data = json.loads(message)
                            handle_backend_message(data)
                        except asyncio.TimeoutError:
                            continue
                        except websockets.exceptions.ConnectionClosed as e:
                            print(f"❌ Connection closed by server: {e}")
                            break
                        except Exception as e:
                            print(f"⚠️ Error receiving message: {e}")
                            continue
                except KeyboardInterrupt:
                    print("\n🛑 Stopping watcher...")
                    break
                finally:
                    observer.stop()
                    observer.join()
                
        except ConnectionRefusedError:
            print(f"❌ Could not connect to {BACKEND_WS_URL}")
            print("   Make sure the Python backend is running on port 8000")
            print("   Retrying in 5 seconds...")
            await asyncio.sleep(5)
            continue
        except websockets.exceptions.ConnectionClosed:
            print("❌ Connection closed, reconnecting in 5 seconds...")
            await asyncio.sleep(5)
            continue
        except websockets.exceptions.InvalidStatusCode as e:
            print(f"❌ Connection failed with status {e.status_code}")
            print("   Retrying in 5 seconds...")
            await asyncio.sleep(5)
            continue
        except asyncio.TimeoutError:
            print(f"❌ Connection timeout to {BACKEND_WS_URL}")
            print("   The backend might be processing a large file")
            print("   Retrying in 5 seconds...")
            await asyncio.sleep(5)
            continue
        except Exception as e:
            error_msg = str(e)
            if "timed out" in error_msg.lower() or "timeout" in error_msg.lower():
                print(f"❌ Connection timeout: {error_msg}")
                print("   The backend might be processing a large file")
            else:
                print(f"❌ Error: {error_msg}")
            print("   Retrying in 5 seconds...")
            await asyncio.sleep(5)
            continue

def handle_backend_message(data: dict):
    """Handle messages from backend"""
    msg_type = data.get("type", "unknown")
    
    if msg_type == "connected":
        print(f"✅ {data.get('message', 'Connected')}")
    
    elif msg_type == "received":
        print(f"   ✓ Backend received: {data.get('filename', 'file')}")
    
    elif msg_type == "analysis":
        analysis = data.get("analysis", {})
        print(f"\n🧠 AI Analysis:")
        print(f"   Topics: {', '.join(analysis.get('topics', []))}")
        print(f"   Difficulty: {analysis.get('difficulty', 'N/A')}")
        if analysis.get('errors'):
            print(f"   ⚠️  Errors found: {len(analysis['errors'])}")
        if analysis.get('weak_areas'):
            print(f"   📉 Weak areas: {', '.join(analysis['weak_areas'][:3])}")
    
    elif msg_type == "documentation":
        suggestions = data.get("suggestions", [])
        errors = data.get("errors", [])
        weak_areas = data.get("weak_areas", [])
        
        print(f"\n📚 Documentation Suggestions ({len(suggestions)}):")
        if errors:
            print(f"   ⚠️  {len(errors)} error(s) detected")
        if weak_areas:
            print(f"   📉 Weak areas: {', '.join(weak_areas[:3])}")
        for i, sug in enumerate(suggestions[:3], 1):
            print(f"   {i}. {sug.get('title', 'N/A')}")
            if sug.get('url'):
                print(f"      🔗 {sug['url']}")
    
    elif msg_type == "recommendations":
        recs = data.get("recommendations", [])
        if recs:
            print(f"\n💡 Recommendations ({len(recs)}):")
            for i, rec in enumerate(recs[:3], 1):
                print(f"   {i}. {rec.get('title', 'N/A')}")
    
    elif msg_type == "quiz":
        quiz = data.get("quiz", {})
        questions = quiz.get("questions", [])
        focus_areas = data.get("focus_areas", [])
        if questions:
            print(f"\n📝 Quiz Generated ({len(questions)} questions):")
            print(f"   Focus areas: {', '.join(focus_areas[:3])}")
            print(f"   Check the frontend to take the quiz!")
    
    elif msg_type == "error":
        print(f"   ❌ Error: {data.get('message', 'Unknown error')}")

if __name__ == "__main__":
    # Check if watchdog is installed
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
    except ImportError:
        print("❌ Missing dependency: watchdog")
        print("   Install with: pip install watchdog")
        sys.exit(1)
    
    try:
        asyncio.run(connect_and_watch())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")

