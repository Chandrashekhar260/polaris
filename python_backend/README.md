# Personal Learning AI Agent - Backend

Real-time learning analysis powered by Google Gemini AI and ChromaDB vector storage.

## 🚀 Features

- **Real-time Code Analysis**: WebSocket streaming from local file watcher
- **AI-Powered Insights**: Gemini API analyzes your code and identifies learning patterns
- **Vector Storage**: ChromaDB stores embeddings for semantic search
- **Personalized Recommendations**: AI generates learning resources based on your activity
- **Progress Summaries**: Daily/weekly/monthly AI-generated learning summaries

## 📦 Installation

### 1. Install Dependencies

```bash
cd python_backend
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your Google API key:

```
GOOGLE_API_KEY=your_actual_api_key_here
```

Get your free Gemini API key from: https://aistudio.google.com/

### 3. Run the Server

```bash
# Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python main.py
```

The server will start at `http://localhost:8000`

## 🔌 API Endpoints

### WebSocket

- **`/api/ws/stream`**: WebSocket endpoint for real-time code streaming
  - Send: `{"filename": "app.py", "filepath": "/path/to/app.py", "content": "code..."}`
  - Receive: Real-time analysis and recommendations

### REST API

- **`GET /api/insights`**: Get latest learning insights
  - Returns recent sessions, top topics, difficulty distribution

- **`GET /api/insights/search?query=react`**: Search similar sessions
  - Semantic search through learning history

- **`GET /api/recommendations`**: Get AI-generated recommendations
  - Fresh recommendations based on recent activity

- **`GET /api/summary?period=weekly`**: Get learning summary
  - Periods: `daily`, `weekly`, `monthly`

- **`GET /api/summary/stats`**: Get statistical overview

- **`GET /health`**: Health check endpoint

## 🏗️ Project Structure

```
python_backend/
├── main.py                     # FastAPI app entry point
├── routes/
│   ├── stream.py              # WebSocket streaming
│   ├── insights.py            # Learning insights API
│   ├── recommendations.py     # Recommendations API
│   └── summary.py             # Progress summary API
├── services/
│   ├── ai_agent.py            # Gemini AI integration
│   ├── vector_store.py        # ChromaDB management
│   └── websocket_manager.py   # WebSocket connections
├── utils/
│   └── text_cleaner.py        # Text processing utilities
├── db/
│   └── chroma_store/          # ChromaDB persistent storage
├── .env.example               # Environment template
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🧠 How It Works

1. **Local File Watcher** (separate script) monitors your IDE/VS Code
2. On file save, sends code via WebSocket to `/api/ws/stream`
3. **AI Agent** analyzes code with Gemini:
   - Extracts topics and concepts
   - Identifies difficulty level
   - Detects potential struggles
4. **Vector Store** saves embeddings in ChromaDB for semantic search
5. **Recommendations** generated based on analysis
6. Results streamed back to client in real-time

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Gemini API key (required) | - |
| `CHROMA_DB_PATH` | ChromaDB storage path | `./db/chroma_store` |
| `BACKEND_PORT` | Server port | `8000` |

### Gemini Models Used

- **Chat**: `gemini-2.0-flash-exp` (fast, efficient)
- **Embeddings**: `text-embedding-004` (semantic search)

## 📊 Vector Database

ChromaDB stores:
- **Learning Sessions**: Code snippets with metadata
- **Recommendations**: AI-generated learning resources

Collections:
- `learning_sessions`: Your coding activity
- `recommendations`: Generated recommendations

## 🔐 Security

- API key stored in environment variables
- Never committed to version control
- CORS configured for frontend access
- WebSocket connections managed securely

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### ChromaDB Errors

```bash
# Clear database (warning: deletes all data)
rm -rf db/chroma_store
```

### API Key Issues

- Verify key is in `.env` file
- Check key is valid at https://aistudio.google.com/
- Ensure no extra spaces or quotes around key

## 📚 Next Steps

1. Set up the local file watcher script (see watcher documentation)
2. Connect your frontend dashboard
3. Start coding and watch the AI analyze your progress!

## 🤝 Contributing

This is a learning project. Feel free to extend and customize!

## 📄 License

MIT License - Feel free to use and modify
