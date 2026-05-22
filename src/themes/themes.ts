export type ThemeId = 
  | 'ivory' 
  | 'graphite' 
  | 'obsidian' 
  | 'navy' 
  | 'crimson' 
  | 'emerald' 
  | 'sapphire'
  | 'arctic'
  | 'midnight'
  | 'classic'
  | 'medical'
  | 'public_health'
  | 'toxicology'
  | 'antalya'
  | 'minimal'
  | 'emergency'
  | 'laboratory';

export interface Theme {
  id: ThemeId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  isDark: boolean;
  glow: string;
  sidebarBg: string;
  cardBg: string;
  hoverBg: string;
}

export const themes: Record<ThemeId, Theme> = {
  ivory: {
    id: 'ivory',
    name: 'Ivory Clinical 🏛️',
    primary: '#1e293b', // Slate 800
    secondary: '#0ea5e9', // Medical sky cyan
    accent: '#10b981', // Clean medical green
    background: '#fafaf9', // Stone 50 (warm ivory)
    isDark: false,
    glow: 'rgba(14, 165, 233, 0.1)',
    sidebarBg: 'bg-white border-stone-200/80 text-stone-800',
    cardBg: 'bg-white border-stone-200/60 shadow-md shadow-stone-100',
    hoverBg: 'hover:bg-stone-50',
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite Government 🎞️',
    primary: '#0f172a',
    secondary: '#475569', // Slate 600
    accent: '#059669', // Government green
    background: '#f1f5f9', // Clean elegant gray
    isDark: false,
    glow: 'rgba(71, 85, 105, 0.12)',
    sidebarBg: 'bg-slate-200/90 border-slate-300 text-slate-800',
    cardBg: 'bg-white border-slate-200/80 shadow-sm shadow-slate-200',
    hoverBg: 'hover:bg-slate-100',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Core 🌑',
    primary: '#f8fafc',
    secondary: '#a855f7', // Violet
    accent: '#d8b4fe',
    background: '#09090b', // Pure deep black
    isDark: true,
    glow: 'rgba(168, 85, 247, 0.25)',
    sidebarBg: 'bg-[#121214] border-zinc-805 border-zinc-800 text-zinc-350',
    cardBg: 'bg-[#18181c] border-zinc-800/85 shadow-2xl shadow-black/80',
    hoverBg: 'hover:bg-zinc-800',
  },
  navy: {
    id: 'navy',
    name: 'Navy Intelligence 🌌',
    primary: '#f1f5f9',
    secondary: '#38bdf8', // Light blue
    accent: '#0ea5e9',
    background: '#0a0f1d', // Intensely rich dark blue
    isDark: true,
    glow: 'rgba(56, 189, 248, 0.2)',
    sidebarBg: 'bg-[#0f172a] border-slate-800 text-slate-300',
    cardBg: 'bg-[#1e293b]/85 border-slate-800/60 shadow-lg shadow-black/50',
    hoverBg: 'hover:bg-slate-800/60',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Emergency 🚨',
    primary: '#fff1f2',
    secondary: '#f43f5e', // Emergency rose
    accent: '#fda4af',
    background: '#180202', // Medical urgent deep rose/crimson dark background
    isDark: true,
    glow: 'rgba(244, 63, 94, 0.25)',
    sidebarBg: 'bg-[#270303] border-red-950 text-red-100',
    cardBg: 'bg-[#3b0808]/90 border-red-900/40 shadow-xl shadow-black/40',
    hoverBg: 'hover:bg-red-900/35',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Toxicology 🧪',
    primary: '#ecfdf5',
    secondary: '#10b981', // Tox green
    accent: '#a7f3d0',
    background: '#021e17', // High tension toxicology lab green
    isDark: true,
    glow: 'rgba(16, 185, 129, 0.22)',
    sidebarBg: 'bg-[#042f24] border-emerald-950 text-emerald-100',
    cardBg: 'bg-[#064e3b]/85 border-emerald-800/45 shadow-xl shadow-black/60',
    hoverBg: 'hover:bg-emerald-800/35',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire Medical 💎',
    primary: '#f0fdfa',
    secondary: '#2563eb', // Royal sapphire blue
    accent: '#93c5fd',
    background: '#040d21', // Deep space medical safety sapphire blue
    isDark: true,
    glow: 'rgba(37, 99, 235, 0.25)',
    sidebarBg: 'bg-[#091533] border-slate-800/80 text-slate-200',
    cardBg: 'bg-[#0e214d]/80 border-slate-700/50 shadow-2xl shadow-black/70',
    hoverBg: 'hover:bg-slate-700/45',
  },

  // Fallbacks for any backward-compatible aliases so nothing crashes!
  arctic: {
    id: 'arctic',
    name: 'Ivory Clinical 🏛️',
    primary: '#1e293b',
    secondary: '#0ea5e9',
    accent: '#10b981',
    background: '#fafaf9',
    isDark: false,
    glow: 'rgba(14, 165, 233, 0.1)',
    sidebarBg: 'bg-white border-stone-200/80 text-stone-800',
    cardBg: 'bg-white border-stone-200/60 shadow-md shadow-stone-100',
    hoverBg: 'hover:bg-stone-50',
  },
  midnight: {
    id: 'midnight',
    name: 'Navy Intelligence 🌌',
    primary: '#f1f5f9',
    secondary: '#38bdf8',
    accent: '#0ea5e9',
    background: '#0a0f1d',
    isDark: true,
    glow: 'rgba(56, 189, 248, 0.2)',
    sidebarBg: 'bg-[#0f172a] border-slate-800 text-slate-300',
    cardBg: 'bg-[#1e293b]/85 border-slate-800/60 shadow-lg shadow-black/50',
    hoverBg: 'hover:bg-slate-800/60',
  },
  classic: {
    id: 'classic',
    name: 'Ivory Clinical 🏛️',
    primary: '#1e293b',
    secondary: '#0ea5e9',
    accent: '#10b981',
    background: '#fafaf9',
    isDark: false,
    glow: 'rgba(14, 165, 233, 0.1)',
    sidebarBg: 'bg-white border-stone-200/80 text-stone-800',
    cardBg: 'bg-white border-stone-200/60 shadow-md shadow-stone-100',
    hoverBg: 'hover:bg-stone-50',
  },
  medical: {
    id: 'medical',
    name: 'Sapphire Medical 💎',
    primary: '#f0fdfa',
    secondary: '#2563eb',
    accent: '#93c5fd',
    background: '#040d21',
    isDark: true,
    glow: 'rgba(37, 99, 235, 0.25)',
    sidebarBg: 'bg-[#091533] border-slate-800/80 text-slate-200',
    cardBg: 'bg-[#0e214d]/80 border-slate-700/50 shadow-2xl shadow-black/70',
    hoverBg: 'hover:bg-slate-700/45',
  },
  public_health: {
    id: 'public_health',
    name: 'Ivory Clinical 🏛️',
    primary: '#1e293b',
    secondary: '#0ea5e9',
    accent: '#10b981',
    background: '#fafaf9',
    isDark: false,
    glow: 'rgba(14, 165, 233, 0.1)',
    sidebarBg: 'bg-white border-stone-200/80 text-stone-800',
    cardBg: 'bg-white border-stone-200/60 shadow-md shadow-stone-100',
    hoverBg: 'hover:bg-stone-50',
  },
  toxicology: {
    id: 'toxicology',
    name: 'Emerald Toxicology 🧪',
    primary: '#ecfdf5',
    secondary: '#10b981',
    accent: '#a7f3d0',
    background: '#021e17',
    isDark: true,
    glow: 'rgba(16, 185, 129, 0.22)',
    sidebarBg: 'bg-[#042f24] border-emerald-950 text-emerald-100',
    cardBg: 'bg-[#064e3b]/85 border-emerald-800/45 shadow-xl shadow-black/60',
    hoverBg: 'hover:bg-emerald-800/35',
  },
  antalya: {
    id: 'antalya',
    name: 'Obsidian Core 🌑',
    primary: '#f8fafc',
    secondary: '#a855f7',
    accent: '#d8b4fe',
    background: '#09090b',
    isDark: true,
    glow: 'rgba(16, 185, 129, 0.22)',
    sidebarBg: 'bg-[#121214] border-zinc-800 text-zinc-350',
    cardBg: 'bg-[#18181c] border-zinc-800/85 shadow-2xl shadow-black/85',
    hoverBg: 'hover:bg-zinc-805',
  },
  minimal: {
    id: 'minimal',
    name: 'Ivory Clinical 🏛️',
    primary: '#1e293b',
    secondary: '#0ea5e9',
    accent: '#10b981',
    background: '#fafaf9',
    isDark: false,
    glow: 'rgba(14, 165, 233, 0.1)',
    sidebarBg: 'bg-white border-stone-200/80 text-stone-800',
    cardBg: 'bg-white border-stone-200/60 shadow-md shadow-stone-100',
    hoverBg: 'hover:bg-stone-50',
  },
  emergency: {
    id: 'emergency',
    name: 'Crimson Emergency 🚨',
    primary: '#fff1f2',
    secondary: '#f43f5e',
    accent: '#fda4af',
    background: '#180202',
    isDark: true,
    glow: 'rgba(244, 63, 94, 0.25)',
    sidebarBg: 'bg-[#270303] border-red-950 text-red-100',
    cardBg: 'bg-[#3b0808]/90 border-red-900/40 shadow-xl shadow-black/40',
    hoverBg: 'hover:bg-red-900/35',
  },
  laboratory: {
    id: 'laboratory',
    name: 'Sapphire Medical 💎',
    primary: '#f0fdfa',
    secondary: '#2563eb',
    accent: '#93c5fd',
    background: '#040d21',
    isDark: true,
    glow: 'rgba(37, 99, 235, 0.25)',
    sidebarBg: 'bg-[#091533] border-slate-800/80 text-slate-200',
    cardBg: 'bg-[#0e214d]/80 border-slate-700/50 shadow-2xl shadow-black/70',
    hoverBg: 'hover:bg-slate-700/45',
  }
};
