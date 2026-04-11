import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Difficulty, Resource, RoadmapTopic } from "@/data/roadmapData";

const BROWSER_ID_KEY = "sql-roadmap-browser-id";

function getBrowserId(): string {
  let id = localStorage.getItem(BROWSER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(BROWSER_ID_KEY, id);
  }
  return id;
}

interface DbNode {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: unknown;
  position_x: number;
  position_y: number;
  connections: string[];
  video_url: string | null;
}

function dbToTopic(row: DbNode): RoadmapTopic & { position_x: number; position_y: number; connections: string[]; video_url: string } {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty as Difficulty,
    resources: (row.resources as Resource[]) || [],
    position_x: row.position_x,
    position_y: row.position_y,
    connections: row.connections || [],
    video_url: row.video_url || "",
  };
}

export type RoadmapNode = ReturnType<typeof dbToTopic>;

export function useRoadmapStore() {
  const [topics, setTopics] = useState<RoadmapNode[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");
  const [loading, setLoading] = useState(true);
  const browserId = useMemo(() => getBrowserId(), []);

  // Real-time subscription to roadmap_nodes
  useEffect(() => {
    const fetchInitial = async () => {
      const { data } = await supabase.from("roadmap_nodes").select("*");
      if (data) setTopics(data.map((d) => dbToTopic(d as unknown as DbNode)));
      setLoading(false);
    };
    fetchInitial();

    const channel = supabase
      .channel("roadmap-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "roadmap_nodes" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const node = dbToTopic(payload.new as unknown as DbNode);
          setTopics((prev) => [...prev.filter((t) => t.id !== node.id), node]);
        } else if (payload.eventType === "UPDATE") {
          const node = dbToTopic(payload.new as unknown as DbNode);
          setTopics((prev) => prev.map((t) => (t.id === node.id ? node : t)));
        } else if (payload.eventType === "DELETE") {
          const old = payload.old as { id?: string };
          if (old.id) setTopics((prev) => prev.filter((t) => t.id !== old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load progress
  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("node_id")
        .eq("browser_id", browserId);
      if (data) setCompletedIds(new Set(data.map((d) => d.node_id)));
    };
    fetchProgress();
  }, [browserId]);

  const toggleCompleted = useCallback(
    async (id: string) => {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

      const isCompleted = completedIds.has(id);
      if (isCompleted) {
        await supabase.from("user_progress").delete().eq("node_id", id).eq("browser_id", browserId);
      } else {
        await supabase.from("user_progress").insert({ node_id: id, browser_id: browserId });
      }
    },
    [completedIds, browserId]
  );

  const addTopic = useCallback(async (topic: Partial<RoadmapNode> & { id: string; title: string }) => {
    const row = {
      id: topic.id,
      title: topic.title,
      description: topic.description || "",
      category: topic.category || "",
      difficulty: topic.difficulty || "beginner",
      resources: (topic.resources || []) as unknown as import("@/integrations/supabase/types").Json,
      position_x: topic.position_x || 0,
      position_y: topic.position_y || 0,
      connections: topic.connections || [],
      video_url: topic.video_url || "",
    };
    await supabase.from("roadmap_nodes").insert(row);
  }, []);

  const updateTopic = useCallback(async (id: string, updates: Partial<RoadmapNode>) => {
    const dbUpdates: {
      title?: string;
      description?: string;
      category?: string;
      difficulty?: string;
      resources?: import("@/integrations/supabase/types").Json;
      position_x?: number;
      position_y?: number;
      connections?: string[];
      video_url?: string;
    } = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
    if (updates.resources !== undefined) dbUpdates.resources = updates.resources as unknown as import("@/integrations/supabase/types").Json;
    if (updates.position_x !== undefined) dbUpdates.position_x = updates.position_x;
    if (updates.position_y !== undefined) dbUpdates.position_y = updates.position_y;
    if (updates.connections !== undefined) dbUpdates.connections = updates.connections;
    if (updates.video_url !== undefined) dbUpdates.video_url = updates.video_url;
    await supabase.from("roadmap_nodes").update(dbUpdates).eq("id", id);
  }, []);

  const deleteTopic = useCallback(async (id: string) => {
    await supabase.from("roadmap_nodes").delete().eq("id", id);
  }, []);

  const resetToDefaults = useCallback(async () => {
    // Delete all and re-seed
    await supabase.from("roadmap_nodes").delete().neq("id", "___never___");
    // Reload will happen via realtime
    window.location.reload();
  }, []);

  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || t.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const progress = topics.length > 0 ? Math.round((completedIds.size / topics.length) * 100) : 0;

  return {
    topics,
    filteredTopics,
    completedIds,
    searchQuery,
    setSearchQuery,
    difficultyFilter,
    setDifficultyFilter,
    toggleCompleted,
    addTopic,
    updateTopic,
    deleteTopic,
    resetToDefaults,
    progress,
    loading,
  };
}
