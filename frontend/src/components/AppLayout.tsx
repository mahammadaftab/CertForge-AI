import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Terminal,
  Activity,
  Network,
  Cpu,
  BrainCircuit,
  LogOut,
  Command,
  ShieldAlert,
  BarChart4,
  Users,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import CommandPalette from './CommandPalette';

const dockItems = [
  { icon: Terminal, label: 'Command Center', path: '/' },
  { icon: Cpu, label: 'Agent Studio', path: '/agent-studio' },
  { icon: Network, label: 'Intelligence Graph', path: '/intelligence-graph' },
  { icon: Users, label: 'Workforce Matrix', path: '/workforce-matrix' },
  { icon: BrainCircuit, label: 'Foundry IQ', path: '/foundry-iq' },
  { icon: Activity, label: 'Prediction Engine', path: '/prediction-engine' },
  { icon: BarChart4, label: 'Executive Intelligence', path: '/executive-intelligence' },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden font-sans text-white relative">
      {/* Deep Space Background with Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#030712] to-[#000000]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <CommandPalette />

      {/* OS Frame Container */}
      <div className="absolute inset-4 md:inset-6 flex overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
        
        {/* Premium Command Dock */}
        <motion.aside 
          initial={{ width: 88 }}
          animate={{ width: isExpanded ? 280 : 88 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="relative z-30 flex flex-col items-start py-8 bg-[#000000]/60 border-r border-white/5 backdrop-blur-xl group"
        >
          {/* Logo Section */}
          <div className="flex items-center px-6 w-full mb-12">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              CF
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 overflow-hidden whitespace-nowrap font-black tracking-widest uppercase text-sm"
            >
              CertForge<span className="text-blue-400">OS</span>
            </motion.div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-2 w-full px-3">
            {dockItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center h-12 rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-blue-500/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="w-[64px] shrink-0 flex items-center justify-center relative">
                    <item.icon className={cn("w-5 h-5 transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]")} />
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isExpanded ? 1 : 0 }}
                    className="overflow-hidden whitespace-nowrap text-xs font-bold tracking-wider"
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2 w-full px-3 mt-auto">
            <button className="relative flex items-center h-12 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
              <div className="w-[64px] shrink-0 flex items-center justify-center"><Settings className="w-5 h-5" /></div>
              <motion.span animate={{ opacity: isExpanded ? 1 : 0 }} className="overflow-hidden whitespace-nowrap text-xs font-bold tracking-wider">System Settings</motion.span>
            </button>
            <button onClick={logout} className="relative flex items-center h-12 rounded-xl text-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <div className="w-[64px] shrink-0 flex items-center justify-center"><LogOut className="w-5 h-5" /></div>
              <motion.span animate={{ opacity: isExpanded ? 1 : 0 }} className="overflow-hidden whitespace-nowrap text-xs font-bold tracking-wider">Terminate Session</motion.span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-transparent">
          <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white/40">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                 <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                 OS Kernel Active
               </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition-colors cursor-pointer">
                <Command className="w-3.5 h-3.5" /> ⌘K
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                   {user?.full_name?.charAt(0) || 'U'}
                 </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
