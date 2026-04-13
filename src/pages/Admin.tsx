import { useState, useEffect, useCallback } from "react";
import { useRoadmapStore, type RoadmapNode } from "@/hooks/useRoadmapStore";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSearchFilter from "@/components/admin/AdminSearchFilter";
import AdminTopicCard from "@/components/admin/AdminTopicCard";
import AdminTopicDrawer from "@/components/admin/AdminTopicDrawer";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const store = useRoadmapStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<RoadmapNode | null>(null);

  const openCreate = () => {
    setEditingTopic(null);
    setDrawerOpen(true);
  };

  const openEdit = (topic: RoadmapNode) => {
    setEditingTopic(topic);
    setDrawerOpen(true);
  };

  const handleSave = async (form: any, editingId: string | null) => {
    try {
      if (editingId) {
        await store.updateTopic(editingId, form);
        toast.success("Topic updated");
      } else {
        const baseId = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const existingIds = new Set(store.topics.map((t) => t.id));
        let id = baseId;
        let counter = 1;
        while (existingIds.has(id)) {
          id = `${baseId}-${counter++}`;
        }
        await store.addTopic({ ...form, id });
        toast.success("Topic added");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save topic");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await store.deleteTopic(id);
      toast.success("Topic deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete topic");
    }
  };

  // Keyboard shortcut: N to open drawer, Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "n" && !drawerOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        openCreate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader topics={store.topics} onAddTopic={openCreate} onReset={store.resetToDefaults} />

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
        <AdminSearchFilter
          searchQuery={store.searchQuery}
          onSearchChange={store.setSearchQuery}
          difficultyFilter={store.difficultyFilter}
          onFilterChange={store.setDifficultyFilter}
        />

        {store.loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : store.filteredTopics.length === 0 && store.topics.length > 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-4xl">🔍</div>
            <p className="text-muted-foreground text-sm">No topics match your search or filter.</p>
            <Button variant="outline" size="sm" onClick={() => { store.setSearchQuery(""); store.setDifficultyFilter("all"); }}>
              Clear filters
            </Button>
          </div>
        ) : store.topics.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium">No topics yet</p>
              <p className="text-muted-foreground text-sm mt-1">Add your first topic to get started</p>
            </div>
            <Button onClick={openCreate} size="sm" className="bg-gradient-to-r from-primary to-primary/80">
              Add Topic
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {store.filteredTopics.map((topic, i) => (
              <div
                key={topic.id}
                className="stagger-fade"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <AdminTopicCard
                  topic={topic}
                  index={i}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminTopicDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        editingTopic={editingTopic}
        topics={store.topics}
        onSave={handleSave}
      />

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 text-[10px] text-muted-foreground/50 font-mono hidden md:block">
        Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">N</kbd> to add topic
      </div>
    </div>
  );
}
