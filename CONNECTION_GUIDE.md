# Frontend-Backend Connection Guide

## ✅ What's Been Connected

The frontend is now fully connected to the Python backend with the following features:

### 1. **File Upload & Analysis** 📄
- Upload PDFs, code files (.py, .js, .ts, .jsx, .tsx, .java, .cpp, .go, .rs, .html, .css, .sql, .txt, .md)
- AI analyzes the content using Gemini API
- Extracts topics, difficulty level, concepts, and potential struggle areas
- Generates personalized learning recommendations
- Automatically generates quiz questions

### 2. **Quiz Generation** 🎯
- Generate quizzes based on topics or recent sessions
- Interactive quiz interface with multiple choice questions
- Instant feedback with explanations
- Score tracking

### 3. **Real-time WebSocket Connection** 🔌
- Fixed WebSocket URL to `/api/ws/stream`
- Real-time code analysis from file watcher
- Live updates to dashboard

### 4. **REST API Integration** 🔗
- All endpoints properly connected:
  - `/api/insights` - Learning insights
  - `/api/recommendations` - AI recommendations
  - `/api/summary` - Learning summaries
  - `/api/upload` - File upload
  - `/api/quiz` - Quiz generation
  - `/api/ws/stream` - WebSocket streaming

## 🚀 How to Use

### Step 1: Start the Python Backend

```bash
cd python_backend
python main.py
```

Or using uvicorn:
```bash
cd python_backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Start the Frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or your configured port)

### Step 3: Configure API Key (Optional but Recommended)

Create a `.env` file in `python_backend/`:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Get your free Gemini API key from: https://aistudio.google.com/

**Note:** The system works without an API key in "mock mode" but with limited functionality.

## 📋 New Features

### Upload & Analyze Page
1. Navigate to "Upload & Analyze" in the sidebar
2. Click "Select File" and choose a PDF or code file
3. Click "Upload & Analyze"
4. View:
   - File analysis (topics, difficulty, concepts)
   - AI-generated recommendations
   - Generated quiz questions

### Quiz Page
1. Navigate to "Quiz" in the sidebar
2. Enter topics (comma-separated) OR select a recent session
3. Choose number of questions (1-20)
4. Click "Generate Quiz"
5. Answer questions and submit to see results

## 🔧 Technical Details

### Backend Changes
- Added `routes/upload.py` - File upload endpoint
- Added `routes/quiz.py` - Quiz generation endpoint
- Enhanced `services/ai_agent.py` - Added quiz generation
- Updated `pyproject.toml` - Added PDF processing dependencies:
  - `python-multipart` - File upload support
  - `pypdf` - PDF text extraction
  - `pdfplumber` - Alternative PDF processing

### Frontend Changes
- Added `components/FileUpload.tsx` - File upload component
- Added `pages/Upload.tsx` - Upload page
- Added `pages/Quiz.tsx` - Quiz page
- Updated `lib/pythonApi.ts` - Added upload and quiz functions
- Fixed WebSocket URL in `hooks/useWebSocket.ts`
- Updated sidebar navigation

## 📝 API Endpoints

### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

file: <file>
```

Response:
```json
{
  "success": true,
  "session_id": "uuid",
  "filename": "example.pdf",
  "file_type": "pdf",
  "analysis": {
    "topics": ["Python", "Programming"],
    "difficulty": "intermediate",
    "concepts": ["Functions", "Classes"],
    "potential_struggles": ["Error handling"],
    "summary": "Working on Python programming..."
  },
  "recommendations": [...],
  "quiz": {
    "questions": [...]
  }
}
```

### Generate Quiz
```http
GET /api/quiz?topics=Python,JavaScript&num_questions=5
```

Or for a specific session:
```http
GET /api/quiz/session/{session_id}?num_questions=5
```

## 🐛 Troubleshooting

### Backend not connecting?
1. Check if backend is running on port 8000
2. Check CORS settings in `main.py`
3. Verify `VITE_PYTHON_API_URL` in frontend (defaults to `http://localhost:8000`)

### File upload failing?
1. Check file size (large files may timeout)
2. Verify file type is supported
3. Check backend logs for errors

### Quiz not generating?
1. Ensure topics are provided
2. Check if GOOGLE_API_KEY is set (required for AI-generated quizzes)
3. Verify backend is running

### WebSocket not connecting?
1. Check WebSocket URL: `ws://localhost:8000/api/ws/stream`
2. Verify backend WebSocket endpoint is active
3. Check browser console for connection errors

## 🎯 Next Steps

1. **Set up Gemini API Key** for full AI functionality
2. **Upload your first file** to see analysis in action
3. **Generate a quiz** to test your knowledge
4. **Monitor your learning** through the dashboard

## 📚 Additional Resources

- Backend README: `python_backend/README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Quick Start: `QUICK_START.md`

