export type ThemeId = 
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
}

export const themes: Record<ThemeId, Theme> = {
  classic: {
    id: 'classic',
    name: 'TALEP Classic',
    primary: '#0f172a', // slate-900
    secondary: '#3b82f6', // blue-500
    accent: '#f59e0b', // amber-500
    background: '#f8fafc',
    isDark: false,
  },
  medical: {
    id: 'medical',
    name: 'Medical Blue',
    primary: '#0f172a',
    secondary: '#2563eb', // blue-650
    accent: '#10b981', // emerald-550
    background: '#f1f5f9',
    isDark: false,
  },
  public_health: {
    id: 'public_health',
    name: 'Public Health Green',
    primary: '#111827',
    secondary: '#10b981',
    accent: '#14b8a6',
    background: '#f0fdf4',
    isDark: false,
  },
  toxicology: {
    id: 'toxicology',
    name: 'Toxicology Dark',
    primary: '#cbd5e1', // slate-300
    secondary: '#22d3ee', // cyan-400
    accent: '#f43f5e', // rose-500
    background: '#030712', // slate-950
    isDark: true,
  },
  antalya: {
    id: 'antalya',
    name: 'Midnight Sunset',
    primary: '#f8fafc',
    secondary: '#ea580c', // orange-600
    accent: '#8b5cf6', // violet-500
    background: '#090514', // dark indigo-990
    isDark: true,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal White',
    primary: '#171717',
    secondary: '#171717',
    accent: '#737373',
    background: '#ffffff',
    isDark: false,
  },
  emergency: {
    id: 'emergency',
    name: 'Emergency Room',
    primary: '#1c1917',
    secondary: '#ef4444', // red-500
    accent: '#eab308', // yellow-500
    background: '#fff5f5',
    isDark: false,
  },
  laboratory: {
    id: 'laboratory',
    name: 'Laboratory Purple',
    primary: '#1e1b4b',
    secondary: '#7c3aed', // violet-600
    accent: '#db2777', // pink-600
    background: '#f5f3ff',
    isDark: false,
  }
};
