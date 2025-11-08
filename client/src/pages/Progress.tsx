import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TopicProgress from "@/components/TopicProgress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function Progress() {
  // TODO: remove mock data - replace with real data from API
  const mockWeeklySummary = {
    summary: "Great progress this week! You've focused heavily on backend development, particularly authentication and database design. Your TypeScript skills are improving steadily. Consider spending more time on testing patterns to round out your full-stack capabilities.",
    topicsLearned: ["TypeScript", "Authentication", "SQL", "REST APIs", "Node.js"],
    strugglingTopics: ["Testing", "Async Patterns"],
    totalSessions: 18,
  };

  const mockTopicMastery = [
    { topic: "TypeScript", progress: 85, sessions: 12, status: "learning" as const },
    { topic: "React", progress: 78, sessions: 15, status: "learning" as const },
    { topic: "Node.js", progress: 72, sessions: 10, status: "learning" as const },
    { topic: "SQL", progress: 65, sessions: 8, status: "learning" as const },
    { topic: "Authentication", progress: 58, sessions: 6, status: "struggling" as const },
    { topic: "Testing", progress: 42, sessions: 4, status: "struggling" as const },
    { topic: "API Design", progress: 68, sessions: 7, status: "learning" as const },
    { topic: "Security", progress: 55, sessions: 5, status: "struggling" as const },
  ];

  const mockStruggleAreas = [
    {
      topic: "Testing Patterns",
      description: "Unit testing and integration testing concepts need more practice. Consider focusing on Jest and testing library fundamentals.",
      sessions: 4,
    },
    {
      topic: "Async/Await",
      description: "Error handling in async functions showing inconsistent patterns. Review Promise chains and async error boundaries.",
      sessions: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
        <p className="text-muted-foreground">
          Track your growth and identify areas for improvement
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Weekly AI Summary</h2>
              <p className="text-sm text-muted-foreground">
                {mockWeeklySummary.totalSessions} learning sessions this week
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{mockWeeklySummary.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-sm">Topics Explored</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockWeeklySummary.topicsLearned.map((topic, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-green-500/10 text-green-700 dark:text-green-400"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-sm">Needs Attention</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockWeeklySummary.strugglingTopics.map((topic, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-orange-500/10 text-orange-700 dark:text-orange-400"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Topic Mastery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTopicMastery.map((topic) => (
            <TopicProgress key={topic.topic} {...topic} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Areas Needing Focus</h2>
        <div className="space-y-4">
          {mockStruggleAreas.map((area, idx) => (
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
    </div>
  );
}
