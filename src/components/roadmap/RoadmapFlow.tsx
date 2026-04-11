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
import { RoadmapTopic, nodePositions, edgeDefinitions } from "@/data/roadmapData";

const nodeTypes = { roadmap: RoadmapNode };

interface RoadmapFlowProps {
  topics: RoadmapTopic[];
  completedIds: Set<string>;
  toggleCompleted: (id: string) => void;
  highlightedIds?: Set<string>;
}

export default function RoadmapFlow({ topics, completedIds, toggleCompleted, highlightedIds }: RoadmapFlowProps) {
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);

  const topicMap = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  const nodes: Node[] = useMemo(() => {
    return nodePositions
      .filter((pos) => topicMap.has(pos.id))
      .map((pos) => {
        const topic = topicMap.get(pos.id)!;
        const dimmed = highlightedIds && highlightedIds.size > 0 && !highlightedIds.has(pos.id);
        return {
          id: pos.id,
          type: "roadmap",
          position: { x: pos.x, y: pos.y },
          data: {
            label: topic.title,
            difficulty: topic.difficulty,
            completed: completedIds.has(pos.id),
            onClick: () => setSelectedTopic(topic),
            onToggleComplete: () => toggleCompleted(pos.id),
          },
          style: dimmed ? { opacity: 0.25, transition: "opacity 0.2s" } : { transition: "opacity 0.2s" },
        };
      });
  }, [topicMap, completedIds, toggleCompleted, highlightedIds]);

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
  }, [topicMap, completedIds]);

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
