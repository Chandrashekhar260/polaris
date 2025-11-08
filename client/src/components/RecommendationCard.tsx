import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText, ExternalLink, Lightbulb } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  resourceUrl?: string;
  resourceType?: string;
  difficulty?: string;
  estimatedTime?: string;
  topics: string[];
  reason?: string;
}

export default function RecommendationCard({
  title,
  description,
  resourceUrl,
  resourceType = "article",
  difficulty,
  estimatedTime,
  topics,
  reason,
}: RecommendationCardProps) {
  const getResourceIcon = () => {
    switch (resourceType) {
      case "video":
        return <Video className="w-5 h-5 text-primary" />;
      case "documentation":
        return <FileText className="w-5 h-5 text-primary" />;
      case "tutorial":
        return <BookOpen className="w-5 h-5 text-primary" />;
      default:
        return <BookOpen className="w-5 h-5 text-primary" />;
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "intermediate":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "advanced":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      default:
        return "";
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-recommendation-${title}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex gap-3 min-w-0 flex-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 shrink-0">
            {getResourceIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base mb-1" data-testid="text-title">
              {title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {difficulty && (
                <Badge variant="secondary" className={`text-xs ${getDifficultyColor()}`}>
                  {difficulty}
                </Badge>
              )}
              {estimatedTime && (
                <Badge variant="outline" className="text-xs">
                  {estimatedTime}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {resourceUrl && (
          <Button
            size="sm"
            variant="ghost"
            asChild
            data-testid="button-open-resource"
          >
            <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground/90">{description}</p>
        
        {reason && (
          <div className="flex gap-2 p-3 rounded-md bg-accent/50">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">{reason}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {topics.map((topic, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs"
              data-testid={`badge-topic-${idx}`}
            >
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
