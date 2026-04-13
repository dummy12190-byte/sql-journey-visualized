import { useState } from "react";
import { Pencil, Trash2, GripVertical, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { RoadmapNode } from "@/hooks/useRoadmapStore";

const categoryEmojis: Record<string, string> = {
  Fundamentals: "📘",
  Commands: "⌨️",
  "Joins & Relations": "🔗",
  Performance: "⚡",
  "Data Integrity": "🛡️",
  Design: "🏗️",
  Advanced: "🚀",
};

const difficultyColors: Record<string, { border: string; badge: string; glow: string }> = {
  beginner: {
    border: "border-l-primary",
    badge: "bg-primary/10 text-primary border-primary/30",
    glow: "hover:shadow-[0_0_16px_hsl(142_60%_50%/0.15)]",
  },
  intermediate: {
    border: "border-l-warning",
    badge: "bg-warning/10 text-warning border-warning/30",
    glow: "hover:shadow-[0_0_16px_hsl(38_92%_55%/0.15)]",
  },
  advanced: {
    border: "border-l-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/30",
    glow: "hover:shadow-[0_0_16px_hsl(0_72%_55%/0.15)]",
  },
};

interface AdminTopicCardProps {
  topic: RoadmapNode;
  index: number;
  onEdit: (topic: RoadmapNode) => void;
  onDelete: (id: string) => void;
}

export default function AdminTopicCard({ topic, index, onEdit, onDelete }: AdminTopicCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const colors = difficultyColors[topic.difficulty] || difficultyColors.beginner;
  const emoji = categoryEmojis[topic.category] || "📄";
  // Estimated time based on difficulty
  const estTime = topic.difficulty === "beginner" ? 20 : topic.difficulty === "intermediate" ? 35 : 50;

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border border-border ${colors.border} border-l-[3px] bg-card/80 backdrop-blur-sm p-4 transition-all duration-200 hover:translate-x-1 ${colors.glow} hover:border-border/80`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Drag handle */}
      <div className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors cursor-grab shrink-0">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Emoji */}
      <span className="text-lg shrink-0">{emoji}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium text-foreground text-sm">{topic.title}</h3>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-5 border ${colors.badge} font-medium`}
          >
            {topic.difficulty}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 border-border text-muted-foreground bg-muted/30"
          >
            {topic.category}
          </Badge>
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/60 rounded-full px-2 py-0.5 border border-border/50">
            <Clock className="h-2.5 w-2.5" />
            {estTime} min
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">{topic.description}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-0.5 ml-2 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              onClick={() => onEdit(topic)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Edit Topic</TooltipContent>
        </Tooltip>

        <Popover open={deleteOpen} onOpenChange={setDeleteOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Delete Topic</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-56 p-3 bg-card border-border" side="left" align="center">
            <p className="text-sm text-foreground font-medium mb-1">Delete topic?</p>
            <p className="text-xs text-muted-foreground mb-3">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  onDelete(topic.id);
                  setDeleteOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
