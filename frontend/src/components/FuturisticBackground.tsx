import React, { useEffect, useState } from "react";
import { Bot, Cpu, Users, Zap, Sparkles, Workflow, ShieldCheck } from "lucide-react";

export const FuturisticBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute scroll rotation angles
  const rotX = 25 + Math.sin(scrollY * 0.003) * 15;
  const rotY = (scrollY * 0.12) % 360;
  const rotZ = Math.cos(scrollY * 0.002) * 10;
  const parallaxOffset = scrollY * 0.08;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Deep Cosmic Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#070b14] to-slate-950" />

      {/* 2. Cybernetic Tech Grid with Radial Vignette & Parallax Shift */}
      <div
        className="absolute inset-0 opacity-[0.20] transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${-parallaxOffset * 0.4}px)`,
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 85% 65% at 50% 30%, black 25%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 50% 30%, black 25%, transparent 80%)",
        }}
      />

      {/* 3. Multi-Spectrum Atmospheric Nebulas (AI Violet, Systems Cyan, Freelancer Emerald) */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-500/10 blur-[130px] animate-pulse-glow"
        style={{ transform: `translate(-50%, ${parallaxOffset * 0.2}px)` }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/10 blur-[140px] animate-float-slow"
        style={{ transform: `translateY(${-parallaxOffset * 0.3}px)` }}
      />
      <div
        className="absolute top-1/4 -right-32 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-teal-500/15 via-emerald-600/10 to-indigo-500/10 blur-[130px] animate-float-reverse"
        style={{ transform: `translateY(${-parallaxOffset * 0.25}px)` }}
      />

      {/* 4. Interactive 3D Scroll-Rotating Tech Cubes (Systems, Freelancers, AI) */}
      <div className="hidden lg:block absolute top-1/3 right-[12%] perspective-1000 opacity-60 pointer-events-none">
        <div
          className="w-28 h-28 transform-style-3d transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
          }}
        >
          {/* 3D Cube Faces */}
          <div className="absolute inset-0 rounded-2xl bg-indigo-600/20 border border-indigo-400/50 backdrop-blur-md flex items-center justify-center shadow-lg shadow-indigo-500/30" style={{ transform: "translateZ(56px)" }}>
            <Bot className="w-10 h-10 text-indigo-300 drop-shadow-md" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-teal-600/20 border border-emerald-400/50 backdrop-blur-md flex items-center justify-center shadow-lg shadow-emerald-500/30" style={{ transform: "rotateY(180deg) translateZ(56px)" }}>
            <Users className="w-10 h-10 text-emerald-300 drop-shadow-md" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-cyan-600/20 border border-cyan-400/50 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/30" style={{ transform: "rotateY(-90deg) translateZ(56px)" }}>
            <Cpu className="w-10 h-10 text-cyan-300 drop-shadow-md" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-purple-600/20 border border-purple-400/50 backdrop-blur-md flex items-center justify-center shadow-lg shadow-purple-500/30" style={{ transform: "rotateY(90deg) translateZ(56px)" }}>
            <Zap className="w-10 h-10 text-purple-300 drop-shadow-md" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-indigo-700/20 border border-indigo-400/40 backdrop-blur-md flex items-center justify-center" style={{ transform: "rotateX(90deg) translateZ(56px)" }}>
            <Sparkles className="w-8 h-8 text-amber-300 drop-shadow-md" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md flex items-center justify-center" style={{ transform: "rotateX(-90deg) translateZ(56px)" }}>
            <Workflow className="w-8 h-8 text-slate-300" />
          </div>
        </div>
      </div>

      {/* 5. High-Tech SVG Circuit Conduits & Interconnected Nodes with Dynamic Tilt */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.25] transition-transform duration-300 ease-out"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `translateY(${-parallaxOffset * 0.2}px)` }}
      >
        <defs>
          <linearGradient id="systemsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="aiGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="talentGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <path
          d="M 50 120 L 220 120 L 320 220 L 520 220"
          stroke="url(#systemsGrad)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 4"
        />
        <path
          d="M 520 220 L 640 340 L 900 340"
          stroke="url(#aiGrad)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 850 80 L 1050 80 L 1180 210 L 1400 210"
          stroke="url(#talentGrad)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 6"
        />
        <path
          d="M 120 700 L 300 700 L 450 550 L 750 550"
          stroke="url(#systemsGrad)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 750 550 L 920 720 L 1250 720"
          stroke="url(#aiGrad)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 5"
        />

        <circle cx="220" cy="120" r="3.5" fill="#06b6d4" className="animate-ping" style={{ animationDuration: "3s" }} />
        <circle cx="320" cy="220" r="4" fill="#6366f1" />
        <circle cx="640" cy="340" r="3" fill="#a855f7" />
        <circle cx="1050" cy="80" r="3.5" fill="#10b981" className="animate-ping" style={{ animationDuration: "4s" }} />
        <circle cx="1180" cy="210" r="4" fill="#06b6d4" />
        <circle cx="450" cy="550" r="3.5" fill="#6366f1" />
        <circle cx="920" cy="720" r="4" fill="#ec4899" />
      </svg>

      {/* 6. Ambient Floating Holographic System & AI Badges */}
      <div className="hidden xl:block">
        {/* Node 1: AI Automation & Neural Agent Core (Top Left) */}
        <div
          className="absolute top-28 left-8 p-3 rounded-2xl bg-slate-900/60 border border-indigo-500/20 shadow-2xl backdrop-blur-md animate-float-slow max-w-xs transition-all duration-300 hover:border-indigo-500/40"
          style={{ transform: `translateY(${parallaxOffset * 0.15}px)` }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>AI Automations</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-indigo-300 font-medium font-mono">
                Agent Workflows · Active
              </p>
            </div>
          </div>
        </div>

        {/* Node 2: Verified Freelancer Network (Top Right) */}
        <div
          className="absolute top-36 right-8 p-3 rounded-2xl bg-slate-900/60 border border-teal-500/20 shadow-2xl backdrop-blur-md animate-float-reverse max-w-xs transition-all duration-300 hover:border-teal-500/40"
          style={{ transform: `translateY(${-parallaxOffset * 0.15}px)` }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>Global Freelancers</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-teal-300 font-medium font-mono">
                Verified Experts · Online
              </p>
            </div>
          </div>
        </div>

        {/* Node 3: Decentralized Infrastructure & Systems (Bottom Left) */}
        <div
          className="absolute bottom-24 left-10 p-3 rounded-2xl bg-slate-900/60 border border-cyan-500/20 shadow-2xl backdrop-blur-md animate-float-slow max-w-xs transition-all duration-300 hover:border-cyan-500/40"
          style={{ transform: `translateY(${-parallaxOffset * 0.1}px)` }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>Decentralized Systems</span>
                <Workflow className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-[10px] text-cyan-300 font-medium font-mono">
                Escrow & Ledger · Synced
              </p>
            </div>
          </div>
        </div>

        {/* Node 4: Real-Time Pipelines & Execution (Bottom Right) */}
        <div
          className="absolute bottom-28 right-10 p-3 rounded-2xl bg-slate-900/60 border border-purple-500/20 shadow-2xl backdrop-blur-md animate-float-reverse max-w-xs transition-all duration-300 hover:border-purple-500/40"
          style={{ transform: `translateY(${parallaxOffset * 0.12}px)` }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>Autonomous Pipelines</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] text-purple-300 font-medium font-mono">
                Smart Milestones · Instant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Subtle Micro-Particles / Cyber Constellation Dots */}
      <div className="absolute inset-0">
        <div className="absolute top-[18%] left-[22%] w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-ping" style={{ animationDuration: "5s" }} />
        <div className="absolute top-[42%] left-[14%] w-1 h-1 rounded-full bg-cyan-400/50" />
        <div className="absolute top-[68%] left-[28%] w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-ping" style={{ animationDuration: "7s" }} />
        <div className="absolute top-[15%] right-[24%] w-1 h-1 rounded-full bg-emerald-400/60" />
        <div className="absolute top-[48%] right-[18%] w-1.5 h-1.5 rounded-full bg-teal-400/60 animate-ping" style={{ animationDuration: "6s" }} />
        <div className="absolute top-[75%] right-[25%] w-1 h-1 rounded-full bg-pink-400/50" />
        <div className="absolute top-[85%] left-[50%] w-1 h-1 rounded-full bg-indigo-300/40" />
      </div>
    </div>
  );
};
