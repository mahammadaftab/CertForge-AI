import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Search, Filter, Info, Server, Activity, Users, Award, 
  Target, ShieldAlert, Cpu, ZoomIn, ZoomOut, Maximize, Database
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { dashboardService } from '../lib/dashboardService';
import type { GraphData, GraphNode } from '../lib/dashboardService';
import { agentService } from '../lib/agentService';
import type { AgentExecutionLog } from '../lib/agentService';
import { cn } from '../lib/utils';
import { ErrorBoundary } from '../components/ErrorBoundary';

const NODE_COLORS: Record<string, string> = {
  team: '#f43f5e',       // Rose
  employee: '#3b82f6',   // Blue
  skill: '#a855f7',      // Purple
  cert: '#ec4899',       // Pink
  assessment: '#eab308', // Yellow
  readiness: '#10b981',  // Emerald
};

const NODE_ICONS: Record<string, any> = {
  team: Users,
  employee: Target,
  skill: Activity,
  cert: Award,
  assessment: ShieldAlert,
  readiness: Network,
};

const IntelligenceGraph: React.FC = () => {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [filteredData, setFilteredData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // UI State
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(Object.keys(NODE_COLORS));
  const [selectedNode, setSelectedNode] = useState<GraphNode & { details?: any } | null>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [feed, setFeed] = useState<AgentExecutionLog[]>([]);

  const fetchGraphData = useCallback(async () => {
    try {
      const result = await dashboardService.getGraphData();
      setData(result);
      setFilteredData(result);
      setError(false);
    } catch (err) {
      console.error("Graph fetch failed", err);
      setError(true);
      // Fallback synthetic data
      const mockNodes = [
         { id: '1', name: 'Cloud Ops', type: 'team', val: 25 },
         { id: '2', name: 'John Doe', type: 'employee', val: 15 },
         { id: '3', name: 'Azure Architect', type: 'cert', val: 20 },
      ];
      const mockLinks = [
         { source: '2', target: '1', relation: 'member' },
         { source: '2', target: '3', relation: 'studying' }
      ];
      setData({ nodes: mockNodes, links: mockLinks });
      setFilteredData({ nodes: mockNodes, links: mockLinks });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAgentFeed = useCallback(async () => {
    try {
      const logs = await agentService.getLiveFeed();
      setFeed(logs);
    } catch(err) {
      // Ignore
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
    fetchAgentFeed();
    const interval = setInterval(() => {
       fetchGraphData();
       fetchAgentFeed();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchGraphData, fetchAgentFeed]);

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

  // Filter Logic
  useEffect(() => {
    if (!data.nodes.length) return;
    
    let nodes = data.nodes.filter(n => activeFilters.includes(n.type));
    
    if (search.trim()) {
       const term = search.toLowerCase();
       nodes = nodes.filter(n => n.name.toLowerCase().includes(term) || n.type.toLowerCase().includes(term));
    }
    
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = data.links.filter(l => nodeIds.has((l.source as any).id || l.source) && nodeIds.has((l.target as any).id || l.target));
    
    setFilteredData({ nodes, links });
  }, [data, search, activeFilters]);

  // Node Canvas Rendering
  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = Math.max(12 / globalScale, 4);
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoverNode?.id === node.id;
    
    // Draw Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = NODE_COLORS[node.type] || '#fff';
    
    if (isSelected || isHovered) {
       ctx.shadowBlur = 20;
       ctx.shadowColor = ctx.fillStyle;
       ctx.lineWidth = 2 / globalScale;
       ctx.strokeStyle = '#fff';
       ctx.stroke();
    } else {
       ctx.shadowBlur = 0;
    }
    
    ctx.fill();

    // Draw Label
    if (globalScale > 0.8 || isSelected || isHovered) {
       ctx.font = `600 ${fontSize}px Inter, sans-serif`;
       ctx.textAlign = 'center';
       ctx.textBaseline = 'middle';
       ctx.fillStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.8)';
       
       // Background for text to improve readability
       const textWidth = ctx.measureText(label).width;
       const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
       ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
       ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + (node.val / 2) + 4 / globalScale, bckgDimensions[0], bckgDimensions[1]);
       
       ctx.fillStyle = '#fff';
       ctx.fillText(label, node.x, node.y + (node.val / 2) + (fontSize/2) + 4 / globalScale);
    }
  }, [selectedNode, hoverNode]);

  // Graph Controls
  const handleZoomIn = () => graphRef.current?.zoom(graphRef.current.zoom() * 1.2, 400);
  const handleZoomOut = () => graphRef.current?.zoom(graphRef.current.zoom() / 1.2, 400);
  const handleFit = () => graphRef.current?.zoomToFit(400);

  const toggleFilter = (type: string) => {
     setActiveFilters(prev => 
       prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
     );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-transparent overflow-hidden text-white font-sans relative">
      
      {/* Demo Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 backdrop-blur-md"
          >
            <Server className="w-4 h-4" /> Demo Mode: Backend unreachable. Rendering synthetic topology.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Graph Area */}
      <div className="flex-1 relative" ref={containerRef}>
         {/* Background Styling */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent pointer-events-none" />
         
         {/* Header Overlay */}
         <div className="absolute top-6 left-6 z-20 pointer-events-none flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl">
               <Network className="w-6 h-6 text-blue-400" />
            </div>
            <div>
               <h1 className="text-2xl font-black tracking-tighter">Intelligence Graph</h1>
               <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Enterprise Ontology Mapping</p>
            </div>
         </div>

         {loading ? (
            <div className="absolute inset-0 flex items-center justify-center z-10">
               <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
         ) : (
            dimensions.width > 0 && (
              <ErrorBoundary>
                <ForceGraph2D
                  ref={graphRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  graphData={filteredData}
                  nodeRelSize={6}
                  nodeCanvasObject={drawNode}
                  onNodeClick={(node) => {
                    setSelectedNode(node as any);
                    // Center node
                    graphRef.current?.centerAt(node.x, node.y, 1000);
                    graphRef.current?.zoom(2, 1000);
                  }}
                  onNodeHover={(node) => setHoverNode(node as any)}
                  linkColor={() => 'rgba(255,255,255,0.05)'}
                  linkWidth={1.5}
                  linkDirectionalParticles={2}
                  linkDirectionalParticleSpeed={0.005}
                  d3AlphaDecay={0.02}
                  d3VelocityDecay={0.3}
                  backgroundColor="transparent"
                />
              </ErrorBoundary>
            )
         )}

         {/* Floating Controls */}
         <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
            <button onClick={handleZoomIn} className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md">
               <ZoomIn className="w-4 h-4 text-white/80" />
            </button>
            <button onClick={handleFit} className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md">
               <Maximize className="w-4 h-4 text-white/80" />
            </button>
            <button onClick={handleZoomOut} className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md">
               <ZoomOut className="w-4 h-4 text-white/80" />
            </button>
         </div>

         {/* Agent Activity Overlay */}
         <div className="absolute bottom-6 left-6 z-20 w-80 max-h-48 overflow-y-auto no-scrollbar pointer-events-auto">
            <div className="flex flex-col gap-2">
               <AnimatePresence>
                 {feed.slice(0, 3).map(log => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-3"
                    >
                       <Cpu className={cn("w-3 h-3 shrink-0", log.status === 'error' ? 'text-red-400' : 'text-blue-400')} />
                       <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-white/80 truncate">{log.action}</p>
                          <p className="text-[8px] uppercase tracking-widest text-white/40">{log.agent}</p>
                       </div>
                    </motion.div>
                 ))}
               </AnimatePresence>
            </div>
         </div>
      </div>

      {/* Right Side Panel */}
      <div className="w-[380px] shrink-0 bg-black/40 border-l border-white/5 backdrop-blur-2xl flex flex-col relative z-30">
         
         {/* Search & Filters */}
         <div className="p-6 border-b border-white/5">
            <div className="relative mb-6">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
               <input 
                 type="text" 
                 placeholder="Search ontology..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-medium outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
               />
            </div>
            
            <div>
               <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Filters</span>
                  <Filter className="w-3 h-3 text-white/40" />
               </div>
               <div className="flex flex-wrap gap-2">
                  {Object.entries(NODE_COLORS).map(([type, color]) => (
                     <button 
                       key={type}
                       onClick={() => toggleFilter(type)}
                       className={cn(
                          "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all",
                          activeFilters.includes(type) 
                            ? "bg-white/10 border-white/20 text-white" 
                            : "bg-transparent border-white/5 text-white/30 hover:border-white/10"
                       )}
                     >
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: color }} />
                        {type}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Node Details */}
         <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
            <AnimatePresence mode="wait">
               {selectedNode ? (
                 <motion.div 
                   key={selectedNode.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-6"
                 >
                    <div className="flex items-start gap-4">
                       <div 
                         className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                         style={{ backgroundColor: NODE_COLORS[selectedNode.type] + '20', color: NODE_COLORS[selectedNode.type] }}
                       >
                          {React.createElement(NODE_ICONS[selectedNode.type] || Info, { className: "w-6 h-6" })}
                       </div>
                       <div>
                          <h2 className="text-lg font-black leading-tight text-white/90">{selectedNode.name}</h2>
                          <span 
                            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-2 inline-block"
                            style={{ backgroundColor: NODE_COLORS[selectedNode.type] + '20', color: NODE_COLORS[selectedNode.type] }}
                          >
                             {selectedNode.type} Node
                          </span>
                       </div>
                    </div>

                    {selectedNode.details && Object.keys(selectedNode.details).length > 0 ? (
                       <div className="space-y-3 pt-4 border-t border-white/5">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Properties</h3>
                          {Object.entries(selectedNode.details).map(([key, val]) => (
                             <div key={key} className="flex flex-col bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{key}</span>
                                <span className="text-xs font-medium text-white/80 mt-1">{String(val)}</span>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="pt-4 border-t border-white/5 flex flex-col items-center justify-center py-8 text-center">
                          <Database className="w-8 h-8 text-white/10 mb-3" />
                          <p className="text-xs text-white/40 font-medium">No additional telemetry available for this node.</p>
                       </div>
                    )}
                 </motion.div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <Network className="w-12 h-12 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest max-w-[200px]">Select a node in the graph to view intelligence telemetry.</p>
                 </div>
               )}
            </AnimatePresence>
         </div>

      </div>
    </div>
  );
};

export default IntelligenceGraph;
