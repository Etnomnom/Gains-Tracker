import { useEffect, useMemo } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  ConnectionLineType,
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';

interface Gain {
  id: number;
  amount: number;
  tag: string;
}

interface RevenueMindMapProps {
  gains: Gain[];
}

const RevenueMindMap = ({ gains }: RevenueMindMapProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const initialElements = useMemo(() => {
    // Group gains by tag
    const totalsByTag = gains.reduce((acc: Record<string, number>, curr) => {
      acc[curr.tag] = (acc[curr.tag] || 0) + curr.amount;
      return acc;
    }, {});

    const centerNode = {
      id: 'root',
      type: 'input',
      data: { label: 'TOTAL REVENUE' },
      position: { x: 250, y: 0 },
      style: { 
        background: 'rgba(138, 127, 168, 0.2)', 
        color: '#fff', 
        border: '2px solid #8A7FA8',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '12px',
        width: 150,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 20px rgba(138, 127, 168, 0.3)'
      },
    };

    const tagNodes = Object.entries(totalsByTag).map(([tag, total], index) => ({
      id: tag,
      data: { label: `${tag}\n₦${total.toLocaleString()}` },
      position: { x: index * 200, y: 150 },
      style: { 
        background: 'rgba(255, 255, 255, 0.05)', 
        color: 'rgba(255, 255, 255, 0.8)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        fontSize: '10px',
        padding: '10px',
        width: 140,
        textAlign: 'center' as const,
        backdropFilter: 'blur(5px)'
      },
    }));

    const newEdges = Object.keys(totalsByTag).map((tag) => ({
      id: `e-root-${tag}`,
      source: 'root',
      target: tag,
      animated: true,
      style: { stroke: '#8A7FA8', strokeWidth: 2, opacity: 0.4 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#8A7FA8',
      },
    }));

    return { nodes: [centerNode, ...tagNodes], edges: newEdges };
  }, [gains]);

  useEffect(() => {
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);
  }, [initialElements, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        // Hiding the attribution for a cleaner UI
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
};

export default RevenueMindMap;