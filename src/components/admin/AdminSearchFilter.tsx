import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Difficulty } from "@/data/roadmapData";

const filters: { label: string; value: Difficulty | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

interface AdminSearchFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  difficultyFilter: Difficulty | "all";
  onFilterChange: (f: Difficulty | "all") => void;
}

export default function AdminSearchFilter({
  searchQuery,
  onSearchChange,
  difficultyFilter,
  onFilterChange,
}: AdminSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 w-full sm:max-w-xs group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search topics..."
          className="pl-9 pr-8 bg-secondary/60 border-border focus:border-primary/50 transition-all duration-200 h-9 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5">
        {filters.map((f) => {
          const isActive = difficultyFilter === f.value;
          const colorClass =
            f.value === "beginner"
              ? "text-primary border-primary/40 bg-primary/10"
              : f.value === "intermediate"
              ? "text-warning border-warning/40 bg-warning/10"
              : f.value === "advanced"
              ? "text-destructive border-destructive/40 bg-destructive/10"
              : "text-foreground border-foreground/20 bg-foreground/5";

          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                isActive
                  ? `${colorClass} shadow-sm`
                  : "text-muted-foreground border-transparent hover:border-border hover:text-foreground"
              }`}
            >
              {f.label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 rounded-full bg-current opacity-60" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
