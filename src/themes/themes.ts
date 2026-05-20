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
}

export const themes: Record<ThemeId, Theme> = {
  classic: {
    id: 'classic',
    name: 'TALEP Classic',
    primary: '#0f172a', // slate-900
    secondary: '#3b82f6', // blue-500
    accent: '#f59e0b', // amber-500
    background: '#f8fafc',
  },
  medical: {
    id: 'medical',
    name: 'Medical Blue',
    primary: '#1e40af', // blue-800
    secondary: '#60a5fa',
    accent: '#10b981', // emerald-500
    background: '#f0f9ff',
  },
  public_health: {
    id: 'public_health',
    name: 'Public Health Green',
    primary: '#064e3b', // emerald-900
    secondary: '#10b981',
    accent: '#f97316', // orange-500
    background: '#f0fdf4',
  },
  toxicology: {
    id: 'toxicology',
    name: 'Toxicology Dark',
    primary: '#000000',
    secondary: '#ef4444', // red-500
    accent: '#7c3aed', // violet-600
    background: '#0a0a0a',
  },
  antalya: {
    id: 'antalya',
    name: 'Antalya Congress',
    primary: '#c2410c', // orange-700
    secondary: '#f97316',
    accent: '#0369a1', // sky-700
    background: '#fff7ed',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal White',
    primary: '#171717',
    secondary: '#737373',
    accent: '#000000',
    background: '#ffffff',
  },
  emergency: {
    id: 'emergency',
    name: 'Emergency Red',
    primary: '#991b1b', // red-800
    secondary: '#dc2626',
    accent: '#facc15', // yellow-400
    background: '#fef2f2',
  },
  laboratory: {
    id: 'laboratory',
    name: 'Laboratory Purple',
    primary: '#4c1d95', // violet-900
    secondary: '#8b5cf6',
    accent: '#ec4899', // pink-500
    background: '#f5f3ff',
  }
};
