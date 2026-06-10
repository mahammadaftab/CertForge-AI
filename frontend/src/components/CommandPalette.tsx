import React from 'react';
import { Command } from 'cmdk';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Zap, 
  Settings, 
  LogOut,
  Sparkles,
  Terminal,
  Award,
  BookOpen,
  BarChart4,
  Network,
  Cpu,
  BrainCircuit,
  Activity,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole, type UserRoleType } from '../context/AuthContext';

const CommandPalette = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const hasRole = (roles: UserRoleType[]) => user && roles.includes(user.role as UserRoleType);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#010204]/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-[640px] bg-[#0A0F1E]/80 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <Command className="w-full bg-transparent">
              <div className="flex items-center border-b border-white/5 px-6 py-4">
                <Search className="w-5 h-5 text-white/40 mr-4" />
                <Command.Input 
                  placeholder="Execute command or jump to module..." 
                  className="w-full bg-transparent text-white font-bold outline-none placeholder:text-white/20 text-sm"
                />
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-white/40">
                  ESC
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
                <Command.List>
                  <Command.Empty className="px-6 py-12 text-center text-xs font-bold text-white/20 uppercase tracking-widest italic">
                    No neural matches found...
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <Command.Item onSelect={() => runCommand(() => navigate('/dashboard'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                      <LayoutDashboard className="w-4.5 h-4.5 text-blue-400" />
                      <span className="text-xs font-bold group-hover:text-white transition-colors">Go to Dashboard</span>
                    </Command.Item>
                    
                    {hasRole([UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.ROOT_ADMIN]) && (
                      <>
                        <Command.Item onSelect={() => runCommand(() => navigate('/certifications'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group text-sm">
                          <Award className="w-4.5 h-4.5 text-emerald-400" />
                          <span className="text-xs font-bold group-hover:text-white transition-colors text-sm">Certifications Catalog</span>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => navigate('/assessments'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                          <BookOpen className="w-4.5 h-4.5 text-amber-400" />
                          <span className="text-xs font-bold group-hover:text-white transition-colors">Adaptive Assessments</span>
                        </Command.Item>
                      </>
                    )}

                  </Command.Group>

                  {hasRole([UserRole.CONTROLLER, UserRole.ROOT_ADMIN]) && (
                    <Command.Group heading="Operations" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-4">
                      <Command.Item onSelect={() => runCommand(() => navigate('/workforce-matrix'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                        <Users className="w-4.5 h-4.5 text-blue-500" />
                        <span className="text-xs font-bold group-hover:text-white transition-colors">Workforce Matrix</span>
                      </Command.Item>
                      <Command.Item onSelect={() => runCommand(() => navigate('/analytics'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                        <BarChart4 className="w-4.5 h-4.5 text-secondary" />
                        <span className="text-xs font-bold group-hover:text-white transition-colors">Enterprise Analytics</span>
                      </Command.Item>
                    </Command.Group>
                  )}

                  {hasRole([UserRole.ROOT_ADMIN]) && (
                    <Command.Group heading="Administration" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]/70 mt-4">
                      <Command.Item onSelect={() => runCommand(() => navigate('/command-center'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                        <Terminal className="w-4.5 h-4.5 text-purple-400" />
                        <span className="text-xs font-bold group-hover:text-white transition-colors">Launch Command Center</span>
                      </Command.Item>
                      <Command.Item onSelect={() => runCommand(() => navigate('/agent-studio'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                        <Cpu className="w-4.5 h-4.5 text-blue-400" />
                        <span className="text-xs font-bold group-hover:text-white transition-colors">Agent Studio</span>
                      </Command.Item>
                      <Command.Item onSelect={() => runCommand(() => navigate('/prediction-engine'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                        <Zap className="w-4.5 h-4.5 text-amber-500" />
                        <span className="text-xs font-bold group-hover:text-white transition-colors text-sm">Run Success Prediction</span>
                      </Command.Item>
                      <Command.Item onSelect={() => runCommand(() => navigate('/system-settings'))} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-white/80 group">
                        <Settings className="w-4.5 h-4.5 text-white/40" />
                        <span className="text-xs font-bold group-hover:text-white transition-colors">System Settings</span>
                      </Command.Item>
                    </Command.Group>
                  )}

                  <Command.Group heading="Session" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-4">
                    <Command.Item onSelect={() => runCommand(logout)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 cursor-pointer transition-colors text-red-500/70 group">
                      <LogOut className="w-4.5 h-4.5" />
                      <span className="text-xs font-bold group-hover:text-red-400 transition-colors">Terminate Neural Link</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </div>

              <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-[10px]">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-white/80 leading-none">{user?.full_name}</span>
                       <span className="text-[9px] font-black uppercase text-white/20 tracking-widest mt-1">{user?.role} clearance</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20 italic">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400/40" /> Powered by CertForge AI
                 </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
