import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import type { RoadmapNode } from "@/hooks/useRoadmapStore";
import type { Resource, Difficulty } from "@/data/roadmapData";

interface TopicForm {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  resources: Resource[];
  position_x: number;
  position_y: number;
  connections: string[];
  video_url: string;
}

const emptyForm: TopicForm = {
  title: "",
  description: "",
  category: "",
  difficulty: "beginner",
  resources: [],
  position_x: 400,
  position_y: 0,
  connections: [],
  video_url: "",
};

const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "bg-primary/20 text-primary border-primary/40" },
  { value: "intermediate", label: "Intermediate", color: "bg-warning/20 text-warning border-warning/40" },
  { value: "advanced", label: "Advanced", color: "bg-destructive/20 text-destructive border-destructive/40" },
];

interface AdminTopicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTopic: RoadmapNode | null;
  topics: RoadmapNode[];
  onSave: (form: TopicForm, editingId: string | null) => Promise<void>;
}

export default function AdminTopicDrawer({ open, onOpenChange, editingTopic, topics, onSave }: AdminTopicDrawerProps) {
  const [form, setForm] = useState<TopicForm>(emptyForm);
  const [newResource, setNewResource] = useState<Resource>({ title: "", url: "", type: "article" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTopic) {
      setForm({
        title: editingTopic.title,
        description: editingTopic.description,
        category: editingTopic.category,
        difficulty: editingTopic.difficulty,
        resources: [...editingTopic.resources],
        position_x: editingTopic.position_x,
        position_y: editingTopic.position_y,
        connections: [...editingTopic.connections],
        video_url: editingTopic.video_url,
      });
    } else {
      const maxY = topics.reduce((max, t) => Math.max(max, t.position_y), 0);
      setForm({ ...emptyForm, position_y: maxY + 140 });
    }
  }, [editingTopic, open, topics]);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onSave(form, editingTopic?.id || null);
    setSaving(false);
    onOpenChange(false);
  };

  const addResource = () => {
    if (!newResource.title || !newResource.url) return;
    setForm((prev) => ({ ...prev, resources: [...prev.resources, { ...newResource }] }));
    setNewResource({ title: "", url: "", type: "article" });
  };

  const removeResource = (i: number) => {
    setForm((prev) => ({ ...prev, resources: prev.resources.filter((_, idx) => idx !== i) }));
  };

  const descMaxLen = 300;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-card border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-foreground text-lg">
            {editingTopic ? "Edit Topic" : "Add Topic"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Topic Name</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. SQL Basics"
              className="bg-secondary/60 border-border focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
              <span className={`text-[10px] ${form.description.length > descMaxLen ? "text-destructive" : "text-muted-foreground"}`}>
                {form.description.length}/{descMaxLen}
              </span>
            </div>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-secondary/60 border-border focus:border-primary/50 transition-all duration-200 min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
            <Select value={form.category || undefined} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="bg-secondary/60 border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Fundamentals">📘 Fundamentals</SelectItem>
                <SelectItem value="Commands">⌨️ Commands</SelectItem>
                <SelectItem value="Joins & Relations">🔗 Joins & Relations</SelectItem>
                <SelectItem value="Performance">⚡ Performance</SelectItem>
                <SelectItem value="Data Integrity">🛡️ Data Integrity</SelectItem>
                <SelectItem value="Design">🏗️ Design</SelectItem>
                <SelectItem value="Advanced">🚀 Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Difficulty</label>
            <div className="grid grid-cols-3 gap-1.5">
              {difficultyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, difficulty: opt.value })}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-all duration-200 ${
                    form.difficulty === opt.value
                      ? opt.color
                      : "border-border text-muted-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Position X</label>
              <Input type="number" value={form.position_x} onChange={(e) => setForm({ ...form, position_x: Number(e.target.value) })} className="bg-secondary/60 border-border" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Position Y</label>
              <Input type="number" value={form.position_y} onChange={(e) => setForm({ ...form, position_y: Number(e.target.value) })} className="bg-secondary/60 border-border" />
            </div>
          </div>

          {/* Video URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Video URL</label>
            <Input
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
              className="bg-secondary/60 border-border"
            />
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resources</label>
            {form.resources.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-secondary/40 rounded-md px-3 py-2 border border-border/50">
                <span className="flex-1 truncate text-secondary-foreground text-xs">{r.title}</span>
                <Badge variant="outline" className="text-[10px] border-border text-muted-foreground h-5 px-1.5">{r.type}</Badge>
                <button onClick={() => removeResource(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2">
              <Input placeholder="Title" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} className="bg-secondary/60 border-border text-xs h-8" />
              <Input placeholder="URL" value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} className="bg-secondary/60 border-border text-xs h-8" />
              <Select value={newResource.type} onValueChange={(v) => setNewResource({ ...newResource, type: v as Resource["type"] })}>
                <SelectTrigger className="bg-secondary/60 border-border text-xs h-8 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="docs">Docs</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={addResource} className="h-8 w-8 p-0 border-border">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={saving || !form.title.trim()}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 font-medium"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : editingTopic ? (
              "Update Topic"
            ) : (
              "Create Topic"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
