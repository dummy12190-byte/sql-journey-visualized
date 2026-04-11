import { useState } from "react";
import { Link } from "react-router-dom";
import { useRoadmapStore, type RoadmapNode } from "@/hooks/useRoadmapStore";
import { Resource, Difficulty } from "@/data/roadmapData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, Trash2, RotateCcw, X, Database } from "lucide-react";

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

export default function Admin() {
  const store = useRoadmapStore();
  const [editingTopic, setEditingTopic] = useState<RoadmapNode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<TopicForm>(emptyForm);
  const [newResource, setNewResource] = useState<Resource>({ title: "", url: "", type: "article" });

  const openCreate = () => {
    // Auto-calculate Y position below last node
    const maxY = store.topics.reduce((max, t) => Math.max(max, t.position_y), 0);
    setForm({ ...emptyForm, position_y: maxY + 140 });
    setEditingTopic(null);
    setIsCreating(true);
  };

  const openEdit = (topic: RoadmapNode) => {
    setForm({
      title: topic.title,
      description: topic.description,
      category: topic.category,
      difficulty: topic.difficulty,
      resources: [...topic.resources],
      position_x: topic.position_x,
      position_y: topic.position_y,
      connections: [...topic.connections],
      video_url: topic.video_url,
    });
    setEditingTopic(topic);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (editingTopic) {
      await store.updateTopic(editingTopic.id, form);
    } else {
      const id = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await store.addTopic({ ...form, id });
    }
    setIsCreating(false);
    setEditingTopic(null);
  };

  const addResource = () => {
    if (!newResource.title || !newResource.url) return;
    setForm((prev) => ({ ...prev, resources: [...prev.resources, { ...newResource }] }));
    setNewResource({ title: "", url: "", type: "article" });
  };

  const removeResource = (i: number) => {
    setForm((prev) => ({ ...prev, resources: prev.resources.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3 md:px-6">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-display text-foreground">Admin Panel</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={store.resetToDefaults} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" onClick={openCreate} className="gap-2">
              <Plus className="h-3.5 w-3.5" /> Add Topic
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-3">
        {store.loading ? (
          <p className="text-muted-foreground text-center py-12">Loading topics...</p>
        ) : store.topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No topics yet. Add one!</p>
        ) : (
          store.topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 animate-fade-in"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-foreground">{topic.title}</h3>
                  <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                    {topic.category}
                  </Badge>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      topic.difficulty === "beginner"
                        ? "bg-primary/15 text-primary border-primary/30"
                        : topic.difficulty === "intermediate"
                        ? "bg-accent/15 text-accent border-accent/30"
                        : "bg-destructive/15 text-destructive border-destructive/30"
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">{topic.description}</p>
              </div>
              <div className="flex gap-1 ml-3 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(topic)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => store.deleteTopic(topic.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editingTopic ? "Edit Topic" : "Add Topic"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-secondary border-border" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Difficulty</label>
                <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as Difficulty })}>
                  <SelectTrigger className="mt-1 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Position X</label>
                <Input type="number" value={form.position_x} onChange={(e) => setForm({ ...form, position_x: Number(e.target.value) })} className="mt-1 bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Position Y</label>
                <Input type="number" value={form.position_y} onChange={(e) => setForm({ ...form, position_y: Number(e.target.value) })} className="mt-1 bg-secondary border-border" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Video URL (YouTube / OneDrive embed)</label>
              <Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://www.youtube.com/embed/..." className="mt-1 bg-secondary border-border" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Resources</label>
              <div className="space-y-2 mt-2">
                {form.resources.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-secondary/50 rounded-md px-3 py-2 border border-border">
                    <span className="flex-1 truncate text-secondary-foreground">{r.title}</span>
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{r.type}</Badge>
                    <button onClick={() => removeResource(i)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-[1fr_1fr_auto_auto] gap-2">
                <Input placeholder="Title" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} className="bg-secondary border-border text-sm h-8" />
                <Input placeholder="URL" value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} className="bg-secondary border-border text-sm h-8" />
                <Select value={newResource.type} onValueChange={(v) => setNewResource({ ...newResource, type: v as Resource["type"] })}>
                  <SelectTrigger className="bg-secondary border-border text-sm h-8 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="docs">Docs</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={addResource} className="h-8">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              {editingTopic ? "Update Topic" : "Create Topic"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
