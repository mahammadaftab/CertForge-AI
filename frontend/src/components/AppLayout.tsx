import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Award, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Command,
  HelpCircle,
  MessageSquare,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Employees', path: '/employees' },
  { icon: UserCircle, label: 'Teams', path: '/teams' },
  { icon: Award, label: 'Certifications', path: '/certifications' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Assessments', path: '/assessments' },
  { icon: Zap, label: 'Success Predictor', path: '/predictor' },
];

const SidebarItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
        isActive 
          ? "bg-primary text-white shadow-xl shadow-primary/25 z-10" 
          : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon className="w-5 h-5 shrink-0" />
        <span className="font-bold text-sm tracking-tight">{label}</span>
        {/* Active indicator dot */}
        {isActive && (
          <motion.div 
            layoutId="sidebar-active"
            className="absolute left-[-12px] w-1 h-6 bg-primary rounded-r-full"
          />
        )}
      </>
    )}
  </NavLink>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isCopilotOpen, setIsCopilotOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-20 relative"
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 transform -rotate-3">
            CF
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter dark:text-white block leading-none">CertForge</span>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Intelligence</span>
          </div>
        </div>

        <div className="px-6 py-4 flex-1 space-y-8 overflow-y-auto no-scrollbar">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase px-3 mb-4 tracking-[0.2em]">Navigation</p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <SidebarItem key={item.path} {...item} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase px-3 mb-4 tracking-[0.2em]">Support</p>
            <div className="space-y-1">
              <SidebarItem icon={HelpCircle} label="Help Center" path="/help" />
              <SidebarItem icon={Settings} label="Settings" path="/settings" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="acrylic p-4 rounded-3xl border border-white/20 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-black dark:text-white">AI Assistant</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mb-3">Get real-time insights for your team's readiness.</p>
            <button 
              onClick={() => setIsCopilotOpen(true)}
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Ask Copilot
            </button>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-10 z-10">
          <div className="flex items-center gap-6 w-[500px]">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search metrics, employees, or certifications..." 
                className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <Command className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-2xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black dark:text-white leading-none group-hover:text-primary transition-colors">{user?.full_name || 'System User'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user?.role || 'Member'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-tr from-primary to-blue-400 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-primary/20 transform group-hover:rotate-6 transition-transform">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950 canvas-grid relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            {children}
          </motion.div>

          {/* Floating Action Button (Copilot) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCopilotOpen(true)}
            className="fixed bottom-10 right-10 w-16 h-16 bg-primary rounded-3xl shadow-2xl shadow-primary/40 flex items-center justify-center text-white z-50 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Sparkles className="w-7 h-7" />
          </motion.button>
        </main>
      </div>

      {/* Copilot Drawer (Placeholder) */}
      <AnimatePresence>
        {isCopilotOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCopilotOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[450px] mica shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[70] p-10 flex flex-col border-l border-white/20"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight dark:text-white">CertForge Copilot</h2>
                </div>
                <button onClick={() => setIsCopilotOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <LayoutDashboard className="w-5 h-5 text-slate-400 rotate-45" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                <div className="bg-primary/10 border border-primary/20 p-5 rounded-3xl">
                  <p className="text-sm font-bold text-primary mb-2">👋 How can I help you today?</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    I can analyze team readiness scores, suggest learning paths, or help you generate new assessments.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Suggestions</p>
                  {["Summarize Cloud Ops readiness", "Identify skill gaps in AI/ML team", "Suggest AZ-900 study plan"].map((text, i) => (
                    <button key={i} className="w-full text-left p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-primary/20 transition-all text-sm font-medium dark:text-slate-300">
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 relative group">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Message CertForge Copilot..." 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
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
