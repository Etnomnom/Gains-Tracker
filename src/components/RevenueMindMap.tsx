import { ReactFlow, Background, Controls } from '@xyflow/react';
import type { Edge, Node } from '@xyflow/react'; // Added 'type' here
import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';
import { CATEGORIES } from '../hooks/useGains';
import type { Gain } from '../hooks/useGains'; // Added 'type' here

export default function RevenueMindMap({ gains }: { gains: Gain[] }) {
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [
      {
        id: 'root',
        type: 'input',
        data: { label: '2025 Revenue Hub' },
        position: { x: 250, y: 0 },
        style: { background: '#0f172a', color: '#fff', borderRadius: '12px', padding: '10px', fontWeight: 'bold' },
      },
    ];

    const initialEdges: Edge[] = [];

    CATEGORIES.forEach((cat, index) => {
      const catGains = gains.filter(g => g.tag === cat.name);
      const total = catGains.reduce((sum, g) => sum + g.amount, 0);

      if (total > 0) {
        const id = `node-${index}`;
        initialNodes.push({
          id,
          data: { label: `${cat.name}\n₦${total.toLocaleString()}` },
          position: { x: index * 200 - (CATEGORIES.length * 50), y: 150 },
          style: { 
            background: cat.taxable ? '#eff6ff' : '#f0fdf4', 
            border: `2px solid ${cat.taxable ? '#3b82f6' : '#22c55e'}`,
            borderRadius: '10px',
            fontSize: '12px',
            textAlign: 'center',
            width: 150
          },
        });

        initialEdges.push({
          id: `e-root-${id}`,
          source: 'root',
          target: id,
          animated: cat.taxable,
          style: { stroke: cat.taxable ? '#3b82f6' : '#22c55e' }
        });
      }
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [gains]);

  return (
    <div className="h-[400px] w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#f1f5f9" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}