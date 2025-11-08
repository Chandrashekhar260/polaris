import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadFile, type Recommendation } from "@/lib/pythonApi";
import { useToast } from "@/hooks/use-toast";
import RecommendationCard from "@/components/RecommendationCard";

interface UploadResult {
  session_id: string;
  filename: string;
  file_type: string;
  analysis: {
    topics: string[];
    difficulty: string;
    concepts: string[];
    potential_struggles: string[];
    summary: string;
  };
  recommendations: Recommendation[];
  quiz?: any;
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'py', 'js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'go', 'rs', 'html', 'css', 'sql', 'txt', 'md'];
      
      if (extension && allowedExtensions.includes(extension)) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError(`Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`);
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadResult = await uploadFile(file);
      setResult(uploadResult);
      toast({
        title: "File uploaded successfully",
        description: `Analysis complete for ${uploadResult.filename}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formattedRecommendations = result?.recommendations?.map(rec => ({
    title: rec.title,
    description: rec.description,
    resourceType: rec.resource_type,
    difficulty: rec.difficulty,
    estimatedTime: rec.estimated_time,
    topics: rec.topics,
    reason: rec.reason,
  })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload File for Analysis</CardTitle>
          <CardDescription>
            Upload PDFs, code files, or text documents to get AI-powered learning insights, recommendations, and quizzes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.py,.js,.ts,.jsx,.tsx,.java,.cpp,.go,.rs,.html,.css,.sql,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </span>
              </Button>
            </label>
            
            {file && (
              <div className="flex items-center gap-2 flex-1">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
            
            {file && (
              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Analyze
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Analyzing file... This may take a moment.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">File Information</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Filename:</span> {result.filename}</p>
                  <p><span className="font-medium">Type:</span> {result.file_type}</p>
                  <p><span className="font-medium">Session ID:</span> {result.session_id}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Topics Identified</h3>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Difficulty Level</h3>
                <p className="text-sm capitalize">{result.analysis.difficulty}</p>
              </div>

              {result.analysis.concepts.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Concepts</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {result.analysis.concepts.map((concept, idx) => (
                      <li key={idx}>{concept}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.analysis.potential_struggles.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Areas to Focus On
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {result.analysis.potential_struggles.map((struggle, idx) => (
                      <li key={idx}>{struggle}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">{result.analysis.summary}</p>
              </div>
            </CardContent>
          </Card>

          {formattedRecommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Recommendations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {formattedRecommendations.map((rec, idx) => (
                  <RecommendationCard key={idx} {...rec} />
                ))}
              </div>
            </div>
          )}

          {result.quiz && result.quiz.questions && result.quiz.questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Quiz</CardTitle>
                <CardDescription>
                  Test your understanding with AI-generated questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.quiz.questions.map((q: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold">Question {idx + 1}</h4>
                      <p className="text-sm">{q.question}</p>
                      <div className="space-y-2">
                        {Object.entries(q.options || {}).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{key}:</span>
                            <span>{value as string}</span>
                            {key === q.correct_answer && (
                              <span className="text-green-600 text-xs">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <span className="font-medium">Explanation: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

