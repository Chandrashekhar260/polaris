import { Activity, Brain, Flame, Lightbulb } from "lucide-react";
import StatCard from "@/components/StatCard";
import ActivityCard from "@/components/ActivityCard";
import RecommendationCard from "@/components/RecommendationCard";
import TopicProgress from "@/components/TopicProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsights, useRecommendations, useSummaryStats, useBackendHealth } from "@/hooks/useLearningData";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { data: insights, isLoading: insightsLoading, isError: insightsError, refetch: refetchInsights } = useInsights();
  const { data: recommendations, isLoading: recsLoading, isError: recsError, refetch: refetchRecs } = useRecommendations();
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useSummaryStats();
  const { data: backendHealthy, isLoading: healthLoading } = useBackendHealth();
  
  // WebSocket for real-time updates
  const { isConnected, lastMessage, error: wsError } = useWebSocket();
  
  // Determine overall connection status
  const isBackendConnected = backendHealthy === true;
  const isBackendOffline = backendHealthy === false;
  const showConnectionStatus = !healthLoading;
  
  // Invalidate queries when new analysis comes through WebSocket
  useEffect(() => {
    if (lastMessage?.type === 'analysis') {
      queryClient.invalidateQueries({ queryKey: ['/api/python/insights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/python/summary/stats'] });
    }
  }, [lastMessage]);

  // Process data from backend
  const activities = insights?.recent_sessions?.map(session => ({
    id: session.id || session.filepath,
    filename: session.filename,
    filepath: session.filepath,
    topics: session.topics || [],
    summary: session.summary,
    timestamp: new Date(session.timestamp || Date.now()),
  })) || [];

  // Calculate topic progress from insights
  const topicProgress = insights?.top_topics?.slice(0, 3).map(({ topic, count }) => ({
    topic,
    progress: Math.min((count / (stats?.total_sessions || 1)) * 100, 100),
    sessions: count,
    status: 'learning' as const,
  })) || [];

  // Format recommendations for display
  const formattedRecommendations = recommendations?.slice(0, 2).map(rec => ({
    title: rec.title,
    description: rec.description,
    resourceType: rec.resource_type,
    difficulty: rec.difficulty,
    estimatedTime: rec.estimated_time,
    topics: rec.topics,
    reason: rec.reason,
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            {showConnectionStatus && (
              <>
                {isBackendConnected ? (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    Backend Online
                  </Badge>
                ) : isBackendOffline ? (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    Backend Offline
                  </Badge>
                ) : null}
                <Badge 
                  variant="secondary" 
                  className={isConnected 
                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20" 
                    : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20"
                  }
                  data-testid="badge-connection-status"
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  {isConnected ? 'Live Monitoring' : 'Not Connected'}
                </Badge>
              </>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          Track your learning journey and get AI-powered insights
        </p>
        
        {(isBackendOffline || insightsError || recsError || statsError) && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium mb-2">
              {isBackendOffline ? 'Backend Connection Failed' : 'Unable to load data from Python backend'}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              The backend service may be offline or unreachable. Make sure the Python backend is running on port 8000.
              <br />
              <span className="font-mono text-xs mt-1 block">Backend URL: http://localhost:8000</span>
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['/api/python/health'] });
                  if (insightsError) refetchInsights();
                  if (recsError) refetchRecs();
                  if (statsError) refetchStats();
                }} 
                variant="outline" 
                size="sm"
                data-testid="button-retry-backend"
              >
                Retry Connection
              </Button>
              {isBackendOffline && (
                <Button 
                  onClick={() => window.open('http://localhost:8000/health', '_blank')}
                  variant="outline" 
                  size="sm"
                >
                  Check Backend Health
                </Button>
              )}
            </div>
          </div>
        )}
        
        {isBackendConnected && isConnected && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              ✅ Successfully connected to Python backend at http://localhost:8000
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Sessions"
              value={stats?.total_sessions || 0}
              icon={Activity}
              description="All time"
              data-testid="stat-total-sessions"
            />
            <StatCard
              title="Topics Learned"
              value={stats?.unique_topics || 0}
              icon={Brain}
              description="Unique topics"
              data-testid="stat-topics-learned"
            />
            <StatCard
              title="Current Streak"
              value={`${stats?.current_streak || 0} days`}
              icon={Flame}
              description="Keep it up!"
              data-testid="stat-current-streak"
            />
            <StatCard
              title="AI Suggestions"
              value={recommendations?.length || 0}
              icon={Lightbulb}
              description="Pending review"
              data-testid="stat-ai-suggestions"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            {insightsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : insightsError ? (
              <div className="text-center py-12 text-destructive">
                <p>Failed to load recent activity</p>
                <Button onClick={() => refetchInsights()} variant="outline" size="sm" className="mt-4" data-testid="button-retry-insights">
                  Retry
                </Button>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} {...activity} data-testid={`activity-${activity.id}`} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No recent activity detected.</p>
                <p className="text-sm mt-2">Start coding and your sessions will appear here!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Active Topics</h2>
            {insightsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : insightsError ? (
              <div className="text-center py-8 text-destructive text-sm">
                <p>Failed to load topics</p>
              </div>
            ) : topicProgress.length > 0 ? (
              <div className="space-y-3">
                {topicProgress.map((topic) => (
                  <TopicProgress key={topic.topic} {...topic} data-testid={`topic-${topic.topic}`} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>No topics tracked yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Recommendations</h2>
        {recsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : recsError ? (
          <div className="text-center py-12 text-destructive">
            <p>Failed to load recommendations</p>
            <Button onClick={() => refetchRecs()} variant="outline" size="sm" className="mt-4" data-testid="button-retry-recommendations">
              Retry
            </Button>
          </div>
        ) : formattedRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {formattedRecommendations.map((rec, idx) => (
              <RecommendationCard key={idx} {...rec} data-testid={`recommendation-${idx}`} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No recommendations available yet.</p>
            <p className="text-sm mt-2">Keep learning and AI will generate personalized suggestions!</p>
          </div>
        )}
      </div>
    </div>
  );
}
