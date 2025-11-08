import FileUpload from "@/components/FileUpload";

export default function Upload() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload & Analyze</h1>
        <p className="text-muted-foreground">
          Upload PDFs, code files, or documents to get AI-powered learning insights, recommendations, and quizzes
        </p>
      </div>
      <FileUpload />
    </div>
  );
}

