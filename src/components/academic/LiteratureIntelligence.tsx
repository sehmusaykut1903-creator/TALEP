import React, { useState, useMemo } from 'react';
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
  Scale,
  FileText
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { literatureDatabase, Article } from '../../data/literatureDatabase';
import { toxicAgentsDatabase, ToxicAgentProfile } from '../../data/toxicAgentsDatabase';
import { MsdsPremiumBanner } from '../MsdsPremiumBanner';

export default function LiteratureIntelligence() {
  const { theme, showToast } = useSettings();
  
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

  // PubMed / Nature specific filters
  const [studyDesign, setStudyDesign] = useState<'All' | 'meta_analysis' | 'rct' | 'cohort' | 'epidemiological_survey'>('All');
  const [domainFilter, setDomainFilter] = useState<'All' | 'epidemiology' | 'toxicology'>('All');

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

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Kopyalandı!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. FILTER LITERATURE COMPONENT (with RCT, Cohort, Meta-analysis, Epi/Tox filters)
  const filterArticle = useMemo(() => {
    return literatureDatabase.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            art.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            art.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            art.exposureCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            art.doi.includes(searchTerm);
      
      const matchesAgency = selectedAgency === 'All' || art.agency === selectedAgency;
      
      // Category filter
      let matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;

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

      // 1. Study Design Filters Mapping (RCT, Cohort, Meta-analysis, Epidemiological)
      let matchesStudyDesign = true;
      if (studyDesign === 'meta_analysis') {
        matchesStudyDesign = art.evidenceLevel === 'Level Ia'; // Systematic review / meta analysis
      } else if (studyDesign === 'rct') {
        matchesStudyDesign = art.evidenceLevel === 'Level Ib'; // Randomized Clinical Trial
      } else if (studyDesign === 'cohort') {
        matchesStudyDesign = art.evidenceLevel === 'Level IIa'; // Cohort study
      } else if (studyDesign === 'epidemiological_survey') {
        matchesStudyDesign = art.evidenceLevel === 'Level IV' || art.category === 'Mesleki Epidemiyoloji';
      }

      // 2. Domain Filters (Epidemiology / Toxicology)
      let matchesDomain = true;
      if (domainFilter === 'epidemiology') {
        matchesDomain = art.category === 'Mesleki Epidemiyoloji';
      } else if (domainFilter === 'toxicology') {
        matchesDomain = art.category !== 'Mesleki Epidemiyoloji';
      }

      return matchesSearch && matchesAgency && matchesCategory && matchesCarcinogen && 
             matchesEvidence && matchesYear && matchesOrgan && matchesStudyDesign && matchesDomain;
    });
  }, [searchTerm, selectedAgency, selectedCategory, selectedCarcinogen, selectedEvidence, selectedYear, selectedOrgan, studyDesign, domainFilter]);

  // 2. FILTER CHEMICAL AGENTS COMPONENT
  const filteredAgents = useMemo(() => {
    return toxicAgentsDatabase.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(registrySearch.toLowerCase()) || 
                            agent.nameTr.toLowerCase().includes(registrySearch.toLowerCase()) ||
                            agent.overview.toLowerCase().includes(registrySearch.toLowerCase()) ||
                            agent.acuteToxicity.toLowerCase().includes(registrySearch.toLowerCase()) ||
                            agent.chronicToxicity.toLowerCase().includes(registrySearch.toLowerCase());
      
      const matchesIarc = selectedIarcClass === 'All' || agent.iarcClassification.includes(selectedIarcClass);
      
      return matchesSearch && matchesIarc;
    });
  }, [registrySearch, selectedIarcClass]);

  // Counting dynamic stats
  const totalRecords = literatureDatabase.length;
  const filteredCount = filterArticle.length;
  const metaCount = literatureDatabase.filter(a => a.evidenceLevel === 'Level Ia').length;
  const rctCount = literatureDatabase.filter(a => a.evidenceLevel === 'Level Ib').length;
  const cohortCount = literatureDatabase.filter(a => a.evidenceLevel === 'Level IIa').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER HERO */}
      <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-[#0c1424] text-white rounded-3xl p-8 border border-white/5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <BookMarked className="text-cyan-400" size={16} />
            <span className="text-[10px] font-black tracking-[0.25em] text-cyan-300 uppercase font-mono">PULSED ACADEMIC SPHERE</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Literatür Taraması & Toksikoloji Kütüphanesi</h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Prof. Dr. Vugar Ali Türksoy rehberliğinde derlenmiş, IARC karsinojen standartları, ATSDR toksik kaskadları ve pubmed hakemli kanıt derecelerine göre kategorize edilmiş tıbbi kütüphane.
          </p>
          
          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 mt-4">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-cyan-400 font-mono text-xl font-bold font-black leading-none">{totalRecords}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight block mt-0.5">Yayın Dosyası</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-violet-400 font-mono text-xl font-bold font-black leading-none">{metaCount}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight block mt-0.5">Sistematik Meta-Analiz (Ia)</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-emerald-400 font-mono text-xl font-bold font-black leading-none">{rctCount}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight block mt-0.5">Klinik RCT Seviyesi (Ib)</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-amber-400 font-mono text-xl font-bold font-black leading-none">{cohortCount}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight block mt-0.5">Kohort Sürveyansı (IIa)</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW SELECTOR SWITCH */}
      <div className="bg-slate-100 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 p-1 rounded-2xl flex max-w-sm">
        <button 
          onClick={() => setSubView('registry')}
          className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subView === 'registry' 
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Etken Madde Kimliği
        </button>
        <button 
          onClick={() => setSubView('papers')}
          className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subView === 'papers' 
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          PubMed Kütüphanesi
        </button>
      </div>

      {/* 1. AGENTS DOSSIERS VIEW */}
      {subView === 'registry' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0c101d] p-5 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Toksik ajan, CAS numarası, akut/kronik toksisite ara..."
                  className="w-full bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  value={registrySearch}
                  onChange={e => setRegistrySearch(e.target.value)}
                />
              </div>
              
              <select 
                className="bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-2xl py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
                value={selectedIarcClass}
                onChange={e => setSelectedIarcClass(e.target.value)}
              >
                <option value="All">Tüm IARC Sınıflandırmaları</option>
                <option value="1">Group 1 (Kanserojen)</option>
                <option value="2A">Group 2A (Muhtemel Kanserojen)</option>
                <option value="2B">Group 2B (Olası Kanserojen)</option>
                <option value="3">Group 3 (Sınıflandırılmamış)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgents.map((agent) => (
              <div 
                key={agent.id}
                className="bg-white dark:bg-[#0c101d] rounded-2xl p-5 border border-slate-200/50 dark:border-white/5 hover:border-cyan-400/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-450 px-2 py-0.5 rounded font-mono uppercase tracking-widest leading-none">
                      ID: {agent.id.toUpperCase()}
                    </span>
                    <span className={`text-[9.5px] px-2.5 py-1 rounded-lg border font-black uppercase ${
                      agent.iarcClassification === "Group 1" 
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      IARC {agent.iarcClassification}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-950 dark:text-white">
                    {agent.nameTr} <span className="text-xs text-slate-400 font-semibold italic">({agent.name})</span>
                  </h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {agent.overview}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-3 mt-4 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono">Antidot / Tedavi: <strong className="text-slate-600 dark:text-slate-300">{agent.antidote || "Belirtilmemiş"}</strong></span>
                  <button 
                    onClick={() => setExpandedAgentId(expandedAgentId === agent.id ? null : agent.id)}
                    className="text-cyan-400 font-black uppercase tracking-wider hover:underline"
                  >
                    {expandedAgentId === agent.id ? "DOSYAYI KAPAT" : "KLİNİK DOSYAYI AÇ"}
                  </button>
                </div>

                {expandedAgentId === agent.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-slate-100 dark:border-white/5 mt-4 pt-4 space-y-3 text-xs"
                  >
                    <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                      <strong className="text-rose-400 block mb-1">Akut Toksisite Profili</strong>
                      <p className="text-slate-600 dark:text-slate-450 leading-relaxed font-semibold">{agent.acuteToxicity}</p>
                    </div>
                    <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                      <strong className="text-amber-400 block mb-1">Kronik Toksisite / Organ Hasarı</strong>
                      <p className="text-slate-600 dark:text-slate-450 leading-relaxed font-semibold">{agent.chronicToxicity}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 font-mono text-[10px] grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-slate-500">OSHA Standardı:</span>
                        <span className="text-slate-700 dark:text-slate-200 block font-sans font-bold">{agent.oshaStandard || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-slate-500">NIOSH Limiti:</span>
                        <span className="text-slate-700 dark:text-slate-200 block font-sans font-bold">{agent.nihoshLimit || "N/A"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PUBMED ACADEMIC PAPERS VIEW */}
      {subView === 'papers' && (
        <div className="space-y-6">
          
          {/* SEARCH AND FILTERS BUTTON BAR */}
          <div className="bg-white dark:bg-[#0c101d] p-5 rounded-3xl border border-slate-250/60 dark:border-white/5 shadow-sm space-y-4">
            
            {/* Primary Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Başlık, DOI, yazar veya maruziyet detayları ara..."
                  className="w-full bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <select 
                  className="w-full bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-2xl py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500 cursor-pointer text-ellipsis overflow-hidden"
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
                  className={`w-full py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    showAdvanced 
                      ? 'bg-slate-900 dark:bg-white/10 border-slate-900 dark:border-white/10 text-white' 
                      : 'bg-slate-50 dark:bg-[#040812] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Filter size={14} className={showAdvanced ? 'animate-spin' : ''} />
                  Gelişmiş Filtreler
                </button>
              </div>
            </div>

            {/* Nature/PubMed Study Design Filters Segment */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-slate-100 dark:border-white/5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-tight">Çalışma Dizaynı:</span>
              {[
                { id: 'All', label: 'Tüm Çalışmalar' },
                { id: 'meta_analysis', label: 'Meta-Analiz / Sistemik Revizyon (Level Ia)' },
                { id: 'rct', label: 'Klinik Deney (RCT) (Level Ib)' },
                { id: 'cohort', label: 'Kohort Sürveyansı (Level IIa)' },
                { id: 'epidemiological_survey', label: 'Epidemiyolojik Alan Taraması' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setStudyDesign(opt.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    studyDesign === opt.id
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-400/30'
                      : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Domain Filters (Epi/Tox) */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-tight">Tıbbi Alan Filtresi:</span>
              {[
                { id: 'All', label: 'Tüm Alanlar' },
                { id: 'epidemiology', label: 'Mesleki Epidemiyoloji Kontrolü' },
                { id: 'toxicology', label: 'Hücresel & Genetik Toksikoloji' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDomainFilter(opt.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    domainFilter === opt.id
                      ? 'bg-blue-500/10 text-blue-400 border-blue-400/20'
                      : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* COLLAPSIBLE ADVANCED DRAWER */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1 font-mono">Araştırma Kategorisi</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
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
                      className="w-full bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
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
                      className="w-full bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
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
                      className="w-full bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
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
                  groupBadgeColor = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                } else if (art.carcinogenicGroup === "Group 2A") {
                  groupBadgeColor = "bg-amber-500/15 text-amber-600 border-amber-500/20";
                } else if (art.carcinogenicGroup === "Group 2B") {
                  groupBadgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
                } else if (art.carcinogenicGroup === "Group 3") {
                  groupBadgeColor = "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
                }

                // Dynamically build clean keywords based on category & title words
                const keywords = [
                  art.category.split(' ')[0], 
                  art.exposureCategory.replace('(', '').split(' ')[0],
                  art.journal.split(' ')[0].replace('The', '')
                ].filter(Boolean).map(k => `#${k.toLowerCase()}`);

                return (
                  <motion.div 
                    key={art.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#0c101d] rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 hover:border-cyan-500/40 shadow-sm transition-all focus-within:ring-2 focus-within:ring-cyan-500"
                  >
                    {/* PMID / IF & Citation Level Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 bg-cyan-500/5 text-cyan-400 text-[9px] font-black uppercase tracking-wider rounded-lg border border-cyan-500/10 font-mono">
                          {art.category}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9.5px] font-bold rounded">
                          REF: {art.agency}
                        </span>
                        <span className={`px-2 py-0.5 text-[9.5px] font-extrabold rounded border ${groupBadgeColor}`}>
                          IARC {art.carcinogenicGroup}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-405 border-amber-400/20">
                          {art.evidenceLevel}
                        </span>
                        <span className="text-[9.5px] font-bold text-slate-400 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded">
                          IF: {art.impactFactor}
                        </span>
                      </div>
                    </div>

                    {/* Paper Title (Serif Heading feel like Lancet or Nature) */}
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-950 dark:text-white leading-snug tracking-tight font-sans">
                        {art.title}
                      </h3>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400">
                        By <span className="font-bold text-slate-600 dark:text-slate-300">{art.authors}</span> &bull; <span className="italic font-bold text-indigo-500">{art.journal}</span> &bull; {art.year}
                      </div>
                    </div>

                    {/* DOI & PMID Field values (Nature style) */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-[#040812] border border-slate-200/50 dark:border-white/5 rounded-2xl text-[10.5px] font-mono">
                      <div className="flex items-center justify-between pr-2 border-r border-slate-200/50 dark:border-white/5">
                        <span className="text-slate-400 font-sans">DOI:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 max-w-[130px] truncate">
                          {art.doi}
                        </span>
                        <button 
                          onClick={() => handleCopyText(art.doi, `${art.id}-doi`)}
                          className="text-cyan-400 hover:text-cyan-300 ml-1"
                        >
                          <Copy size={11} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pl-2">
                        <span className="text-slate-400 font-sans">PubMed ID (PMID):</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {art.pubmedId || "N/A"}
                        </span>
                        {art.pubmedId && (
                          <button 
                            onClick={() => handleCopyText(art.pubmedId, `${art.id}-pmid`)}
                            className="text-cyan-400 hover:text-cyan-300 ml-1"
                          >
                            <Copy size={11} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Abstract Component Column (Nature Abstract look) */}
                    <div className="mt-4 border-l-2 border-cyan-400/55 pl-4 py-1">
                      <strong className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block mb-1">ABSTRACT (ÖZET)</strong>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {art.summary}
                      </p>
                    </div>

                    {/* Dynamic Keywords Area (Turkish & English toxicology tokens) */}
                    <div className="mt-3 pl-4 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[9.5px] text-slate-400 font-mono">Anahtar Kelimeler:</span>
                      {keywords.map((kw, idx) => (
                        <span key={idx} className="text-[#0ea5e9] bg-sky-500/10 dark:bg-sky-500/5 text-[9.5px] font-mono px-2 py-0.5 rounded-md hover:scale-105 transition-all">
                          {kw}
                        </span>
                      ))}
                      <span className="text-emerald-400 bg-emerald-500/5 text-[9.5px] font-mono px-2 py-0.5 rounded-md">
                        #{art.exposureCategory.replace('(', '').split(' ')[0].toLowerCase()}
                      </span>
                    </div>

                    {/* EXPANDABLE TRIGGERED BUTTON */}
                    <div className="mt-4">
                      {/* EXPANDED SYSTEM DATA */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3 space-y-3 pt-3 border-t border-slate-100 dark:border-white/5"
                          >
                            <div className="p-4 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl text-xs space-y-1">
                              <span className="text-[9.5px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 font-mono">
                                <Brain size={11} /> Genomik Risk Yorumu
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{art.riskInterpretation}</p>
                            </div>

                            <div className="p-4 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl text-xs space-y-1">
                              <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                                <Beaker size={11} /> Biyobelirteç Bulguları (Biomarkers)
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{art.biomarkerFindings}</p>
                            </div>

                            <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl text-xs space-y-1">
                              <span className="text-[9.5px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                                <ShieldCheck size={11} /> Önerilen Klinik Sürveyans (Monitoring)
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{art.recommendedMonitoring}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
                        <button 
                          onClick={() => toggleArticleDetails(art.id)}
                          className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#0ea5e9] uppercase tracking-wider hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={12} /> Bilimsel Bulguları Kapat
                            </>
                          ) : (
                            <>
                              <ChevronDown size={12} /> Genetik Bulguları Aç ({art.evidenceLevel})
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedArticleForCitation(art)}
                            className="p-1.5 px-3 bg-slate-50 hover:bg-emerald-50 dark:bg-white/5 hover:dark:bg-emerald-500/10 text-slate-500 hover:text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-200/50 dark:border-white/5"
                          >
                            Atıf İhraç Et
                          </button>
                          <a 
                            href={`https://doi.org/${art.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all"
                          >
                            Göster <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filterArticle.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-[#0c101d] rounded-3xl border border-dashed border-slate-200 dark:border-white/5">
                  <BookOpen className="mx-auto text-slate-400 mb-2" size={32} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Arama Kriterine Uygun Çalışma Bulunamadı</p>
                  <p className="text-[10px] text-slate-400 mt-1">Lütfen formülü, maruziyet ajanını veya yazar ismini değiştirmeyi deneyin.</p>
                </div>
              )}
            </div>

            {/* SIDEBAR METRICS */}
            <div className="space-y-6">
              <div className="bg-gradient-to-b from-slate-950 to-[#0e1424] text-white p-7 rounded-[2.2rem] border border-white/5 shadow-xl space-y-5">
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest leading-none font-mono">AKADEMİK METODOLOJİ REHBERİ</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs leading-relaxed font-semibold italic">
                    "Halk sağlığı çalışmalarında mesleki maruziyetlerin tespiti genetik polimorfizmlerden, tam hematopoetik sayımlara kadar çok disiplinli akademik referanslara dayanmalıdır."
                  </div>
                  <div className="flex flex-col border-t border-white/10 pt-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0a2040] border border-cyan-400/25 flex items-center justify-center text-sm font-black text-cyan-400">VT</div>
                      <div>
                        <h5 className="text-xs font-black">Prof. Dr. Vugar Ali Türksoy</h5>
                        <p className="text-[9px] text-cyan-300 font-bold uppercase font-mono tracking-wider">Halk Sağlığı Anabilim Dalı</p>
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

              <div className="bg-white dark:bg-[#0c101d] p-6 rounded-[2.2rem] border border-slate-200/50 dark:border-white/5 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">KILAVUZ KANIT SEVİYELERİ</h4>
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex justify-between items-center p-2.5 bg-rose-500/5 dark:bg-rose-500/[0.02] rounded-xl border border-rose-500/10">
                    <span className="font-extrabold text-rose-450 text-rose-400">Level Ia</span>
                    <span className="text-[9px] font-semibold text-slate-400 font-mono">Meta-Analiz</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-orange-500/5 dark:bg-orange-500/[0.02] rounded-xl border border-orange-500/10">
                    <span className="font-extrabold text-orange-400">Level Ib</span>
                    <span className="text-[9px] font-semibold text-slate-400 font-mono">Klinik RCT Seviyesi</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-emerald-500/5 dark:bg-emerald-500/[0.02] rounded-xl border border-emerald-500/10">
                    <span className="font-extrabold text-emerald-450 text-emerald-400">Level IIa</span>
                    <span className="text-[9px] font-semibold text-slate-400 font-mono">Kohort Sürveyansı</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-blue-500/5 dark:bg-blue-500/[0.02] rounded-xl border border-blue-500/10">
                    <span className="font-extrabold text-blue-400">Level III</span>
                    <span className="text-[9px] font-semibold text-slate-400 font-mono">Retrospektif Deneyler</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MsdsPremiumBanner className="mt-6" />

      {/* CITATION MODAL (Atıf İhraç Etme) */}
      <AnimatePresence>
        {selectedArticleForCitation && (
          <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticleForCitation(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white dark:bg-[#0c101d] rounded-[32px] max-w-lg w-full p-7 border border-slate-200/50 dark:border-white/5 shadow-2xl relative z-10 space-y-5"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono">EXPORTER CONSOLE</span>
                <h3 className="text-base font-black text-slate-950 dark:text-white leading-tight">Yayın Atıf İhraç Motoru</h3>
                <p className="text-xs text-slate-400">Akademik yayınlarınızda referans göstermek üzere uluslararası formatlarda kopyalayın.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#040812] border border-slate-100 dark:border-white/5 rounded-2xl space-y-3.5">
                {/* 1. Vancouver */}
                <div className="space-y-1 pb-3.5 border-b border-slate-200/50 dark:border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400 font-bold uppercase">Vancouver (NLM)</span>
                    <button 
                      onClick={() => handleCopyText(`${selectedArticleForCitation.authors}. ${selectedArticleForCitation.title}. ${selectedArticleForCitation.journal}. ${selectedArticleForCitation.year}; DOI: ${selectedArticleForCitation.doi}`, 'van')}
                      className="text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer font-bold"
                    >
                      Kopyala <Copy size={11} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-300 font-mono leading-normal break-words">
                    {selectedArticleForCitation.authors}. {selectedArticleForCitation.title}. {selectedArticleForCitation.journal}. {selectedArticleForCitation.year}; DOI: {selectedArticleForCitation.doi}
                  </p>
                </div>

                {/* 2. APA */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400 font-bold uppercase">APA 7th Edition</span>
                    <button 
                      onClick={() => handleCopyText(`${selectedArticleForCitation.authors} (${selectedArticleForCitation.year}). ${selectedArticleForCitation.title}. ${selectedArticleForCitation.journal}. doi:${selectedArticleForCitation.doi}`, 'apa')}
                      className="text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer font-bold"
                    >
                      Kopyala <Copy size={11} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-300 font-mono leading-normal break-words">
                    {selectedArticleForCitation.authors} ({selectedArticleForCitation.year}). {selectedArticleForCitation.title}. {selectedArticleForCitation.journal}. doi:{selectedArticleForCitation.doi}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedArticleForCitation(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Kapat
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
