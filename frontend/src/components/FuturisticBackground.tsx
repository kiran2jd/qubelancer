import React, { useEffect, useState } from "react";

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

  const parallaxOffset = scrollY * 0.05;

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Cosmic Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#060a12] to-slate-950" />

      {/* 2. Cybernetic Tech Grid with Radial Vignette & Parallax Shift */}
      <div
        className="absolute inset-0 opacity-[0.12] transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${-parallaxOffset * 0.3}px)`,
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
        }}
      />

      {/* 3. Multi-Spectrum Atmospheric Nebulas (Soft, Non-Intrusive Ambient Glows) */}
      <div
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-pink-500/5 blur-[140px] pointer-events-none"
        style={{ transform: `translate(-50%, ${parallaxOffset * 0.15}px)` }}
      />
      <div
        className="absolute top-1/3 -left-48 w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-cyan-600/10 via-blue-600/5 to-transparent blur-[150px] pointer-events-none"
        style={{ transform: `translateY(${-parallaxOffset * 0.2}px)` }}
      />
      <div
        className="absolute top-1/2 -right-48 w-[620px] h-[620px] rounded-full bg-gradient-to-bl from-teal-500/10 via-emerald-600/5 to-transparent blur-[140px] pointer-events-none"
        style={{ transform: `translateY(${-parallaxOffset * 0.15}px)` }}
      />
      <div
        className="absolute -bottom-36 left-1/3 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-900/15 via-slate-900/10 to-transparent blur-[160px] pointer-events-none"
      />

      {/* 4. Delicate Geometric Circuit Traces (Far Background Lines Only, No Overlapping Badges) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.10] transition-transform duration-300 ease-out"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `translateY(${-parallaxOffset * 0.15}px)` }}
      >
        <defs>
          <linearGradient id="circGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="circGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="circGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Traced Circuit Lines */}
        <path
          d="M 50 140 L 220 140 L 320 240 L 580 240"
          stroke="url(#circGrad1)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="6 4"
        />
        <path
          d="M 580 240 L 720 380 L 1050 380"
          stroke="url(#circGrad2)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 900 90 L 1120 90 L 1260 230 L 1500 230"
          stroke="url(#circGrad3)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="8 6"
        />
        <path
          d="M 140 750 L 320 750 L 480 590 L 800 590"
          stroke="url(#circGrad1)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 800 590 L 980 770 L 1350 770"
          stroke="url(#circGrad2)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="5 5"
        />

        {/* Delicate Connecting Micro-Nodes */}
        <circle cx="220" cy="140" r="2.5" fill="#06b6d4" />
        <circle cx="320" cy="240" r="3" fill="#6366f1" />
        <circle cx="720" cy="380" r="2.5" fill="#8b5cf6" />
        <circle cx="1120" cy="90" r="2.5" fill="#10b981" />
        <circle cx="1260" cy="230" r="3" fill="#06b6d4" />
        <circle cx="480" cy="590" r="2.5" fill="#6366f1" />
        <circle cx="980" cy="770" r="3" fill="#ec4899" />
      </svg>

      {/* 5. Cyber Constellation Micro-Dots (Twinkling Far Particles) */}
      <div className="absolute inset-0">
        <div className="absolute top-[16%] left-[18%] w-1 h-1 rounded-full bg-indigo-400/40 animate-ping" style={{ animationDuration: "6s" }} />
        <div className="absolute top-[38%] left-[12%] w-1 h-1 rounded-full bg-cyan-400/35" />
        <div className="absolute top-[65%] left-[24%] w-1 h-1 rounded-full bg-purple-400/40 animate-ping" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[22%] right-[20%] w-1 h-1 rounded-full bg-emerald-400/40" />
        <div className="absolute top-[45%] right-[14%] w-1 h-1 rounded-full bg-teal-400/35 animate-ping" style={{ animationDuration: "7s" }} />
        <div className="absolute top-[72%] right-[22%] w-1 h-1 rounded-full bg-pink-400/35" />
        <div className="absolute top-[88%] left-[45%] w-1 h-1 rounded-full bg-indigo-300/30" />
      </div>
    </div>
  );
};
