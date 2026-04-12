import { useState, useEffect, useRef } from "react";
import { Search, Filter, Database, Flame, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Difficulty } from "@/data/roadmapData";

const difficulties: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

function getLevelInfo(completed: number) {
  if (completed >= 12) return { level: 5, title: "SQL Master", color: "text-warning" };
  if (completed >= 9) return { level: 4, title: "SQL Expert", color: "text-destructive" };
  if (completed >= 6) return { level: 3, title: "SQL Developer", color: "text-accent" };
  if (completed >= 3) return { level: 2, title: "SQL Apprentice", color: "text-primary" };
  return { level: 1, title: "SQL Beginner", color: "text-muted-foreground" };
}

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [pop, setPop] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 300);
      setDisplay(value);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return <span className={pop ? "counter-pop inline-block" : "inline-block"}>{display}</span>;
}

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
  const levelInfo = getLevelInfo(completedCount);

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: Title + Progress HUD */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display text-foreground leading-tight">SQL Roadmap</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                <AnimatedCounter value={completedCount} />/{totalCount} topics
              </span>
              <span className="text-border">•</span>
              <span className={`flex items-center gap-1 font-semibold ${levelInfo.color}`}>
                <Trophy className="h-3 w-3" />
                Lv.{levelInfo.level} — {levelInfo.title}
              </span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="ml-3 flex flex-col gap-1">
            <div className="relative w-28 h-2.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 progress-glow transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ width: `${progress}%` }}
              />
              {/* Segments */}
              {[25, 50, 75].map((seg) => (
                <div
                  key={seg}
                  className="absolute top-0 h-full w-px bg-background/40"
                  style={{ left: `${seg}%` }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Flame className={`h-3 w-3 transition-all duration-300 ${completedCount > 0 ? "text-warning scale-110" : "text-muted-foreground/40 scale-90"}`} />
              <span className="font-mono">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Right: Search + Filters */}
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
                className={`h-7 text-xs px-2.5 relative ${difficultyFilter === d.value ? "filter-active bg-gradient-to-r from-primary to-primary/80" : ""}`}
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
