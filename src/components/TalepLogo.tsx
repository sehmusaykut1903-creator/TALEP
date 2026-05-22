import React, { useState } from 'react';
import { motion } from 'motion/react';

interface TalepLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'glass';
}

export const TalepLogo: React.FC<TalepLogoProps> = ({
  size = 'md',
  showText = false,
  showSubtitle = false,
  className = '',
  variant = 'glass',
}) => {
  const [imgErr, setImgErr] = useState(false);

  // Determine dimensions
  const dimensions = {
    sm: { container: 'w-10 h-10 rounded-xl', icon: 20, text: 'text-lg', scale: 0.8 },
    md: { container: 'w-14 h-14 rounded-2xl', icon: 28, text: 'text-2xl', scale: 1 },
    lg: { container: 'w-20 h-20 rounded-[1.75rem]', icon: 40, text: 'text-3.5xl', scale: 1.3 },
    xl: { container: 'w-28 h-28 rounded-[2.25rem]', icon: 56, text: 'text-5xl', scale: 1.8 }
  }[size];

  // Neon-shading values based on variants
  const containerStyles = {
    light: 'bg-white border border-blue-100 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.15)]',
    dark: 'bg-slate-950 border border-blue-950/50 shadow-[0_15px_30px_-5px_rgba(14,165,233,0.3)]',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)] relative overflow-hidden'
  }[variant];

  return (
    <div className={`flex ${showSubtitle ? 'flex-col items-center text-center' : 'items-center'} gap-3 ${className}`}>
      {/* 3D Glassmorphic Glowing Logo Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${dimensions.container} ${containerStyles} overflow-hidden`}>
        {!imgErr ? (
          <img
            src="/IMG_1285.jpeg"
            alt="TALEP Logo"
            className="w-full h-full object-cover rounded-[inherit] relative z-10"
            referrerPolicy="no-referrer"
            onError={() => setImgErr(true)}
          />
        ) : (
          <>
            {/* Luminous Glow Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-blue-600/20 active:from-cyan-400/40 opacity-80" />
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-[inherit] blur-md opacity-25 animate-pulse" />
            
            {/* Lab Liquid Bubbling Motion Mask */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyan-400/20 to-transparent pointer-events-none" />

            {/* Custom Premium Chemistry/Toxicology Icon */}
            <svg
              width={dimensions.icon}
              height={dimensions.icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.8)]"
            >
              {/* Flask Outer Shell with glassy thickness */}
              <path
                d="M8.5 2H15.5M10 2V6L4.5 17.5C3.5 19.5 4.5 22 7 22H17C19.5 22 20.5 19.5 19.5 17.5L14 6V2"
                stroke="url(#flaskGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Luminous Chemical Liquid Level (Toxicology aesthetic) */}
              <path
                d="M6.2 14C8.2 13.5 9.8 14.5 11.5 14C13.2 13.5 14.8 12.5 17.8 14L19.1 16.7C19.6 17.7 19.1 19 18 19.5C17.7 19.6 17.3 19.7 17 19.7H7C5.8 19.7 5 18.7 5.2 17.5L6.2 14Z"
                fill="url(#chemLiquid)"
                className="animate-pulse"
                opacity="0.85"
              />

              {/* Molecular Active Circles / DNA double-helix elements floating inside */}
              <circle cx="10" cy="11" r="1.2" fill="#22d3ee" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
              <circle cx="14" cy="13" r="1" fill="#38bdf8" className="animate-bounce" style={{ animationDelay: '0.5s' }} />
              <circle cx="11.5" cy="16.5" r="1.5" fill="#e0f2fe" className="animate-ping" style={{ animationDuration: '3s' }} />

              {/* Chemical Bonds/Chains */}
              <line x1="10" y1="11" x2="14" y2="13" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />

              {/* Radiating High-Tech Crosshair Graticule Lines */}
              <path d="M12 4.5V2.5" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="flaskGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e0f2fe" />
                  <stop offset="0.32" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="chemLiquid" x1="5" y1="13" x2="19" y2="19.7" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22d3ee" />
                  <stop offset="0.5" stopColor="#06b6d4" />
                  <stop offset="1" stopColor="#0369a1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Luminous Core Flare */}
            <div className="absolute top-[25%] left-[25%] w-4 h-4 rounded-full bg-white/40 blur-sm pointer-events-none z-20" />
          </>
        )}
      </div>

      {showText && (
        <div className={`flex flex-col ${showSubtitle ? 'items-center text-center' : 'text-left'}`}>
          <h1 className={`font-black tracking-widest text-[#0ea5e9] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent`} style={{ fontSize: showSubtitle ? '2rem' : dimensions.text }}>
            TALEP
          </h1>
          {showSubtitle ? (
            <div className="mt-2 space-y-1.5 max-w-[240px]">
              <p className="text-[10px] font-black tracking-tight text-slate-800 dark:text-slate-200 leading-normal uppercase">
                Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu
              </p>
              <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 leading-none mt-1 shrink-0 whitespace-nowrap">
                “2026 Şehmus Aykut tarafından geliştirilmiştir.”
              </p>
            </div>
          ) : (
            <p className="text-[9px] font-black tracking-widest uppercase text-slate-400 mt-0.5">
              Premium CDSS
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TalepLogo;
