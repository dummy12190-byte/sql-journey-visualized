import { useState, useEffect, useCallback } from "react";
import { defaultTopics, RoadmapTopic, Difficulty } from "@/data/roadmapData";

const TOPICS_KEY = "sql-roadmap-topics";
const PROGRESS_KEY = "sql-roadmap-progress";

function loadTopics(): RoadmapTopic[] {
  try {
    const stored = localStorage.getItem(TOPICS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultTopics;
}

function loadProgress(): Set<string> {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
}

export function useRoadmapStore() {
  const [topics, setTopics] = useState<RoadmapTopic[]>(loadTopics);
  const [completedIds, setCompletedIds] = useState<Set<string>>(loadProgress);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");

  useEffect(() => {
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completedIds]));
  }, [completedIds]);

  const toggleCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addTopic = useCallback((topic: RoadmapTopic) => {
    setTopics((prev) => [...prev, topic]);
  }, []);

  const updateTopic = useCallback((id: string, updates: Partial<RoadmapTopic>) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setTopics(defaultTopics);
    localStorage.removeItem(TOPICS_KEY);
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
  };
}
