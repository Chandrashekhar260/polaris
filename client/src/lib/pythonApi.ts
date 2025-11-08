/**
 * Python Backend API Client
 * Handles communication with FastAPI backend for AI learning insights
 */

const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || '';

export interface LearningSession {
  id: string;
  filename: string;
  filepath: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  potential_struggles: string[];
  summary: string;
  timestamp: string;
}

export interface Recommendation {
  title: string;
  description: string;
  reason: string;
  estimated_time: string;
  difficulty: string;
  resource_type: string;
  topics: string[];
}

export interface InsightsData {
  recent_sessions: LearningSession[];
  top_topics: Array<{ topic: string; count: number }>;
  difficulty_distribution: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  total_sessions: number;
  struggle_areas: string[];
}

export interface SummaryStats {
  total_sessions: number;
  unique_topics: number;
  top_topics: Array<[string, number]>;
  difficulty_breakdown: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  current_streak: number;
}

export interface LearningSummary {
  period: string;
  summary: string;
  topics_learned: string[];
  struggling_topics: string[];
  total_sessions: number;
  date_range: {
    start: string;
    end: string;
  };
}

/**
 * Fetch learning insights from Python backend
 */
export async function fetchInsights(): Promise<InsightsData> {
  const response = await fetch(`${PYTHON_API_BASE}/api/insights`);
  if (!response.ok) {
    throw new Error('Failed to fetch insights');
  }
  return response.json();
}

/**
 * Fetch AI-generated recommendations
 */
export async function fetchRecommendations(): Promise<Recommendation[]> {
  const response = await fetch(`${PYTHON_API_BASE}/api/recommendations`);
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  return response.json();
}

/**
 * Fetch learning summary for a time period
 */
export async function fetchSummary(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<LearningSummary> {
  const response = await fetch(`${PYTHON_API_BASE}/api/summary?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch summary');
  }
  return response.json();
}

/**
 * Fetch summary statistics
 */
export async function fetchSummaryStats(): Promise<SummaryStats> {
  const response = await fetch(`${PYTHON_API_BASE}/api/summary/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch summary stats');
  }
  return response.json();
}

/**
 * Search for similar learning sessions
 */
export async function searchSessions(query: string, limit: number = 5): Promise<LearningSession[]> {
  const response = await fetch(`${PYTHON_API_BASE}/api/insights/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to search sessions');
  }
  return response.json();
}

/**
 * Health check for Python backend
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${PYTHON_API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Upload file (PDF, code, etc.) for analysis
 */
export async function uploadFile(file: File): Promise<{
  success: boolean;
  session_id: string;
  filename: string;
  file_type: string;
  analysis: any;
  recommendations: Recommendation[];
  quiz?: any;
  timestamp: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${PYTHON_API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to upload file' }));
    throw new Error(error.detail || 'Failed to upload file');
  }
  
  return response.json();
}

/**
 * Quiz interfaces
 */
export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
  message?: string;
}

/**
 * Fetch quiz questions
 */
export async function fetchQuiz(
  topics?: string,
  sessionId?: string,
  numQuestions: number = 5
): Promise<Quiz> {
  const params = new URLSearchParams();
  if (topics) params.append('topics', topics);
  if (sessionId) params.append('session_id', sessionId);
  params.append('num_questions', numQuestions.toString());
  
  const response = await fetch(`${PYTHON_API_BASE}/api/quiz?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quiz');
  }
  return response.json();
}

/**
 * Fetch quiz for a specific session
 */
export async function fetchQuizForSession(sessionId: string, numQuestions: number = 5): Promise<Quiz> {
  const response = await fetch(`${PYTHON_API_BASE}/api/quiz/session/${sessionId}?num_questions=${numQuestions}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quiz for session');
  }
  return response.json();
}
