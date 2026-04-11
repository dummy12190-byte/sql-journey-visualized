import { RoadmapTopic } from "@/data/roadmapData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ExternalLink, FileText, Video, BookOpen, GraduationCap } from "lucide-react";

const resourceIcons: Record<string, typeof FileText> = {
  article: FileText,
  video: Video,
  docs: BookOpen,
  tutorial: GraduationCap,
};

const difficultyVariant: Record<string, string> = {
  beginner: "bg-primary/15 text-primary border-primary/30",
  intermediate: "bg-accent/15 text-accent border-accent/30",
  advanced: "bg-destructive/15 text-destructive border-destructive/30",
};

interface TopicModalProps {
  topic: RoadmapTopic | null;
  open: boolean;
  onClose: () => void;
  completed: boolean;
  onToggleComplete: () => void;
}

export default function TopicModal({ topic, open, onClose, completed, onToggleComplete }: TopicModalProps) {
  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg animate-scale-in">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-display text-foreground">{topic.title}</DialogTitle>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${difficultyVariant[topic.difficulty]}`}>
              {topic.difficulty}
            </span>
          </div>
          <Badge variant="outline" className="w-fit mt-1 text-muted-foreground border-border">
            {topic.category}
          </Badge>
        </DialogHeader>

        <p className="text-sm text-secondary-foreground leading-relaxed mt-2">{topic.description}</p>

        <Button
          variant={completed ? "default" : "outline"}
          size="sm"
          onClick={onToggleComplete}
          className="w-full mt-3"
        >
          {completed ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Completed
            </>
          ) : (
            <>
              <Circle className="h-4 w-4 mr-2" /> Mark as Completed
            </>
          )}
        </Button>

        {topic.resources.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Learning Resources</h4>
            {topic.resources.map((r, i) => {
              const Icon = resourceIcons[r.type] || FileText;
              return (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-md border border-border bg-secondary/50 px-3 py-2.5 text-sm text-secondary-foreground hover:bg-secondary transition-colors group"
                >
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1">{r.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
