import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, RotateCcw, Database } from "lucide-react";
import type { RoadmapNode } from "@/hooks/useRoadmapStore";

interface AdminHeaderProps {
  topics: RoadmapNode[];
  onAddTopic: () => void;
  onReset: () => void;
  roadmapName?: string;
}

export default function AdminHeader({ topics, onAddTopic, onReset, roadmapName }: AdminHeaderProps) {
  const [spinning, setSpinning] = useState(false);

  const beginnerCount = topics.filter((t) => t.difficulty === "beginner").length;
  const intermediateCount = topics.filter((t) => t.difficulty === "intermediate").length;
  const advancedCount = topics.filter((t) => t.difficulty === "advanced").length;

  const handleReset = () => {
    setSpinning(true);
    onReset();
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-primary/40" />
              <Database className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-display text-foreground">Admin Panel</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 border-border hover:border-muted-foreground/40 transition-all duration-200"
            >
              <RotateCcw className={`h-3.5 w-3.5 transition-transform duration-700 ${spinning ? "animate-spin" : ""}`} />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={onAddTopic}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_hsl(142_60%_50%/0.3)]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Topic
            </Button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-6xl mx-auto px-4 pb-3 md:px-6">
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            📚 <span className="text-foreground">{topics.length}</span> Topics
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-foreground">{beginnerCount}</span> Beginner
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-foreground">{intermediateCount}</span> Intermediate
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-foreground">{advancedCount}</span> Advanced
          </span>
        </div>
      </div>
    </div>
  );
}
