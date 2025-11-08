# Personal Learning AI Agent

## Overview

The Personal Learning AI Agent is a full-stack intelligent system that monitors coding activity in real-time, analyzes learning patterns using Google Gemini AI, and provides personalized recommendations to accelerate developer learning. The system consists of a local file watcher that monitors code changes, a Python FastAPI backend that performs AI analysis using Gemini and stores embeddings in ChromaDB, an Express.js/TypeScript proxy server, and a React frontend dashboard built with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query v5) for server state management and caching

**UI Component Strategy:**
- shadcn/ui component library (New York variant) for consistent design system
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS with custom design tokens for styling
- Custom CSS variables for theming (light/dark mode support)
- Design inspired by Linear's productivity aesthetics and Notion's knowledge management interface

**State Management Approach:**
- React Query handles all Python backend REST API state with 10-60 second refetch intervals
- WebSocket connection for real-time code analysis streaming from Python backend (ws://localhost:8000/ws/stream)
- Automatic query cache invalidation when WebSocket receives new analysis events
- Local UI state managed with React hooks
- Error boundaries and retry mechanisms for failed backend connections

**Backend Integration:**
- Custom hooks (useLearningData.ts) for fetching insights, recommendations, and stats
- WebSocket hook (useWebSocket.ts) with exponential backoff reconnection (max 5 attempts)
- Environment variables: VITE_PYTHON_API_URL and VITE_PYTHON_WS_URL for backend endpoints
- Comprehensive error handling with user-facing retry buttons
- Loading skeletons for improved UX during data fetches

**Key Design Decisions:**
- Information density prioritized over whitespace for productivity tool use case
- Monospace font (JetBrains Mono) for code-related content
- Inter font family for UI elements
- Standardized spacing units (2, 4, 6, 8, 12, 16) for consistent layout
- Error states clearly distinguish between "no data" and "backend unavailable"

### Backend Architecture

**Dual Backend Approach:**

The application uses two separate backend services that communicate:

1. **Python FastAPI Backend (Port 8000):**
   - Handles all AI operations and vector storage
   - Provides REST API endpoints and WebSocket streaming
   - Runs independently as a microservice
   - Primary backend for learning analysis functionality

2. **Node.js Express Server:**
   - Serves Vite-built frontend in production
   - Acts as potential API proxy/gateway
   - Provides session management infrastructure (connect-pg-simple configured)
   - Currently minimal implementation with room for API route expansion

**Rationale:** This separation allows Python to handle AI/ML workloads (LangChain, Gemini API, ChromaDB) while Node.js handles web serving and potential future authentication/session management.

**API Structure (Python Backend):**
- `/api/insights` - GET endpoint for recent learning insights and topic analysis
- `/api/recommendations` - GET endpoint for AI-generated learning recommendations
- `/api/summary?period={daily|weekly|monthly}` - GET endpoint for progress summaries
- `/ws/stream` - WebSocket endpoint for real-time code analysis streaming

**AI Integration:**
- Google Gemini 2.0 Flash model via LangChain framework
- Structured output using Pydantic models (LearningAnalysis schema)
- Temperature set to 0.3 for consistent, focused analysis
- **Graceful Degradation:** Backend starts and functions without GOOGLE_API_KEY
  - Mock analysis returns basic topic detection based on file extensions
  - Mock recommendations provide placeholder suggestions
  - All endpoints remain functional for testing and development
  - Console warnings indicate mock mode is active

**Vector Storage:**
- ChromaDB for persistent vector embeddings storage
- Google Generative AI Embeddings (text-embedding-004 model)
- Two collections: learning_sessions and recommendations
- Semantic search capabilities for finding similar learning patterns

### Data Storage Solutions

**Vector Database:**
- ChromaDB with persistent storage (./db/chroma_store)
- Stores code embeddings for semantic search
- Enables pattern recognition across learning sessions

**Relational Database Schema (PostgreSQL via Drizzle ORM):**
- `users` table: User authentication (id, username, password)
- `learningSessions` table: Tracked code changes (filename, filepath, content, topics, summary, timestamp)
- `recommendations` table: AI-generated suggestions (title, description, resourceUrl, resourceType, difficulty, topics, reason)
- `insights` table: Analyzed learning patterns (topics, concepts, struggles, confidence, timestamp)
- `summaries` table: Periodic progress reports (period, summary, topicsLearned, strugglingTopics, dateRange)

**Database Integration Status:**
- Drizzle ORM configured with PostgreSQL dialect
- Neon Database serverless driver configured
- Schema defined but migration/connection not yet implemented in application code
- Current backend uses in-memory storage and ChromaDB only

### Authentication & Authorization

**Current State:** Not implemented

**Prepared Infrastructure:**
- connect-pg-simple for PostgreSQL session storage
- User schema defined with username/password fields
- MemStorage class provides interface for future database integration

**Future Implementation Path:**
- Session-based authentication using Express sessions
- PostgreSQL-backed session store
- User registration/login endpoints to be added in server/routes.ts

### External Dependencies

**AI & ML Services:**
- Google Gemini API (gemini-2.0-flash-exp model) - Code analysis, topic extraction, recommendation generation
- Google Generative AI Embeddings (text-embedding-004) - Vector embeddings for semantic search
- LangChain framework - AI orchestration and structured output

**Database Services:**
- Neon Database (PostgreSQL serverless) - Configured but not yet actively used
- ChromaDB - Vector storage for embeddings (currently active)

**Third-Party Libraries:**
- Drizzle ORM - Database queries and migrations
- Watchdog (Python) - Local file system monitoring
- websockets (Python) - Real-time communication
- TanStack Query - API state management
- date-fns - Date formatting and manipulation

**Development Tools:**
- Replit Vite plugins (runtime error overlay, cartographer, dev banner)
- esbuild - Backend bundling for production
- tsx - TypeScript execution in development

**Local File Watcher:**
- Standalone Python script (local_watcher/watcher.py)
- Monitors configurable directory for code file changes
- Supported file types: .py, .js, .jsx, .ts, .tsx, .java, .c, .cpp, .go, .rs, .rb, .php, .html, .css, .sql, .md
- WebSocket connection to Python backend for real-time streaming
- Configurable ignore patterns (node_modules, .git, venv, dist, build)

**Environment Configuration:**
- GOOGLE_API_KEY - Required for Gemini AI functionality
- DATABASE_URL - PostgreSQL connection (configured but not actively used)
- CHROMA_DB_PATH - Vector storage location (default: ./db/chroma_store)
- VITE_PYTHON_API_URL - Frontend connection to Python backend
- VITE_PYTHON_WS_URL - WebSocket endpoint for real-time updates