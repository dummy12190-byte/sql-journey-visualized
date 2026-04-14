import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Roadmap } from "@/hooks/useRoadmaps";

interface AdminRoadmapListProps {
  roadmaps: Roadmap[];
  loading: boolean;
  onEdit: (r: Roadmap) => void;
  onDelete: (id: string) => void;
}

export default function AdminRoadmapList({ roadmaps, loading, onEdit, onDelete }: AdminRoadmapListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <p className="text-foreground font-medium">No roadmaps yet</p>
        <p className="text-muted-foreground text-sm mt-1">Create your first roadmap to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {roadmaps.map((roadmap, i) => (
        <RoadmapRow key={roadmap.id} roadmap={roadmap} index={i} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

function RoadmapRow({ roadmap, index, onEdit, onDelete }: { roadmap: Roadmap; index: number; onEdit: (r: Roadmap) => void; onDelete: (id: string) => void }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div
      className="stagger-fade group flex items-center gap-3 rounded-lg border border-border bg-card/80 backdrop-blur-sm p-4 transition-all duration-200 hover:translate-x-1 hover:border-muted-foreground/30 hover:shadow-lg"
      style={{
        animationDelay: `${index * 60}ms`,
        borderLeftColor: roadmap.accent_color,
        borderLeftWidth: "3px",
      }}
    >
      <span className="text-2xl shrink-0">{roadmap.icon}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium text-foreground text-sm">{roadmap.name}</h3>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-5 border ${
              roadmap.status === "published"
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-warning/10 text-warning border-warning/30"
            }`}
          >
            {roadmap.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{roadmap.description}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link to={`/admin/${roadmap.id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8 text-primary hover:text-primary hover:bg-primary/10">
            Topics <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              onClick={() => onEdit(roadmap)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Edit Roadmap</TooltipContent>
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
            <TooltipContent side="top" className="text-xs">Delete Roadmap</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-56 p-3 bg-card border-border" side="left" align="center">
            <p className="text-sm text-foreground font-medium mb-1">Delete roadmap?</p>
            <p className="text-xs text-muted-foreground mb-3">All topics in this roadmap will be deleted too.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={() => { onDelete(roadmap.id); setDeleteOpen(false); }}>
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
