import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface TopicProgressProps {
  topic: string;
  progress: number;
  sessions: number;
  status?: "learning" | "struggling" | "mastered";
}

export default function TopicProgress({
  topic,
  progress,
  sessions,
  status = "learning",
}: TopicProgressProps) {
  const getStatusColor = () => {
    switch (status) {
      case "mastered":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "struggling":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "mastered":
        return "Mastered";
      case "struggling":
        return "Needs Focus";
      default:
        return "Learning";
    }
  };

  return (
    <Card data-testid={`card-topic-${topic}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-semibold text-sm" data-testid="text-topic">
            {topic}
          </h3>
          <Badge variant="secondary" className={`text-xs ${getStatusColor()}`}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{sessions} sessions</span>
          <span data-testid="text-progress">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}
