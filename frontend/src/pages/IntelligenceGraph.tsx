import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Search, Filter, Info, Server, Activity, Users, Award, 
  Target, ShieldAlert, Cpu, ZoomIn, ZoomOut, Maximize, Database,
  LayoutDashboard, Zap, ShieldCheck, ChevronRight, RefreshCcw
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import api from '../lib/api';
import { cn } from '../lib/utils';
import { ErrorBoundary } from '../components/ErrorBoundary';

// --- Types ---
interface GraphNode {
  id: string;
  name: string;
  type: 'employee' | 'skill' | 'cert' | 'assessment' | 'readiness';
  val: number;
  details?: Record<string, any>;
}

interface GraphLink {
  source: string;
  target: string;
  relation: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// --- Configuration ---
const NODE_COLORS: Record<string, string> = {
  employee: '#3b82f6',   // Blue
  skill: '#a855f7',      // Purple
  cert: '#00E5FF',       // Cyan (Primary)
  assessment: '#eab308', // Yellow
  readiness: '#10b981',  // Emerald
};

const NODE_ICONS: Record<string, any> = {
  employee: Users,
  skill: Zap,
  cert: Award,
  assessment: ShieldAlert,
  readiness: Target,
};

const IntelligenceGraph: React.FC = () => {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // UI State
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(Object.keys(NODE_COLORS));
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const fetchGraphData = useCallback(async () => {
    try {
      const response = await api.get('/command-center/graph-data');
      setData(response.data);
      setError(false);
    } catch (err) {
      console.error("Graph fetch failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
    const interval = setInterval(fetchGraphData, 30000);
    return () => clearInterval(interval);
  }, [fetchGraphData]);

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    let nodes = data.nodes.filter(n => activeFilters.includes(n.type));
    
    if (search.trim()) {
       const term = search.toLowerCase();
       nodes = nodes.filter(n => 
          n.name.toLowerCase().includes(term) || 
          n.type.toLowerCase().includes(term)
       );
    }
    
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = data.links.filter(l => 
       nodeIds.has((l.source as any).id || l.source) && 
       nodeIds.has((l.target as any).id || l.target)
    );
    
    return { nodes, links };
  }, [data, search, activeFilters]);

  // D3 Canvas Rendering for Nodes
  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoverNode?.id === node.id;
    const radius = node.val / 2;
    
    // Draw Shadow / Glow
    if (isSelected || isHovered) {
       ctx.shadowBlur = 15;
       ctx.shadowColor = NODE_COLORS[node.type];
    }

    // Draw Main Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = NODE_COLORS[node.type];
    ctx.fill();

    // Reset Shadow
    ctx.shadowBlur = 0;

    // Draw Border for selection
    if (isSelected) {
       ctx.strokeStyle = '#fff';
       ctx.lineWidth = 2 / globalScale;
       ctx.stroke();
    }

    // Draw Label if zoomed in or hovered
    if (globalScale > 1.2 || isHovered || isSelected) {
       const label = node.name;
       const fontSize = Math.max(10 / globalScale, 4);
       ctx.font = `${isSelected ? '900' : '600'} ${fontSize}px Inter, sans-serif`;
       ctx.textAlign = 'center';
       ctx.textBaseline = 'top';
       
       // Text Background
       const textWidth = ctx.measureText(label).width;
       ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
       ctx.fillRect(node.x - (textWidth/2) - 2, node.y + radius + 2, textWidth + 4, fontSize + 4);
       
       // Text
       ctx.fillStyle = '#fff';
       ctx.fillText(label, node.x, node.y + radius + 4);
    }
  }, [selectedNode, hoverNode]);

  // Controls
  const toggleFilter = (type: string) => {
     setActiveFilters(prev => 
       prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
     );
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden text-white font-sans relative z-10">
      
      {/* Graph Area */}
      <div className="flex-1 relative" ref={containerRef}>
         {/* Title Overlay */}
         <div className="absolute top-8 left-8 z-20 pointer-events-none space-y-2">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl azure-gradient flex items-center justify-center shadow-glow">
                  <Network className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Enterprise Graph</h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-1">Multi-Domain Intelligence</p>
               </div>
            </div>
         </div>

         {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/20 backdrop-blur-sm">
               <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-glow" />
               <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Synthesizing Neural Topology...</p>
            </div>
         ) : dimensions.width > 0 && (
            <ErrorBoundary>
              <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={filteredData}
                nodeCanvasObject={drawNode}
                onNodeClick={(node) => {
                   setSelectedNode(node as any);
                   graphRef.current?.centerAt(node.x, node.y, 800);
                   graphRef.current?.zoom(2.5, 800);
                }}
                onNodeHover={(node) => setHoverNode(node as any)}
                linkColor={() => 'rgba(255,255,255,0.06)'}
                linkWidth={1.5}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.004}
                backgroundColor="transparent"
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.2}
              />
            </ErrorBoundary>
         )}

         {/* Navigation Controls */}
         <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-3">
            <button 
               onClick={() => graphRef.current?.zoom(graphRef.current.zoom() * 1.5, 400)}
               className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-xl group"
            >
               <ZoomIn className="w-5 h-5 text-white/40 group-hover:text-primary" />
            </button>
            <button 
               onClick={() => graphRef.current?.zoomToFit(600)}
               className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-xl group"
            >
               <Maximize className="w-5 h-5 text-white/40 group-hover:text-primary" />
            </button>
            <button 
               onClick={() => graphRef.current?.zoom(graphRef.current.zoom() / 1.5, 400)}
               className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-xl group"
            >
               <ZoomOut className="w-5 h-5 text-white/40 group-hover:text-primary" />
            </button>
         </div>
      </div>

      {/* Control Sidebar */}
      <div className="w-[420px] bg-black/40 border-l border-white/5 backdrop-blur-3xl flex flex-col relative z-30 shadow-2xl">
         
         {/* Search & Filter Header */}
         <div className="p-8 space-y-8 border-b border-white/5">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search registry nodes..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:border-primary/40 focus:bg-white/10 transition-all placeholder:text-white/10"
               />
            </div>
            
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Domain Filters</span>
                  <Filter className="w-4 h-4 text-white/20" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                  {Object.entries(NODE_COLORS).map(([type, color]) => (
                     <button 
                       key={type}
                       onClick={() => toggleFilter(type)}
                       className={cn(
                          "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-3 transition-all",
                          activeFilters.includes(type) 
                            ? "bg-white/10 border-white/20 text-white shadow-inner" 
                            : "bg-transparent border-white/5 text-white/20 hover:border-white/10 hover:text-white/40"
                       )}
                     >
                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                        {type}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Telemetry Detail Panel */}
         <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <AnimatePresence mode="wait">
               {selectedNode ? (
                 <motion.div 
                   key={selectedNode.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-10"
                 >
                    <div className="flex items-start gap-6">
                       <div 
                         className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl border border-white/5"
                         style={{ backgroundColor: NODE_COLORS[selectedNode.type] + '15', color: NODE_COLORS[selectedNode.type] }}
                       >
                          {React.createElement(NODE_ICONS[selectedNode.type] || Info, { className: "w-8 h-8" })}
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-2xl font-black tracking-tight text-white">{selectedNode.name}</h2>
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: NODE_COLORS[selectedNode.type] }} />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{selectedNode.type} Node</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-3 flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" /> Node Telemetry
                       </h3>
                       
                       <div className="grid grid-cols-1 gap-4">
                          {selectedNode.details && Object.entries(selectedNode.details).map(([key, val]) => (
                             <div key={key} className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-primary transition-colors">{key}</span>
                                <p className="text-sm font-bold text-white/90 mt-1 uppercase tracking-tight">{String(val)}</p>
                             </div>
                          ))}
                          
                          {/* Special Actions per node type */}
                          <div className="pt-6">
                             <button className="w-full py-5 azure-gradient rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95">
                                <Zap className="w-4 h-4 fill-white" /> Execute Focus Cycle
                             </button>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                       <Network className="w-10 h-10 text-white/40 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Neural Pulse Inactive</p>
                       <p className="text-[10px] font-medium text-white/40 italic">Select a network node to initialize telemetry stream.</p>
                    </div>
                 </div>
               )}
            </AnimatePresence>
         </div>

         {/* Bottom Action */}
         <div className="p-8 border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 px-2">
               <span>Registry Mesh</span>
               <span className="text-primary animate-pulse">Sync Active</span>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
               <RefreshCcw className="w-4 h-4" /> Re-map Global Ontology
            </button>
         </div>
      </div>
    </div>
  );
};

export default IntelligenceGraph;
