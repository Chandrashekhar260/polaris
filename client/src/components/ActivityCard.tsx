import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityCardProps {
  filename: string;
  filepath: string;
  topics: string[];
  summary?: string;
  timestamp: Date;
}

export default function ActivityCard({
  filename,
  filepath,
  topics,
  summary,
  timestamp,
}: ActivityCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-activity-${filename}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
            <FileCode className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate" data-testid="text-filename">
              {filename}
            </h3>
            <p className="text-xs text-muted-foreground truncate font-mono">
              {filepath}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {summary && (
          <p className="text-sm text-foreground/90 line-clamp-2">{summary}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {topics.slice(0, 3).map((topic, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs"
              data-testid={`badge-topic-${idx}`}
            >
              {topic}
            </Badge>
          ))}
          {topics.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{topics.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span data-testid="text-timestamp">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
