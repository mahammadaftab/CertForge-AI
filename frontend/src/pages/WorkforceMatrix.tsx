import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Download, ChevronDown, Activity, 
  Target, ShieldAlert, Cpu, AlertCircle, BrainCircuit, Server, Award, BarChart4
} from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { cn } from '../lib/utils';
import api from '../lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { agentService } from '../lib/agentService';

const GlassCard = ({ children, className, title, icon: Icon, action }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
    {(title || Icon) && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />}
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="flex-1 p-6 relative z-10 overflow-hidden flex flex-col">
      {children}
    </div>
  </motion.div>
);

const WorkforceMatrix: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  
  const fetchData = useCallback(async () => {
    try {
      const [empRes, teamRes, riskRes] = await Promise.all([
        api.get('/employees/'),
        api.get('/teams/'),
        api.get('/command-center/risk-heatmap')
      ]);
      setEmployees(empRes.data);
      setTeams(teamRes.data);
      setRiskData(riskRes.data);
      setError(false);
      setIsDemoMode(false);
    } catch (err) {
      console.error("Failed to fetch workforce data", err);
      setError(true);
      setIsDemoMode(true);
      // Fallback synthetic data
      setEmployees([
        { id: '1', name: 'Alice Smith', role: 'Cloud Architect', team: 'Cloud Ops', status: 'Ready', score: 92 },
        { id: '2', name: 'Bob Jones', role: 'Data Engineer', team: 'AI/ML Core', status: 'Learning', score: 68 },
        { id: '3', name: 'Charlie Day', role: 'Security Specialist', team: 'Infrastructure', status: 'Assessment', score: 45 },
      ]);
      setTeams([
        { id: '1', name: 'Cloud Ops', department: 'Engineering' },
        { id: '2', name: 'AI/ML Core', department: 'Engineering' },
        { id: '3', name: 'Infrastructure', department: 'IT' }
      ]);
      setRiskData([
        { team: "Cloud Ops", domain: "Compute", risk: 12 },
        { team: "Cloud Ops", domain: "Security", risk: 45 },
        { team: "AI/ML Core", domain: "Data", risk: 8 },
        { team: "AI/ML Core", domain: "Logic", risk: 22 },
        { team: "Infrastructure", domain: "Network", risk: 90 }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Real-time polling fallback
    return () => clearInterval(interval);
  }, [fetchData]);

  // Derived Data
  const departments = useMemo(() => {
     const deps = new Set(teams.map(t => t.department || 'Unassigned'));
     return ['All', ...Array.from(deps)];
  }, [teams]);

  const filteredEmployees = useMemo(() => {
     let result = employees;
     if (departmentFilter !== 'All') {
        const validTeams = teams.filter(t => (t.department || 'Unassigned') === departmentFilter).map(t => t.name);
        result = result.filter(e => validTeams.includes(e.team));
     }
     if (search) {
        const s = search.toLowerCase();
        result = result.filter(e => e.name.toLowerCase().includes(s) || e.role.toLowerCase().includes(s));
     }
     return result;
  }, [employees, teams, departmentFilter, search]);

  const overviewStats = useMemo(() => {
     const total = filteredEmployees.length;
     const ready = filteredEmployees.filter(e => e.score >= 85).length;
     const atRisk = filteredEmployees.filter(e => e.score < 60).length;
     const avgScore = total ? Math.round(filteredEmployees.reduce((acc, e) => acc + e.score, 0) / total) : 0;
     return { total, ready, atRisk, avgScore };
  }, [filteredEmployees]);

  const handleExport = (format: string) => {
     // Mock export behavior
     console.log(`Exporting Workforce Matrix as ${format}`);
     alert(`Exporting Workforce Matrix as ${format}...`);
  };

  const executeAgentAction = async (agentName: string) => {
     try {
         await agentService.executeWorkflow({ 
             employee_id: "demo-user",
             certification_target: "AZ-104: Microsoft Azure Administrator",
             employee_skills: ["General", "Cloud"]
         });
         alert(`${agentName} triggered successfully.`);
     } catch (e) {
         console.error("Failed to trigger agent", e);
         alert(`Failed to connect to ${agentName}. Ensure kernel is online.`);
     }
  };

  if (loading && !isDemoMode) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
         <div className="flex flex-col items-center gap-8">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
            <span className="text-[12px] font-black uppercase tracking-[0.5em] text-blue-400 animate-pulse">Syncing Workforce Telemetry...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1800px] mx-auto pb-24 text-white">
      
      {/* Demo Mode Banner */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 mb-4"
          >
            <Server className="w-4 h-4" /> Demo Mode Active: Displaying synthetic workforce intelligence.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] shadow-xl">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Users className="w-5 h-5" /></div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Human Capital Sync</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Workforce <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Matrix</span></h1>
         </div>
         
         <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
               <input 
                 type="text" 
                 placeholder="Search employees or roles..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
               />
            </div>
            <div className="relative">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
               <select 
                 value={departmentFilter}
                 onChange={(e) => setDepartmentFilter(e.target.value)}
                 className="appearance-none bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium outline-none focus:border-blue-500/50 transition-colors text-white"
               >
                 {departments.map(d => <option key={d} value={d}>{d} Department</option>)}
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
            <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden p-1">
               {['CSV', 'Excel', 'PDF'].map(fmt => (
                 <button 
                   key={fmt} 
                   onClick={() => handleExport(fmt)}
                   className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
                 >
                    <Download className="w-3 h-3" /> {fmt}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {[
           { label: 'Total Headcount', val: overviewStats.total, icon: Users, color: 'blue' },
           { label: 'Deployment Ready (>85%)', val: overviewStats.ready, icon: Target, color: 'emerald' },
           { label: 'Critical Risk (<60%)', val: overviewStats.atRisk, icon: ShieldAlert, color: 'red' },
           { label: 'Enterprise Readiness Avg', val: `${overviewStats.avgScore}%`, icon: Activity, color: 'purple' }
         ].map((stat, i) => (
           <GlassCard key={i} delay={i * 0.1} className="py-2">
              <div className="flex items-center gap-4">
                 <div className={cn("p-4 rounded-xl shadow-inner", `bg-${stat.color}-500/20 text-${stat.color}-400`)}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                    <p className="text-2xl font-black leading-none">{stat.val}</p>
                 </div>
              </div>
           </GlassCard>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* 5. Employee Readiness Heatmap / Table */}
        <div className="xl:col-span-8 flex flex-col gap-6">
           <ErrorBoundary>
              <GlassCard title="Employee Readiness Heatmap" icon={Activity} className="min-h-[400px] overflow-hidden flex flex-col">
                 <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-none border border-white/5 rounded-2xl bg-black/20">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-black/80 backdrop-blur-xl z-20">
                        <tr className="border-b border-white/5">
                          <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Employee</th>
                          <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Role / Team</th>
                          <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                          <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] text-center">Readiness Index</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredEmployees.map((emp) => (
                          <motion.tr 
                            key={emp.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="group hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs shadow-lg">
                                  {emp.name.split(' ').map((n: string) => n[0]).join('').substring(0,2)}
                                </div>
                                <span className="text-xs font-bold text-white/90">{emp.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-[10px] font-black uppercase tracking-wider text-white/80">{emp.team}</p>
                              <p className="text-[9px] font-bold text-white/40 tracking-wide mt-0.5">{emp.role}</p>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                emp.status === 'Ready' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                                emp.status === 'Learning' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : 
                                "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", emp.status === 'Ready' ? "bg-emerald-400" : emp.status === 'Learning' ? "bg-blue-400" : "bg-amber-400")} />
                                {emp.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-3">
                                 <div className="w-full max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                      className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        emp.score >= 85 ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : 
                                        emp.score >= 60 ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"
                                      )}
                                      style={{ width: `${emp.score}%` }}
                                    />
                                 </div>
                                 <span className="text-[10px] font-black w-8 text-right">{emp.score}%</span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                        {filteredEmployees.length === 0 && (
                           <tr>
                              <td colSpan={4} className="p-8 text-center text-white/40 text-xs font-bold uppercase tracking-widest">
                                 No records found for current filters.
                              </td>
                           </tr>
                        )}
                      </tbody>
                    </table>
                 </div>
              </GlassCard>
           </ErrorBoundary>

           <ErrorBoundary>
              <GlassCard title="Department Intelligence View" icon={BarChart4} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teams} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="readiness" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {teams.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.department === 'Engineering' ? '#8b5cf6' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              </GlassCard>
           </ErrorBoundary>
        </div>

        {/* Side Panel */}
        <div className="xl:col-span-4 flex flex-col gap-6">
           
           {/* 8. AI Recommendations Panel */}
           <ErrorBoundary>
              <GlassCard 
                 title="Foundry AI Actions" 
                 icon={BrainCircuit} 
                 className="shrink-0"
                 action={<div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[8px] font-black uppercase tracking-widest rounded">Active</div>}
              >
                 <div className="space-y-3">
                    <button onClick={() => executeAgentAction('Learning Agent')} className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                       <div className="flex items-center gap-3">
                          <Cpu className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">Trigger Learning Paths</span>
                       </div>
                       <ChevronDown className="w-4 h-4 text-white/20 -rotate-90 group-hover:text-emerald-400 transition-all" />
                    </button>
                    <button onClick={() => executeAgentAction('Assessment Agent')} className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                       <div className="flex items-center gap-3">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">Deploy Assessments</span>
                       </div>
                       <ChevronDown className="w-4 h-4 text-white/20 -rotate-90 group-hover:text-amber-400 transition-all" />
                    </button>
                    <button onClick={() => executeAgentAction('Prediction Agent')} className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                       <div className="flex items-center gap-3">
                          <Target className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">Run Readiness Forecast</span>
                       </div>
                       <ChevronDown className="w-4 h-4 text-white/20 -rotate-90 group-hover:text-purple-400 transition-all" />
                    </button>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Automated Insights</p>
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border-l-2 border-purple-500 text-xs font-medium text-white/80 leading-relaxed">
                       "Infrastructure team exhibits a 90% risk signature in Network domains. Recommend immediate execution of AZ-700 Study Plans."
                    </div>
                 </div>
              </GlassCard>
           </ErrorBoundary>

           {/* 6. Skill Gap Matrix */}
           <ErrorBoundary>
              <GlassCard title="Skill Gap Matrix" icon={AlertCircle} className="flex-1 min-h-[300px] overflow-hidden flex flex-col">
                 <div className="flex-1 overflow-y-auto pr-2 scrollbar-none space-y-3">
                    {riskData.map((item, i) => (
                       <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-white/90">{item.domain}</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40 px-1.5 py-0.5 rounded bg-black/40">{item.team}</span>
                             </div>
                             <span className={cn(
                                "text-[9px] font-black tracking-widest",
                                item.risk > 70 ? "text-red-400" : item.risk > 40 ? "text-amber-400" : "text-emerald-400"
                             )}>
                                RISK: {item.risk}%
                             </span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <div 
                               className={cn(
                                 "h-full rounded-full transition-all duration-1000",
                                 item.risk > 70 ? "bg-red-500" : item.risk > 40 ? "bg-amber-500" : "bg-emerald-500"
                               )}
                               style={{ width: `${item.risk}%` }}
                             />
                          </div>
                       </div>
                    ))}
                    {riskData.length === 0 && (
                       <div className="text-center text-white/20 mt-4 text-[10px] uppercase tracking-widest">No gap data available</div>
                    )}
                 </div>
              </GlassCard>
           </ErrorBoundary>
           
        </div>
      </div>
    </div>
  );
};

export default WorkforceMatrix;
