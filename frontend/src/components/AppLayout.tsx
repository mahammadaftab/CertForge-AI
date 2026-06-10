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
  Settings,
  LayoutDashboard,
  Award,
  Zap,
  BookOpen,
  FileText,
  Milestone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth, UserRole } from '../context/AuthContext';
import CommandPalette from './CommandPalette';

interface NavItem {
  icon: any;
  label: string;
  path: string;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Award, label: 'Certifications', path: '/certifications', roles: [UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN] },
  { icon: Milestone, label: 'Learning Path', path: '/learning-path', roles: [UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN] },
  { icon: BookOpen, label: 'Assessments', path: '/assessments', roles: [UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN] },
  { icon: Zap, label: 'Work IQ', path: '/work-iq', roles: [UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN] },
];

const controllerNavItems: NavItem[] = [
  { icon: Users, label: 'Workforce Matrix', path: '/workforce-matrix', roles: [UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN] },
  { icon: BarChart4, label: 'Fabric IQ (Analytics)', path: '/analytics', roles: [UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN] },
  { icon: Network, label: 'Semantic Graph', path: '/fabric-iq', roles: [UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN] },
];

const adminNavItems: NavItem[] = [
  { icon: Terminal, label: 'Command Center', path: '/command-center', roles: [UserRole.ROOT_ADMIN, UserRole.ADMIN] },
  { icon: BrainCircuit, label: 'Foundry IQ (Engine)', path: '/foundry-iq', roles: [UserRole.ROOT_ADMIN, UserRole.ADMIN] },
  { icon: Activity, label: 'Prediction Engine', path: '/prediction-engine', roles: [UserRole.ROOT_ADMIN, UserRole.ADMIN] },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const filterItems = (items: NavItem[]) => {
    return items.filter(item => !item.roles || (user && item.roles.includes(user.role)));
  };

  const navGroups = [
    { label: 'Personnel', items: filterItems(mainNavItems) },
    { label: 'Operations', items: filterItems(controllerNavItems) },
    { label: 'Administration', items: filterItems(adminNavItems) },
  ].filter(group => group.items.length > 0);

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden font-sans text-white relative">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#030712] to-[#000000]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <CommandPalette />

      <div className="absolute inset-4 md:inset-6 flex overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
        
        {/* Dynamic Command Dock */}
        <motion.aside 
          initial={{ width: 88 }}
          animate={{ width: isExpanded ? 280 : 88 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="relative z-30 flex flex-col items-start py-8 bg-[#000000]/60 border-r border-white/5 backdrop-blur-xl group"
        >
          {/* Logo Section */}
          <div className="flex items-center px-6 w-full mb-10">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              CF
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              className="ml-4 overflow-hidden whitespace-nowrap font-black tracking-widest uppercase text-sm"
            >
              CertForge<span className="text-blue-400">OS</span>
            </motion.div>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 flex flex-col gap-8 w-full px-3 overflow-y-auto no-scrollbar">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2">
                 <motion.p 
                   animate={{ opacity: isExpanded ? 1 : 0 }}
                   className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 overflow-hidden whitespace-nowrap"
                 >
                    {group.label}
                 </motion.p>
                 {group.items.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "relative flex items-center h-11 rounded-xl transition-all duration-300",
                          isActive 
                            ? "bg-blue-500/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" 
                            : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <div className="w-[64px] shrink-0 flex items-center justify-center relative">
                          <item.icon className={cn("w-4.5 h-4.5 transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]")} />
                          {isActive && (
                            <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full" />
                          )}
                        </div>
                        <motion.span animate={{ opacity: isExpanded ? 1 : 0 }} className="overflow-hidden whitespace-nowrap text-xs font-bold tracking-wider">
                          {item.label}
                        </motion.span>
                      </NavLink>
                    );
                 })}
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2 w-full px-3 mt-auto pt-6 border-t border-white/5">
            {(user?.role === UserRole.ROOT_ADMIN || user?.role === UserRole.ADMIN) && (
              <NavLink 
                to="/system-settings"
                className={cn(
                  "relative flex items-center h-11 rounded-xl transition-all duration-300",
                  location.pathname === "/system-settings" ? "bg-blue-500/10 text-blue-400" : "text-white/40 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="w-[64px] shrink-0 flex items-center justify-center"><Settings className="w-4.5 h-4.5" /></div>
                <motion.span animate={{ opacity: isExpanded ? 1 : 0 }} className="overflow-hidden whitespace-nowrap text-xs font-bold tracking-wider">System Settings</motion.span>
              </NavLink>
            )}
            <button onClick={logout} className="relative flex items-center h-11 rounded-xl text-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <div className="w-[64px] shrink-0 flex items-center justify-center"><LogOut className="w-4.5 h-4.5" /></div>
              <motion.span animate={{ opacity: isExpanded ? 1 : 0 }} className="overflow-hidden whitespace-nowrap text-xs font-bold tracking-wider">Terminate Session</motion.span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-transparent">
          <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Clearance Lvl: {user?.role.toUpperCase()}</span>
               </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition-colors cursor-pointer group">
                <Command className="w-3 h-3 group-hover:rotate-90 transition-transform" /> ⌘K Search
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                {user?.full_name?.charAt(0) || 'U'}
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
