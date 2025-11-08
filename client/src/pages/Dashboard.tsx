import { Activity, Brain, Flame, Lightbulb } from "lucide-react";
import StatCard from "@/components/StatCard";
import ActivityCard from "@/components/ActivityCard";
import RecommendationCard from "@/components/RecommendationCard";
import TopicProgress from "@/components/TopicProgress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  // TODO: remove mock data - replace with real data from API
  const mockStats = {
    totalSessions: 47,
    topicsLearned: 12,
    currentStreak: 5,
    recommendations: 8,
  };

  const mockActivities = [
    {
      id: "1",
      filename: "user-authentication.ts",
      filepath: "src/services/user-authentication.ts",
      topics: ["TypeScript", "Authentication", "Security"],
      summary: "Implementing secure password hashing with bcrypt and session management",
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
    },
    {
      id: "2",
      filename: "api-routes.ts",
      filepath: "src/api/api-routes.ts",
      topics: ["Node.js", "Express", "REST API"],
      summary: "Building RESTful endpoints for user management and data retrieval",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: "3",
      filename: "database-schema.sql",
      filepath: "db/database-schema.sql",
      topics: ["SQL", "Database Design", "PostgreSQL"],
      summary: "Creating normalized database schema with proper foreign key relationships",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
    },
  ];

  const mockTopics = [
    { topic: "React Hooks", progress: 75, sessions: 8, status: "learning" as const },
    { topic: "TypeScript", progress: 85, sessions: 12, status: "learning" as const },
    { topic: "Authentication", progress: 60, sessions: 5, status: "struggling" as const },
  ];

  const mockRecommendations = [
    {
      title: "TypeScript Type Guards Deep Dive",
      description: "Master advanced type narrowing techniques to write safer, more maintainable code with TypeScript's type system.",
      resourceType: "tutorial",
      difficulty: "Intermediate",
      estimatedTime: "20 min",
      topics: ["TypeScript", "Type Safety"],
      reason: "You're working heavily with TypeScript. This will help improve type safety in your authentication code.",
    },
    {
      title: "Node.js Security Best Practices",
      description: "Comprehensive guide covering input validation, SQL injection prevention, and secure session handling in Node.js applications.",
      resourceType: "documentation",
      difficulty: "Intermediate",
      estimatedTime: "30 min",
      topics: ["Security", "Node.js", "Best Practices"],
      reason: "Based on your authentication work, understanding security fundamentals will prevent common vulnerabilities.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Monitoring Active
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Track your learning journey and get AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sessions"
          value={mockStats.totalSessions}
          icon={Activity}
          description="All time"
        />
        <StatCard
          title="Topics Learned"
          value={mockStats.topicsLearned}
          icon={Brain}
          description="This month"
        />
        <StatCard
          title="Current Streak"
          value={`${mockStats.currentStreak} days`}
          icon={Flame}
          description="Keep it up!"
        />
        <StatCard
          title="AI Suggestions"
          value={mockStats.recommendations}
          icon={Lightbulb}
          description="Pending review"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <ActivityCard key={activity.id} {...activity} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Active Topics</h2>
            <div className="space-y-3">
              {mockTopics.map((topic) => (
                <TopicProgress key={topic.topic} {...topic} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Recommendations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockRecommendations.map((rec, idx) => (
            <RecommendationCard key={idx} {...rec} />
          ))}
        </div>
      </div>
    </div>
  );
}
