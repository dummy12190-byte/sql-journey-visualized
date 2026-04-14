import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRoadmapStore, type RoadmapNode } from "@/hooks/useRoadmapStore";
import { useRoadmaps, type Roadmap } from "@/hooks/useRoadmaps";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSearchFilter from "@/components/admin/AdminSearchFilter";
import AdminTopicCard from "@/components/admin/AdminTopicCard";
import AdminTopicDrawer from "@/components/admin/AdminTopicDrawer";
import AdminRoadmapList from "@/components/admin/AdminRoadmapList";
import AdminRoadmapDrawer from "@/components/admin/AdminRoadmapDrawer";
import Navbar from "@/components/Navbar";
import { BookOpen, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const { roadmapId } = useParams<{ roadmapId?: string }>();
  const { roadmaps, addRoadmap, updateRoadmap, deleteRoadmap, loading: roadmapsLoading } = useRoadmaps();
  const store = useRoadmapStore(roadmapId);

  const [topicDrawerOpen, setTopicDrawerOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<RoadmapNode | null>(null);
  const [roadmapDrawerOpen, setRoadmapDrawerOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);

  const currentRoadmap = roadmaps.find((r) => r.id === roadmapId);

  const openCreateTopic = () => { setEditingTopic(null); setTopicDrawerOpen(true); };
  const openEditTopic = (topic: RoadmapNode) => { setEditingTopic(topic); setTopicDrawerOpen(true); };

  const openCreateRoadmap = () => { setEditingRoadmap(null); setRoadmapDrawerOpen(true); };
  const openEditRoadmap = (r: Roadmap) => { setEditingRoadmap(r); setRoadmapDrawerOpen(true); };

  const handleSaveTopic = async (form: any, editingId: string | null) => {
    try {
      if (editingId) {
        await store.updateTopic(editingId, form);
        toast.success("✏️ Topic updated");
      } else {
        const baseId = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const existingIds = new Set(store.topics.map((t) => t.id));
        let id = baseId;
        let counter = 1;
        while (existingIds.has(id)) { id = `${baseId}-${counter++}`; }
        await store.addTopic({ ...form, id });
        toast.success("✅ Topic added");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save topic");
    }
  };

  const handleDeleteTopic = async (id: string) => {
    try {
      await store.deleteTopic(id);
      toast.success("🗑️ Topic deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete topic");
    }
  };

  const handleSaveRoadmap = async (form: Partial<Roadmap> & { name: string }, editingId: string | null) => {
    try {
      if (editingId) {
        await updateRoadmap(editingId, form);
        toast.success("✏️ Roadmap updated");
      } else {
        await addRoadmap(form);
        toast.success("✅ Roadmap created");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save roadmap");
    }
  };

  const handleDeleteRoadmap = async (id: string) => {
    try {
      await deleteRoadmap(id);
      toast.success("🗑️ Roadmap deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete roadmap");
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "n" && !topicDrawerOpen && !roadmapDrawerOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        if (roadmapId) openCreateTopic();
        else openCreateRoadmap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [topicDrawerOpen, roadmapDrawerOpen, roadmapId]);

  // If no roadmapId, show roadmap list
  if (!roadmapId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-primary/40" />
              <h1 className="text-lg font-display text-foreground">Admin Panel — Roadmaps</h1>
            </div>
            <Button
              size="sm"
              onClick={openCreateRoadmap}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-105"
            >
              + New Roadmap
            </Button>
          </div>

          <AdminRoadmapList
            roadmaps={roadmaps}
            loading={roadmapsLoading}
            onEdit={openEditRoadmap}
            onDelete={handleDeleteRoadmap}
          />
        </div>

        <AdminRoadmapDrawer
          open={roadmapDrawerOpen}
          onOpenChange={setRoadmapDrawerOpen}
          editingRoadmap={editingRoadmap}
          onSave={handleSaveRoadmap}
        />

        <div className="fixed bottom-4 right-4 text-[10px] text-muted-foreground/50 font-mono hidden md:block">
          Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">N</kbd> to add roadmap
        </div>
      </div>
    );
  }

  // Scoped topic management for a specific roadmap
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">
            {currentRoadmap?.icon} {currentRoadmap?.name || "Roadmap"} Topics
          </span>
        </div>
      </div>

      <AdminHeader
        topics={store.topics}
        onAddTopic={openCreateTopic}
        onReset={store.resetToDefaults}
        roadmapName={currentRoadmap?.name}
      />

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
            <Button onClick={openCreateTopic} size="sm" className="bg-gradient-to-r from-primary to-primary/80">
              Add Topic
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {store.filteredTopics.map((topic, i) => (
              <div key={topic.id} className="stagger-fade" style={{ animationDelay: `${i * 60}ms` }}>
                <AdminTopicCard topic={topic} index={i} onEdit={openEditTopic} onDelete={handleDeleteTopic} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminTopicDrawer
        open={topicDrawerOpen}
        onOpenChange={setTopicDrawerOpen}
        editingTopic={editingTopic}
        topics={store.topics}
        onSave={handleSaveTopic}
      />

      <div className="fixed bottom-4 right-4 text-[10px] text-muted-foreground/50 font-mono hidden md:block">
        Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">N</kbd> to add topic
      </div>
    </div>
  );
}
