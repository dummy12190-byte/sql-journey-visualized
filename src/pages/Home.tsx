import { useState } from "react";
import { Link } from "react-router-dom";
import { useRoadmaps } from "@/hooks/useRoadmaps";
import { useAllProgress, useTopicCounts } from "@/hooks/useRoadmapProgress";
import { Search, ArrowRight, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { roadmaps, loading } = useRoadmaps();
  const progressMap = useAllProgress();
  const topicCounts = useTopicCounts();
  const [search, setSearch] = useState("");

  const published = roadmaps.filter((r) => r.status === "published");
  const filtered = published.filter(
    (r) =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-display text-foreground">
            Your Learning <span className="text-primary">Roadmaps</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Pick a path. Master it step by step.
          </p>

          {/* Search */}
          <div className="relative max-w-sm mx-auto mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roadmaps..."
              className="pl-9 bg-secondary/60 border-border focus:border-primary/50 h-10"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <p className="text-foreground font-medium">No roadmaps yet</p>
            <p className="text-muted-foreground text-sm">
              Add one from the{" "}
              <Link to="/admin" className="text-primary hover:underline">
                Admin Panel
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((roadmap, i) => {
              const total = topicCounts.get(roadmap.id) || 0;
              const completed = progressMap.get(roadmap.id)?.size || 0;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              const hasStarted = completed > 0;

              return (
                <Link
                  key={roadmap.id}
                  to={`/roadmap/${roadmap.id}`}
                  className="stagger-fade group block rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-muted-foreground/30"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    borderTopColor: roadmap.accent_color,
                    borderTopWidth: "3px",
                  }}
                >
                  <div className="p-5 space-y-4">
                    {/* Icon + Title */}
                    <div className="flex items-start gap-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {roadmap.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-foreground text-base">{roadmap.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {roadmap.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {completed}/{total} topics
                        </span>
                        <span className="text-muted-foreground font-mono">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {total} topics
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-xs h-7 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        {hasStarted ? "Continue" : "Start"}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
