
import { motion, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import AgentsSection from '../components/landing/AgentsSection';
import IntelligenceLayerSection from '../components/landing/IntelligenceLayerSection';
import LiveDashboardSection from '../components/landing/LiveDashboardSection';
import PredictionChartSection from '../components/landing/PredictionChartSection';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import ComparisonSection from '../components/landing/ComparisonSection';
import CTASection from '../components/landing/CTASection';

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden font-sans bg-[#0A0F1E]">
      
      {/* Global Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FF00AA] origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Minimal Navigation */}
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="pointer-events-auto flex items-center justify-between px-2 py-1.5 w-full max-w-[1100px] rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-[24px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.05)] transition-shadow duration-500 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),0_0_30px_rgba(0,229,255,0.15)]"
        >
           {/* Left Branding */}
           <div 
             className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer group/brand" 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0A0F1E] font-black shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover/brand:rotate-12 transition-transform duration-500 text-sm">CF</div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] font-black tracking-widest uppercase leading-none text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">CertForge AI</span>
                <span className="text-[8px] font-bold text-white/50 tracking-[0.2em] uppercase mt-0.5 hidden sm:block leading-none">Enterprise Certification Intelligence Platform</span>
              </div>
           </div>

           {/* Right CTA */}
           <div className="flex items-center pr-1">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/command-center')}
                className="px-6 py-2.5 bg-white text-[#0A0F1E] rounded-full font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-shadow relative overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <span className="relative z-10 flex items-center gap-2">Launch Command Center</span>
              </motion.button>
           </div>
        </motion.nav>
      </div>

      {/* Storytelling Sections */}
      <HeroSection />
      <ProblemSection />
      <WorkflowSection />
      <AgentsSection />
      <IntelligenceLayerSection />
      <LiveDashboardSection />
      <PredictionChartSection />
      <AnalyticsSection />
      <ComparisonSection />
      <CTASection />
      
    </div>
  );
};

export default LandingPage;
