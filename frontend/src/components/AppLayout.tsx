import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Terminal,
  Activity,
  Layers,
  BrainCircuit,
  Settings,
  LogOut,
  Command,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import CommandPalette from './CommandPalette';

const dockItems = [
  { icon: Terminal, label: 'Command', path: '/command-center' },
  { icon: BrainCircuit, label: 'Foundry IQ', path: '/foundry-iq' },
  { icon: Activity, label: 'Work IQ', path: '/work-iq' },
  { icon: Layers, label: 'Fabric IQ', path: '/fabric-iq' },
  { icon: Database, label: 'Workforce', path: '/employees' },
];

const DockItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      cn(
        "relative group flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500",
        isActive 
          ? "bg-[#00E5FF]/10 shadow-[0_0_30px_rgba(0,229,255,0.15)] text-white scale-110" 
          : "text-white/50 hover:bg-white/5 hover:text-white hover:scale-105"
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={cn("w-6 h-6 transition-all duration-500", isActive && "text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]")} />
        <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#0A0F1E] border border-[#00E5FF]/20 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none z-50">
          {label}
        </span>
        {isActive && (
          <motion.div 
            layoutId="active-dot"
            className="absolute -left-3 w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </>
    )}
  </NavLink>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans text-white mesh-gradient relative">
      <div className="aurora-bg" />
      <CommandPalette />

      {/* OS Frame Container */}
      <div className="absolute inset-4 md:inset-8 os-window rounded-[2rem] md:rounded-[3rem] flex overflow-hidden shadow-2xl">
        
        {/* Neural Dock (Sidebar) */}
        <aside className="w-24 md:w-28 border-r border-[#00E5FF]/8 flex flex-col items-center py-10 relative z-20 bg-[#080D1A]/60 backdrop-blur-3xl">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0A0F1E] font-black shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-12 cursor-pointer hover:rotate-12 transition-transform" onClick={() => window.location.href = '/'}>
            CF
          </div>

          <div className="flex-1 flex flex-col gap-6 w-full items-center">
            {dockItems.map((item) => (
              <DockItem key={item.path} {...item} />
            ))}
          </div>

          <div className="flex flex-col gap-6 items-center">
            <button className="w-14 h-14 rounded-2xl text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center">
               <Settings className="w-6 h-6" />
            </button>
            <div className="w-10 h-[1px] bg-white/10" />
            <button onClick={logout} className="w-14 h-14 rounded-2xl text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center">
               <LogOut className="w-6 h-6 ml-1" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-[#0A0F1E]/20">
          <header className="h-20 flex items-center justify-between px-8 md:px-12 border-b border-[#00E5FF]/8 backdrop-blur-md">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00E5FF]">{location.pathname.replace('/', '') || 'Core'} Module</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[#00E5FF]/15 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-colors cursor-pointer">
                <Command className="w-4 h-4" /> ⌘K
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-widest text-white">{user?.full_name}</p>
                    <p className="text-[9px] font-black text-[#8B5CF6] uppercase tracking-[0.3em] opacity-80 mt-1">Lvl 9 Clearance</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                   {user?.full_name?.charAt(0)}
                 </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
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
