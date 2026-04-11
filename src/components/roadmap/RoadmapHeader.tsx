import { Search, Filter, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Difficulty } from "@/data/roadmapData";

const difficulties: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

interface RoadmapHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  difficultyFilter: Difficulty | "all";
  onDifficultyChange: (d: Difficulty | "all") => void;
  progress: number;
  completedCount: number;
  totalCount: number;
}

export default function RoadmapHeader({
  searchQuery,
  onSearchChange,
  difficultyFilter,
  onDifficultyChange,
  progress,
  completedCount,
  totalCount,
}: RoadmapHeaderProps) {
  return (
    <div className="border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display text-foreground leading-tight">SQL Roadmap</h1>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{totalCount} topics completed
            </p>
          </div>
          <div className="ml-3 w-24">
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-8 w-48 bg-secondary border-border text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            {difficulties.map((d) => (
              <Button
                key={d.value}
                variant={difficultyFilter === d.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onDifficultyChange(d.value)}
                className="h-7 text-xs px-2.5"
              >
                {d.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
