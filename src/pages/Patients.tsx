import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Filter,
  BadgeCheck,
  ShieldX
} from 'lucide-react';

const mockPatients = [
  { id: '1', name: 'Ahmet Yılmaz', age: 45, sector: 'Metal', duration: '12 yıl', ppe: true, risk: 'Düşük' },
  { id: '2', name: 'Ayşe Demir', age: 32, sector: 'Tarım', duration: '4 yıl', ppe: false, risk: 'Yüksek' },
  { id: '3', name: 'Mustafa Kaya', age: 50, sector: 'Boya', duration: '20 yıl', ppe: true, risk: 'Orta' },
  { id: '4', name: 'Zeynep Ak', age: 28, sector: 'Hastane', duration: '2 yıl', ppe: true, risk: 'Düşük' },
  { id: '5', name: 'Mehmet Öztürk', age: 38, sector: 'Ayakkabı', duration: '15 yıl', ppe: false, risk: 'Yüksek' },
];

export default function Patients() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="patients-page space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy">Hasta Yönetimi</h2>
          <p className="text-brand-navy/60">Kayıtlı hasta ve çalışan listesi</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-navy transition-all shadow-lg shadow-brand-blue/20">
          <UserPlus size={20} />
          <span>Yeni Hasta</span>
        </button>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" size={20} />
          <input 
            type="text" 
            placeholder="İsim, TC veya ID ile ara..."
            className="w-full bg-white border border-brand-navy/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-blue/30 transition-all card-shadow"
          />
        </div>
        <button className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-brand-navy/5 text-brand-navy/60 font-medium card-shadow">
          <Filter size={20} />
          <span>Filtrele</span>
        </button>
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
              {mockPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-brand-light-blue/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                        {patient.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-brand-navy tracking-tight">{patient.name}</p>
                        <p className="text-xs text-brand-navy/40">Yaş: {patient.age} • ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand-navy">{patient.sector}</p>
                    <p className="text-xs text-brand-navy/40">{patient.duration}</p>
                  </td>
                  <td className="px-6 py-4">
                    {patient.ppe ? (
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
                    <span className={`text-xs font-bold ${
                      patient.risk === 'Yüksek' ? 'text-brand-red' : 
                      patient.risk === 'Orta' ? 'text-brand-orange' : 'text-brand-green'
                    }`}>
                      {patient.risk} Risk
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-brand-navy/20 hover:text-brand-blue transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
