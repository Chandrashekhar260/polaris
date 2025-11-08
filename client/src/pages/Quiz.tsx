import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { fetchQuiz, fetchQuizForSession, type Quiz, type QuizQuestion } from "@/lib/pythonApi";
import { useToast } from "@/hooks/use-toast";
import { useInsights } from "@/hooks/useLearningData";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Quiz() {
  const [topics, setTopics] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { data: insights } = useInsights();

  const handleGenerateQuiz = async () => {
    if (!topics && !sessionId) {
      toast({
        title: "Error",
        description: "Please provide topics or select a session",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      let quizData: Quiz;
      if (sessionId) {
        quizData = await fetchQuizForSession(sessionId, numQuestions);
      } else {
        quizData = await fetchQuiz(topics, undefined, numQuestions);
      }
      setQuiz(quizData);
      toast({
        title: "Quiz generated",
        description: `Generated ${quizData.questions?.length || 0} questions`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correct = quiz?.questions?.filter(
      (q, idx) => selectedAnswers[idx] === q.correct_answer
    ).length || 0;
    const total = quiz?.questions?.length || 0;
    
    toast({
      title: "Quiz submitted",
      description: `You got ${correct} out of ${total} questions correct!`,
    });
  };

  const getScore = () => {
    if (!quiz || !showResults) return null;
    const correct = quiz.questions?.filter(
      (q, idx) => selectedAnswers[idx] === q.correct_answer
    ).length || 0;
    const total = quiz.questions?.length || 0;
    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  const score = getScore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Quiz Generator</h1>
        <p className="text-muted-foreground">
          Generate personalized quiz questions based on your learning topics or recent sessions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Quiz</CardTitle>
          <CardDescription>
            Enter topics (comma-separated) or select a recent session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topics">Topics (comma-separated)</Label>
            <Input
              id="topics"
              placeholder="e.g., React, JavaScript, TypeScript"
              value={topics}
              onChange={(e) => {
                setTopics(e.target.value);
                setSessionId("");
              }}
            />
          </div>

          {insights?.recent_sessions && insights.recent_sessions.length > 0 && (
            <div className="space-y-2">
              <Label>Or select a recent session</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={sessionId}
                onChange={(e) => {
                  setSessionId(e.target.value);
                  setTopics("");
                }}
              >
                <option value="">Select a session...</option>
                {insights.recent_sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.filename} - {session.topics?.join(", ") || "No topics"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <Input
              id="numQuestions"
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
            />
          </div>

          <Button
            onClick={handleGenerateQuiz}
            disabled={loading || (!topics && !sessionId)}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {quiz && quiz.questions && quiz.questions.length > 0 && (
        <div className="space-y-6">
          {score && (
            <Alert>
              <Card className="w-full">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Your Score</h3>
                    <div className="text-4xl font-bold text-primary">
                      {score.correct} / {score.total}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {score.percentage}% Correct
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Alert>
          )}

          <div className="space-y-6">
            {quiz.questions.map((question: QuizQuestion, idx: number) => {
              const isCorrect = selectedAnswers[idx] === question.correct_answer;
              const showAnswer = showResults;

              return (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {idx + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium">{question.question}</p>
                    
                    <div className="space-y-2">
                      {Object.entries(question.options).map(([key, value]) => {
                        const isSelected = selectedAnswers[idx] === key;
                        const isCorrectOption = key === question.correct_answer;
                        const showCorrect = showAnswer && isCorrectOption;
                        const showIncorrect = showAnswer && isSelected && !isCorrectOption;

                        return (
                          <div
                            key={key}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                              !showAnswer && isSelected
                                ? "bg-primary/10 border-primary"
                                : showCorrect
                                ? "bg-green-500/10 border-green-500"
                                : showIncorrect
                                ? "bg-red-500/10 border-red-500"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => !showAnswer && handleAnswerSelect(idx, key)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{key}:</span>
                              <span>{value}</span>
                              {showCorrect && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                              )}
                              {showIncorrect && (
                                <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {showAnswer && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {!showResults && (
            <div className="flex justify-end">
              <Button onClick={handleSubmit} size="lg">
                Submit Quiz
              </Button>
            </div>
          )}

          {showResults && (
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                setQuiz(null);
                setSelectedAnswers({});
                setShowResults(false);
                setTopics("");
                setSessionId("");
              }} variant="outline">
                Generate New Quiz
              </Button>
            </div>
          )}
        </div>
      )}

      {quiz && (!quiz.questions || quiz.questions.length === 0) && (
        <Alert>
          <AlertDescription>
            {quiz.message || "No questions generated. Try different topics or check your API key."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

