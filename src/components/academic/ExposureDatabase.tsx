import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Search, 
  Download, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  BookMarked, 
  HelpCircle, 
  AlertCircle
} from 'lucide-react';

interface Toxin {
  id: string;
  name: string;
  formula: string;
  cas: string;
  molecularWeight: string;
  ld50: string;
  halfLife: string;
  persistence: 'Çok Yüksek' | 'Yüksek' | 'Orta' | 'Düşük';
  bioaccumulation: 'Hızlı' | 'Yavaş' | 'İhmal Edilebilir' | 'Çok Hızlı';
  oshaPel: string;
  nioshRel: string;
  sectors: string[];
  organImpacts: {
    neuro: number; // 1-5 scale
    hepato: number;
    nephro: number;
    reprod: number;
    dermal: number;
    hematotox: number;
  };
  routes: string[];
  ppe: string[];
  svgStructure: React.ReactNode;
}

const chemicalDatabase: Toxin[] = [
  {
    id: "benzene",
    name: "Benzen",
    formula: "C6H6",
    cas: "71-43-2",
    molecularWeight: "78.11 g/mol",
    ld50: "930 mg/kg p.o. (Rats)",
    halfLife: "72 saat (Kan)",
    persistence: "Orta",
    bioaccumulation: "Yavaş",
    oshaPel: "1 ppm (TWA)",
    nioshRel: "0.1 ppm (REL)",
    sectors: ["Boya", "Kimya", "Petrol Rafinerisi", "Ayakkabı / Deri"],
    organImpacts: { neuro: 4, hepato: 3, nephro: 2, reprod: 3, dermal: 4, hematotox: 5 },
    routes: ["Solunum", "Cilt Emilimi", "Kazara Sindirim"],
    ppe: ["N95 Solvent Filtreli Maske", "Viton Kimyasal Eldiven", "Tip 3 Sızdırmaz Tulum", "Koruyucu Cam Gözlük"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto text-indigo-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="22" strokeDasharray="6 3" />
        <text x="46" y="53" className="text-[7px] font-mono fill-indigo-600 font-extrabold stroke-none">C₆H₆</text>
      </svg>
    )
  },
  {
    id: "lead",
    name: "Kurşun (Ağır Metal)",
    formula: "Pb",
    cas: "7439-92-1",
    molecularWeight: "207.2 g/mol",
    ld50: "450 mg/kg i.p. (Mice)",
    halfLife: "40 yıl (Kemik Dokusu)",
    persistence: "Çok Yüksek",
    bioaccumulation: "Çok Hızlı",
    oshaPel: "0.05 mg/m³",
    nioshRel: "0.05 mg/m³",
    sectors: ["Akü Sanayi", "Geri Dönüşüm", "Metal Eritme", "Kablo Koruması"],
    organImpacts: { neuro: 5, hepato: 2, nephro: 4, reprod: 5, dermal: 1, hematotox: 5 },
    routes: ["İnhalasyon (Toz)", "Sindirim (Ağız)"],
    ppe: ["P3 Toz Maskesi (HEPA)", "Ağır İş Nitril Eldivenler", "Partikül Geçirmez Tulum", "Koruyucu Toz Gözlüğü"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto text-slate-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
        <path d="M50,10 L50,90 M10,50 L90,50" strokeDasharray="4 4" />
        <text x="44" y="53" className="text-[10px] font-mono fill-slate-700 font-extrabold stroke-none">Pb</text>
      </svg>
    )
  },
  {
    id: "formaldehyde",
    name: "Formaldehit",
    formula: "HCHO",
    cas: "50-00-0",
    molecularWeight: "30.03 g/mol",
    ld50: "100 mg/kg (Rats)",
    halfLife: "12 saat (Klinik)",
    persistence: "Düşük",
    bioaccumulation: "İhmal Edilebilir",
    oshaPel: "0.75 ppm",
    nioshRel: "0.016 ppm",
    sectors: ["Hastaneler / Patoloji", "MDF / Panel Sanayi", "Sterilizasyon Küvetleri", "Tekstil Terbiye"],
    organImpacts: { neuro: 3, hepato: 2, nephro: 2, reprod: 2, dermal: 5, hematotox: 4 },
    routes: ["Solunum", "Direkt Göz / Cilt Teması"],
    ppe: ["Kombine ABEK Gaz Maskesi Filtresi", "Butil Koruyucu Eldiven", "Kimyasal Sıçrama Önlüğü", "Tam Koruyucu Siperlik"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto text-amber-500" stroke="currentColor" fill="none" strokeWidth="3">
        <line x1="50" y1="50" x2="50" y2="20" strokeWidth="4" />
        <line x1="46" y1="50" x2="46" y2="20" strokeWidth="4" />
        <line x1="50" y1="50" x2="25" y2="75" />
        <line x1="50" y1="50" x2="75" y2="75" />
        <text x="44" y="16" className="text-[10px] font-mono fill-amber-600 font-extrabold stroke-none">O</text>
        <text x="18" y="85" className="text-[10px] font-mono fill-amber-600 font-bold stroke-none">H</text>
        <text x="74" y="85" className="text-[10px] font-mono fill-amber-600 font-bold stroke-none">H</text>
        <text x="46" y="53" className="text-[10px] font-mono fill-amber-850 font-black stroke-none">C</text>
      </svg>
    )
  },
  {
    id: "organo",
    name: "Klorpirifos (Organofosfat)",
    formula: "C9H11Cl3NO3PS",
    cas: "2921-88-2",
    molecularWeight: "350.59 g/mol",
    ld50: "135 mg/kg p.o. (Rats)",
    halfLife: "27 gün",
    persistence: "Yüksek",
    bioaccumulation: "Hızlı",
    oshaPel: "0.2 mg/m³",
    nioshRel: "0.2 mg/m³ (Dermal)",
    sectors: ["Tarımsal Gübreleme", "Sera İlaçlamaları", "Pest Kontrol"],
    organImpacts: { neuro: 5, hepato: 4, nephro: 3, reprod: 4, dermal: 3, hematotox: 2 },
    routes: ["Cilt Emilimi (%90)", "İnhalasyon (Mist)", "Oral Kontamine Gıdalar"],
    ppe: ["Su Geçirmez Tyvek İlaçlama Tulumu", "Bariyer Kimyasal Nitril Eldiven (Uzun)", "A2P3 Filtreli Maske", "Yarım Yüz Siperlik"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto text-emerald-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <polygon points="50,15 75,30 75,60 50,75 25,60 25,30" />
        <circle cx="50" cy="45" r="8" />
        <line x1="50" y1="45" x2="50" y2="75" strokeWidth="3" />
        <text x="46" y="49" className="text-[8px] font-mono fill-emerald-700 font-extrabold stroke-none">P</text>
        <text x="46" y="86" className="text-[7px] font-mono fill-slate-700 stroke-none">Cl₃</text>
      </svg>
    )
  }
];

export default function ExposureDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToxin, setSelectedToxin] = useState<Toxin>(chemicalDatabase[0]);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('All');

  // Filter Toxins
  const filteredToxins = chemicalDatabase.filter(tox => {
    const matchesSearch = tox.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tox.cas.includes(searchQuery) || 
                          tox.formula.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSector = selectedSector === 'All' || tox.sectors.some(sec => sec.includes(selectedSector));
    
    // Check organ impacts mapping
    let matchesOrgan = true;
    if (selectedOrgan !== 'All') {
      if (selectedOrgan === 'neuro') matchesOrgan = tox.organImpacts.neuro >= 4;
      else if (selectedOrgan === 'hepato') matchesOrgan = tox.organImpacts.hepato >= 4;
      else if (selectedOrgan === 'nephro') matchesOrgan = tox.organImpacts.nephro >= 4;
      else if (selectedOrgan === 'reprod') matchesOrgan = tox.organImpacts.reprod >= 4;
      else if (selectedOrgan === 'hematotox') matchesOrgan = tox.organImpacts.hematotox >= 4;
    }

    return matchesSearch && matchesSector && matchesOrgan;
  });

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white rounded-[2.2rem] p-8 border border-teal-900/45 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl opacity-35 animate-spin" style={{ animationDuration: '24s' }} />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Database className="text-teal-400" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-teal-400 uppercase font-mono">TOKSERİ KİMYASAL MATRİSİ</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Kimyasal Toksin & Moleküler İzleme Veritabanı</h2>
          <p className="text-xs text-teal-200 max-w-2xl leading-relaxed">
            CAS sorgulamaları, LD50 akut katsayıları, biyolojik yarı ömürler, hedef organ hasar matrisleri ve sızdırmaz kişisel koruyucu ekipman (PPE) spesifikasyonları.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT SEARCH AND LIST */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-5 flex flex-col h-[650px]">
          <div className="space-y-3 shrink-0">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Dinamik İnceleme</span>
            
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Toksin, CAS veya formül..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold' text-slate-700 outline-none focus:border-teal-500 transition-colors"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector filter */}
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-[10.5px] font-black text-slate-600 outline-none"
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
            >
              <option value="All">Tüm Sektörler</option>
              <option value="Boya">Boya / Solvent Sanayi</option>
              <option value="Metal">Ağır Metal döküm</option>
              <option value="Hastane">Hastane & Laboratuvar</option>
              <option value="Tarım">Pestisit / Tarım</option>
            </select>

            {/* Organ filter */}
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-[10.5px] font-black text-slate-600 outline-none"
              value={selectedOrgan}
              onChange={e => setSelectedOrgan(e.target.value)}
            >
              <option value="All">Tüm Hedef Organ Sistemleri</option>
              <option value="neuro">Nörotoksinler (Score 4+)</option>
              <option value="hepato">Hepatotoksinler (Score 4+)</option>
              <option value="nephro">Nefrotoksinler (Score 4+)</option>
              <option value="reprod">Üreme Riski (Score 4+)</option>
              <option value="hematotox">Miyelotoksinler (Score 4+)</option>
            </select>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {filteredToxins.map((tox) => (
              <button 
                key={tox.id}
                onClick={() => setSelectedToxin(tox)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-bold flex items-center justify-between group ${
                  selectedToxin.id === tox.id 
                    ? 'bg-gradient-to-r from-teal-900 to-slate-900 border-teal-950 text-white shadow-md' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="truncate font-black text-sm">{tox.name}</p>
                  <p className={`text-[9.5px] font-mono mt-0.5 ${selectedToxin.id === tox.id ? 'text-teal-300' : 'text-slate-400'}`}>CAS {tox.cas} | {tox.formula}</p>
                </div>
              </button>
            ))}
            {filteredToxins.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 font-bold italic">UYGUN BULGU YOK</div>
            )}
          </div>
        </div>

        {/* RIGHT DETAILS VIEW */}
        {selectedToxin && (
          <div className="lg:col-span-3 bg-white p-8 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-7 h-[650px] overflow-y-auto scrollbar-hide">
            
            {/* Top Name, Formula & SVG Molecular Drawing */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 -m-8 mb-4 p-8 border-b border-slate-100 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest font-mono">Kimyasal Veri Kartı</span>
                <h3 className="text-xl font-black text-slate-900 uppercase">{selectedToxin.name} Spektrum Dosyası</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-0.5 bg-white text-indigo-700 font-mono text-[10px] font-bold rounded border border-indigo-100">Mol.W: {selectedToxin.molecularWeight}</span>
                  <span className="px-2.5 py-0.5 bg-white text-emerald-700 font-mono text-[10px] font-bold rounded border border-emerald-100">Yarılanma Ömrü: {selectedToxin.halfLife}</span>
                </div>
              </div>

              {/* Molecular preview box inside visual frame */}
              <div className="p-3 bg-white rounded-3xl border border-slate-250 flex items-center justify-center shadow-inner relative group shrink-0">
                <span className="absolute top-2 left-3 text-[8px] font-black text-slate-300 uppercase tracking-wider">Molekül Geometrisi (SVG)</span>
                {selectedToxin.svgStructure}
              </div>
            </div>

            {/* Multi-Scale Tox Rating Indicators */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Hassaslaşmış Sistem Toksisite Profil Analizi (Score 1-5)</span>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { label: "Miyelotoksisite", score: selectedToxin.organImpacts.hematotox, color: 'bg-red-500' },
                  { label: "Nörotoksisite", score: selectedToxin.organImpacts.neuro, color: 'bg-orange-500' },
                  { label: "Hepatotoksisite", score: selectedToxin.organImpacts.hepato, color: 'bg-amber-500' },
                  { label: "Nefrotoksisite", score: selectedToxin.organImpacts.nephro, color: 'bg-blue-500' },
                  { label: "Reprodüktif Toks.", score: selectedToxin.organImpacts.reprod, color: 'bg-teal-500' },
                  { label: "Dermal İrritasyon", score: selectedToxin.organImpacts.dermal, color: 'bg-slate-500' },
                ].map((org, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none">{org.label}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div 
                          key={s} 
                          className={`h-2.5 w-full rounded-sm ${s <= org.score ? org.color : 'bg-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 font-mono mt-1 block">Skor: {org.score} / 5</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limit ve Akut Derecelendirmeleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ulusal Maruziyet Eşikleri</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">OSHA PEL (Limit Derecesi)</span>
                    <span className="font-mono text-rose-600 font-bold">{selectedToxin.oshaPel}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">NIOSH REL (Önerilen Eşik)</span>
                    <span className="font-mono text-emerald-600 font-bold">{selectedToxin.nioshRel}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">Akut LD50 Ölçüsü</span>
                    <span className="font-mono text-indigo-700 font-bold">{selectedToxin.ld50}</span>
                  </div>
                </div>
              </div>

              {/* PPE & Routes of Entry */}
              <div className="bg-slate-900 text-slate-100 p-6 rounded-[2rem] border border-slate-800 space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Kılavuz PPE Donanım & Çevresel Kapsam</h4>
                
                <div className="space-y-1 text-xs">
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Öncelikli Kişisel Donanım:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1 pb-2">
                    {selectedToxin.ppe.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 rounded-lg text-[9.5px] font-bold text-indigo-300 border border-white/5">{item}</span>
                    ))}
                  </div>

                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-2.5 block">Geçirgenlik / Bireysel Persistence:</span>
                  <div className="flex justify-between pt-1 border-t border-white/5 text-[10.5px]">
                    <span className="text-slate-400">Çevresel Kalıcılık (Persistence):</span>
                    <span className="font-black text-rose-400">{selectedToxin.persistence}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-slate-400">Biyolojik Birikim Katsayısı (Bioaccumulation):</span>
                    <span className="font-black text-indigo-300">{selectedToxin.bioaccumulation}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
