import { useState } from "react";
import RecommendationCard from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Recommendations() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // TODO: remove mock data - replace with real data from API
  const mockRecommendations = [
    {
      title: "Advanced React Patterns: Compound Components",
      description: "Learn how to build flexible and reusable component APIs using the compound component pattern with practical examples.",
      resourceUrl: "https://example.com/react-patterns",
      resourceType: "tutorial",
      difficulty: "Advanced",
      estimatedTime: "45 min",
      topics: ["React", "Design Patterns", "Component Design"],
      reason: "Your recent work with React components shows you're ready for advanced patterns that will make your code more maintainable.",
    },
    {
      title: "TypeScript Utility Types Masterclass",
      description: "Comprehensive exploration of built-in TypeScript utility types like Partial, Pick, Omit, and how to create your own.",
      resourceUrl: "https://example.com/ts-utility",
      resourceType: "documentation",
      difficulty: "Intermediate",
      estimatedTime: "30 min",
      topics: ["TypeScript", "Type System", "Advanced Types"],
      reason: "You're using TypeScript extensively. Mastering utility types will significantly improve your type definitions.",
    },
    {
      title: "Database Indexing Strategies for Performance",
      description: "Deep dive into database indexing, covering B-tree indexes, composite indexes, and query optimization techniques.",
      resourceUrl: "https://example.com/db-indexing",
      resourceType: "video",
      difficulty: "Intermediate",
      estimatedTime: "1 hour",
      topics: ["Database", "Performance", "SQL"],
      reason: "Based on your database schema work, understanding indexing will help you optimize query performance.",
    },
    {
      title: "REST API Design Best Practices",
      description: "Industry-standard guidelines for designing scalable and maintainable RESTful APIs, including versioning and error handling.",
      resourceUrl: "https://example.com/rest-api",
      resourceType: "article",
      difficulty: "Beginner",
      estimatedTime: "15 min",
      topics: ["API Design", "REST", "Best Practices"],
      reason: "Reinforce your API development knowledge with established patterns and conventions.",
    },
    {
      title: "Authentication Flow Security Checklist",
      description: "Practical security checklist covering common authentication vulnerabilities and how to prevent them in your applications.",
      resourceUrl: "https://example.com/auth-security",
      resourceType: "documentation",
      difficulty: "Intermediate",
      estimatedTime: "25 min",
      topics: ["Security", "Authentication", "Best Practices"],
      reason: "Critical reading for your authentication implementation - addresses security concerns in your recent code.",
    },
    {
      title: "Node.js Event Loop Explained",
      description: "Visual and conceptual guide to understanding how Node.js handles asynchronous operations under the hood.",
      resourceUrl: "https://example.com/event-loop",
      resourceType: "tutorial",
      difficulty: "Intermediate",
      estimatedTime: "35 min",
      topics: ["Node.js", "Asynchronous", "Performance"],
      reason: "Understanding the event loop will help you write more efficient asynchronous code in your Node.js projects.",
    },
  ];

  const filteredRecommendations = mockRecommendations.filter((rec) => {
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      rec.difficulty?.toLowerCase() === selectedDifficulty;
    const matchesType =
      selectedType === "all" || rec.resourceType === selectedType;
    return matchesDifficulty && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Recommendations</h1>
        <p className="text-muted-foreground">
          Personalized learning resources based on your activity
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Difficulty:</span>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-40" data-testid="select-difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Type:</span>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40" data-testid="select-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="article">Article</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Badge variant="secondary">
            {filteredRecommendations.length} recommendations
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecommendations.map((rec, idx) => (
          <RecommendationCard key={idx} {...rec} />
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No recommendations match your filters. Try adjusting your selection.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedDifficulty("all");
              setSelectedType("all");
            }}
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
