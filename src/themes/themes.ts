export type ThemeId = 
  | 'arctic' 
  | 'ivory' 
  | 'midnight' 
  | 'obsidian' 
  | 'emerald' 
  | 'sapphire'
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
  arctic: {
    id: 'arctic',
    name: 'Arctic Clinical ❄️',
    primary: '#0f172a',
    secondary: '#06b6d4', // Cyan 500
    accent: '#3b82f6', // Blue 500
    background: '#f8fafc', // Slate 50
    isDark: false,
    glow: 'rgba(6, 182, 212, 0.15)',
    sidebarBg: 'bg-white border-slate-200/80',
    cardBg: 'bg-white border-slate-200/60 shadow-sm',
    hoverBg: 'hover:bg-slate-50',
  },
  ivory: {
    id: 'ivory',
    name: 'Ivory Government 🏛️',
    primary: '#1c1917', // Stone 900
    secondary: '#b45309', // Amber 70
    accent: '#15803d', // Green 700
    background: '#fafaf9', // Stone 50 (warm ivory)
    isDark: false,
    glow: 'rgba(180, 83, 9, 0.1)',
    sidebarBg: 'bg-[#fafaf9] border-stone-200',
    cardBg: 'bg-[#ffffff] border-stone-200 shadow-sm',
    hoverBg: 'hover:bg-stone-50',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Toxicology 🧪',
    primary: '#f1f5f9',
    secondary: '#22d3ee', // Cyan 400
    accent: '#f43f5e', // Rose 500
    background: '#030712', // Very dark slate 950
    isDark: true,
    glow: 'rgba(34, 211, 238, 0.2)',
    sidebarBg: 'bg-slate-950/80 border-slate-900',
    cardBg: 'bg-[#0d1527] border-slate-900 shadow-md',
    hoverBg: 'hover:bg-slate-900/60',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian AI ✨',
    primary: '#f8fafc',
    secondary: '#8b5cf6', // Violet 500
    accent: '#10b981', // Emerald 500
    background: '#09090b', // Zinc 950
    isDark: true,
    glow: 'rgba(139, 92, 246, 0.25)',
    sidebarBg: 'bg-zinc-950/90 border-zinc-900',
    cardBg: 'bg-[#121214] border-zinc-900/80 shadow-lg',
    hoverBg: 'hover:bg-zinc-900/50',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Surveillance 📈',
    primary: '#ecfdf5',
    secondary: '#10b981', // Emerald 500
    accent: '#14b8a6', // Teal 500
    background: '#022c22', // Deep green 950
    isDark: true,
    glow: 'rgba(16, 185, 129, 0.2)',
    sidebarBg: 'bg-[#011e18]/90 border-emerald-950',
    cardBg: 'bg-[#033c2e]/60 border-emerald-900/40 shadow-md',
    hoverBg: 'hover:bg-[#044c3b]/50',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire Intelligence 💠',
    primary: '#f0fdf4',
    secondary: '#3b82f6', // Blue 500
    accent: '#6366f1', // Indigo 500
    background: '#080d21', // Dark blue 950
    isDark: true,
    glow: 'rgba(59, 130, 246, 0.2)',
    sidebarBg: 'bg-[#040817]/90 border-blue-950',
    cardBg: 'bg-[#0a112d] border-blue-900/40 shadow-md',
    hoverBg: 'hover:bg-blue-950/50',
  },

  // Backward compatible alias fallback configurations
  classic: {
    id: 'classic',
    name: 'Arctic Clinical ❄️',
    primary: '#0f172a',
    secondary: '#06b6d4',
    accent: '#3b82f6',
    background: '#f8fafc',
    isDark: false,
    glow: 'rgba(6, 182, 212, 0.15)',
    sidebarBg: 'bg-white border-slate-200/80',
    cardBg: 'bg-white border-slate-200/60 shadow-sm',
    hoverBg: 'hover:bg-slate-50',
  },
  medical: {
    id: 'medical',
    name: 'Arctic Clinical ❄️',
    primary: '#0f172a',
    secondary: '#06b6d4',
    accent: '#3b82f6',
    background: '#f8fafc',
    isDark: false,
    glow: 'rgba(6, 182, 212, 0.15)',
    sidebarBg: 'bg-white border-slate-200/80',
    cardBg: 'bg-white border-slate-200/60 shadow-sm',
    hoverBg: 'hover:bg-slate-50',
  },
  public_health: {
    id: 'public_health',
    name: 'Ivory Government 🏛️',
    primary: '#1c1917',
    secondary: '#b45309',
    accent: '#15803d',
    background: '#fafaf9',
    isDark: false,
    glow: 'rgba(180, 83, 9, 0.1)',
    sidebarBg: 'bg-[#fafaf9] border-stone-200',
    cardBg: 'bg-[#ffffff] border-stone-200 shadow-sm',
    hoverBg: 'hover:bg-stone-50',
  },
  toxicology: {
    id: 'toxicology',
    name: 'Midnight Toxicology 🧪',
    primary: '#f1f5f9',
    secondary: '#22d3ee',
    accent: '#f43f5e',
    background: '#030712',
    isDark: true,
    glow: 'rgba(34, 211, 238, 0.2)',
    sidebarBg: 'bg-slate-950/80 border-slate-900',
    cardBg: 'bg-[#0d1527] border-slate-900 shadow-md',
    hoverBg: 'hover:bg-slate-900/60',
  },
  antalya: {
    id: 'antalya',
    name: 'Obsidian AI ✨',
    primary: '#f8fafc',
    secondary: '#8b5cf6',
    accent: '#10b981',
    background: '#09090b',
    isDark: true,
    glow: 'rgba(139, 92, 246, 0.25)',
    sidebarBg: 'bg-zinc-950/90 border-zinc-900',
    cardBg: 'bg-[#121214] border-zinc-900/80 shadow-lg',
    hoverBg: 'hover:bg-zinc-900/50',
  },
  minimal: {
    id: 'minimal',
    name: 'Ivory Government 🏛️',
    primary: '#1c1917',
    secondary: '#b45309',
    accent: '#15803d',
    background: '#fafaf9',
    isDark: false,
    glow: 'rgba(180, 83, 9, 0.1)',
    sidebarBg: 'bg-[#fafaf9] border-stone-200',
    cardBg: 'bg-[#ffffff] border-stone-200 shadow-sm',
    hoverBg: 'hover:bg-stone-50',
  },
  emergency: {
    id: 'emergency',
    name: 'Midnight Toxicology 🧪',
    primary: '#f1f5f9',
    secondary: '#22d3ee',
    accent: '#f43f5e',
    background: '#030712',
    isDark: true,
    glow: 'rgba(34, 211, 238, 0.2)',
    sidebarBg: 'bg-slate-950/80 border-slate-900',
    cardBg: 'bg-[#0d1527] border-slate-900 shadow-md',
    hoverBg: 'hover:bg-slate-900/60',
  },
  laboratory: {
    id: 'laboratory',
    name: 'Sapphire Intelligence 💠',
    primary: '#f0fdf4',
    secondary: '#3b82f6',
    accent: '#6366f1',
    background: '#080d21',
    isDark: true,
    glow: 'rgba(59, 130, 246, 0.2)',
    sidebarBg: 'bg-[#040817]/90 border-blue-950',
    cardBg: 'bg-[#0a112d] border-blue-900/40 shadow-md',
    hoverBg: 'hover:bg-blue-950/50',
  }
};
