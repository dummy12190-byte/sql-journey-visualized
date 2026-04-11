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

export default function RoadmapFlow({ topics, completedIds, toggleCompleted, highlightedIds }: RoadmapFlowProps) {
  const [selectedTopic, setSelectedTopic] = useState<RoadmapNodeType | null>(null);

  const topicMap = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  // Build edges from connections stored in each node
  const edgeDefinitions = useMemo(() => {
    const edges: { source: string; target: string }[] = [];
    topics.forEach((t) => {
      (t.connections || []).forEach((targetId) => {
        edges.push({ source: t.id, target: targetId });
      });
    });
    return edges;
  }, [topics]);

  const nodes: Node[] = useMemo(() => {
    return topics.map((topic) => {
      const dimmed = highlightedIds && highlightedIds.size > 0 && !highlightedIds.has(topic.id);
      return {
        id: topic.id,
        type: "roadmap",
        position: { x: topic.position_x, y: topic.position_y },
        data: {
          label: topic.title,
          difficulty: topic.difficulty,
          completed: completedIds.has(topic.id),
          onClick: () => setSelectedTopic(topic),
          onToggleComplete: () => toggleCompleted(topic.id),
        },
        style: dimmed ? { opacity: 0.25, transition: "opacity 0.2s" } : { transition: "opacity 0.2s" },
      };
    });
  }, [topics, completedIds, toggleCompleted, highlightedIds]);

  const edges: Edge[] = useMemo(() => {
    return edgeDefinitions
      .filter((e) => topicMap.has(e.source) && topicMap.has(e.target))
      .map((e, i) => ({
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        animated: completedIds.has(e.source) && !completedIds.has(e.target),
        style: {
          stroke: completedIds.has(e.source) && completedIds.has(e.target)
            ? "hsl(142 60% 50%)"
            : "hsl(225 12% 28%)",
          strokeWidth: 2,
        },
      }));
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
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(225, 12%, 16%)" />
      </ReactFlow>

      <TopicModal
        topic={selectedTopic}
        open={!!selectedTopic}
        onClose={handleClose}
        completed={selectedTopic ? completedIds.has(selectedTopic.id) : false}
        onToggleComplete={() => selectedTopic && toggleCompleted(selectedTopic.id)}
      />
    </>
  );
}
