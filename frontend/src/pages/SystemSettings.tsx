import React, { useState, useEffect } from 'react';
import { 
  Settings, Globe, Moon, Sun, Monitor, Bell, Mail, ShieldCheck, 
  Key, Clock, Users, Database, RefreshCcw, HardDrive, Cpu, 
  Activity, Zap, Sparkles, Layout, Palette, Accessibility,
  ChevronRight, Save, RotateCcw, Building2, Image as ImageIcon,
  CheckCircle2, AlertTriangle, XCircle, Share2, Cloud, MessageSquare,
  Lock, History, Fingerprint, Eye, Sliders, Play, BrainCircuit,
  Terminal, BarChart4, ShieldAlert, Workflow, Microscope, ListChecks, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import api from '../lib/api';

// --- Error Boundary ---
class SettingsErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#0A0F1E] rounded-[3rem] border border-accent/20">
          <ShieldAlert className="w-16 h-16 text-accent mb-6" />
          <h2 className="text-3xl font-black tracking-tighter text-white mb-4">Config Core Offline</h2>
          <p className="description max-w-md mb-8">The settings engine encountered a memory allocation fault. Security protocols remain active.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs">Reboot Config Mesh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Components ---

const StatusIndicator = ({ status, label }: { status: 'online' | 'warning' | 'offline', label: string }) => (
  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
    <div className={cn(
      "w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
      status === 'online' ? "bg-highlight shadow-[0_0_10px_#7CFF6B]" : 
      status === 'warning' ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]" : 
      "bg-accent shadow-[0_0_10px_#FF3D00]"
    )} />
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
      <span className="text-xs font-bold text-white uppercase tracking-tighter">
        {status === 'online' ? 'Operational' : status === 'warning' ? 'Degraded' : 'Offline'}
      </span>
    </div>
  </div>
);

const Toggle = ({ active, onToggle, label }: { active: boolean, onToggle: () => void, label: string }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-white/80">{label}</span>
    <button 
      onClick={onToggle}
      className={cn(
        "w-12 h-6 rounded-full relative transition-all duration-300 border",
        active ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10"
      )}
    >
      <motion.div 
        animate={{ x: active ? 24 : 4 }}
        className={cn(
          "absolute top-1 w-3.5 h-3.5 rounded-full transition-colors",
          active ? "bg-primary" : "bg-white/20"
        )}
      />
    </button>
  </div>
);

const SystemSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('organization');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
       await new Promise(r => setTimeout(r, 1500));
       setLoading(false);
    };
    init();
  }, []);

  const handleSave = async () => {
    setSaveLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaveLoading(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const sections = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'agents', label: 'Agent Configuration', icon: BrainCircuit },
    { id: 'microsoft', label: 'Microsoft Integrations', icon: Cloud },
    { id: 'security', label: 'Security Center', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'health', label: 'System Health', icon: Activity },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
       <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-4 border-4 border-secondary/20 border-b-secondary rounded-full animate-spin-reverse" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Syncing Enterprise Registry...</p>
    </div>
  );

  return (
    <SettingsErrorBoundary>
      <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6 px-6 relative z-10">
        <header className="flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 azure-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Settings Console</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Enterprise Administration Mesh</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                 <RotateCcw className="w-3.5 h-3.5" /> Factory Reset
              </button>
              <button 
                onClick={handleSave}
                disabled={saveLoading}
                className="px-8 py-3 azure-gradient rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2 relative overflow-hidden"
              >
                 {saveLoading ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                 {saveLoading ? 'Committing...' : 'Commit Changes'}
                 <AnimatePresence>
                   {saveSuccess && (
                     <motion.div 
                       initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: -40 }}
                       className="absolute inset-0 bg-highlight text-black flex items-center justify-center"
                     >
                       <CheckCircle2 className="w-4 h-4 mr-2" /> Synced
                     </motion.div>
                   )}
                 </AnimatePresence>
              </button>
           </div>
        </header>

        <div className="flex-1 flex gap-6 min-h-0">
           {/* Navigation Tabs */}
           <aside className="w-[280px] os-window rounded-[2.5rem] p-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group text-left",
                    activeSection === section.id 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]" 
                      : "text-white/40 hover:bg-white/5 hover:text-white/70"
                  )}
                >
                  <section.icon className={cn("w-5 h-5 transition-all", activeSection === section.id ? "drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "opacity-40")} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{section.label}</span>
                  {activeSection === section.id && (
                    <motion.div layoutId="setting-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00E5FF]" />
                  )}
                </button>
              ))}
           </aside>

           {/* Main Settings Area */}
           <main className="flex-1 os-window rounded-[2.5rem] p-12 overflow-y-auto no-scrollbar relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-12 pb-20 text-white"
                >
                   {/* Organization Settings */}
                   {activeSection === 'organization' && (
                     <div className="space-y-10">
                        <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                           <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5 relative group cursor-pointer">
                              <ImageIcon className="w-6 h-6 text-white/20" />
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 rounded-3xl flex items-center justify-center transition-all"><Zap className="w-4 h-4 text-primary" /></div>
                           </div>
                           <div>
                              <h3 className="text-2xl font-black tracking-tighter uppercase">Organization Profile</h3>
                              <p className="text-sm font-medium text-white/40 italic">Global enterprise identity and localization.</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Organization Name</label>
                              <input type="text" placeholder="Microsoft Foundry" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/40 transition-all" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Time Zone</label>
                              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none bg-black">
                                 <option>North America (West US 3)</option>
                                 <option>Europe (West Europe)</option>
                                 <option>Asia (East Asia)</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Primary Language</label>
                              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none bg-black">
                                 <option>English (Universal)</option>
                                 <option>Deutsch</option>
                                 <option>日本語</option>
                              </select>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Agent Configuration */}
                   {activeSection === 'agents' && (
                     <div className="space-y-10">
                        <div className="p-10 os-glass rounded-[3rem] border-primary/20 relative overflow-hidden group text-white">
                           <div className="absolute top-0 right-0 p-10 opacity-5"><Sparkles className="w-32 h-32 text-primary" /></div>
                           <h3 className="text-2xl font-black tracking-tighter mb-6 uppercase">Autonomous Pipeline</h3>
                           <div className="grid grid-cols-1 gap-8 max-w-2xl">
                              <Toggle active={true} onToggle={() => {}} label="Auto-Trigger Intelligence Cycles" />
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Confidence Threshold</span>
                                    <span className="text-xl font-black text-primary">85%</span>
                                 </div>
                                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer" />
                                 <p className="text-[10px] font-bold text-white/20 italic">Agents will only commit strategic actions when confidence exceeds this value.</p>
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           {['Foundry IQ', 'Work IQ', 'Prediction Agent', 'Readiness Agent', 'Assessment Agent', 'Learning Agent'].map(agent => (
                             <div key={agent} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-white/20 transition-all text-white">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-secondary transition-all"><Cpu className="w-6 h-6" /></div>
                                   <span className="text-[11px] font-black uppercase tracking-widest text-white/60">{agent}</span>
                                </div>
                                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white"><Sliders className="w-4 h-4" /></button>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Microsoft Integrations */}
                   {activeSection === 'microsoft' && (
                     <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-6">
                           {[
                             { name: 'Azure OpenAI', status: 'Connected', icon: Zap, color: 'text-primary' },
                             { name: 'Microsoft Fabric', status: 'Syncing', icon: Workflow, color: 'text-secondary' },
                             { name: 'Microsoft Graph', status: 'Connected', icon: Globe, color: 'text-highlight' },
                             { name: 'Microsoft Teams', status: 'Operational', icon: MessageSquare, color: 'text-blue-400' },
                             { name: 'Outlook / 365', status: 'Connected', icon: Mail, color: 'text-orange-400' },
                           ].map(integ => (
                             <div key={integ.name} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center justify-between group text-white">
                                <div className="flex items-center gap-6">
                                   <div className={cn("p-4 bg-white/5 rounded-2xl", integ.color)}><integ.icon className="w-6 h-6" /></div>
                                   <div>
                                      <h4 className="text-lg font-black tracking-tight">{integ.name}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                         <div className="w-1.5 h-1.5 rounded-full bg-highlight" />
                                         <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{integ.status}</span>
                                      </div>
                                   </div>
                                </div>
                                <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">Configure</button>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Security Center */}
                   {activeSection === 'security' && (
                     <div className="space-y-10">
                        <div className="grid grid-cols-3 gap-6 text-white">
                           <div className="p-8 os-glass rounded-[2rem] border-highlight/20 flex flex-col items-center gap-4 text-center group cursor-pointer hover:bg-highlight/5 transition-all">
                              <Fingerprint className="w-12 h-12 text-highlight group-hover:scale-110 transition-all" />
                              <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Multi-Factor</h4>
                           </div>
                           <div className="p-8 os-glass rounded-[2rem] border-primary/20 flex flex-col items-center gap-4 text-center group cursor-pointer hover:bg-primary/5 transition-all">
                              <Lock className="w-12 h-12 text-primary group-hover:scale-110 transition-all" />
                              <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Vault Control</h4>
                           </div>
                           <div className="p-8 os-glass rounded-[2rem] border-amber-500/20 flex flex-col items-center gap-4 text-center group cursor-pointer hover:bg-amber-500/5 transition-all">
                              <Eye className="w-12 h-12 text-amber-500 group-hover:scale-110 transition-all" />
                              <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">RBAC Mesh</h4>
                           </div>
                        </div>
                        <div className="os-window rounded-[2rem] overflow-hidden border-white/5">
                           <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Real-time Security Stream</span>
                              <span className="text-[9px] font-black text-highlight animate-pulse uppercase">Monitoring Active</span>
                           </div>
                           <div className="p-0">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="px-8 py-5 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all text-white">
                                   <div className="flex items-center gap-4">
                                      <ShieldAlert className="w-4 h-4 text-white/20" />
                                      <div className="flex flex-col">
                                         <span className="text-xs font-bold text-white/80 uppercase tracking-tight">Privileged Config Access</span>
                                         <span className="text-[9px] text-white/20 font-mono italic">User: admin_mdaft | IP: 10.0.4.122</span>
                                      </div>
                                   </div>
                                   <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Just now</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Notifications */}
                   {activeSection === 'notifications' && (
                     <div className="space-y-10">
                        <div className="p-8 os-glass rounded-[2.5rem] border-white/5 space-y-8 text-white">
                           <h3 className="text-xl font-black tracking-tighter uppercase">Alert Matrix</h3>
                           <div className="grid grid-cols-1 gap-6 max-w-xl">
                              <Toggle active={true} onToggle={() => {}} label="Enterprise Email Alerts" />
                              <Toggle active={true} onToggle={() => {}} label="Real-time Risk Intelligence Alerts" />
                              <Toggle active={false} onToggle={() => {}} label="Certification Expiry Auto-Notifications" />
                              <Toggle active={true} onToggle={() => {}} label="Foundry IQ Strategic Updates" />
                           </div>
                        </div>
                     </div>
                   )}

                   {/* System Health */}
                   {activeSection === 'health' && (
                     <div className="space-y-10">
                        <div className="grid grid-cols-3 gap-6">
                           <StatusIndicator status="online" label="Core Neural Engine" />
                           <StatusIndicator status="online" label="Fabric Data Lake" />
                           <StatusIndicator status="online" label="Agent Pipeline" />
                           <StatusIndicator status="online" label="PostgreSQL v15" />
                           <StatusIndicator status="warning" label="WebSocket Mesh" />
                           <StatusIndicator status="online" label="Redis Cache" />
                        </div>
                        <div className="p-10 os-glass rounded-[3rem] border-white/5 h-[300px] flex flex-col gap-8 text-white">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                 <Microscope className="w-5 h-5 text-primary" />
                                 <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Global Pulse Stream (24h)</h4>
                              </div>
                              <div className="px-4 py-1.5 bg-highlight/10 border border-highlight/20 rounded-xl text-[9px] font-black text-highlight uppercase tracking-[0.2em]">99.99% Availability</div>
                           </div>
                           <div className="flex-1 flex items-end gap-1.5 px-4">
                              {Array.from({ length: 48 }).map((_, i) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ height: 0 }} animate={{ height: `${Math.random() * 60 + 20}%` }}
                                  className={cn(
                                    "flex-1 rounded-t-sm transition-all duration-1000",
                                    i > 40 ? "bg-amber-500/40" : "bg-primary/20"
                                  )}
                                />
                              ))}
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Audit Logs */}
                   {activeSection === 'audit' && (
                     <div className="space-y-10">
                        <div className="os-window rounded-[2rem] overflow-hidden border-white/5 text-white">
                           <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                 <ListChecks className="w-5 h-5 text-secondary" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Global Audit Log</span>
                              </div>
                              <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                 <Download className="w-3 h-3" /> Export CSV
                              </button>
                           </div>
                           <div className="p-0">
                              {[
                                { action: 'Schema Update', target: 'Foundry V-Lake', actor: 'admin_mdaft', time: '2h ago' },
                                { action: 'Agent Reboot', target: 'Readiness Agent', actor: 'System', time: '5h ago' },
                                { action: 'Key Rotation', target: 'Azure OpenAI', actor: 'admin_mdaft', time: '1d ago' },
                                { action: 'Config Access', target: 'Security Center', actor: 'user_sjenkins', time: '2d ago' },
                              ].map((log, i) => (
                                <div key={i} className="px-8 py-5 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all">
                                   <div className="flex items-center gap-6">
                                      <div className="w-1 h-8 rounded-full bg-secondary/40" />
                                      <div className="flex flex-col">
                                         <span className="text-xs font-black uppercase tracking-tight text-white/80">{log.action}</span>
                                         <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Target: {log.target}</span>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[10px] font-black uppercase text-white/60">{log.actor}</p>
                                      <p className="text-[9px] font-mono text-white/20 mt-0.5">{log.time}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Appearance */}
                   {activeSection === 'appearance' && (
                     <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-12 text-white">
                           <div className="space-y-6">
                              <h4 className="text-xs font-black uppercase tracking-widest text-white/40">OS Theme Profile</h4>
                              <div className="grid grid-cols-3 gap-4">
                                 {[
                                   { id: 'mica', label: 'Mica Dark', icon: Moon },
                                   { id: 'fluent', label: 'Fluent Light', icon: Sun },
                                   { id: 'dynamic', label: 'Adaptive', icon: Monitor },
                                 ].map(opt => (
                                   <button key={opt.id} className="p-6 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col items-center gap-4 transition-all hover:border-primary/20">
                                      <opt.icon className="w-7 h-7 text-white/40" />
                                      <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                                   </button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-6">
                              <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Neural Accent Color</h4>
                              <div className="flex gap-6">
                                 {['#00E5FF', '#8B5CF6', '#7CFF6B', '#FF3D00'].map(color => (
                                   <div 
                                     key={color} 
                                     className={cn(
                                       "w-12 h-12 rounded-full cursor-pointer transition-all border-4 border-transparent hover:scale-110",
                                       color === '#00E5FF' && "border-white/40 shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-110"
                                     )}
                                     style={{ backgroundColor: color }}
                                   />
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div className="pt-10 border-t border-white/5 space-y-8 text-white">
                           <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Motion & Physics</h4>
                           <div className="grid grid-cols-1 gap-6 max-w-xl">
                              <Toggle active={true} onToggle={() => {}} label="Enable Advanced OS Animations" />
                              <Toggle active={true} onToggle={() => {}} label="High-Density Information Layout" />
                              <Toggle active={false} onToggle={() => {}} label="Hardware Acceleration Override" />
                           </div>
                        </div>
                     </div>
                   )}
                </motion.div>
              </AnimatePresence>
           </main>

           {/* Quick Actions Panel */}
           <aside className="w-[320px] flex flex-col gap-6">
              <div className="os-window rounded-[2.5rem] p-8 bg-gradient-to-br from-white/[0.02] to-transparent text-white">
                 <div className="flex items-center gap-3 mb-8">
                    <History className="w-5 h-5 text-secondary" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Recent Commits</h3>
                 </div>
                 <div className="space-y-6">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex gap-4 group">
                         <div className="w-1 h-8 rounded-full bg-white/5 group-hover:bg-primary transition-all" />
                         <div>
                            <p className="text-[10px] font-black uppercase text-white/60">Updated Confidence Mesh</p>
                            <p className="text-[9px] font-medium text-white/20 mt-1">2h ago by admin_mdaft</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="flex-1 os-glass rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden text-white">
                 <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Neural Tasks</h3>
                 <div className="space-y-3">
                    {[
                      { label: 'Rotate Session Keys', icon: RefreshCcw },
                      { label: 'Sync Fabric Schema', icon: Workflow },
                      { label: 'Export Audit Log', icon: HardDrive },
                      { label: 'Prune System Cache', icon: Play },
                    ].map(task => (
                      <button key={task.label} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-primary/20 transition-all group text-white">
                         <div className="flex items-center gap-4">
                            <task.icon className="w-4 h-4 text-white/20 group-hover:text-primary transition-all" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{task.label}</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-all" />
                      </button>
                    ))}
                 </div>
                 <div className="mt-auto pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] font-bold text-white/20 italic mb-4">Enterprise kernel requires manual schema validation for major changes.</p>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-glow transition-all">Manual Validation →</button>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </SettingsErrorBoundary>
  );
};

export default SystemSettings;
