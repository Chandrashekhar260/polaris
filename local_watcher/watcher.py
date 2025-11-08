#!/usr/bin/env python3
"""
Personal Learning AI Agent - Local File Watcher
Monitors your local code directory and streams changes to Replit backend
"""
import os
import asyncio
import json
import websockets
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path
from datetime import datetime

# Configuration
CONFIG_FILE = "config.json"

class CodeFileHandler(FileSystemEventHandler):
    """Handler for code file changes"""
    
    # File extensions to monitor
    CODE_EXTENSIONS = {
        '.py', '.js', '.jsx', '.ts', '.tsx',  # Python, JavaScript, TypeScript
        '.java', '.cpp', '.c', '.h', '.hpp',  # Java, C++
        '.go', '.rs', '.rb', '.php',          # Go, Rust, Ruby, PHP
        '.html', '.css', '.scss', '.sass',    # Web
        '.json', '.yaml', '.yml', '.toml',    # Config
        '.sql', '.md', '.txt'                 # SQL, Markdown, Text
    }
    
    def __init__(self, websocket_url: str):
        """
        Initialize file handler
        
        Args:
            websocket_url: URL of the backend WebSocket endpoint
        """
        self.websocket_url = websocket_url
        self.loop = asyncio.new_event_loop()
        self.last_processed = {}  # Track last processed time per file
        
    def on_modified(self, event):
        """Handle file modification events"""
        if event.is_directory:
            return
        
        # Check if file extension is monitored
        file_path = event.src_path
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext not in self.CODE_EXTENSIONS:
            return
        
        # Debounce - ignore if processed in last 2 seconds
        now = datetime.now().timestamp()
        last_time = self.last_processed.get(file_path, 0)
        if now - last_time < 2:
            return
        
        self.last_processed[file_path] = now
        
        print(f"\n📝 Detected change: {file_path}")
        
        # Send to backend
        self.loop.run_until_complete(self.send_to_backend(file_path))
    
    async def send_to_backend(self, file_path: str):
        """
        Send file content to backend via WebSocket
        
        Args:
            file_path: Path to the modified file
        """
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Prepare payload
            payload = {
                "filename": os.path.basename(file_path),
                "filepath": file_path,
                "content": content,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Connect and send
            async with websockets.connect(self.websocket_url) as websocket:
                # Wait for welcome message
                welcome = await websocket.recv()
                print(f"✅ Connected to backend")
                
                # Send file data
                await websocket.send(json.dumps(payload))
                print(f"📤 Sent: {payload['filename']}")
                
                # Wait for responses (with timeout)
                try:
                    async with asyncio.timeout(10):
                        while True:
                            response = await websocket.recv()
                            data = json.loads(response)
                            
                            msg_type = data.get("type", "unknown")
                            
                            if msg_type == "received":
                                print(f"   ✓ Backend received file")
                            
                            elif msg_type == "analysis":
                                analysis = data.get("analysis", {})
                                print(f"\n🧠 AI Analysis:")
                                print(f"   Topics: {', '.join(analysis.get('topics', []))}")
                                print(f"   Difficulty: {analysis.get('difficulty', 'N/A')}")
                                print(f"   Summary: {analysis.get('summary', 'N/A')}")
                                
                                struggles = analysis.get('potential_struggles', [])
                                if struggles:
                                    print(f"   ⚠️  Watch out for: {', '.join(struggles)}")
                            
                            elif msg_type == "recommendations":
                                recs = data.get("recommendations", [])
                                if recs:
                                    print(f"\n💡 AI Recommendations ({len(recs)}):")
                                    for i, rec in enumerate(recs[:3], 1):
                                        print(f"   {i}. {rec.get('title', 'N/A')}")
                            
                            elif msg_type == "error":
                                print(f"   ❌ Error: {data.get('message', 'Unknown error')}")
                                break
                
                except asyncio.TimeoutError:
                    pass  # Normal - we got what we needed
        
        except FileNotFoundError:
            print(f"   ❌ File not found: {file_path}")
        except UnicodeDecodeError:
            print(f"   ⚠️  Skipping binary file: {file_path}")
        except Exception as e:
            print(f"   ❌ Error sending to backend: {e}")

def load_config():
    """Load configuration from config.json"""
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    else:
        # Create default config
        config = {
            "watch_directory": os.path.expanduser("~/Development"),
            "backend_url": "ws://localhost:8000/api/ws/stream",
            "ignore_patterns": [
                "**/node_modules/**",
                "**/.git/**",
                "**/venv/**",
                "**/__pycache__/**",
                "**/dist/**",
                "**/build/**"
            ]
        }
        
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)
        
        return config

def main():
    """Main entry point"""
    print("🚀 Personal Learning AI Agent - File Watcher")
    print("=" * 60)
    
    # Load configuration
    config = load_config()
    watch_dir = config["watch_directory"]
    backend_url = config["backend_url"]
    
    # Expand user directory
    watch_dir = os.path.expanduser(watch_dir)
    
    if not os.path.exists(watch_dir):
        print(f"❌ Watch directory does not exist: {watch_dir}")
        print(f"   Please update {CONFIG_FILE} with a valid directory")
        return
    
    print(f"📁 Watching: {watch_dir}")
    print(f"🔗 Backend: {backend_url}")
    print(f"📝 Config: {CONFIG_FILE}")
    print("\n✨ Monitoring started. Edit any code file to see AI analysis!\n")
    print("Press Ctrl+C to stop.\n")
    
    # Set up file watcher
    event_handler = CodeFileHandler(backend_url)
    observer = Observer()
    observer.schedule(event_handler, watch_dir, recursive=True)
    observer.start()
    
    try:
        while True:
            asyncio.get_event_loop().run_until_complete(asyncio.sleep(1))
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping file watcher...")
        observer.stop()
    
    observer.join()
    print("✅ File watcher stopped. Good bye!")

if __name__ == "__main__":
    main()
