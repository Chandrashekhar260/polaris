import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TopicProgress from "@/components/TopicProgress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useSummary, useInsights, useSummaryStats } from "@/hooks/useLearningData";
import { queryClient } from "@/lib/queryClient";

export default function Progress() {
  const { data: weeklySummary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useSummary('weekly');
  const { data: insights, isLoading: insightsLoading, isError: insightsError } = useInsights();
  const { data: stats, isLoading: statsLoading } = useSummaryStats();

  // Calculate topic mastery from insights
  const topicMastery = insights?.top_topics?.map(({ topic, count }) => {
    const totalSessions = stats?.total_sessions || 1;
    const progress = Math.min((count / totalSessions) * 100, 100);
    // Determine status based on progress
    const status = progress >= 70 ? "learning" : progress >= 40 ? "learning" : "struggling";
    return {
      topic,
      progress: Math.round(progress),
      sessions: count,
      status: status as "learning" | "struggling" | "mastered"
    };
  }) || [];

  // Get struggle areas from insights
  const struggleAreas = insights?.struggle_areas?.map((area, idx) => ({
    topic: area,
    description: `This area needs more attention based on your recent learning activity.`,
    sessions: topicMastery.find(t => t.topic === area)?.sessions || 0,
  })) || [];

  // Use real data or fallback to empty state
  const weeklySummaryData = weeklySummary || {
    summary: "No learning activity to summarize yet. Start coding and the AI will track your progress!",
    topics_learned: [],
    struggling_topics: [],
    total_sessions: 0,
  };

  const isLoading = summaryLoading || insightsLoading || statsLoading;
  const hasError = summaryError || insightsError;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
        <p className="text-muted-foreground">
          Track your growth and identify areas for improvement
        </p>
      </div>
        <Button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/python/summary', 'weekly'] });
            queryClient.invalidateQueries({ queryKey: ['/api/python/insights'] });
            queryClient.invalidateQueries({ queryKey: ['/api/python/summary/stats'] });
          }}
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {hasError && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <p className="text-sm text-destructive mb-2">Failed to load progress data</p>
            <Button onClick={() => {
              if (summaryError) refetchSummary();
            }} variant="outline" size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Weekly AI Summary</h2>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `${weeklySummaryData.total_sessions || 0} learning sessions this week`
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <p className="text-sm leading-relaxed">{weeklySummaryData.summary}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-sm">Topics Explored</h3>
              </div>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-20" />
                  ))}
                </div>
              ) : weeklySummaryData.topics_learned && weeklySummaryData.topics_learned.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                  {weeklySummaryData.topics_learned.map((topic, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-green-500/10 text-green-700 dark:text-green-400"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
              ) : (
                <p className="text-sm text-muted-foreground">No topics tracked yet</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-sm">Needs Attention</h3>
              </div>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-24" />
                  ))}
                </div>
              ) : weeklySummaryData.struggling_topics && weeklySummaryData.struggling_topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                  {weeklySummaryData.struggling_topics.map((topic, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-orange-500/10 text-orange-700 dark:text-orange-400"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
              ) : (
                <p className="text-sm text-muted-foreground">No struggling topics identified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Topic Mastery</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : topicMastery.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicMastery.map((topic) => (
            <TopicProgress key={topic.topic} {...topic} />
          ))}
        </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No topic mastery data available yet.</p>
              <p className="text-sm mt-2">Start uploading files or coding to track your progress!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {struggleAreas.length > 0 && (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Areas Needing Focus</h2>
        <div className="space-y-4">
            {struggleAreas.map((area, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{area.topic}</h3>
                      <Badge variant="outline" className="text-xs">
                        {area.sessions} sessions
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
