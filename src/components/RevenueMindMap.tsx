import { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  type Edge, 
  type Node 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type Gain, CATEGORIES } from '../hooks/useGains';

interface Props {
  gains: Gain[];
}

export default function RevenueMindMap({ gains }: Props) {
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [
      {
        id: 'root',
        data: { label: '2025 Revenue' },
        position: { x: 250, y: 0 },
        style: { background: '#0f172a', color: '#fff', borderRadius: '12px', fontWeight: 'bold' }
      }
    ];

    const initialEdges: Edge[] = [];

    CATEGORIES.forEach((cat, index) => {
      const catGains = gains.filter(g => g.tag === cat.name);
      const total = catGains.reduce((sum, g) => sum + g.amount, 0);

      if (total > 0) {
        const id = `node-${cat.name}`;
        initialNodes.push({
          id,
          data: { label: `${cat.name}\n₦${total.toLocaleString()}` },
          position: { x: index * 200, y: 150 },
          style: { 
            background: cat.taxable ? '#f8fafc' : '#f0fdf4',
            border: cat.taxable ? '2px solid #e2e8f0' : '2px solid #22c55e',
            borderRadius: '12px',
            fontSize: '12px',
            width: 150,
            textAlign: 'center'
          }
        });

        initialEdges.push({
          id: `edge-${cat.name}`,
          source: 'root',
          target: id,
          animated: true,
          style: { stroke: cat.taxable ? '#cbd5e1' : '#22c55e' }
        });
      }
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [gains]);

  const onNodesChange = useCallback(() => {}, []);
  const onEdgesChange = useCallback(() => {}, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}