import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent_color: string;
  status: string;
  estimated_time: number;
  created_at: string;
  updated_at: string;
}

export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("roadmaps").select("*").order("created_at");
      if (data) setRoadmaps(data as Roadmap[]);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel("roadmaps-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "roadmaps" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const r = payload.new as Roadmap;
          setRoadmaps((prev) => [...prev.filter((x) => x.id !== r.id), r]);
        } else if (payload.eventType === "UPDATE") {
          const r = payload.new as Roadmap;
          setRoadmaps((prev) => prev.map((x) => (x.id === r.id ? r : x)));
        } else if (payload.eventType === "DELETE") {
          const old = payload.old as { id?: string };
          if (old.id) setRoadmaps((prev) => prev.filter((x) => x.id !== old.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addRoadmap = useCallback(async (r: Partial<Roadmap> & { name: string }) => {
    const { error } = await supabase.from("roadmaps").insert({
      name: r.name,
      description: r.description || "",
      icon: r.icon || "📚",
      accent_color: r.accent_color || "#22c55e",
      status: r.status || "published",
      estimated_time: r.estimated_time || 0,
    });
    if (error) throw error;
  }, []);

  const updateRoadmap = useCallback(async (id: string, updates: Partial<Roadmap>) => {
    const { error } = await supabase.from("roadmaps").update(updates).eq("id", id);
    if (error) throw error;
  }, []);

  const deleteRoadmap = useCallback(async (id: string) => {
    const { error } = await supabase.from("roadmaps").delete().eq("id", id);
    if (error) throw error;
  }, []);

  return { roadmaps, loading, addRoadmap, updateRoadmap, deleteRoadmap };
}
