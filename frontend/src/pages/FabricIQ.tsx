import React, { useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Layers, Network, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const FabricIQ: React.FC = () => {
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState<any>(null);

  useEffect(() => {
    api.get('/fabric-iq/semantic-graph')
      .then(res => setGraphData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Fabric IQ Ontology...</div>;

  return (
    <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6">
      <header className="flex justify-between items-end mb-4 px-4">
         <div>
            <h1 className="text-5xl font-black tracking-tighter text-glow">Fabric IQ</h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] description mt-2">Semantic Knowledge & Skill Graph</p>
         </div>
      </header>

      <div className="flex-1 os-glass rounded-[3rem] relative overflow-hidden flex flex-col shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
         <div className="absolute top-8 left-8 z-10">
            <div className="flex items-center gap-3 px-6 py-2 os-glass opacity-80 backdrop-blur-md rounded-full border border-white/10">
               <Network className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest">Global Ontology Viewer</span>
            </div>
         </div>
         
         <div className="absolute top-8 right-8 z-10 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
               <div className="w-3 h-3 bg-secondary rounded-full" /> Certifications
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
               <div className="w-3 h-3 bg-primary rounded-full" /> Core Skills
            </div>
         </div>

         <ForceGraph2D
            graphData={graphData}
            backgroundColor="rgba(0,0,0,0)"
            nodeLabel="name"
            nodeRelSize={6}
            nodeVal={d => (d as any).val}
            nodeColor={d => {
              const type = (d as any).type;
              if (type === 'root') return '#ff007a';
              if (type === 'cert') return '#7000ff';
              return '#00f2ff';
            }}
            linkColor={() => 'rgba(255,255,255,0.1)'}
            linkWidth={d => (d as any).value || 1}
            linkDirectionalParticles={3}
            linkDirectionalParticleSpeed={0.01}
            width={1600}
            height={900}
            onNodeClick={node => setActiveNode(node)}
         />

         <AnimatePresence>
            {activeNode && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="absolute bottom-8 left-8 p-8 os-window rounded-[2.5rem] flex flex-col gap-2 shadow-2xl min-w-[300px]"
               >
                  <div className="flex justify-between items-start mb-2">
                     <Layers className="w-6 h-6 text-primary" />
                     <button onClick={() => setActiveNode(null)} className="text-white/30 hover:text-white transition-colors">
                        <Command className="w-5 h-5 rotate-45" />
                     </button>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-glow">{activeNode.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Node Type: {activeNode.type}</p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                     <span className="text-[10px] font-black uppercase description">Weight: {activeNode.val}</span>
                     <span className="text-[10px] font-black uppercase text-secondary cursor-pointer hover:underline">View Dependencies</span>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default FabricIQ;
