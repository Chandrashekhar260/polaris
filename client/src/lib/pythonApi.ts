/**
 * Python Backend API Client
 * Handles communication with FastAPI backend for AI learning insights
 */

const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';

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
  const response = await fetch(`${PYTHON_API_BASE}/insights`);
  if (!response.ok) {
    throw new Error('Failed to fetch insights');
  }
  return response.json();
}

/**
 * Fetch AI-generated recommendations
 */
export async function fetchRecommendations(): Promise<Recommendation[]> {
  const response = await fetch(`${PYTHON_API_BASE}/recommendations`);
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  return response.json();
}

/**
 * Fetch learning summary for a time period
 */
export async function fetchSummary(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<LearningSummary> {
  const response = await fetch(`${PYTHON_API_BASE}/summary?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch summary');
  }
  return response.json();
}

/**
 * Fetch summary statistics
 */
export async function fetchSummaryStats(): Promise<SummaryStats> {
  const response = await fetch(`${PYTHON_API_BASE}/summary/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch summary stats');
  }
  return response.json();
}

/**
 * Search for similar learning sessions
 */
export async function searchSessions(query: string, limit: number = 5): Promise<LearningSession[]> {
  const response = await fetch(`${PYTHON_API_BASE}/insights/search?query=${encodeURIComponent(query)}&limit=${limit}`);
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
