import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

const BROWSER_ID_KEY = "sql-roadmap-browser-id";

function getBrowserId(): string {
  let id = localStorage.getItem(BROWSER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(BROWSER_ID_KEY, id);
  }
  return id;
}

interface ProgressEntry {
  node_id: string;
  roadmap_id: string | null;
}

/** Returns a map of roadmap_id -> Set<completed_node_id> for the current browser */
export function useAllProgress() {
  const [progressMap, setProgressMap] = useState<Map<string, Set<string>>>(new Map());
  const browserId = useMemo(() => getBrowserId(), []);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("node_id, roadmap_id")
        .eq("browser_id", browserId);
      if (data) {
        const map = new Map<string, Set<string>>();
        (data as ProgressEntry[]).forEach((d) => {
          const rid = d.roadmap_id || "unknown";
          if (!map.has(rid)) map.set(rid, new Set());
          map.get(rid)!.add(d.node_id);
        });
        setProgressMap(map);
      }
    };
    fetch();
  }, [browserId]);

  return progressMap;
}

/** Returns topic count per roadmap */
export function useTopicCounts() {
  const [counts, setCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("roadmap_nodes").select("roadmap_id");
      if (data) {
        const map = new Map<string, number>();
        data.forEach((d) => {
          const rid = d.roadmap_id;
          map.set(rid, (map.get(rid) || 0) + 1);
        });
        setCounts(map);
      }
    };
    fetch();
  }, []);

  return counts;
}
