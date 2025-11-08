import { Activity, Brain, Flame, Lightbulb, TrendingUp, Zap } from "lucide-react";
import StatCard from "@/components/StatCard";
import ActivityCard from "@/components/ActivityCard";
import RecommendationCard from "@/components/RecommendationCard";
import TopicProgress from "@/components/TopicProgress";
import LiveSuggestions from "@/components/LiveSuggestions";
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
  
  const { isConnected, lastMessage, error: wsError } = useWebSocket();
  
  const isBackendConnected = backendHealthy === true;
  const isBackendOffline = backendHealthy === false;
  const showConnectionStatus = !healthLoading;
  
  useEffect(() => {
    if (lastMessage?.type === 'analysis') {
      queryClient.invalidateQueries({ queryKey: ['/api/python/insights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/python/summary/stats'] });
    }
  }, [lastMessage]);

  const activities = insights?.recent_sessions?.map(session => ({
    id: session.id || session.filepath,
    filename: session.filename,
    filepath: session.filepath,
    topics: session.topics || [],
    summary: session.summary,
    timestamp: new Date(session.timestamp || Date.now()),
  })) || [];

  const topicProgress = insights?.top_topics?.slice(0, 3).map(({ topic, count }) => ({
    topic,
    progress: Math.min((count / (stats?.total_sessions || 1)) * 100, 100),
    sessions: count,
    status: 'learning' as const,
  })) || [];

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
    <div className="space-y-8 custom-scrollbar">
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 p-8 border border-purple-500/20">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient-primary mb-2">Learning Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                  Track your journey with AI-powered insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {showConnectionStatus && (
                <>
                  {isBackendConnected ? (
                    <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                      Backend Online
                    </Badge>
                  ) : isBackendOffline ? (
                    <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      Backend Offline
                    </Badge>
                  ) : null}
                  <Badge 
                    className={isConnected 
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 backdrop-blur-sm" 
                      : "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30 backdrop-blur-sm"
                    }
                  >
                    <Zap className="w-3 h-3 mr-2" />
                    {isConnected ? 'Live Monitoring' : 'Not Connected'}
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          {(isBackendOffline || insightsError || recsError || statsError) && (
            <div className="mt-4 p-6 glass-card border-red-500/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                    {isBackendOffline ? 'Backend Connection Failed' : 'Unable to load data from Python backend'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    The backend service may be offline or unreachable. Make sure the Python backend is running on port 8000.
                    <br />
                    <span className="font-mono text-xs mt-2 block bg-muted/50 px-2 py-1 rounded">Backend URL: http://localhost:8000</span>
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
                      className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                    >
                      Retry Connection
                    </Button>
                    {isBackendOffline && (
                      <Button 
                        onClick={() => window.open('http://localhost:8000/health', '_blank')}
                        variant="outline" 
                        size="sm"
                        className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                      >
                        Check Backend Health
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isBackendConnected && isConnected && (
            <div className="mt-4 p-4 glass-card border-emerald-500/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Successfully connected to Python backend at http://localhost:8000
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Suggestions */}
      {isConnected && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Live Suggestions</h2>
          </div>
          <LiveSuggestions />
        </div>
      )}

      {/* Stats Grid - Enhanced with gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </>
        ) : (
          <>
            <div className="glass-card rounded-2xl p-6 card-hover-lift gradient-border border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl icon-bg-primary flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="secondary" className="text-xs">All time</Badge>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{stats?.total_sessions || 0}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 card-hover-lift gradient-border border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl icon-bg-success flex items-center justify-center">
                  <Brain className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <Badge variant="secondary" className="text-xs">Unique</Badge>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{stats?.unique_topics || 0}</p>
                <p className="text-sm text-muted-foreground">Topics Learned</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 card-hover-lift gradient-border border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl icon-bg-warning flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge variant="secondary" className="text-xs">Keep it up!</Badge>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{stats?.current_streak || 0} days</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 card-hover-lift gradient-border border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl icon-bg-primary flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <Badge variant="secondary" className="text-xs">Pending</Badge>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{recommendations?.length || 0}</p>
                <p className="text-sm text-muted-foreground">AI Suggestions</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Recent Activity</h2>
          </div>
          
          {insightsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          ) : insightsError ? (
            <div className="glass-card rounded-2xl p-8 text-center border-red-500/30">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-400 mb-4">Failed to load recent activity</p>
              <Button onClick={() => refetchInsights()} variant="outline" size="sm" className="bg-red-500/10 border-red-500/30">
                Retry
              </Button>
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="glass-card rounded-2xl overflow-hidden card-hover-lift">
                  <ActivityCard {...activity} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-10 h-10 text-purple-500" />
              </div>
              <p className="text-muted-foreground mb-2">No recent activity detected.</p>
              <p className="text-sm text-muted-foreground">Start coding and your sessions will appear here!</p>
            </div>
          )}
        </div>

        {/* Active Topics - 1 column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Active Topics</h2>
          </div>
          
          {insightsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : insightsError ? (
            <div className="glass-card rounded-2xl p-6 text-center border-red-500/30">
              <p className="text-sm text-red-600 dark:text-red-400">Failed to load topics</p>
            </div>
          ) : topicProgress.length > 0 ? (
            <div className="space-y-3">
              {topicProgress.map((topic) => (
                <div key={topic.topic} className="glass-card rounded-2xl overflow-hidden card-hover-lift">
                  <TopicProgress {...topic} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-cyan-500" />
              </div>
              <p className="text-sm text-muted-foreground">No topics tracked yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Quick Recommendations</h2>
        </div>
        
        {recsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl" />
            ))}
          </div>
        ) : recsError ? (
          <div className="glass-card rounded-2xl p-12 text-center border-red-500/30">
            <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load recommendations</p>
            <Button onClick={() => refetchRecs()} variant="outline" size="sm" className="bg-red-500/10 border-red-500/30">
              Retry
            </Button>
          </div>
        ) : formattedRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formattedRecommendations.map((rec, idx) => (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden card-hover-lift">
                <RecommendationCard {...rec} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-10 h-10 text-yellow-500" />
            </div>
            <p className="text-muted-foreground mb-2">No recommendations available yet.</p>
            <p className="text-sm text-muted-foreground">Keep learning and AI will generate personalized suggestions!</p>
          </div>
        )}
      </div>
    </div>
  );
}