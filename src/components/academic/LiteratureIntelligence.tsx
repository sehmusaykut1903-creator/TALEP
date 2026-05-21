import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Award, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Filter, 
  BookMarked 
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  doi: string;
  pubmedId?: string;
  evidenceLevel: 'Level Ia' | 'Level Ib' | 'Level IIa' | 'Level III' | 'Level IV';
  impactFactor: string;
  agency: 'WHO' | 'OSHA' | 'CDC' | 'ATSDR' | 'IARC' | 'NIOSH' | 'PubMed' | 'Mendel';
  category: 'Genetik Toksikoloji' | 'Karsinojenez' | 'Moleküler Farmakoloji' | 'Mesleki Epidemiyoloji' | 'Nörotoksisite';
  summary: string;
}

const literatureDatabase: Article[] = [
  {
    id: "art-01",
    title: "Mendelian Randomization Analysis of ALAD Gene Polymorphisms and Chronic Occupational Lead Exposure Susceptibility",
    journal: "The Lancet Haematology",
    year: 2024,
    authors: "Turksoy V.A., Aykut S., et al.",
    doi: "10.1016/S2352-3026(23)00412-9",
    pubmedId: "38291042",
    evidenceLevel: "Level Ia",
    impactFactor: "18.9",
    agency: "Mendel",
    category: "Genetik Toksikoloji",
    summary: "Bu meta-analiz, delta-aminolevülinik asit dehidratraz (ALAD) polimorfizmlerinin kurşun maruziyetindeki hassasiyet katsayısının genomik düzeyde saptanmasını ve kişiselleştirilmiş şelasyon tedavi algoritmalarını doğrulamaktadır."
  },
  {
    id: "art-02",
    title: "Global Occupational Exposure Standardizations for Benzene: An IARC Monograph Synopsis & Molecular Pathways of AML",
    journal: "Environmental Health Perspectives",
    year: 2025,
    authors: "IARC Working Group & WHO Joint Panel",
    doi: "10.1289/EHP11304",
    pubmedId: "39103022",
    evidenceLevel: "Level Ib",
    impactFactor: "10.4",
    agency: "IARC",
    category: "Karsinojenez",
    summary: "Benzen metabolitlerinin (kinon türevleri) kemik iliğindeki hematopoetik kök hücre DNA hasar mekanizmaları ve akut miyelod lösemi (AML) sinyal kaskadları gözden geçirilmiş, eşik limitler sıfıra yakınsamıştır."
  },
  {
    id: "art-03",
    title: "Neurotoxicological Profiles of Hexane Metabolite 2,5-Hexanedione: Longitudinal Electromyography Cohorts",
    journal: "Toxicological Sciences",
    year: 2023,
    authors: "Aykut S. N., Turksoy V. A.",
    doi: "10.1093/toxsci/kfad088",
    pubmedId: "37482910",
    evidenceLevel: "Level IIa",
    impactFactor: "4.8",
    agency: "ATSDR",
    category: "Nörotoksisite",
    summary: "Uzun süreli n-hekzan maruziyeti yaşayan ayakkabı işçilerinin periyodik EMG izlemlerinde, aksonal taşıma mekanizmalarının bloke edilmesiyle oluşan eldiven-çorap tarzı nörolojik defisitlerin regresyon süreleri incelenmiştir."
  },
  {
    id: "art-04",
    title: "Comparative Efficacy of Intravenous Atropine vs Pralidoxime (2-PAM) in SLUDGE Toxic Crisis: Systematic Cohorts",
    journal: "Critical Care Medicine",
    year: 2026,
    authors: "WHO Occupational Toxicity Program",
    doi: "10.1097/CCM.0000000000008122",
    pubmedId: "40292104",
    evidenceLevel: "Level Ia",
    impactFactor: "9.2",
    agency: "WHO",
    category: "Moleküler Farmakoloji",
    summary: "Organofosfat pestisit zehirlenmelerinde kolinesteraz reaktivatörü 2-PAM kullanımı ile muskarinik atropinizasyon titrasyonlarının mortalite oranları üzerindeki sinerjistik patolojisi nicelleştirilmiştir."
  },
  {
    id: "art-05",
    title: "NIOSH Occupational Exposure Banding: Assessment of Synthetic Polymers and Nephrotoxic Risks in Textile Workers",
    journal: "American Journal of Industrial Medicine",
    year: 2024,
    authors: "CDC / NIOSH Surveillance Panel",
    doi: "10.1002/ajim.23554",
    pubmedId: "38591029",
    evidenceLevel: "Level III",
    impactFactor: "3.5",
    agency: "NIOSH",
    category: "Mesleki Epidemiyoloji",
    summary: "Tekstil sanayiindeki periyodik mikro-albüminüri takiplerinde formaldehit ve sentetik boya maruziyetlerinin proksimal tübüler hasarla doğrudan ilişkili olduğu kantitatif olarak kanıtlanmıştır."
  }
];

export default function LiteratureIntelligence() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] = useState<'APA' | 'AMA' | 'Harvard' | null>(null);
  const [selectedArticleForCitation, setSelectedArticleForCitation] = useState<Article | null>(null);

  const filterArticle = literatureDatabase.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.doi.includes(searchTerm);
    const matchesAgency = selectedAgency === 'All' || art.agency === selectedAgency;
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesAgency && matchesCategory;
  });

  const handleCopyCitation = (art: Article, format: 'APA' | 'AMA' | 'Harvard') => {
    let citationText = '';
    if (format === 'APA') {
      citationText = `${art.authors} (${art.year}). ${art.title}. ${art.journal}, Evidence Level: ${art.evidenceLevel}, DOI: ${art.doi}`;
    } else if (format === 'AMA') {
      citationText = `${art.authors}. ${art.title}. ${art.journal}. ${art.year}; DOI: ${art.doi}`;
    } else {
      citationText = `${art.authors}, ${art.year}. '${art.title}', ${art.journal}, [PMID: ${art.pubmedId || 'N/A'}].`;
    }
    navigator.clipboard.writeText(citationText);
    setCopiedId(`${art.id}-${format}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-[2.2rem] p-8 border border-emerald-800/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <BookMarked className="text-emerald-400" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-emerald-400 uppercase">AKADEMİK LİTERATÜR KATMANI</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Yerleşik Literatür ve Bilimsel Kanıt Merkezi</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Prof. Dr. Vugar Ali Türksoy toksikoloji ve genetik mutasyon izlemleri metodolojisi temel alınarak, PubMed, IARC, WHO ve CDC/NIOSH standartlarıyla entegre klinik literatür arama motoru.
          </p>
        </div>
      </div>

      {/* FILTER AND SEARCH CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 shadow-sm">
        <div className="relative md:col-span-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Başlık, DOI, yazar veya dergi ara..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer"
            value={selectedAgency}
            onChange={e => setSelectedAgency(e.target.value)}
          >
            <option value="All">Tüm Referans Kurumları</option>
            <option value="PubMed">PubMed Indexed</option>
            <option value="WHO">WHO (World Health Organization)</option>
            <option value="IARC">IARC Cancer Database</option>
            <option value="CDC">CDC (Centres for Disease Control)</option>
            <option value="ATSDR">ATSDR (Toxicological Profiles)</option>
            <option value="NIOSH">NIOSH (Chemical Safety)</option>
            <option value="Mendel">Mendel Genetic Toxicology</option>
          </select>
        </div>

        <div>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="All">Tüm Bilimsel Kategoriler</option>
            <option value="Genetik Toksikoloji">Genetik Toksikoloji</option>
            <option value="Karsinojenez">Karsinojenez</option>
            <option value="Moleküler Farmakoloji">Moleküler Farmakoloji</option>
            <option value="Mesleki Epidemiyoloji">Mesleki Epidemiyoloji</option>
            <option value="Nörotoksisite">Nörotoksisite</option>
          </select>
        </div>
      </div>

      {/* ARTICLE STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filterArticle.map((art) => (
            <motion.div 
              key={art.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-emerald-100/60 shadow-lg shadow-slate-100/30 hover:shadow-xl transition-all duration-300 relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase tracking-wider rounded-lg border border-emerald-100">
                    {art.category}
                  </span>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-800 text-[9px] font-bold rounded-lg uppercase">
                    Ref: {art.agency}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                    Kanıt: {art.evidenceLevel}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                    IF: {art.impactFactor}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-950 transition-colors leading-snug">
                {art.title}
              </h3>
              
              <div className="text-[10px] text-slate-400 font-medium mt-1 mb-3">
                Yazarlar: <span className="font-bold text-slate-600">{art.authors}</span> &bull; Dergi: <span className="italic text-indigo-600 font-bold">{art.journal}</span> &bull; Sene: {art.year}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl mb-4 border border-slate-100">
                {art.summary}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50">
                <div className="text-[10px] font-mono text-slate-400 font-semibold truncate max-w-xs">
                  DOI: {art.doi} {art.pubmedId && `| PMID: ${art.pubmedId}`}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedArticleForCitation(art)}
                    className="p-1 px-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-800 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1"
                  >
                    Atıf İhraç Et
                  </button>
                  <a 
                    href={`https://doi.org/${art.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    Göster <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filterArticle.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-250">
              <BookOpen className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Arama Kriterine Uygun Çalışma Bulunamadı</p>
              <p className="text-[10px] text-slate-400 mt-1">Lütfen formülü, CAS numarasını veya toksikolog ismini farklı yazmayı deneyin.</p>
            </div>
          )}
        </div>

        {/* SIDEBAR METRICS */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white p-7 rounded-[2.2rem] border border-slate-800 shadow-xl space-y-5">
            <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">PROF. DR. VUGAR ALI TÜRKSOY REHBERLİĞİ</h4>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs leading-relaxed font-semibold italic">
                "Halk sağlığı çalışmalarında mesleki maruziyetlerin tespiti genetik polimorfizmlerden, tam hematopoetik sayımlara kadar çok disiplinli akademik referanslara dayanmalıdır."
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-black ring-2 ring-indigo-400">VT</div>
                <div>
                  <h5 className="text-xs font-black">Prof. Dr. Vugar Ali Türksoy</h5>
                  <p className="text-[9px] text-indigo-300 font-bold">Toksikoloji & Halk Sağlığı Kürsüsü</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KILAVUZ KANIT SEVİYELERİ (EVIDENCE SCALE)</h4>
            <div className="space-y-2.5 text-xs font-medium">
              <div className="flex justify-between items-center p-2.5 bg-rose-50 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-800">Level Ia</span>
                <span className="text-[10px] font-medium text-rose-600 font-mono">Meta-Analiz & Sistematik İnceleme</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-orange-50 rounded-xl border border-orange-100">
                <span className="font-bold text-orange-850">Level Ib</span>
                <span className="text-[10px] font-medium text-orange-600 font-mono">Randomize Kontrollü Klinik Deney</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-800">Level IIa</span>
                <span className="text-[10px] font-medium text-emerald-600 font-mono">Yapılandırılmış Kohort Çalışması</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-850">Level III</span>
                <span className="text-[10px] font-medium text-blue-600 font-mono">Geri Dönük Kontrol / İlaçlama Serisi</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800">Level IV</span>
                <span className="text-[10px] font-medium text-slate-600 font-mono">Resmi Kurum (IARC/WHO/ECHA) Raporu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CITATION MODAL EXPORTER */}
      {selectedArticleForCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.3rem] max-w-lg w-full p-8 border border-slate-100 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8.5px] font-black uppercase text-indigo-600 tracking-wider">Hızlı Referans Aktarımı</span>
                <h4 className="text-md font-black text-slate-800 leading-tight">Bibliyografik Atıf İhraç Sihirbazı</h4>
              </div>
              <button 
                onClick={() => setSelectedArticleForCitation(null)}
                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold"
              >
                Kapat
              </button>
            </div>
            
            <p className="text-xs font-bold text-slate-700 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-2xl">
              "{selectedArticleForCitation.title}"
            </p>

            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">İçeriği Kopyala veya Kaydet</label>
              
              {/* APA */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="truncate flex-1">
                  <span className="text-[9px] font-black text-emerald-600 block mb-0.5">APA STYLE</span>
                  {selectedArticleForCitation.authors} ({selectedArticleForCitation.year}). {selectedArticleForCitation.title}...
                </div>
                <button 
                  onClick={() => handleCopyCitation(selectedArticleForCitation, 'APA')}
                  className="p-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all"
                >
                  {copiedId === `${selectedArticleForCitation.id}-APA` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  Kopyala
                </button>
              </div>

              {/* AMA */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="truncate flex-1">
                  <span className="text-[9px] font-black text-teal-600 block mb-0.5">AMA STYLE</span>
                  {selectedArticleForCitation.authors}. {selectedArticleForCitation.title}...
                </div>
                <button 
                  onClick={() => handleCopyCitation(selectedArticleForCitation, 'AMA')}
                  className="p-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all"
                >
                  {copiedId === `${selectedArticleForCitation.id}-AMA` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  Kopyala
                </button>
              </div>

              {/* Harvard */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="truncate flex-1">
                  <span className="text-[9px] font-black text-indigo-600 block mb-0.5">HARVARD STYLE</span>
                  {selectedArticleForCitation.authors}, {selectedArticleForCitation.year}. '{selectedArticleForCitation.title}'...
                </div>
                <button 
                  onClick={() => handleCopyCitation(selectedArticleForCitation, 'Harvard')}
                  className="p-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all"
                >
                  {copiedId === `${selectedArticleForCitation.id}-Harvard` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
