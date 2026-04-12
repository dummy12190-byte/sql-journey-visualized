import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useRoadmapStore } from "@/hooks/useRoadmapStore";
import RoadmapFlow from "@/components/roadmap/RoadmapFlow";
import RoadmapHeader from "@/components/roadmap/RoadmapHeader";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const store = useRoadmapStore();

  const highlightedIds = useMemo(() => {
    return new Set(store.filteredTopics.map((t) => t.id));
  }, [store.filteredTopics]);

  if (store.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <RoadmapHeader
        searchQuery={store.searchQuery}
        onSearchChange={store.setSearchQuery}
        difficultyFilter={store.difficultyFilter}
        onDifficultyChange={store.setDifficultyFilter}
        progress={store.progress}
        completedCount={store.completedIds.size}
        totalCount={store.topics.length}
      />

      <div className="relative flex-1 roadmap-bg">
        <RoadmapFlow
          topics={store.topics}
          completedIds={store.completedIds}
          toggleCompleted={store.toggleCompleted}
          highlightedIds={highlightedIds}
        />

        <Link to="/admin" className="absolute bottom-4 right-4 z-10">
          <Button variant="outline" size="sm" className="gap-2 bg-card/90 backdrop-blur-sm border-border hover:border-primary/50 transition-colors">
            <Settings className="h-4 w-4" />
            Admin
          </Button>
        </Link>
      </div>
    </div>
  );
}
