import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import confetti from "canvas-confetti";

import RoadmapNode from "./RoadmapNode";
import TopicModal from "./TopicModal";
import { type RoadmapNode as RoadmapNodeType } from "@/hooks/useRoadmapStore";

const nodeTypes = { roadmap: RoadmapNode };

interface RoadmapFlowProps {
  topics: RoadmapNodeType[];
  completedIds: Set<string>;
  toggleCompleted: (id: string) => void;
  highlightedIds?: Set<string>;
}

function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#22c55e", "#4ade80", "#86efac", "#fbbf24", "#60a5fa"],
    ticks: 120,
    gravity: 1.2,
    scalar: 0.9,
  });
}

export default function RoadmapFlow({ topics, completedIds, toggleCompleted, highlightedIds }: RoadmapFlowProps) {
  const [selectedTopic, setSelectedTopic] = useState<RoadmapNodeType | null>(null);

  const topicMap = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  // Find "next recommended" node: first incomplete node that has all prerequisites completed
  const nextNodeId = useMemo(() => {
    for (const t of topics) {
      if (completedIds.has(t.id)) continue;
      // Check if any node connects TO this one
      const prereqs = topics.filter((p) => p.connections.includes(t.id));
      const allPrereqsDone = prereqs.every((p) => completedIds.has(p.id));
      if (allPrereqsDone) return t.id;
    }
    return null;
  }, [topics, completedIds]);

  const handleToggle = useCallback((id: string) => {
    const wasCompleted = completedIds.has(id);
    toggleCompleted(id);
    if (!wasCompleted) {
      fireConfetti();
    }
  }, [completedIds, toggleCompleted]);

  const edgeDefinitions = useMemo(() => {
    const edges: { source: string; target: string }[] = [];
    topics.forEach((t) => {
      (t.connections || []).forEach((targetId) => {
        edges.push({ source: t.id, target: targetId });
      });
    });
    return edges;
  }, [topics]);

  // Sort topics by position for stagger index
  const sortedTopicIds = useMemo(() => {
    return [...topics].sort((a, b) => a.position_y - b.position_y || a.position_x - b.position_x).map(t => t.id);
  }, [topics]);

  const nodes: Node[] = useMemo(() => {
    return topics.map((topic) => {
      const dimmed = highlightedIds && highlightedIds.size > 0 && !highlightedIds.has(topic.id);
      const staggerIndex = sortedTopicIds.indexOf(topic.id);
      return {
        id: topic.id,
        type: "roadmap",
        position: { x: topic.position_x, y: topic.position_y },
        data: {
          label: topic.title,
          difficulty: topic.difficulty,
          completed: completedIds.has(topic.id),
          isNext: topic.id === nextNodeId,
          onClick: () => setSelectedTopic(topic),
          onToggleComplete: () => handleToggle(topic.id),
          staggerIndex,
        },
        style: dimmed
          ? { opacity: 0.15, transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)" }
          : { opacity: 1, transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)" },
      };
    });
  }, [topics, completedIds, handleToggle, highlightedIds, nextNodeId, sortedTopicIds]);

  const edges: Edge[] = useMemo(() => {
    return edgeDefinitions
      .filter((e) => topicMap.has(e.source) && topicMap.has(e.target))
      .map((e, i) => {
        const bothDone = completedIds.has(e.source) && completedIds.has(e.target);
        const sourceOnly = completedIds.has(e.source) && !completedIds.has(e.target);
        return {
          id: `e-${i}`,
          source: e.source,
          target: e.target,
          type: "smoothstep",
          animated: sourceOnly,
          style: {
            stroke: bothDone
              ? "hsl(142 60% 50%)"
              : sourceOnly
                ? "hsl(142 60% 50% / 0.5)"
                : "hsl(225 12% 28%)",
            strokeWidth: bothDone ? 2.5 : 2,
            strokeDasharray: !bothDone && !sourceOnly ? "6 4" : undefined,
          },
          className: !bothDone && !sourceOnly ? "edge-marching" : "",
        };
      });
  }, [edgeDefinitions, topicMap, completedIds]);

  const handleClose = useCallback(() => setSelectedTopic(null), []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="!bg-background"
      >
        <Controls className="!bg-secondary !border-border !shadow-lg" />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(n) => (completedIds.has(n.id) ? "hsl(142, 60%, 50%)" : "hsl(225, 14%, 20%)")}
          maskColor="hsl(225, 15%, 8%, 0.8)"
          className="!rounded-lg !border-border"
          pannable
          zoomable
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(225, 12%, 16%)" />
      </ReactFlow>

      <TopicModal
        topic={selectedTopic}
        open={!!selectedTopic}
        onClose={handleClose}
        completed={selectedTopic ? completedIds.has(selectedTopic.id) : false}
        onToggleComplete={() => {
          if (selectedTopic) handleToggle(selectedTopic.id);
        }}
      />
    </>
  );
}
