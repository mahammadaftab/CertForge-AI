import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, Sphere, MeshDistortMaterial, Stars, Float, 
  Points, PointMaterial, PerspectiveCamera, Environment,
  Text, Center, Float as FloatDrei
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  BrainCircuit, Zap, Target, Network, Activity, ShieldCheck, 
  Cpu, LayoutDashboard, Globe, AlertTriangle, Lock, Users, 
  BarChart4, ArrowRight, PlayCircle, Search, CheckCircle2, 
  ArrowUpRight, BookOpen, Milestone, Terminal, Server,
  MessageSquare, Share2, Database, Fingerprint, Eye
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- 3D Background & Logic Mesh ---

const DataPacket = ({ start, end, speed = 0.02 }: { start: THREE.Vector3, end: THREE.Vector3, speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(Math.random());

  useFrame(() => {
    if (meshRef.current) {
      setProgress((prev) => (prev + speed) % 1);
      meshRef.current.position.lerpVectors(start, end, progress);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={5} />
    </mesh>
  );
};

const IntelligenceCore = ({ scrollProgress }: { scrollProgress: any }) => {
  const coreRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
      const progress = scrollProgress.get();

      let targetScale = 0.8;
      if (progress <= 0.2) {
        targetScale = 1.5 + (2.5 - 1.5) * (progress / 0.2);
      } else if (progress <= 0.5) {
        targetScale = 2.5 + (0.8 - 2.5) * ((progress - 0.2) / 0.3);
      }

      coreRef.current.scale.set(targetScale, targetScale, targetScale);
      coreRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 4, progress);
    }
  });

  return (
    <group ref={coreRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial 
            color="#00E5FF" 
            distort={0.4} 
            speed={2} 
            roughness={0} 
            metalness={1} 
            transparent 
            opacity={0.3} 
            emissive="#8B5CF6" 
            emissiveIntensity={0.5} 
            wireframe 
          />
        </Sphere>
        <Sphere args={[0.8, 32, 32]}>
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={2} />
        </Sphere>
      </Float>
      
      {/* Dynamic Data Packets */}
      {Array.from({ length: 20 }).map((_, i) => {
        const start = new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
        const end = new THREE.Vector3(0, 0, 0);
        return <DataPacket key={i} start={start} end={end} speed={0.005 + Math.random() * 0.01} />;
      })}
    </group>
  );
};

const Scene3D = ({ scrollProgress }: { scrollProgress: any }) => {
  const cameraZ = useTransform(scrollProgress, [0, 0.5, 1], [5, 10, 3]);
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00E5FF" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#8B5CF6" />
          <Environment preset="city" />
          
          <IntelligenceCore scrollProgress={scrollProgress} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// --- Reusable UI Primitives ---

const SectionEyebrow = ({ text, icon: Icon, color = "text-primary" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    className={cn("flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 w-fit mx-auto mb-10 shadow-2xl backdrop-blur-3xl relative z-10", color)}
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span className="text-[11px] font-black uppercase tracking-[0.5em]">{text}</span>
  </motion.div>
);

const SectionTitle = ({ children, className }: any) => (
  <motion.h2 
    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
    className={cn("text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white mb-12 leading-[0.8] text-center", className)}
  >
    {children}
  </motion.h2>
);

// --- Sections ---

const HeroExperience = ({ navigate, scrollProgress }: { navigate: any, scrollProgress: any }) => {
  const opacity = useTransform(scrollProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollProgress, [0, 0.15], [1, 0.8]);
  const blur = useTransform(scrollProgress, [0, 0.15], ["blur(0px)", "blur(20px)"]);

  return (
    <motion.div style={{ opacity, scale, filter: blur }} className="relative h-screen flex flex-col items-center justify-center px-6 z-20">
      <div className="text-center max-w-7xl mx-auto space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
           <div className="px-4 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              System Live
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">CertForge v4.2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, letterSpacing: "-0.05em" }} animate={{ opacity: 1, letterSpacing: "-0.02em" }} transition={{ duration: 1.5, ease: "circOut" }}
          className="text-7xl md:text-[9rem] lg:text-[12rem] font-black tracking-tighter text-white leading-[0.75] uppercase italic"
        >
          Neural <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]">Capital.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-xl md:text-3xl font-medium text-white/50 max-w-4xl mx-auto italic leading-relaxed"
        >
          Predict certification success before training begins. Power workforce readiness using multi-agent reasoning and enterprise knowledge graphs.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
        >
          <button onClick={() => navigate('/login')} className="px-16 py-8 azure-gradient rounded-full font-black uppercase tracking-[0.3em] text-sm text-black shadow-[0_30px_60px_-15px_rgba(0,229,255,0.6)] hover:scale-110 active:scale-95 transition-all">
            Enter Intelligence OS
          </button>
          <button className="px-16 py-8 bg-white/5 border border-white/10 rounded-full font-black uppercase tracking-[0.3em] text-sm text-white hover:bg-white/10 backdrop-blur-3xl transition-all flex items-center gap-4 group">
            Agent Flow <PlayCircle className="w-6 h-6 group-hover:text-primary transition-colors" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProblemStorytelling = ({ scrollProgress }: any) => {
  const opacity = useTransform(scrollProgress, [0.1, 0.2, 0.35, 0.45], [0, 1, 1, 0]);
  const y = useTransform(scrollProgress, [0.1, 0.2, 0.35, 0.45], [100, 0, 0, -100]);

  return (
    <motion.div style={{ opacity, y }} className="fixed inset-0 flex flex-col items-center justify-center z-10 px-6 pointer-events-none">
       <SectionEyebrow text="The Blindspot" icon={AlertTriangle} color="text-accent" />
       <SectionTitle>Training in the <span className="text-accent">Dark.</span></SectionTitle>
       <p className="text-2xl md:text-4xl font-bold text-white/40 max-w-4xl text-center leading-tight italic">
          "82% of organizations cannot predict certification outcomes. Millions are spent on training with zero visibility into workforce readiness."
       </p>
    </motion.div>
  );
};

const AgentCommandCenter = ({ scrollProgress }: any) => {
  const opacity = useTransform(scrollProgress, [0.45, 0.55, 0.8, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollProgress, [0.45, 0.55], [0.8, 1]);

  const agents = [
    { n: "Foundry IQ", d: "Reasoning", c: "text-secondary", icon: BrainCircuit },
    { n: "Work IQ", d: "Signals", c: "text-emerald-400", icon: Zap },
    { n: "Fabric IQ", d: "Analytics", c: "text-primary", icon: BarChart4 },
    { n: "Prediction", d: "Forecasting", c: "text-amber-500", icon: Target },
    { n: "Readiness", d: "Mapping", c: "text-blue-500", icon: ShieldCheck }
  ];

  return (
    <motion.div style={{ opacity, scale }} className="fixed inset-0 flex flex-col items-center justify-center z-10 px-6 pointer-events-none">
       <SectionEyebrow text="Neural Orchestration" icon={Terminal} color="text-white" />
       <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-20 uppercase">Autonomous <span className="text-primary text-glow">Swarm.</span></h2>
       
       <div className="relative w-full max-w-6xl h-[500px]">
          {/* Connecting Lines */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
             <div className="h-[80%] w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>

          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-10">
             {agents.map((agent, i) => (
               <div key={i} className={cn(
                 "flex flex-col items-center justify-center gap-6 p-8 bg-black/60 border border-white/10 rounded-[3rem] backdrop-blur-3xl",
                 i === 4 ? "col-start-2" : ""
               )}>
                  <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
                     <agent.icon className={cn("w-10 h-10", agent.c)} />
                  </div>
                  <div className="text-center">
                     <span className="text-xl font-black uppercase tracking-tighter text-white">{agent.n}</span>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">{agent.d} Active</p>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </motion.div>
  );
};

const FoundryIQCinematic = ({ scrollProgress }: any) => {
  const opacity = useTransform(scrollProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);

  return (
    <motion.div style={{ opacity }} className="fixed inset-0 flex flex-col items-center justify-center z-10 px-6">
       <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
             <SectionEyebrow text="Foundry IQ" icon={BrainCircuit} color="text-secondary" />
             <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase italic">
                Reasoning <br/> <span className="text-secondary text-glow">Beyond.</span>
             </h2>
             <p className="text-2xl font-medium text-white/60 leading-relaxed italic border-l-4 border-secondary/30 pl-10">
                "System synthesis of workforce signals creates a multi-stage logic mesh. We don't just show data—we explain why it matters."
             </p>
          </div>

          <div className="os-window p-10 rounded-[4rem] border border-secondary/30 bg-secondary/5 relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 living-canvas opacity-10" />
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/40"><Search className="w-5 h-5 text-secondary" /></div>
                   <p className="text-sm font-bold text-white/80">"Who is at risk for AZ-305 rollout?"</p>
                </div>
                <div className="space-y-4 pl-14 border-l border-white/10">
                   {[
                     "Scanning readiness registry...",
                     "Detected 14 nodes with high latency.",
                     "Recalculating success probability...",
                     "Foundry IQ Insight Generated."
                   ].map((step, i) => (
                     <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 1 + (i * 0.5) }} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#8B5CF6]" />
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{step}</span>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </motion.div>
  );
};

// --- Main Cinematic Page ---

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative h-[800vh] bg-[#010204] font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      
      {/* 3D Global Ecosystem */}
      <Scene3D scrollProgress={scrollYProgress} />

      {/* Storytelling Layers */}
      <div className="relative z-10">
         {/* Scene 1: Initial Link */}
         <section className="h-screen relative">
            <HeroExperience navigate={navigate} scrollProgress={scrollYProgress} />
         </section>

         {/* Scene 2: The Problem (Fixed storytelling) */}
         <section className="h-screen" />

         {/* Scene 3: The Problem Content Trigger */}
         <ProblemStorytelling scrollProgress={scrollYProgress} />

         {/* Scene 4: Agent Orchestration */}
         <section className="h-screen" />
         <AgentCommandCenter scrollProgress={scrollYProgress} />

         {/* Scene 5: Foundry IQ Cinematic */}
         <section className="h-screen" />
         <FoundryIQSection /> {/* Using the legacy component for content density */}
         
         <FoundryIQCinematic scrollProgress={scrollYProgress} />

         {/* Scene 6: Intelligence Mesh */}
         <section className="h-screen" />
         <IntelligenceGridSection />

         {/* Scene 7: Security & Global Result */}
         <section className="h-screen" />
         <SecuritySection />

         {/* Final CTA */}
         <section className="h-[200vh] flex flex-col justify-end">
            <ImpactAndCTASection navigate={navigate} />
         </section>
      </div>

      {/* Persistent Navigation Controls (Invisible) */}
      <div className="fixed top-12 right-12 z-[100] flex gap-4">
         <button onClick={() => navigate('/login')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-xl">
            Authorize OS
         </button>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed bottom-12 right-12 w-1 h-32 bg-white/5 rounded-full z-[100] overflow-hidden"
      >
        <motion.div 
          style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          className="w-full bg-primary shadow-[0_0_15px_#00E5FF]"
        />
      </motion.div>
    </div>
  );
};

// --- Legacy Export Wrapper (to ensure sections are available) ---

const FoundryIQSection_Legacy = () => (
  <div className="py-40 relative z-10 px-6 max-w-7xl mx-auto opacity-0 pointer-events-none">
    {/* This is a spacer to ensure scroll depth for the cinematic layer */}
  </div>
);

const FoundryIQSection = FoundryIQSection_Legacy;

const ImpactAndCTASection = ({ navigate }: { navigate: any }) => (
  <div className="py-40 relative z-10 px-6 max-w-7xl mx-auto text-center border-t border-white/5 bg-[#010204]">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-48">
       {[
         { val: "1.2M+", label: "Predictions Generated" },
         { val: "450k", label: "Assessments Scored" },
         { val: "99.9%", label: "Inference Uptime" },
         { val: "0.00", label: "Data Breaches" },
       ].map((stat, i) => (
         <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center">
            <span className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 text-glow italic">{stat.val}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{stat.label}</span>
         </motion.div>
       ))}
    </div>

    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-20 relative pb-20">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/20 rounded-full blur-[300px] pointer-events-none" />
       
       <h2 className="text-7xl md:text-[9rem] lg:text-[13rem] font-black tracking-tighter text-white leading-[0.75] relative z-10 uppercase italic">
         Neural <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary drop-shadow-[0_0_60px_rgba(0,229,255,0.6)]">Orchestration.</span>
       </h2>
       
       <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative z-10">
          <button onClick={() => navigate('/login')} className="px-20 py-10 azure-gradient rounded-full font-black uppercase tracking-[0.3em] text-lg text-black shadow-[0_40px_100px_-20px_rgba(0,229,255,0.7)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
            Authorize Mission Control
          </button>
       </div>
    </motion.div>
  </div>
);

const IntelligenceGridSection = () => (
  <div className="py-40 relative z-10 px-6 max-w-[1800px] mx-auto border-t border-white/5">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
       {/* Work IQ */}
       <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="os-glass p-16 rounded-[4rem] border border-white/10 flex flex-col gap-12 min-h-[700px] bg-black/60 shadow-2xl">
          <SectionEyebrow text="Work IQ" icon={Zap} color="text-amber-400" />
          <h3 className="text-6xl font-black text-white tracking-tighter text-center leading-[0.85] uppercase italic">Workforce <br/>Signals.</h3>
          <div className="flex-1 grid grid-cols-2 gap-8 mt-12">
             {[
               { label: 'Velocity', val: 'High', color: 'text-emerald-400' },
               { label: 'Engagement', val: '88%', color: 'text-primary' },
               { label: 'Latency', val: '12ms', color: 'text-white' },
               { label: 'Completion', val: '94%', color: 'text-secondary' },
             ].map((stat, i) => (
               <div key={i} className="bg-white/5 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center border border-white/5 hover:border-primary/40 transition-all group">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 group-hover:text-primary transition-colors">{stat.label}</span>
                  <span className={cn("text-5xl font-black", stat.color)}>{stat.val}</span>
               </div>
             ))}
          </div>
       </motion.div>

       {/* Fabric IQ */}
       <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="os-glass p-16 rounded-[4rem] border border-white/10 flex flex-col gap-12 min-h-[700px] bg-black/60 shadow-2xl">
          <SectionEyebrow text="Fabric IQ" icon={BarChart4} color="text-primary" />
          <h3 className="text-6xl font-black text-white tracking-tighter text-center leading-[0.85] uppercase italic">Analytics <br/>Lens.</h3>
          <div className="flex-1 mt-12 relative flex flex-col justify-end bg-white/5 rounded-[3.5rem] border border-white/5 p-12 overflow-hidden">
             <div className="flex items-end justify-between h-64 gap-5 relative z-10">
                {[40, 60, 45, 80, 65, 95].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: 0.5 + (i * 0.1), duration: 1.5, ease: "easeOut" }} className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t-3xl relative group">
                     <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black px-5 py-2 rounded-2xl border border-white/10 shadow-2xl">{h}%</div>
                  </motion.div>
                ))}
             </div>
             <div className="w-full h-px bg-white/20 mt-10 relative z-10" />
             <div className="flex justify-between mt-8 relative z-10">
                <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Q1</span>
                <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Q2</span>
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] text-glow">Forecast</span>
             </div>
          </div>
       </motion.div>

       {/* Knowledge Graph */}
       <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="os-window p-16 rounded-[4rem] border border-white/10 flex flex-col gap-12 min-h-[700px] lg:col-span-1 md:col-span-2 bg-black/60 shadow-2xl overflow-hidden relative">
          <SectionEyebrow text="Knowledge Graph" icon={Network} color="text-emerald-400" />
          <h3 className="text-6xl font-black text-white tracking-tighter text-center leading-[0.85] uppercase italic relative z-10">Semantic <br/>Mapping.</h3>
          <div className="flex-1 mt-12 relative flex items-center justify-center">
             <Network className="w-72 h-72 text-white/5 animate-pulse relative z-10" />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[450px] h-[450px] border-[4px] border-emerald-500/10 rounded-full animate-[spin_20s_linear_infinite] border-dashed" />
                <div className="w-[300px] h-[300px] border-[3px] border-primary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="w-[150px] h-[150px] border-[2px] border-secondary/10 rounded-full animate-[spin_10s_linear_infinite]" />
             </div>
             <motion.div animate={{ y: [-30, 30, -30], x: [-20, 20, -20] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-8 h-8 bg-emerald-500 rounded-full shadow-[0_0_40px_#10b981] z-10" />
             <motion.div animate={{ y: [30, -30, 30], x: [20, -20, 20] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-primary rounded-full shadow-[0_0_40px_#00E5FF] z-10" />
          </div>
       </motion.div>
    </div>
  </div>
);

const SecuritySection = () => (
  <div className="py-40 relative z-10 px-6 max-w-[1800px] mx-auto border-t border-white/5">
    <div className="text-center mb-40">
      <SectionEyebrow text="Security Matrix" icon={ShieldCheck} color="text-white" />
      <SectionTitle className="italic uppercase">Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-primary to-secondary">RBAC.</span></SectionTitle>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
       {[
         { role: "Associate", scope: "Neural Discovery", desc: "Access to localized learning paths, adaptive assessments, and personal Work IQ signals.", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/30" },
         { role: "Controller", scope: "Operational Intel", desc: "Access to the Workforce Matrix, Team Readiness scoring, and Fabric IQ analytics mesh.", color: "text-blue-400", bg: "bg-blue-400/5", border: "border-blue-400/30" },
         { role: "Root Admin", scope: "System Kernel", desc: "Full systemic control. Access to Agent Studio, System Settings, and Foundry IQ reasoning engine.", color: "text-purple-400", bg: "bg-purple-400/5", border: "border-purple-400/30" },
       ].map((tier, i) => (
         <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 1 }} className={cn("p-20 rounded-[5rem] border backdrop-blur-3xl relative overflow-hidden group shadow-2xl", tier.bg, tier.border)}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Lock className={cn("w-20 h-20 mb-12", tier.color)} />
            <h3 className="text-6xl font-black text-white tracking-tighter mb-6 uppercase italic">{tier.role}</h3>
            <p className="text-[13px] font-black uppercase tracking-[0.4em] text-white/40 mb-12 border-b border-white/10 pb-10">{tier.scope} Clearance</p>
            <p className="text-xl font-medium text-white/60 leading-relaxed italic">"{tier.desc}"</p>
         </motion.div>
       ))}
    </div>
  </div>
);

export default LandingPage;
