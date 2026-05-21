import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Award, 
  Copy, 
  Check, 
  Filter, 
  BookMarked,
  ShieldCheck,
  AlertTriangle,
  Beaker,
  ChevronDown,
  ChevronUp,
  Brain,
  Hash,
  Activity,
  UserCheck,
  Zap,
  Sparkles,
  Heart,
  Scale
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { literatureDatabase, Article } from '../../data/literatureDatabase';
import { toxicAgentsDatabase, ToxicAgentProfile } from '../../data/toxicAgentsDatabase';

export default function LiteratureIntelligence() {
  const { theme } = useSettings();
  
  // Dual layout toggle
  const [subView, setSubView] = useState<'papers' | 'registry'>('registry');

  // Paper Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Advanced filters state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCarcinogen, setSelectedCarcinogen] = useState<string>('All');
  const [selectedEvidence, setSelectedEvidence] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('All');

  // Registry / Toxic Dossiers Search state
  const [registrySearch, setRegistrySearch] = useState('');
  const [selectedIarcClass, setSelectedIarcClass] = useState('All');
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedArticleForCitation, setSelectedArticleForCitation] = useState<Article | null>(null);
  
  // Track open/collapsed state of detailed panels for each study
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});

  const toggleArticleDetails = (id: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 1. FILTER LITERATURE COMPONENT
  const filterArticle = literatureDatabase.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.exposureCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.doi.includes(searchTerm);
    const matchesAgency = selectedAgency === 'All' || art.agency === selectedAgency;
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesCarcinogen = selectedCarcinogen === 'All' || art.carcinogenicGroup === selectedCarcinogen;
    const matchesEvidence = selectedEvidence === 'All' || art.evidenceLevel === selectedEvidence;
    const matchesYear = selectedYear === 'All' || 
                        (selectedYear === '2025' && art.year === 2025) ||
                        (selectedYear === '2024' && art.year === 2024) ||
                        (selectedYear === '2023' && art.year === 2023) ||
                        (selectedYear === 'Older' && art.year < 2023);
    const matchesOrgan = selectedOrgan === 'All' ||
                         art.summary.toLowerCase().includes(selectedOrgan.toLowerCase()) ||
                         art.riskInterpretation.toLowerCase().includes(selectedOrgan.toLowerCase()) ||
                         art.biomarkerFindings.toLowerCase().includes(selectedOrgan.toLowerCase());

    return matchesSearch && matchesAgency && matchesCategory && matchesCarcinogen && matchesEvidence && matchesYear && matchesOrgan;
  });

  // 2. FILTER CHEMICAL AGENTS COMPONENT
  const filteredAgents = toxicAgentsDatabase.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(registrySearch.toLowerCase()) || 
                          agent.nameTr.toLowerCase().includes(registrySearch.toLowerCase()) ||
                          agent.overview.toLowerCase().includes(registrySearch.toLowerCase()) ||
                          agent.acuteToxicity.toLowerCase().includes(registrySearch.toLowerCase()) ||
                          agent.chronicToxicity.toLowerCase().includes(registrySearch.toLowerCase());
    
    const matchesIarc = selectedIarcClass === 'All' || agent.iarcClassification.includes(selectedIarcClass);
    
    return matchesSearch && matchesIarc;
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

  // Counting dynamic stats
  const totalRecords = literatureDatabase.length;
  const filteredCount = filterArticle.length;
  const group1Count = literatureDatabase.filter(a => a.carcinogenicGroup === 'Group 1').length;
  const levelIaCount = literatureDatabase.filter(a => a.evidenceLevel === 'Level Ia').length;

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 text-white rounded-[2.5rem] p-8 border border-slate-800/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <BookMarked className="text-emerald-400" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-cyan-400 uppercase font-mono">TOKMED TOKSİKOLOJİ KÜTÜPHANESİ</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Ağır Metal, Solvent & Endüstriyel Toksinler Bilgi Bankası</h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Prof. Dr. Vugar Ali Türksoy mesleki epidemiyoloji yönergelerine uygun olarak hazırlanmış IARC, ATSDR ve OSHA standartlarını içeren genişletilmiş 20 ana toksik etken profili ve {totalRecords} üst düzey hakemli yayın veritabanı.
          </p>
          
          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 mt-4">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Diyagnoz Ajanı</span>
              <span className="text-lg font-black text-white">{toxicAgentsDatabase.length} Toksin Profil</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Çalışma / Makale</span>
              <span className="text-lg font-black text-cyan-400">{totalRecords} Yayın</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">IARC Group 1 Kanser</span>
              <span className="text-lg font-black text-rose-400">{group1Count} Karsinojen</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Level Ia Kanıt</span>
              <span className="text-lg font-black text-amber-400">{levelIaCount} Doküman</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW SELECTOR SWITCH */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md border border-slate-200/50">
        <button
          onClick={() => setSubView('registry')}
          className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${subView === 'registry' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Etken Madde Portalları ({toxicAgentsDatabase.length})
        </button>
        <button
          onClick={() => setSubView('papers')}
          className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${subView === 'papers' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Bilimsel Hakemli Makaleler ({totalRecords})
        </button>
      </div>

      {/* 3. TOXIC REGISTRY VIEW */}
      {subView === 'registry' && (
        <div className="space-y-6">
          {/* SEARCH FOR REGISTERED AGENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Kimyasal madde adı, zehirlilik semptomu veya organ etkisi ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                value={registrySearch}
                onChange={e => setRegistrySearch(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer"
                value={selectedIarcClass}
                onChange={e => setSelectedIarcClass(e.target.value)}
              >
                <option value="All">Tüm IARC Sınıflandırmaları</option>
                <option value="Group 1">Group 1 (Kesin Kanseronjen)</option>
                <option value="Group 2A">Group 2A (Muhtemel Kanserojen)</option>
                <option value="Group 2B">Group 2B (Olası Kanserojen)</option>
                <option value="Group 3">Group 3 (Sınıflandırılamayan)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAgents.map(agent => {
              const worksOnAgentCount = literatureDatabase.filter(a => 
                a.title.toLowerCase().includes(agent.name.toLowerCase()) || 
                a.exposureCategory.toLowerCase().includes(agent.nameTr.toLowerCase())
              ).length;
              const isExpanded = expandedAgentId === agent.id;

              return (
                <div 
                  key={agent.id}
                  className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Badge header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg font-mono border ${
                        agent.iarcClassification.includes("1") ? "bg-red-50 text-red-700 border-red-200" :
                        agent.iarcClassification.includes("2A") ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        IARC {agent.iarcClassification}
                      </span>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[9px] font-bold rounded-lg uppercase">
                        {worksOnAgentCount} İlgili Makale
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900">{agent.nameTr} <span className="text-xs font-bold text-slate-400 font-mono">({agent.name})</span></h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{agent.overview}</p>

                    {/* Standard details */}
                    <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 font-bold block">OSHA Standart Limiti</span>
                        <span className="font-extrabold text-slate-700">{agent.oshaStandard}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">NIOSH Limit REL</span>
                        <span className="font-extrabold text-slate-700">{agent.nihoshLimit}</span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-4 space-y-4 pt-4 border-t border-slate-100"
                        >
                          {/* Exposure Sources */}
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">Başlıca Mesleki Sektör ve Maruziyet Kaynakları</span>
                            <div className="flex flex-wrap gap-1.5">
                              {agent.exposureSources.map((src, i) => (
                                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px]">
                                  • {src}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Toxicity Symptoms */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                            <div>
                              <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block font-mono">Akut Klinik Yanıt</span>
                              <p className="font-medium text-slate-700 mt-1">{agent.acuteToxicity}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-purple-800 uppercase tracking-wider block font-mono">Kronik Birikim Hasarı</span>
                              <p className="font-medium text-slate-700 mt-1">{agent.chronicToxicity}</p>
                            </div>
                          </div>

                          {/* Organ System Effects */}
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">Hedef Organ Sistem Etkileri</span>
                            <div className="space-y-1.5">
                              {agent.organEffects.map((org, i) => (
                                <div key={i} className="flex justify-between items-start text-[11px] border-b border-slate-50 pb-1.5">
                                  <span className="font-black text-slate-800 shrink-0 mr-4">{org.system}</span>
                                  <span className="text-slate-500 text-right font-medium">{org.effect}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mutagenicity, Teratogenicity & Antidote */}
                          <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 text-xs space-y-2">
                            <div className="flex justify-between">
                              <span className="font-black text-orange-850">Mutajenite:</span>
                              <span className="text-slate-600 font-medium">{agent.mutagenicity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-black text-orange-850">Teratojenite:</span>
                              <span className="text-slate-600 font-medium">{agent.teratogenicity}</span>
                            </div>
                            {agent.antidote !== "Yoktur." && (
                              <div className="pt-2 border-t border-orange-200/50 flex justify-between gap-4">
                                <span className="font-black text-emerald-700 uppercase tracking-wider shrink-0 font-mono">Spesifik Panzehir:</span>
                                <span className="text-emerald-950 font-bold text-right">{agent.antidote}</span>
                              </div>
                            )}
                          </div>

                          {/* Biomarkers */}
                          <div className="p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10 text-xs text-slate-700">
                            <span className="text-[10px] font-black text-teal-800 uppercase tracking-widest block mb-1 font-mono">Doğrulayıcı Biyobelirteçler (Biomarkers)</span>
                            <ul className="list-disc list-inside space-y-1 font-medium">
                              {agent.biomarkers.map((bio, i) => (
                                <li key={i}>{bio}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Prevention & PPE */}
                          <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-xs text-slate-700 space-y-2">
                            <div>
                              <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block font-mono">Mühendislik Kontrolleri & Önleme</span>
                              <p className="font-medium text-slate-600 mt-1">{agent.prevention}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block font-mono">Önerilen Özel KKD</span>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {agent.ppe.map((p, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => setExpandedAgentId(isExpanded ? null : agent.id)}
                    className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-100 flex items-center justify-center gap-1.5"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={14} /> Detay Dosyasını Kapat
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> Tıbbi Klinik Dosyasını Gör ({agent.nameTr})
                      </>
                    )}
                  </button>
                </div>
              );
            })}

            {filteredAgents.length === 0 && (
              <div className="md:col-span-2 p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <AlertTriangle className="mx-auto text-amber-500 mb-2" size={32} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Arama Kriterine Uygun Toksin Etken Bulunamadı</p>
                <p className="text-[10px] text-slate-400 mt-1">Lütfen madde ismini kontrol ederek tekrar aratın.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CLINICAL STUDIES PAPERS STREAM */}
      {subView === 'papers' && (
        <div className="space-y-6">
          {/* SEARCH AND FILTERS BUTTON BAR */}
          <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Başlık, DOI, yazar veya maruziyet detayları ara..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer text-ellipsis overflow-hidden"
                  value={selectedAgency}
                  onChange={e => setSelectedAgency(e.target.value)}
                >
                  <option value="All">Tüm İndeks Kurumları</option>
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
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`w-full py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${showAdvanced ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  <Filter size={14} className={showAdvanced ? 'animate-spin' : ''} />
                  Gelişmiş Filtreler
                </button>
              </div>
            </div>

            {/* COLLAPSIBLE ADVANCED DRAWER */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1 font-mono">Araştırma Kategorisi</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer"
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">Tümü</option>
                      <option value="Genetik Toksikoloji">Genetik Toksikoloji</option>
                      <option value="Karsinojenez">Karsinojenez</option>
                      <option value="Moleküler Farmakoloji">Moleküler Farmakoloji</option>
                      <option value="Mesleki Epidemiyoloji">Mesleki Epidemiyoloji</option>
                      <option value="Nörotoksisite">Nörotoksisite</option>
                    </select>
                  </div>

                  {/* Carcinogenicity filter */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1 font-mono">IARC Karsinojen Grubu</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer"
                      value={selectedCarcinogen}
                      onChange={e => setSelectedCarcinogen(e.target.value)}
                    >
                      <option value="All">Tümü</option>
                      <option value="Group 1">Group 1 (Kesin)</option>
                      <option value="Group 2A">Group 2A (Muhtemel)</option>
                      <option value="Group 2B">Group 2B (Olası)</option>
                      <option value="Group 3">Group 3 (Kanıtlanmamış)</option>
                    </select>
                  </div>

                  {/* Evidence level filter */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1 font-mono">Kılavuz Kanıt Seviyesi</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer"
                      value={selectedEvidence}
                      onChange={e => setSelectedEvidence(e.target.value)}
                    >
                      <option value="All">Tümü</option>
                      <option value="Level Ia">Level Ia (Sistematik Derleme)</option>
                      <option value="Level Ib">Level Ib (Klinik Deney)</option>
                      <option value="Level IIa">Level IIa (Kohort Çalışması)</option>
                      <option value="Level III">Level III (Retrospektif)</option>
                      <option value="Level IV">Level IV (Resmi Rapor)</option>
                    </select>
                  </div>

                  {/* Pub Year filter */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1 font-mono">Yayın Yılı</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none focus:border-emerald-500 cursor-pointer"
                      value={selectedYear}
                      onChange={e => setSelectedYear(e.target.value)}
                    >
                      <option value="All">Tümü</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="Older">Eski Tarihli</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {filterArticle.map((art) => {
                const isExpanded = !!expandedArticles[art.id];
                
                // Background color for IARC Monograph groups
                let groupBadgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                if (art.carcinogenicGroup === "Group 1") {
                  groupBadgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20";
                } else if (art.carcinogenicGroup === "Group 2A") {
                  groupBadgeColor = "bg-amber-500/15 text-amber-700 border-amber-500/20";
                } else if (art.carcinogenicGroup === "Group 2B") {
                  groupBadgeColor = "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
                } else if (art.carcinogenicGroup === "Group 3") {
                  groupBadgeColor = "bg-indigo-500/10 text-indigo-700 border-indigo-500/20";
                }

                return (
                  <motion.div 
                    key={art.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-emerald-200/60 shadow-lg shadow-slate-100/30 hover:shadow-xl transition-all duration-300 relative group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase tracking-wider rounded-lg border border-emerald-100 font-mono">
                          {art.category}
                        </span>
                        <span className="px-2.5 py-1 bg-teal-50 text-teal-800 text-[9px] font-bold rounded-lg uppercase">
                          REF: {art.agency}
                        </span>
                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${groupBadgeColor}`}>
                          IARC {art.carcinogenicGroup}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                          {art.evidenceLevel}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                          IF: {art.impactFactor}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <span className="text-[11px] font-mono text-slate-300 font-bold mt-0.5">#{art.id.toUpperCase()}</span>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-950 transition-colors leading-snug">
                        {art.title}
                      </h3>
                    </div>
                    
                    <div className="text-[10px] text-slate-400 font-medium mt-1 mb-3 pl-8">
                      Yazarlar: <span className="font-bold text-slate-600">{art.authors}</span> &bull; Dergi: <span className="italic text-indigo-600 font-bold">{art.journal}</span> &bull; Maruziyet: <span className="font-bold text-teal-600">{art.exposureCategory}</span> &bull; Yıl: {art.year}
                    </div>

                    {/* EXPANDABLE TRIGGERED BUTTON */}
                    <div className="pl-8 mb-4">
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-black text-emerald-600 block uppercase tracking-widest mb-1 font-mono">Özet ve Bulgular</span>
                        {art.summary}
                      </p>
                      
                      {/* EXPANDED SYSTEM DATA */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3 space-y-3"
                          >
                            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-xs space-y-1">
                              <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1 font-mono">
                                <Brain size={11} /> Genomik Risk Yorumu
                              </span>
                              <p className="text-slate-700 font-medium leading-relaxed">{art.riskInterpretation}</p>
                            </div>

                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-xs space-y-1">
                              <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1 font-mono">
                                <Beaker size={11} /> Biyobelirteç Bulguları (Biomarkers)
                              </span>
                              <p className="text-slate-700 font-medium leading-relaxed">{art.biomarkerFindings}</p>
                            </div>

                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-xs space-y-1">
                              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1 font-mono">
                                <ShieldCheck size={11} /> Önerilen Klinik Sürveyans (Monitoring)
                              </span>
                              <p className="text-slate-700 font-medium leading-relaxed">{art.recommendedMonitoring}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <button 
                        onClick={() => toggleArticleDetails(art.id)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] font-extrabold text-[#0ea5e9] uppercase tracking-wider hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={12} /> Bilimsel Detayları Gizle
                          </>
                        ) : (
                          <>
                            <ChevronDown size={12} /> Tüm Bilimsel Detayları Göster ({art.evidenceLevel})
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50">
                      <div className="text-[10px] font-mono text-slate-400 font-semibold truncate max-w-xs pl-8">
                        DOI: {art.doi} {art.pubmedId && `| PMID: ${art.pubmedId}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedArticleForCitation(art)}
                          className="p-1 px-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-800 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Atıf İhraç Et
                        </button>
                        <a 
                          href={`https://doi.org/${art.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          Göster <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filterArticle.length === 0 && (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <BookOpen className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Arama Kriterine Uygun Çalışma Bulunamadı</p>
                  <p className="text-[10px] text-slate-400 mt-1">Lütfen formülü, maruziyet ajanını veya yazar ismini değiştirmeyi deneyin.</p>
                </div>
              )}
            </div>

            {/* SIDEBAR METRICS */}
            <div className="space-y-6">
              <div className="bg-gradient-to-b from-slate-950 to-indigo-950 text-white p-7 rounded-[2.2rem] border border-slate-800 shadow-xl space-y-5">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none font-mono">AKADEMİK DANIŞMAN METODOLOJİSİ</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs leading-relaxed font-semibold italic">
                    "Halk sağlığı çalışmalarında mesleki maruziyetlerin tespiti genetik polimorfizmlerden, tam hematopoetik sayımlara kadar çok disiplinli akademik referanslara dayanmalıdır."
                  </div>
                  <div className="flex flex-col border-t border-white/10 pt-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-black ring-2 ring-indigo-400">VT</div>
                      <div>
                        <h5 className="text-xs font-black">Prof. Dr. Vugar Ali Türksoy</h5>
                        <p className="text-[9px] text-indigo-300 font-bold uppercase font-mono tracking-wider">Halk Sağlığı Anabilim Dalı</p>
                        <p className="text-[8px] text-slate-400">Akademik Katman Danışmanı</p>
                      </div>
                    </div>
                    
                    <div className="pt-2.5 border-t border-white/5 space-y-1 text-[9px] font-mono text-slate-400">
                      <div className="flex justify-between items-center">
                        <span>Ana Geliştirici:</span>
                        <span className="font-bold text-white font-sans">Şehmus AYKUT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Klinik Koordinasyon:</span>
                        <span className="font-bold text-slate-200 font-sans">Fatma Nur AYKUT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Araştırma Geliştirme:</span>
                        <span className="font-bold text-slate-300 font-sans">Aghajan MUSALI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">KILAVUZ KANIT SEVİYELERİ (EVIDENCE SCALE)</h4>
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex justify-between items-center p-2.5 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="font-extrabold text-rose-800">Level Ia</span>
                    <span className="text-[10px] font-semibold text-rose-600 font-mono">Meta-Analiz / Sistematik İnceleme</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-orange-50 rounded-xl border border-orange-100">
                    <span className="font-extrabold text-orange-800">Level Ib</span>
                    <span className="text-[10px] font-semibold text-orange-600 font-mono">Randomize Kontrollü Klinik Deney</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="font-extrabold text-emerald-800">Level IIa</span>
                    <span className="text-[10px] font-semibold text-emerald-600 font-mono">Yapılandırılmış Kohort Çalışması</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="font-extrabold text-blue-800">Level III</span>
                    <span className="text-[10px] font-semibold text-blue-600 font-mono">Geri Dönük Kontrol / İlaçlama Serisi</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-extrabold text-slate-800">Level IV</span>
                    <span className="text-[10px] font-semibold text-slate-600 font-mono">IARC / WHO Resmi Raporu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CITATION MODAL EXPORTER */}
      {selectedArticleForCitation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.3rem] max-w-lg w-full p-8 border border-slate-100 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8.5px] font-black uppercase text-indigo-600 tracking-wider font-mono">Hızlı Referans Aktarımı</span>
                <h4 className="text-md font-black text-slate-800 leading-tight">Bibliyografik Atıf İhraç Sihirbazı</h4>
              </div>
              <button 
                onClick={() => setSelectedArticleForCitation(null)}
                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Kapat
              </button>
            </div>
            
            <p className="text-xs font-bold text-slate-700 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-2xl">
              "{selectedArticleForCitation.title}"
            </p>

            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono">İçeriği Kopyala veya Kaydet</label>
              
              {/* APA */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="truncate flex-1">
                  <span className="text-[9px] font-black text-emerald-600 block mb-0.5 font-mono">APA STYLE</span>
                  {selectedArticleForCitation.authors} ({selectedArticleForCitation.year}). {selectedArticleForCitation.title}.
                </div>
                <button 
                  onClick={() => handleCopyCitation(selectedArticleForCitation, 'APA')}
                  className="p-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer"
                >
                  {copiedId === `${selectedArticleForCitation.id}-APA` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  Kopyala
                </button>
              </div>

              {/* AMA */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="truncate flex-1">
                  <span className="text-[9px] font-black text-teal-600 block mb-0.5 font-mono">AMA STYLE</span>
                  {selectedArticleForCitation.authors}. {selectedArticleForCitation.title}.
                </div>
                <button 
                  onClick={() => handleCopyCitation(selectedArticleForCitation, 'AMA')}
                  className="p-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer"
                >
                  {copiedId === `${selectedArticleForCitation.id}-AMA` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  Kopyala
                </button>
              </div>

              {/* Harvard */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="truncate flex-1">
                  <span className="text-[9px] font-black text-indigo-600 block mb-0.5 font-mono">HARVARD STYLE</span>
                  {selectedArticleForCitation.authors}, {selectedArticleForCitation.year}. '{selectedArticleForCitation.title}'...
                </div>
                <button 
                  onClick={() => handleCopyCitation(selectedArticleForCitation, 'Harvard')}
                  className="p-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer"
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
