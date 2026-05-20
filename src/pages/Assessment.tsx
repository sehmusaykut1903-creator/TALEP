import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { 
  Microscope, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  FlaskConical, 
  AlertCircle,
  FileText,
  Printer,
  Users,
  Activity,
  Wind,
  Image as ImageIcon
} from 'lucide-react';
import { symptoms, sectors, unitMap } from '../data/toxicology';
import { calculateRisk, MatchingResult } from '../utils/matchingEngine';
import { useSettings } from '../context/SettingsContext';

export default function Assessment() {
  const { t, isRTL } = useSettings();
  const location = useLocation();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: '',
    sector: '',
    unit: '',
    symptoms: [] as string[],
    labResults: {
      alt: '',
      ast: '',
      cholinesterase: '',
      bloodLead: '',
      urineArsenic: '',
      wbc: '',
      sft: 'normal',
      xray: 'normal'
    }
  });

  useEffect(() => {
    if (location.state?.demo && location.state?.data) {
      setFormData(location.state.data);
      // If it's a demo, maybe we want to jump to results or just keep them at step 1 to review
    }
  }, [location.state]);

  const [results, setResults] = React.useState<MatchingResult[]>([]);

  const handleNext = () => {
    if (currentStep === 3) {
      const calculationInput = {
        sector: formData.sector,
        unit: formData.unit,
        symptoms: formData.symptoms,
        labResults: {
          ...Object.fromEntries(
            Object.entries(formData.labResults).filter(([k]) => !['sft', 'xray'].includes(k)).map(([k, v]) => [k, v === '' ? undefined : Number(v)])
          ),
          sft: formData.labResults.sft,
          xray: formData.labResults.xray
        }
      } as any;
      setResults(calculateRisk(calculationInput));
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const toggleSymptom = (s: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) 
        ? prev.symptoms.filter(item => item !== s)
        : [...prev.symptoms, s]
    }));
  };

  const steps = [
    { id: 1, title: t('patients'), icon: Users },
    { id: 2, title: t('symptoms'), icon: Activity },
    { id: 3, title: t('labs'), icon: Microscope },
    { id: 4, title: t('results'), icon: FileText },
  ];

  const availableUnits = formData.sector ? unitMap[formData.sector] || [] : [];

  return (
    <div className="assessment-page max-w-4xl mx-auto space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">{t('assessment')}</h2>
        <p className="text-slate-500">TALEP v2.0 Advanced Analysis</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center px-4 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-100 -z-10" />
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${currentStep >= step.id ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-100'}
            `}>
              {currentStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
            </div>
            <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${currentStep >= step.id ? 'text-brand-blue' : 'text-slate-300'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/20 min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">{t('patients')} & {t('sector')}</h3>
                <p className="text-slate-400 text-sm font-medium">Birim ve çalışma alanı takibi.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">AD SOYAD</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="örn. Dr. Ahmet Yılmaz"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 focus:bg-white focus:border-brand-blue transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('sector')}</label>
                  <select 
                    value={formData.sector}
                    onChange={e => setFormData({...formData, sector: e.target.value, unit: ''})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-brand-blue transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="">{t('sector')} Seçiniz...</option>
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('unit')}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableUnits.map(unit => (
                      <button
                        key={unit}
                        onClick={() => setFormData({...formData, unit})}
                        className={`p-4 rounded-xl text-xs font-bold border-2 transition-all ${
                          formData.unit === unit 
                            ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' 
                            : 'border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                    {availableUnits.length === 0 && (
                      <div className="col-span-3 py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 text-sm italic">
                        Lütfen önce sektör seçiniz.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">{t('symptoms')}</h3>
                <p className="text-slate-400 text-sm font-medium">Klinik tabloyu yansıtan tüm bulguları işaretleyin.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {symptoms.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`
                      p-4 rounded-2xl text-xs font-bold transition-all text-center border-2
                      ${formData.symptoms.includes(s) 
                        ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 -translate-y-1' 
                        : 'bg-white text-slate-500 border-slate-100 hover:border-brand-blue/20'}
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 flex-1"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">{t('labs')}</h3>
                <p className="text-slate-400 text-sm font-medium">Biyolojik izlem ve gelişmiş tanı verileri.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-full border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Biyolojik İzlem (Kan/İdrar)</h4>
                </div>
                {[
                  { label: 'ALT (U/L)', key: 'alt' },
                  { label: 'AST (U/L)', key: 'ast' },
                  { label: 'Kolinesteraz (U/L)', key: 'cholinesterase' },
                  { label: 'Kan Kurşun (µg/dL)', key: 'bloodLead' },
                  { label: 'İdrar Arsenik (µg/L)', key: 'urineArsenic' },
                  { label: 'WBC (x10^9/L)', key: 'wbc' },
                ].map((input) => (
                  <div key={input.key} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1">{input.label}</label>
                    <input 
                      type="number"
                      value={formData.labResults[input.key as keyof typeof formData.labResults]}
                      onChange={e => setFormData({
                        ...formData, 
                        labResults: { ...formData.labResults, [input.key]: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 outline-none focus:border-brand-blue transition-all font-mono text-sm"
                    />
                  </div>
                ))}

                <div className="col-span-full border-b border-slate-100 pb-2 mt-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Gelişmiş Tanı (SFT / Grafi)</h4>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Wind size={14} /> Solunum Fonksiyon Testi (SFT)
                  </label>
                  <div className="flex gap-2">
                    {['normal', 'restrictive', 'obstructive'].map(v => (
                      <button
                        key={v}
                        onClick={() => setFormData({...formData, labResults: {...formData.labResults, sft: v}})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${
                          formData.labResults.sft === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ImageIcon size={14} /> Akciğer Grafisi
                  </label>
                  <div className="flex gap-2">
                    {['normal', 'irritation', 'infiltration'].map(v => (
                      <button
                        key={v}
                        onClick={() => setFormData({...formData, labResults: {...formData.labResults, xray: v}})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${
                          formData.labResults.xray === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 flex-1"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{t('results')}</h3>
                  <p className="text-slate-400 text-sm font-medium">TALEP v2.0 Advanced Output</p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-900/10 hover:scale-105 transition-transform"
                >
                  <Printer size={16} /> {t('print_report')}
                </button>
              </div>

              {results.length > 0 ? (
                <div className="space-y-6">
                  {results.slice(0, 3).map((res, i) => (
                    <motion.div 
                      key={res.chemical.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-8 rounded-[2rem] border-2 ${i === 0 ? 'bg-brand-blue/5 border-brand-blue/20' : 'bg-white border-slate-100'}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${i === 0 ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <FlaskConical size={28} />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-slate-900">{res.chemical.name}</h4>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="text-[9px] font-black uppercase text-slate-400 border border-slate-200 px-2 py-0.5 rounded-lg bg-slate-50">CAS: {res.chemical.cas || 'N/A'}</span>
                              <span className={`text-[9px] font-black uppercase border px-2 py-0.5 rounded-lg ${
                                res.chemical.riskLevelBase === 'High' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                              }`}>{t(res.chemical.riskLevelBase?.toLowerCase() || 'medium')} {t('risk_level')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className={`text-4xl font-black tracking-tighter ${res.score > 70 ? 'text-red-500' : 'text-slate-900'}`}>{res.score}</span>
                            <span className="text-xl font-bold opacity-20">%</span>
                          </div>
                          <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest mt-1">Probability</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temel Analiz Bulguları</p>
                          <div className="flex flex-wrap gap-2">
                            {res.reasons.map(reason => (
                              <span key={reason} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 bg-slate-900 text-white p-5 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Klinik Karar Önerisi</p>
                          <p className="text-xs font-medium leading-relaxed leading-relaxed">
                            {res.chemical.riskInfo}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} className="text-slate-200" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-400">Sonuç Bulunamadı</h4>
                  <p className="text-sm text-slate-300 max-w-xs mx-auto mt-2">Girdiğiniz verilere uygun spesifik bir toksikolojik eşleşme saptanamadı.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2.5 px-8 py-4 rounded-[1.5rem] font-bold transition-all ${
            currentStep === 1 ? 'opacity-0' : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50'
          }`}
        >
          <ChevronLeft size={20} /> {t('back')}
        </button>
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2.5 bg-brand-blue text-white px-10 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all"
          >
            {t('next')} <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={() => { 
                setCurrentStep(1); 
                setFormData({ name: '', sector: '', unit: '', symptoms: [], labResults: { alt: '', ast: '', cholinesterase: '', bloodLead: '', urineArsenic: '', wbc: '', sft: 'normal', xray: 'normal' } }); 
            }}
            className="flex items-center gap-2.5 bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
          >
            {t('new_analysis')}
          </button>
        )}
      </div>
    </div>
  );
}
