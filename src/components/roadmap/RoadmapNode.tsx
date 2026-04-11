import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckCircle2, Circle } from "lucide-react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-primary/20 text-primary border-primary/30",
  intermediate: "bg-accent/20 text-accent border-accent/30",
  advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

interface RoadmapNodeProps {
  data: {
    label: string;
    difficulty: string;
    completed: boolean;
    onClick: () => void;
    onToggleComplete: () => void;
  };
}

const RoadmapNode = memo(({ data }: RoadmapNodeProps) => {
  const { label, difficulty, completed, onClick, onToggleComplete } = data;

  return (
    <div
      className={`group relative cursor-pointer rounded-lg border px-5 py-3 transition-all duration-200 hover:scale-105 min-w-[160px] max-w-[200px] text-center ${
        completed
          ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
          : "border-border bg-card hover:border-muted-foreground/40 hover:shadow-lg hover:shadow-primary/5"
      }`}
      onClick={onClick}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2 !border-0" />

      <div className="flex items-center gap-2 justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="shrink-0 transition-colors"
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          )}
        </button>
        <span className={`text-sm font-medium leading-tight ${completed ? "text-primary" : "text-foreground"}`}>
          {label}
        </span>
      </div>

      <div className="mt-1.5 flex justify-center">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>
    </div>
  );
});

RoadmapNode.displayName = "RoadmapNode";
export default RoadmapNode;
