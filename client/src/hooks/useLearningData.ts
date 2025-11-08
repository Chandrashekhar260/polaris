import { useQuery } from '@tanstack/react-query';
import {
  fetchInsights,
  fetchRecommendations,
  fetchSummary,
  fetchSummaryStats,
  searchSessions,
  checkBackendHealth,
  type InsightsData,
  type Recommendation,
  type LearningSummary,
  type SummaryStats,
  type LearningSession
} from '@/lib/pythonApi';

/**
 * Hook for fetching learning insights
 */
export function useInsights() {
  return useQuery<InsightsData>({
    queryKey: ['/api/python/insights'],
    queryFn: fetchInsights,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });
}

/**
 * Hook for fetching AI recommendations
 */
export function useRecommendations() {
  return useQuery<Recommendation[]>({
    queryKey: ['/api/python/recommendations'],
    queryFn: fetchRecommendations,
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
  });
}

/**
 * Hook for fetching learning summary
 */
export function useSummary(period: 'daily' | 'weekly' | 'monthly' = 'weekly') {
  return useQuery<LearningSummary>({
    queryKey: ['/api/python/summary', period],
    queryFn: () => fetchSummary(period),
    refetchInterval: 60000,
    retry: 2,
  });
}

/**
 * Hook for fetching summary statistics
 */
export function useSummaryStats() {
  return useQuery<SummaryStats>({
    queryKey: ['/api/python/summary/stats'],
    queryFn: fetchSummaryStats,
    refetchInterval: 30000,
    retry: 2,
  });
}

/**
 * Hook for searching sessions
 */
export function useSessionSearch(query: string, limit: number = 5) {
  return useQuery<LearningSession[]>({
    queryKey: ['/api/python/insights/search', query, limit],
    queryFn: () => searchSessions(query, limit),
    enabled: query.length > 0,
    retry: 2,
  });
}

/**
 * Hook for checking backend health
 */
export function useBackendHealth() {
  return useQuery<boolean>({
    queryKey: ['/api/python/health'],
    queryFn: checkBackendHealth,
    refetchInterval: 10000, // Check every 10 seconds
    retry: 1,
  });
}
