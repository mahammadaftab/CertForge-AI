import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Award, 
  BarChart3, 
  FileText, 
  LogOut,
  MessageSquare,
  Zap,
  Sparkles,
  ChevronRight,
  Cpu,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import CommandPalette from './CommandPalette';

const menuItems = [
  { icon: LayoutDashboard, label: 'Mission Control', path: '/dashboard' },
  { icon: Terminal, label: 'Command Center', path: '/command-center' },
  { icon: Users, label: 'Workforce', path: '/employees' },
  { icon: UserCircle, label: 'Units', path: '/teams' },
  { icon: Award, label: 'Credentials', path: '/certifications' },
  { icon: BarChart3, label: 'Foundry IQ', path: '/intelligence' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Zap, label: 'Predictor', path: '/predictor' },
  { icon: Sparkles, label: 'Assessments', path: '/assessments' },
];

const SidebarItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-700 group relative overflow-hidden",
        isActive 
          ? "text-white shadow-[0_15px_45px_-10px_rgba(0,242,255,0.4)] scale-[1.03] z-10 font-bold" 
          : "text-foreground/50 hover:text-primary dark:hover:text-white hover:bg-white/5"
      )
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div 
            layoutId="active-pill"
            className="absolute inset-0 cyber-gradient -z-10"
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          />
        )}
        <Icon className={cn("w-5 h-5 shrink-0 transition-all duration-700", isActive ? "text-white scale-110 drop-shadow-md" : "text-foreground/30 group-hover:text-primary group-hover:scale-110")} />
        <span className="text-[12px] font-black uppercase tracking-[0.25em] whitespace-nowrap">{label}</span>
      </>
    )}
  </NavLink>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCopilotOpen, setIsCopilotOpen] = React.useState(false);
  const [copilotInput, setCopilotInput] = React.useState('');
  const [copilotLoading, setCopilotLoading] = React.useState(false);
  const [copilotResponse, setCopilotResponse] = React.useState<any>(null);

  const handleCopilotSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && copilotInput.trim()) {
      setCopilotLoading(true);
      try {
        const res = await api.post('/intelligence/orchestrate', {
          employee_id: user?.id || 'demo-user',
          certification_target: copilotInput,
          employee_skills: ['Python', 'Azure']
        });
        setCopilotResponse(res.data);
      } catch (err) {
        console.error("Copilot orchestration failed", err);
      } finally {
        setCopilotLoading(false);
        setCopilotInput('');
      }
    }
  };

  return (
    <div className="flex h-screen bg-background dark:bg-[#010204] overflow-hidden font-sans selection:bg-primary/30 relative">
      <div className="absolute inset-0 living-canvas -z-0 pointer-events-none opacity-50" />
      <CommandPalette />

      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-85 mica m-6 rounded-[3.5rem] flex flex-col z-20 relative shadow-2xl border-white/10 dark:border-white/5"
      >
        <div className="p-12 flex flex-col gap-2">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.location.href = '/'}>
             <div className="w-14 h-14 bg-foreground dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                <Cpu className="w-7 h-7 text-background dark:text-[#010204]" />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tighter dark:text-white leading-none">CertForge</h1>
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mt-2 opacity-90">Intelligence OS</p>
             </div>
          </div>
        </div>

        <div className="px-8 py-4 flex-1 space-y-12 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-foreground/40 uppercase px-6 mb-6 tracking-[0.35em] opacity-70">Core Protocols</p>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <SidebarItem key={item.path} {...item} />
              ))}
            </div>
          </div>

          <div className="mx-6 p-6 rounded-[2.5rem] bg-primary/5 border border-primary/10 group hover:border-primary/30 transition-all shadow-inner">
             <div className="flex items-center gap-4 mb-5 px-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60">Uplink Stable</span>
             </div>
             <div className="space-y-4">
                {[
                  { label: 'Neural Latency', val: '12ms' },
                  { label: 'Cluster Uptime', val: '99.99%' },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-tighter">{stat.label}</span>
                    <span className="text-[11px] font-black text-primary dark:text-white">{stat.val}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="p-10 space-y-6">
          <div className="mica p-6 rounded-[2rem] border-primary/20 group cursor-pointer hover:bg-primary/10 transition-all shadow-lg">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-primary/20 rounded-xl text-primary"><Sparkles className="w-5 h-5 animate-pulse" /></div>
                   <span className="text-[11px] font-black uppercase dark:text-white tracking-widest">Cognitive Sync</span>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/40 group-hover:translate-x-1 transition-transform" />
             </div>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-4 px-6 py-5 w-full rounded-2xl text-foreground/50 hover:bg-red-500/10 hover:text-red-500 transition-all duration-700 font-black text-[12px] uppercase tracking-[0.2em] border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Terminate Interface</span>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden relative p-6 pl-0">
        <header className="h-24 flex items-center justify-between px-12 z-10">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-6 py-3 mica rounded-2xl border-white/20 shadow-2xl">
                <span className="text-[11px] font-black text-foreground/40 uppercase tracking-widest">Protocol</span>
                <ChevronRight className="w-4 h-4 text-foreground/20" />
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] text-neon">{location.pathname.split('/')[1] || 'Foundry'}</span>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="mica flex items-center gap-4 px-6 py-3 rounded-2xl border-white/10 cursor-pointer group shadow-2xl hover:border-primary/40 transition-all">
               <span className="text-[11px] font-black text-foreground/40 group-hover:text-foreground dark:group-hover:text-white transition-colors uppercase tracking-[0.25em]">Command ⌘K</span>
            </div>
            <div className="h-12 w-[1px] bg-foreground/5"></div>
            <div className="flex items-center gap-5 group cursor-pointer">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-black dark:text-white uppercase tracking-widest leading-none group-hover:text-primary transition-all duration-500">{user?.full_name || 'Neural Root'}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mt-2 opacity-80">Security Lvl 9</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 8 }}
                className="w-14 h-14 rounded-2xl cyber-gradient flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(0,242,255,0.3)] border-2 border-white/30"
              >
                {user?.full_name?.charAt(0) || 'Ω'}
              </motion.div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 relative no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ y: 30, opacity: 0, filter: 'blur(15px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -30, opacity: 0, filter: 'blur(15px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <div className="fixed bottom-16 right-16 flex flex-col items-end gap-8 z-50">
             <motion.button
               whileHover={{ scale: 1.15, rotate: -8 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsCopilotOpen(true)}
               className="w-24 h-24 bg-slate-950 dark:bg-white rounded-[3.5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)] dark:shadow-[0_30px_80px_-15px_rgba(0,242,255,0.4)] flex items-center justify-center text-white dark:text-[#010204] relative group overflow-hidden border-4 border-white/20 dark:border-slate-900/10 pointer-events-auto"
             >
               <div className="absolute inset-0 cyber-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <Sparkles className="w-11 h-11 relative z-10 group-hover:text-white transition-colors duration-500 shadow-glow" />
             </motion.button>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isCopilotOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCopilotOpen(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-[6px] z-[60]"
            />
            <motion.div 
              initial={{ x: '100%', filter: 'blur(30px)' }}
              animate={{ x: 0, filter: 'blur(0px)' }}
              exit={{ x: '100%', filter: 'blur(30px)' }}
              transition={{ type: "spring", damping: 35, stiffness: 200 }}
              className="fixed top-8 right-8 bottom-8 w-[600px] mica shadow-[-60px_0_150px_-30px_rgba(0,0,0,0.4)] z-[70] p-16 flex flex-col rounded-[4rem] border-white/30"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 cyber-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter dark:text-white">Foundry AI</h2>
                    <p className="text-[12px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 opacity-90">Logic Processor</p>
                  </div>
                </div>
                <button onClick={() => setIsCopilotOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/20">
                  <LayoutDashboard className="w-7 h-7 text-foreground/40 rotate-45" />
                </button>
              </div>

              <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar pr-6">
                <div className="mica p-10 rounded-[3rem] border-primary/30 bg-primary/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 cyber-gradient opacity-[0.03]" />
                  <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-5 flex items-center gap-3 relative z-10">
                     <MessageSquare className="w-5 h-5" /> Intelligence Uplink
                  </p>
                  <p className="text-lg font-bold dark:text-slate-200 leading-relaxed italic text-neon relative z-10">
                    Neural pathways are synchronized. Cluster efficiency has reached critical mass. Requesting deployment protocol for Squad Omega?
                  </p>
                </div>

                {copilotLoading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-6">
                     <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-2xl" />
                     <span className="text-[12px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Orchestrating Logic Nodes...</span>
                  </div>
                )}

                {copilotResponse && !copilotLoading && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mica p-12 rounded-[3.5rem] border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(16,185,129,0.2)]"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-32 h-32 text-emerald-500" /></div>
                    <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.25em] mb-8">Protocol Generated</p>
                    <div className="space-y-8 relative z-10">
                      <div>
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-3">Blueprint Objective</p>
                        <p className="text-3xl font-black dark:text-white tracking-tighter leading-none">{copilotResponse.certification_target}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-12">
                         <div>
                            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-3">Readiness</p>
                            <p className="text-6xl font-black text-primary tracking-tighter">{copilotResponse.readiness_score}%</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-3">Verification</p>
                            <p className="text-3xl font-black dark:text-white uppercase tracking-tighter mt-2">{copilotResponse.verification_status}</p>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-white/10">
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-4">Strategic Logic</p>
                        <p className="text-md font-semibold dark:text-slate-300 leading-relaxed italic opacity-90">
                           "{copilotResponse.manager_insights?.summary}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-5">
                  <p className="text-[11px] font-black text-foreground/30 uppercase tracking-[0.4em] px-4">Neural Command Shortcuts</p>
                  {["Analyze AZ-104 Squad", "Detect Burnout in Cloud Ops", "Predict AI-102 Success"].map((text, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCopilotInput(text)}
                      className="w-full text-left p-8 rounded-[2.25rem] bg-white/5 dark:bg-white/5 hover:cyber-gradient hover:text-white border border-white/10 hover:border-transparent transition-all duration-500 group shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                         <span className="text-[13px] font-black uppercase tracking-widest whitespace-nowrap">{text}</span>
                         <Zap className="w-4 h-4 text-primary group-hover:text-white group-hover:scale-125 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-16 relative group">
                <div className="absolute inset-0 bg-primary/30 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                <MessageSquare className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/30 group-focus-within:text-primary transition-colors relative z-10" />
                <input 
                  type="text" 
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  onKeyDown={handleCopilotSubmit}
                  placeholder="Ask OS Intelligence (Enter)..." 
                  className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-white/10 focus:border-primary/50 rounded-[2.5rem] py-8 pl-20 pr-10 text-lg font-black dark:text-white outline-none transition-all relative z-10 shadow-3xl"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
