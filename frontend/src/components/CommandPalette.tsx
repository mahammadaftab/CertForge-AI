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
  Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const CommandPalette = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0A0F1E]/60 backdrop-blur-sm" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl"
          >
            <Command label="Command Menu">
              <div className="flex items-center border-b border-[#00E5FF]/15 px-4">
                <Search className="w-5 h-5 text-[#00E5FF]/60" />
                <Command.Input placeholder="Type a command or search..." />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white/50">
                  ESC
                </div>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-none">
                <Command.Empty className="py-10 text-center text-sm text-white/40">
                   No results found for your query.
                </Command.Empty>

                <Command.Group heading="Navigation" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">
                  <Command.Item onSelect={() => runCommand(() => navigate('/dashboard'))}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Mission Control</span>
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate('/command-center'))}>
                    <Terminal className="w-4 h-4" />
                    <span>AI Command Center</span>
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate('/employees'))}>
                    <Users className="w-4 h-4" />
                    <span>Workforce Registry</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="AI Intelligence" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]/70 mt-4">
                  <Command.Item onSelect={() => runCommand(() => navigate('/predictor'))}>
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Run Success Prediction</span>
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate('/analytics'))}>
                    <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                    <span>Ask AI for Insights</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="System" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-4">
                  <Command.Item onSelect={() => runCommand(() => navigate('/settings'))}>
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => {})}>
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Logout Session</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="p-4 border-t border-[#00E5FF]/10 bg-[#080D1A]/60 rounded-b-[24px] flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <kbd className="px-1.5 py-0.5 bg-white/5 border border-[#00E5FF]/15 rounded text-[10px] font-bold text-white/50">↑↓</kbd>
                       <span className="text-[10px] font-medium text-white/40">Navigate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <kbd className="px-1.5 py-0.5 bg-white/5 border border-[#00E5FF]/15 rounded text-[10px] font-bold text-white/50">↵</kbd>
                       <span className="text-[10px] font-medium text-white/40">Select</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-[#00E5FF] uppercase tracking-widest italic">
                    <Sparkles className="w-3.5 h-3.5" /> Powered by CertForge AI
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
