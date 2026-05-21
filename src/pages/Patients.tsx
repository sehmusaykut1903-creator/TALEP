import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Filter,
  BadgeCheck,
  ShieldX,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useFirebaseSync } from '../context/FirebaseSyncContext';
import { useSettings } from '../context/SettingsContext';

export default function Patients() {
  const navigate = useNavigate();
  const { t } = useSettings();
  const { cases, isLoading, syncError } = useFirebaseSync();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterRisk, setFilterRisk] = React.useState<'All' | 'Yüksek' | 'Orta' | 'Düşük'>('All');

  // Interactive local search and risk queries on the real-time synced Firestore list
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.id && c.id.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Normalize risks if represented in EN vs TR ('High' -> 'Yüksek', 'Medium' -> 'Orta', 'Low' -> 'Düşük' or similar)
    const normalizeRisk = (risk: string) => {
      const r = risk?.toLowerCase() || '';
      if (r === 'high' || r === 'yüksek') return 'Yüksek';
      if (r === 'medium' || r === 'orta') return 'Orta';
      if (r === 'low' || r === 'düşük') return 'Düşük';
      return risk;
    };

    const patientRiskNormalized = normalizeRisk(c.risk);
    const matchesRisk = filterRisk === 'All' || patientRiskNormalized === filterRisk;

    return matchesSearch && matchesRisk;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="patients-page space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy">Hasta Yönetimi</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-brand-navy/60">Kayıtlı hasta ve çalışan listesi</p>
            {isLoading && (
              <RefreshCw size={14} className="text-brand-blue animate-spin" />
            )}
          </div>
        </div>
        <button 
          onClick={() => navigate('/assessment')}
          className="flex items-center justify-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-navy transition-all shadow-lg shadow-brand-blue/20 cursor-pointer"
        >
          <UserPlus size={20} />
          <span>Yeni Hasta</span>
        </button>
      </header>

      {/* Sync Error Display if Firestore breaks */}
      {syncError && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs">
          <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
          <span>Firestore Gerçek Zamanlı Senkronizasyon Hatası: {syncError}. Çevrimdışı yerel önbellek devrede.</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim, TC veya ID ile ara..."
            className="w-full bg-white border border-brand-navy/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-blue/30 transition-all card-shadow text-brand-navy font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-brand-navy/5 text-brand-navy/60 font-medium card-shadow">
          <Filter size={18} className="text-brand-navy/40" />
          <select 
            value={filterRisk} 
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="bg-transparent border-none outline-none font-bold text-xs text-brand-navy cursor-pointer"
          >
            <option value="All">Tüm Riskler</option>
            <option value="Yüksek">Yüksek Risk</option>
            <option value="Orta">Orta Risk</option>
            <option value="Düşük">Düşük Risk</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl border border-brand-navy/5 overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-navy/5 text-brand-navy/40 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Hasta Bilgisi</th>
                <th className="px-6 py-4">Sektör / Süre</th>
                <th className="px-6 py-4">KKD Kullanımı</th>
                <th className="px-6 py-4">Risk Durumu</th>
                <th className="px-6 py-4 text-right">Eylem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/5">
              {filteredCases.map((patient) => {
                const isPpeReg = patient.ppeUsage;
                // Risk determination with multilingual normalization support
                const getRiskStylesAndLabel = (riskVal: string) => {
                  const cleaned = riskVal?.toLowerCase() || '';
                  if (cleaned === 'high' || cleaned === 'yüksek') {
                    return { text: 'text-brand-red bg-brand-red/5', label: 'Yüksek Risk' };
                  }
                  if (cleaned === 'medium' || cleaned === 'orta') {
                    return { text: 'text-brand-orange bg-brand-orange/5', label: 'Orta Risk' };
                  }
                  return { text: 'text-brand-green bg-brand-green/5', label: 'Düşük Risk' };
                };
                const riskConfig = getRiskStylesAndLabel(patient.risk);

                return (
                  <tr key={patient.id} className="hover:bg-brand-light-blue/30 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                          {patient.name ? patient.name[0]?.toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-bold text-brand-navy tracking-tight">{patient.name}</p>
                          <p className="text-xs text-brand-navy/40">
                            Yaş: {patient.age || 'N/A'} • ID: {patient.id?.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-brand-navy">{patient.sector}</p>
                      <p className="text-xs text-brand-navy/40">{patient.duration}</p>
                    </td>
                    <td className="px-6 py-4">
                      {isPpeReg ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs font-bold">
                          <BadgeCheck size={14} />
                          Düzenli
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-xs font-bold">
                          <ShieldX size={14} />
                          Yetersiz
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${riskConfig.text}`}>
                        {riskConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-brand-navy/20 hover:text-brand-blue transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-navy/40 font-medium italic text-sm">
                    Herhangi bir kayıtlı vaka bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
