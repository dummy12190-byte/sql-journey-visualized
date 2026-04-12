import { memo, useRef, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckCircle2, Circle, Zap } from "lucide-react";

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
    isNext: boolean;
    onClick: () => void;
    onToggleComplete: () => void;
    staggerIndex: number;
  };
}

function ParticleBurst() {
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 30 + Math.random() * 20;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle-burst"
          style={{
            top: "50%",
            left: "50%",
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

const RoadmapNode = memo(({ data }: RoadmapNodeProps) => {
  const { label, difficulty, completed, isNext, onClick, onToggleComplete, staggerIndex } = data;
  const [showBurst, setShowBurst] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const prevCompleted = useRef(completed);

  useEffect(() => {
    if (completed && !prevCompleted.current) {
      setShowBurst(true);
      setShowXp(true);
      setTimeout(() => setShowBurst(false), 700);
      setTimeout(() => setShowXp(false), 1200);
    }
    prevCompleted.current = completed;
  }, [completed]);

  return (
    <div
      className={`group relative cursor-pointer rounded-lg border px-5 py-3 min-w-[160px] max-w-[200px] text-center
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-muted-foreground/60
        ${completed
          ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
          : "bg-card border-border hover:bg-card/90"
        }
        ${isNext ? "ring-2 ring-warning/60 ring-offset-2 ring-offset-background" : ""}
      `}
      onClick={onClick}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2 !border-0" />

      {showBurst && <ParticleBurst />}
      {showXp && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 xp-float z-20 pointer-events-none">
          <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/20 rounded-full px-2 py-0.5">
            <Zap className="h-3 w-3" /> +10 XP
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="shrink-0 transition-colors"
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4 text-primary check-bounce" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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

      {isNext && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-warning animate-ping" />
      )}
    </div>
  );
});

RoadmapNode.displayName = "RoadmapNode";
export default RoadmapNode;
