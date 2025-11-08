import { useState } from "react";
import RecommendationCard from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecommendations } from "@/hooks/useLearningData";
import { queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export default function Recommendations() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const { data: recommendations, isLoading, isError, refetch } = useRecommendations();

  const formattedRecommendations = recommendations?.map(rec => ({
    title: rec.title,
    description: rec.description,
    resourceType: rec.resource_type,
    difficulty: rec.difficulty,
    estimatedTime: rec.estimated_time,
    topics: rec.topics,
    reason: rec.reason,
  })) || [];

  const filteredRecommendations = formattedRecommendations.filter((rec) => {
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      rec.difficulty?.toLowerCase() === selectedDifficulty;
    const matchesType =
      selectedType === "all" || rec.resourceType === selectedType;
    return matchesDifficulty && matchesType;
  });
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/python/recommendations'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Recommendations</h1>
          <p className="text-muted-foreground">
            Personalized learning resources based on your activity
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" data-testid="button-refresh-recommendations">
          Refresh Recommendations
        </Button>
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
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Badge variant="secondary" data-testid="badge-recommendation-count">
            {filteredRecommendations.length} recommendations
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-md max-w-md mx-auto">
            <p className="text-destructive font-medium mb-2">Failed to load recommendations</p>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to connect to the Python backend. Make sure the service is running.
            </p>
            <Button onClick={() => refetch()} variant="outline" data-testid="button-retry-all-recommendations">
              Retry
            </Button>
          </div>
        </div>
      ) : filteredRecommendations.length > 0 ? (
        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <AnimatePresence>
            {filteredRecommendations.map((rec, idx) => (
              <motion.div
                key={`${rec.title}-${idx}`}
                variants={cardVariants}
                layout
              >
                <RecommendationCard {...rec} data-testid={`recommendation-${idx}`} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {formattedRecommendations.length === 0 
              ? "No recommendations available yet. Keep learning and AI will generate personalized suggestions!"
              : "No recommendations match your filters. Try adjusting your selection."
            }
          </p>
          {formattedRecommendations.length > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
}
