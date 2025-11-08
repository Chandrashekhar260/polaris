import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, BookOpen, Lightbulb, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function LiveSuggestions() {
  const { isConnected, lastMessage } = useWebSocket();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (!lastMessage) return;

    const msg = lastMessage;

    switch (msg.type) {
      case "analysis":
        setAnalysis(msg.analysis || msg.data);
        if (msg.analysis?.errors) {
          setErrors(msg.analysis.errors);
        }
        if (msg.analysis?.weak_areas) {
          setWeakAreas(msg.analysis.weak_areas);
        }
        break;

      case "documentation":
        if (msg.suggestions) {
          setSuggestions(msg.suggestions);
        }
        if (msg.errors) {
          setErrors(msg.errors);
        }
        if (msg.weak_areas) {
          setWeakAreas(msg.weak_areas);
        }
        break;

      case "quiz":
        if (msg.quiz) {
          setQuiz(msg.quiz);
        }
        break;

      case "recommendations":
        if (msg.recommendations) {
          setRecommendations(msg.recommendations);
        }
        break;
    }
  }, [lastMessage]);

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Waiting for WebSocket connection...</p>
          <p className="text-sm mt-2">
            Make sure:
            <br />1. Python backend is running (port 8000)
            <br />2. File watcher is running
            <br />3. Refresh this page
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Live monitoring active</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Code in VS Code → Save (Ctrl+S) → See suggestions here!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              Errors Detected ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {errors.slice(0, 5).map((error, idx) => (
              <div key={idx} className="p-3 bg-red-500/10 rounded-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Badge variant="destructive" className="mb-2">
                      {error.type || "Error"}
                    </Badge>
                    <p className="text-sm">{error.description || error.message || "Unknown error"}</p>
                    {error.line && (
                      <p className="text-xs text-muted-foreground mt-1">Line {error.line}</p>
                    )}
                  </div>
                  {error.severity && (
                    <Badge
                      variant={
                        error.severity === "critical"
                          ? "destructive"
                          : error.severity === "warning"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {error.severity}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Areas Needing Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {weakAreas.map((area, idx) => (
                <Badge key={idx} variant="outline" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentation Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Documentation Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="p-3 bg-background rounded-md border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                  {suggestion.difficulty && (
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.difficulty}
                    </Badge>
                  )}
                </div>
                {suggestion.description && (
                  <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                )}
                {suggestion.focus_area && (
                  <Badge variant="outline" className="text-xs mr-2">
                    {suggestion.focus_area}
                  </Badge>
                )}
                {suggestion.url && (
                  <a
                    href={suggestion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open Documentation
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI Recommendations ({recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3 bg-background rounded-md border">
                <h4 className="font-semibold text-sm mb-1">{rec.title || `Recommendation ${idx + 1}`}</h4>
                {rec.description && (
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                )}
                {rec.reason && (
                  <p className="text-xs text-muted-foreground italic">{rec.reason}</p>
                )}
                {rec.url && (
                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open Resource
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quiz */}
      {quiz && quiz.questions && quiz.questions.length > 0 && (
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Practice Quiz Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {quiz.questions.length} questions generated based on your weak areas
            </p>
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to quiz page or show quiz modal
                window.location.href = "/quiz";
              }}
            >
              Take Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Summary */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Latest Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.topics && analysis.topics.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Topics:</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.topics.map((topic: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {analysis.summary && (
              <p className="text-sm mt-3">{analysis.summary}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!errors.length && !weakAreas.length && !suggestions.length && !quiz && !analysis && !recommendations.length && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No suggestions yet</p>
            <p className="text-sm mt-2">Start coding or upload files to see AI-powered suggestions</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

