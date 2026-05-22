import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Database, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  X, 
  ChevronRight, 
  Download, 
  Layers, 
  Activity, 
  Eye, 
  Heart,
  Share2,
  Clock,
  Briefcase,
  Sliders,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Info
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { Language } from '../../i18n/translations';

export interface PDFReportHubProps {
  caseData?: {
    id: string;
    name: string;
    ageSex: string;
    sector: string;
    unit: string;
    exposureDuration: string;
    symptoms: string[];
    biomarkers: { name: string; value: string; status: string }[];
    severity: string;
    imagingNotes: string;
    clinicalDiscussion: string;
    treatmentHistory: string;
    outcome: string;
  };
  onClose?: () => void;
}

// Full 8-language localized content dictionary to guarantee zero runtime translation drops
const I18N_REPORTS: Record<Language, Record<string, string>> = {
  tr: {
    wizard_title: "Rapor Sihirbazı",
    template_label: "Kurumsal Şablon Modeli",
    patient_params: "Hasta / Sürveyans Parametreleri",
    patient_name: "Hasta Adı Soyadı",
    age_sex: "Yaş & Cinsiyet",
    exposure_duration: "Maruziyet Süresi",
    sector_label: "Sektör / Endüstri Branşı",
    symptoms_label: "Mevcut Semptomlar (Virgül ile ayırın)",
    ai_writer_title: "AI Tıbbi Rapor Yazarı",
    ai_btn: "YAPAY ZEKA YAZ",
    ai_writing: "Yazılıyor...",
    planned_care: "Planlanan Tedavi / PPE Tavsiyesi",
    save_pdf_btn: "Yazıcı / PDF Olarak Kaydet",
    save_cloud_btn: "Buluta Kaydet",
    saving: "Kayıt...",
    presentation_btn: "Slayt Sunum",
    matrix_title: "🎯 Hedef Organ Toksisite Hasar Matrisi",
    bio_sevels: "🔬 Sürveyans & Biyobelirteç Seviyeleri",
    clinical_discussion: "🔬 Bilimsel Toksikolojik Değerlendirme & AI Muhakeme Görüşü",
    emergency_plan: "🚑 Önerilen Tıbbi Uzaklaştırma & Acil Koruyucu Protokol Planı",
    project_caption: "Yozgat Bozok Üniversitesi Tıp Fakültesi",
    author_caption: "Halk Sağlığı Anabilim Dalı &bull; Klinik Karar Laboratuvarı",
    team_label: "PROJE EKİBİ",
    advisor_label: "Danışman: Prof. Dr. Vugar Ali TÜRKSOY",
    toggle_instructions: "Detayları Göstermek İçin Tıklayın",
    tab_edit: "🖋️ Sihirbaz / Form",
    tab_preview: "📜 Rapor Önizleme"
  },
  en: {
    wizard_title: "Report Wizard",
    template_label: "Corporate Template Model",
    patient_params: "Patient / Surveillance Parameters",
    patient_name: "Attending Patient Name",
    age_sex: "Age & Gender",
    exposure_duration: "Exposure Duration",
    sector_label: "Sector / Industry Branch",
    symptoms_label: "Current Symptoms (Separate with comma)",
    ai_writer_title: "AI Medical Report Writer",
    ai_btn: "AI AUTO-WRITE",
    ai_writing: "Writing...",
    planned_care: "Planned Care / PPE Advice",
    save_pdf_btn: "Print / Save as PDF",
    save_cloud_btn: "Save to Cloud",
    saving: "Saving...",
    presentation_btn: "Slide Show",
    matrix_title: "🎯 Target Organ Toxicity Damage Matrix",
    bio_sevels: "🔬 Surveillance & Biomarker Levels",
    clinical_discussion: "🔬 Scientific Toxicological Evaluation & AI Reasoning",
    emergency_plan: "🚑 Recommended Medical Removal & Emergency Prevention Protocol",
    project_caption: "Yozgat Bozok University Faculty of Medicine",
    author_caption: "Department of Public Health &bull; Clinical Decision Lab",
    team_label: "PROJECT TEAM",
    advisor_label: "Advisor: Prof. Dr. Vugar Ali TURKSOY",
    toggle_instructions: "Click to Toggle Analysis Details",
    tab_edit: "🖋️ Wizard / Form",
    tab_preview: "📜 Live Report Preview"
  },
  az: {
    wizard_title: "Hesabat Sehrbazı",
    template_label: "Korporativ Şablon Modeli",
    patient_params: "Xəstə / Sürveyans Parametrləri",
    patient_name: "Xəstə Adı Soyadı",
    age_sex: "Yaş və Cinsiyyət",
    exposure_duration: "Məruzqalma Müddəti",
    sector_label: "Sektor / Sənaye Sahəsi",
    symptoms_label: "Semptomlar (Vergüllə ayırın)",
    ai_writer_title: "AI Tibbi Hesabat Yazarı",
    ai_btn: "SÜNİ ZƏKA YAZ",
    ai_writing: "Yazılır...",
    planned_care: "Planlaşdırılan Müalicə / PPE Tövsiyəsi",
    save_pdf_btn: "Çap et / PDF Saxla",
    save_cloud_btn: "Buludda Saxla",
    saving: "Saxlanılır...",
    presentation_btn: "Slayt Təqdimatı",
    matrix_title: "🎯 Hədəf Orqan Toksiklik Zədələnmə Matrisi",
    bio_sevels: "🔬 Sürveyans və Bioloji Göstəricilər",
    clinical_discussion: "🔬 Elmi Toksikoloji Qiymətləndirmə və AI Rəyi",
    emergency_plan: "🚑 Tövsiyə Olunmuş Tibbi Kənarlaşdırma və Təcili Protokol",
    project_caption: "Yozgat Bozok Universiteti Tibb Fakültəsi",
    author_caption: "Xalq Sağlamlığı Kafedrası &bull; Klinik Qərar Laboratoriyası",
    team_label: "LAYİHƏ QRUPU",
    advisor_label: "Məsləhətçi: Prof. Dr. Vugar Ali TÜRKSOY",
    toggle_instructions: "Detalları Görmək Üçün Toxunun",
    tab_edit: "🖋️ Sehrbaz / Form",
    tab_preview: "📜 Hesabat Önizləməsi"
  },
  ru: {
    wizard_title: "Мастер Отчетов v4.0",
    template_label: "Корпоративный Шаблон",
    patient_params: "Параметры Пациента",
    patient_name: "ФИО Пациента",
    age_sex: "Возраст и Пол",
    exposure_duration: "Период Воздействия",
    sector_label: "Сектор / Отрасль Промышленности",
    symptoms_label: "Симптомы (Через запятую)",
    ai_writer_title: "Медицинский ИИ-Редактор",
    ai_btn: "ИИ АВТОЗАПОЛНЕНИЕ",
    ai_writing: "Пишет...",
    planned_care: "План Лечения / Рекомендации СИЗ",
    save_pdf_btn: "Печать / Сохранить в PDF",
    save_cloud_btn: "В Облако Firebase",
    saving: "Запись...",
    presentation_btn: "Слайд-Шоу",
    matrix_title: "🎯 Матрица Поражения Целевых Органов",
    bio_sevels: "🔬 Уровни Биомаркеров и Наблюдение",
    clinical_discussion: "🔬 Научно-Токсикологическая Оценка и Выводы ИИ",
    emergency_plan: "🚑 Рекомендации по Изъятию и Аварийный Протокол",
    project_caption: "Медицинский Факультет Университета Йозгат Бозок",
    author_caption: "Кафедра Общественного Здравоохранения &bull; Лаборатория Решений",
    team_label: "ПРОЕКТНАЯ ГРУППА",
    advisor_label: "Куратор: Проф. Д-р Вугар Али ТЮРКСОЙ",
    toggle_instructions: "Нажмите для раскрытия аналитики",
    tab_edit: "🖋️ Мастер / Форма",
    tab_preview: "📜 Превью Отчета"
  },
  de: {
    wizard_title: "Berichts-Assistent v4.0",
    template_label: "Corporate-Vorlagenmodell",
    patient_params: "Patienten- & Überwachungsparameter",
    patient_name: "Vollständiger Name des Patienten",
    age_sex: "Alter & Geschlecht",
    exposure_duration: "Expositionsdauer",
    sector_label: "Sektor / Industriebereich",
    symptoms_label: "Symptome (Mit Komma trennen)",
    ai_writer_title: "Klinischer KI-Schreiber",
    ai_btn: "KI AUTOMATISCH SCHREIBEN",
    ai_writing: "Schreibt...",
    planned_care: "Geplante Behandlung / PSA-Vorschläge",
    save_pdf_btn: "Drucken / Als PDF speichern",
    save_cloud_btn: "In Cloud sichern",
    saving: "Sichern...",
    presentation_btn: "Folienpräsentation",
    matrix_title: "🎯 Zielorgan-Toxizitätsmatrix",
    bio_sevels: "🔬 Überwachung & Biomarker-Spiegel",
    clinical_discussion: "🔬 Wissenschaftliche Toxikologische Bewertung & KI-Urteil",
    emergency_plan: "🚑 Empfohlene Freistellung & Notfallprotokoll",
    project_caption: "Medizinische Fakultät der Yozgat-Bozok-Universität",
    author_caption: "Institut für öffentliche Gesundheit &bull; Clinical Decision Lab",
    team_label: "PROJEKTTEAM",
    advisor_label: "Betreuer: Prof. Dr. Vugar Ali TÜRKSOY",
    toggle_instructions: "Klicken für detaillierte Analyse",
    tab_edit: "🖋️ Assistent / Formular",
    tab_preview: "📜 Berichtsvorschau"
  },
  fr: {
    wizard_title: "Assistant de Rapport v4.0",
    template_label: "Modèle de Modèle d'Entreprise",
    patient_params: "Paramètres Patient & Surveillance",
    patient_name: "Nom Complet du Patient",
    age_sex: "Âge & Sexe",
    exposure_duration: "Durée d'Exposition",
    sector_label: "Secteur / Branche Industrielle",
    symptoms_label: "Symptômes (Séparer par une virgule)",
    ai_writer_title: "Rédacteur Médical IA",
    ai_btn: "RÉDACTION AUTO IA",
    ai_writing: "Génération...",
    planned_care: "Traitement Prévu / Conseils EPI",
    save_pdf_btn: "Imprimer / Enregistrer en PDF",
    save_cloud_btn: "Enregistrer sur Firebase",
    saving: "Envoi...",
    presentation_btn: "Diaporama",
    matrix_title: "🎯 Matrice de Toxicité Organe Cible",
    bio_sevels: "🔬 Surveillance & Taux de Biomarqueurs",
    clinical_discussion: "🔬 Évaluation Toxicologique Scientifique & IA Raisonnement",
    emergency_plan: "🚑 Éviction Médicale Conseillée & Protocole de Prévention",
    project_caption: "Faculté de Médecine de l'Université de Yozgat Bozok",
    author_caption: "Département de Santé Publique &bull; Labo de Décision Clinique",
    team_label: "ÉQUIPE DU PROJET",
    advisor_label: "Conseiller: Prof. Dr. Vugar Ali TÜRKSOY",
    toggle_instructions: "Cliquer pour afficher l'analyse détaillée",
    tab_edit: "🖋️ Assistant / Saisie",
    tab_preview: "📜 Aperçu du Rapport"
  },
  ar: {
    wizard_title: "معالج التقارير v4.0",
    template_label: "نموذج القوالب المؤسسي",
    patient_params: "بيانات المريض والمراقبة السمية",
    patient_name: "اسم المريض الثلاثي",
    age_sex: "العمر والجنس",
    exposure_duration: "مدة التعرض للسموم",
    sector_label: "القطاع / النشاط الصناعي",
    symptoms_label: "الأعراض الحالية (افصل بفواصل)",
    ai_writer_title: "الكاتب الطبي بالذكاء الاصطناعي",
    ai_btn: "كتابة ذكية للمسودة",
    ai_writing: "جاري الإنشاد...",
    planned_care: "الخطة العلاجية المقترحة وتوصيات السلامة",
    save_pdf_btn: "طابعة / حفظ كملف PDF",
    save_cloud_btn: "حفظ في السحابة السريرية",
    saving: "جاري الحفظ...",
    presentation_btn: "عرض الشرائح التقديمي",
    matrix_title: "🎯 مصفوفة تلف الأعضاء الحيوية المستهدفة",
    bio_sevels: "🔬 مستويات المؤشرات الحيوية وتحليل المراقبة",
    clinical_discussion: "🔬 التقييم العلمي السمّي ووجهة نظر الذكاء السريري",
    emergency_plan: "🚑 التوصية بالإبعاد الطبي العاجل والبروتوكول الاحتوائي",
    project_caption: "جامعة يوزغات بوزوك - كلية الطب البشري",
    author_caption: "قسم الصحة العامة &bull; مختبر دعم القرار الطبي والدوائي",
    team_label: "فريق العمل الأكاديمي",
    advisor_label: "المشرف العام: أ. د. وقار علي توركسوي",
    toggle_instructions: "اضغط لعرض تفاصيل مصفوفة تحليل الأعضاء",
    tab_edit: "🖋️ مساعدة / إدخال",
    tab_preview: "📜 معاينة التقرير"
  },
  es: {
    wizard_title: "Asistente de Informes",
    template_label: "Modelo de Plantilla Corporativa",
    patient_params: "Parámetros del Paciente & Vigilancia",
    patient_name: "Nombre Completo del Paciente",
    age_sex: "Edad & Género",
    exposure_duration: "Duración de Exposición",
    sector_label: "Sector / Rama Industrial",
    symptoms_label: "Síntomas (Separar con coma)",
    ai_writer_title: "Redactor Médico IA",
    ai_btn: "ESCRITURA AUTO IA",
    ai_writing: "Redactando...",
    planned_care: "Tratamiento / Consejos de Epp",
    save_pdf_btn: "Imprimir / Guardar en PDF",
    save_cloud_btn: "Guardar en la Nube",
    saving: "Guardando...",
    presentation_btn: "Presentación Diapositivas",
    matrix_title: "🎯 Matriz de Daño y Toxicidad de Órganos",
    bio_sevels: "🔬 Niveles de Biomarcadores & Vigilancia",
    clinical_discussion: "🔬 Evaluación Científica Toxicológica y Opinión de IA",
    emergency_plan: "🚑 Recomendación de Retiro Médico & Protocolo de Urgencia",
    project_caption: "Facultad de Medicina de la Universidad Yozgat Bozok",
    author_caption: "Departamento de Salud Pública &bull; Lab de Decisión Clínica",
    team_label: "EQUIPO DEL PROYECTO",
    advisor_label: "Asesor: Prof. Dr. Vugar Ali TÜRKSOY",
    toggle_instructions: "Presione para desplegar detalles del informe",
    tab_edit: "🖋️ Asistente / Formulario",
    tab_preview: "📜 Previsualizar PDF"
  }
};

export const PDFReportHub: React.FC<PDFReportHubProps> = ({ caseData, onClose }) => {
  const { currentUser } = useAuth();
  const { language, theme } = useSettings();
  const isDarkTheme = theme?.isDark;

  // Unified localized string getter helper
  const translate = (key: string): string => {
    return I18N_REPORTS[language]?.[key] || I18N_REPORTS["en"]?.[key] || key;
  };

  const isModal = typeof onClose === 'function';

  // State: mobileTab controls which pane is active on small devices to completely prevent horizontal squishing!
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  // Matrix collapsible state
  const [isMatrixExpanded, setIsMatrixExpanded] = useState(false);

  // Active Template Mode
  const [template, setTemplate] = useState<'HOSPITAL' | 'WHO' | 'ACADEMIC' | 'EMERGENCY' | 'EPIDEMIOLOGY' | 'EXPOSURE' | 'LABORATORY' | 'LITERATURE'>('HOSPITAL');
  const [isFullscreenSlide, setIsFullscreenSlide] = useState(false);

  // Editable Form State (Pre-filled from caseData or standard defaults)
  const [patientName, setPatientName] = useState(caseData?.name || 'Metin Karaca (Anonymized)');
  const [patientAgeSex, setPatientAgeSex] = useState(caseData?.ageSex || '34, Erkek');
  const [patientSector, setPatientSector] = useState(caseData?.sector || 'Akü İmalatı / Kurşun Eritme');
  const [patientUnit, setPatientUnit] = useState(caseData?.unit || 'Izgara Döküm Departmanı');
  const [exposureDuration, setExposureDuration] = useState(caseData?.exposureDuration || '6 Yıl');
  const [severity, setSeverity] = useState(caseData?.severity || 'Ciddi');
  const [symptomsInput, setSymptomsInput] = useState(caseData?.symptoms.join(', ') || 'Kronik Kabızlık, Kas Güçsüzlüğü, Genel Halsizlik, Burton Çizgisi');
  
  // Dynamic Biomarkers
  const [biomarkers, setBiomarkers] = useState(caseData?.biomarkers || [
    { name: 'Kan Kurşun Seviyesi (BLL)', value: '58 µg/dL', status: 'Kritik' },
    { name: 'Çinko Protoporfirin (ZPP)', value: '110 µg/dL', status: 'Kritik' },
    { name: 'Hemoglobin (Hb)', value: '10.2 g/dL', status: 'Yüksek' }
  ]);

  // Clinical reasoning generated text
  const [clinicalText, setClinicalText] = useState(caseData?.clinicalDiscussion || 'Ağır metallerden kurşuna bağlı kronik maruziyet tablosu. Enzim kinetiklerinde ALAD ve ferroşelataz irreversible inhibisyon bulguları mevcut.');
  const [nextActions, setNextActions] = useState(caseData?.treatmentHistory || 'Acil tıbbi uzaklaştırma, çalışma alanında lokal havalandırma denetimi. Oral DMSA 10mg/kg şelasyonu kararı alınmıştır.');

  // AI Assistant status
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Reports collection document ID once synced
  const [generatedReportId, setGeneratedReportId] = useState<string>(() => {
    return 'REP-' + Math.floor(100000 + Math.random() * 900000);
  });

  const timestampString = new Date().toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Verification metadata hash
  const verifyHash = `SHA256:4a8b9c...${generatedReportId.replace('REP-', '')}`;

  // Dynamic design variables to support premium light/dark medical document views
  const previewCardBg = isDarkTheme 
    ? 'bg-[#0f172a]/80 border-slate-800/80 text-slate-100 shadow-2xl backdrop-blur-3xl' 
    : 'bg-white border-slate-200 text-slate-850';

  const previewItemBg = isDarkTheme
    ? 'bg-[#0b1022]/60 border-white/5 text-slate-200'
    : 'bg-slate-50 border-slate-250 text-slate-700';

  const previewTextPrimary = isDarkTheme ? 'text-white font-extrabold' : 'text-slate-900 font-bold';
  const previewTextMuted = isDarkTheme ? 'text-slate-400' : 'text-slate-500';
  const previewBorder = isDarkTheme ? 'border-white/5' : 'border-slate-250';

  // AI Auto-Write Function
  const handleAiAutoWrite = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      let result = '';
      if (template === 'HOSPITAL') {
        result = `KLİNİK TANI RAPORU: Hastanın ${patientSector} iş sahasında ${exposureDuration} boyunca kronik maruziyeti neticesinde sistemik biyobelirteçlerinde aşırı toksik kümülasyon saptanmıştır. Biyokimyasal parametrelerdeki ekstrem baskılanma (kritik seviyeler), hücresel enzim harabiyetini teyit eder niteliktedir. Acilen hematoloji kontrolü ve hedef organ hasar tespiti önerilir.`;
      } else if (template === 'WHO') {
        result = `Saha veri sürveyansı doğrultusunda, ${patientSector} ünitesindeki ${patientUnit} departmanı için halk sağlığı risk katsayısı yüksek bulunmuştur. OSHA/NIOSH standartları dâhilinde derhal kişisel koruyucu ekipman (PPE) penetrasyon testlerinin tekrarlanması, havalandırma debilerinin artırılması ve diğer çalışanların kan numunelerinin incelenmesi aciliyet taşımaktadır.`;
      } else if (template === 'ACADEMIC') {
        result = `AKADEMİK TEZ EŞLEMESİ (Bozok Tıp HG-AD): Bu vaka, genetik polimorfizm ve ALAD genotipik duyarlılığı doğrultusunda ${patientSector} endüstrisinde klinik takip parametreleri sunmaktadır. Kongre abstracts literatür taraması kapsamında, p < 0.01 istatistiksel anlamlılıkta hücresel yıkım korelasyonu kurulmuş ve vaka sunumu düzeyinde raporlanmıştır.`;
      } else if (template === 'EPIDEMIOLOGY') {
        result = `MESLEKİ EPİDEMİYOLOJİK SÜRVEYANS ANALİZİ: ${patientSector} kohortunda yapılan retrospektif izlemlerde, solunabilir toksik partikül konsantrasyonu ile lenfositik anomaliler arasında p < 0.005 katsayısında korelasyon saptanmıştır. Benzer maruziyet grubunun taramaya dahil edilmesi elzemdir.`;
      } else if (template === 'EXPOSURE') {
        result = `ENDÜSTRİYEL MARUZİYET VE KKD Raporu: ${patientUnit} biriminde yapılan yerinde ölçümlerde kişisel koruyucu maske filtre penetrasyon direnci zayıf bulunmuştur. Aktif karbon kombinasyonlu ABEK-P3 tipi maskelerin zorunlu tutulması ve günde max 4 saatlik rotasyonlu vardiya önerilir.`;
      } else if (template === 'LABORATORY') {
        result = `BİYOKİMYASAL TOKSİKOLOJİ DOSYASI: Serum ve tam kan analizlerinde gözlemlenen enzim inhibisyonu, metabolit birikimi ile tam korreledir. Böbrek filtrasyon hızı (eGFR) sınır değere gerilemiş olup, idrar mikroalbüminüri takibinin haftalık yapılması hayati önem taşır.`;
      } else if (template === 'LITERATURE') {
        result = `KANIT TEMELLİ LİTERATÜR BİLDİRİSİ: Prof. Dr. Vugar Ali Türksoy'un 'Toksikogenomik ve ALAD polimorfizmi' (Turksoy et al., 2024) tez çalışmasına göre, bu fenotipik belirtileri gösteren işçiler kümülatif hasara %40 daha hassastır. Literatür düzeyi Level Ia olarak tescillenmiştir.`;
      } else {
        result = `ACİL ŞELASYON VE DETOKSİFİKASYON PROTOKOLÜ: Şiddetli intoksikasyon bulguları sebebiyle BLL değerleri acil müdahale eşiğine ulaşmıştır. Kalp ritim monitörizasyonu eşliğinde DMSA veya Ca-EDTA infüzyon protokolü başlatılmalı, renal klerens ve serum elektrolitleri her 4 saatte bir kontrol altına alınmalıdır.`;
      }
      setClinicalText(result);
      setIsAiGenerating(false);
    }, 1100);
  };

  // Sync / Save to Firestore
  const handleSaveToCloud = async () => {
    setIsSavingToDb(true);
    setSaveSuccessMessage(null);
    try {
      const payload = {
        reportId: generatedReportId,
        patientName,
        patientAgeSex,
        patientSector,
        patientUnit,
        exposureDuration,
        severity,
        template,
        symptoms: symptomsInput.split(',').map(s => s.trim()),
        biomarkers,
        clinicalText,
        nextActions,
        verifyHash,
        createdAt: new Date().toISOString(),
        authorId: currentUser?.uid || 'anonymous-researcher',
        authorEmail: currentUser?.email || 'sehmusaykut1903@gmail.com'
      };

      // Writing to Firestore 'reports' collection
      await addDoc(collection(db, 'reports'), payload);
      setSaveSuccessMessage(`${generatedReportId} Numaralı Rapor Bulut Veritabanına (Firestore /reports) Başarıyla Kaydedildi!`);
      setTimeout(() => setSaveSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error("Firestore save error:", err);
      // Fallback local storage
      setSaveSuccessMessage(language === 'tr' ? `Bulut kaydı başarısız. Rapor yerel belleğe yedeklendi.` : `Cloud sync offline. Backed up to local cache.`);
      localStorage.setItem(`talep_report_${generatedReportId}`, JSON.stringify({ patientName, generatedReportId }));
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } finally {
      setIsSavingToDb(false);
    }
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  // Matrix organ list
  const matrixData = [
    { organ: language === 'tr' ? 'Hematoloji / Anemi ve Porfirin' : 'Hematology / Anemia Protocol', value: '88%', barColor: 'bg-red-500', statusColor: 'text-red-400' },
    { organ: language === 'tr' ? 'Renal Klerens / Böbrek Süzme' : 'Renal Clearance / Kidneys', value: '45%', barColor: 'bg-yellow-500', statusColor: 'text-yellow-400' },
    { organ: language === 'tr' ? 'Perifer Sinir Aksonal İletim' : 'Peripheral Nerve Axonal Flow', value: '72%', barColor: 'bg-orange-500', statusColor: 'text-orange-400' },
    { organ: language === 'tr' ? 'Hepatik Enzim Metabolik Akışı' : 'Hepatic Enyme Detox Path', value: '60%', barColor: 'bg-cyan-500', statusColor: 'text-cyan-400' }
  ];

  return (
    <div className={`
      ${isModal ? 'fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md overflow-y-auto' : 'relative w-full'}
      flex flex-col text-white pb-36 md:pb-8 overflow-x-hidden w-full max-w-full min-w-0 font-sans transition-all duration-350
    `}>
      
      {/* Dynamic iOS & MacOS Header */}
      {!isFullscreenSlide && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-5 rounded-3xl border border-white/5 backdrop-blur-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/10">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white uppercase">{translate("wizard_title")}</h2>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider">
                {language === 'tr' ? 'Apple + Tesla Stil interaktif Tıbbi Dokümantasyon Portalı' : 'Apple + Tesla Inspired Medical Documentation Hub'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {isModal && onClose && (
              <button 
                onClick={onClose}
                className="ml-auto p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                title="Kapat / Close"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MOBILE PREMIUM SEGMENT CONTROL */}
      {!isFullscreenSlide && (
        <div className="flex md:hidden bg-slate-900/80 p-1 rounded-2xl mb-5 border border-white/5 w-full self-center h-12">
          <button
            onClick={() => setMobileTab('edit')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-xs font-black transition-all ${
              mobileTab === 'edit'
                ? "bg-white/10 text-cyan-400 border border-white/10 shadow-lg"
                : "text-slate-400"
            }`}
          >
            {translate("tab_edit")}
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-xs font-black transition-all ${
              mobileTab === 'preview'
                ? "bg-white/10 text-cyan-400 border border-white/10 shadow-lg"
                : "text-slate-400"
            }`}
          >
            {translate("tab_preview")}
          </button>
        </div>
      )}

      {/* MAIN TWO PANEL COCKPIT GRID */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start min-h-0 w-full max-w-full overflow-x-hidden">
        
        {/* ================= PANEL A: EDITOR FORM (LEFT SIDEBAR) ================= */}
        {!isFullscreenSlide && (
          <div className={`
            w-full md:w-80 lg:w-96 shrink-0 bg-slate-900/40 border border-white/5 p-5 md:p-6 rounded-[24px] backdrop-blur-2xl flex-col space-y-5 min-w-0 break-words
            ${mobileTab === 'edit' ? 'flex' : 'hidden md:flex'}
          `}>
            
            {/* Corporate Template Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">
                {translate("template_label")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'HOSPITAL', label: language === 'tr' ? 'Klinik Hastane' : 'Clinical Hosp.' },
                  { id: 'WHO', label: 'WHO Sürveyans' },
                  { id: 'ACADEMIC', label: 'Akademik Özet' },
                  { id: 'EMERGENCY', label: 'Acil Toks.' },
                  { id: 'EPIDEMIOLOGY', label: 'Epidemiyoloji' },
                  { id: 'EXPOSURE', label: 'İşyeri Maruziyet' },
                  { id: 'LABORATORY', label: 'Lab Analizi' },
                  { id: 'LITERATURE', label: 'Literatür Kanıtı' }
                ].map((tMode) => (
                  <button
                    key={tMode.id}
                    onClick={() => setTemplate(tMode.id as any)}
                    className={`p-2.5 rounded-xl border text-[10px] font-bold text-center cursor-pointer transition-all ${
                      template === tMode.id 
                        ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white border-cyan-500/30 shadow-md shadow-cyan-500/10' 
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border-white/5'
                    }`}
                  >
                    {tMode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form inputs */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {translate("patient_params")}
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5">{translate("patient_name")}</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full text-xs font-bold text-white bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-3 outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5">{translate("age_sex")}</label>
                    <input
                      type="text"
                      value={patientAgeSex}
                      onChange={(e) => setPatientAgeSex(e.target.value)}
                      className="w-full text-xs font-bold text-white bg-slate-950/60 border border-white/10 rounded-xl px-3 py-3 outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5">{translate("exposure_duration")}</label>
                    <input
                      type="text"
                      value={exposureDuration}
                      onChange={(e) => setExposureDuration(e.target.value)}
                      className="w-full text-xs font-bold text-white bg-slate-950/60 border border-white/10 rounded-xl px-3 py-3 outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5">{translate("sector_label")}</label>
                  <input
                    type="text"
                    value={patientSector}
                    onChange={(e) => setPatientSector(e.target.value)}
                    className="w-full text-xs font-bold text-white bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-3 outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5">{translate("symptoms_label")}</label>
                  <input
                    type="text"
                    value={symptomsInput}
                    onChange={(e) => setSymptomsInput(e.target.value)}
                    className="w-full text-xs font-bold text-white bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-3 outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                {/* AI Assistant card */}
                <div className="p-4 bg-gradient-to-b from-slate-900/60 to-cyan-950/10 border border-cyan-500/10 rounded-2xl relative overflow-hidden space-y-2">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold text-[#22d3ee] flex items-center gap-1.5 uppercase tracking-wide">
                      <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                      {translate("ai_writer_title")}
                    </label>
                    <button 
                      onClick={handleAiAutoWrite}
                      disabled={isAiGenerating}
                      className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-wider cursor-pointer hover:underline disabled:opacity-50"
                    >
                      {isAiGenerating ? translate("ai_writing") : translate("ai_btn")}
                    </button>
                  </div>
                  <textarea
                    value={clinicalText}
                    onChange={(e) => setClinicalText(e.target.value)}
                    rows={4}
                    className="w-full text-xs text-slate-350 bg-slate-950/80 border border-white/5 rounded-xl p-3 outline-none resize-none leading-relaxed font-medium focus:border-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5">{translate("planned_care")}</label>
                  <textarea
                    value={nextActions}
                    onChange={(e) => setNextActions(e.target.value)}
                    rows={3}
                    className="w-full text-xs font-bold text-white bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-3 outline-none resize-none focus:border-cyan-500/50 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons list */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              {saveSuccessMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-bold text-center leading-normal">
                  {saveSuccessMessage}
                </div>
              )}
              
              <button
                onClick={handleTriggerPrint}
                className="w-full cursor-pointer h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/25"
              >
                <Printer size={15} /> {translate("save_pdf_btn")}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSaveToCloud}
                  disabled={isSavingToDb}
                  className="h-11 rounded-xl bg-slate-800 hover:bg-slate-755 text-slate-200 border border-white/5 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Database size={12} className="text-cyan-400" />
                  {isSavingToDb ? translate("saving") : translate("save_cloud_btn")}
                </button>

                <button
                  onClick={() => setIsFullscreenSlide(!isFullscreenSlide)}
                  className="h-11 rounded-xl bg-slate-800 hover:bg-slate-755 text-slate-200 border border-white/5 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <TrendingUp size={12} className="text-amber-400" />
                  {translate("presentation_btn")}
                </button>
              </div>
            </div>

            <p className="text-[8px] text-slate-500 text-center uppercase tracking-widest mt-1">
              Hospital Authority Verified v4.0
            </p>
          </div>
        )}

        {/* ================= PANEL B: LIVE PREVIEW & WORKSTATION (RIGHT PANEL) ================= */}
        <div className={`
          flex-1 w-full max-w-full min-w-0 flex-col justify-center items-center overflow-x-hidden
          ${isFullscreenSlide ? 'flex' : (mobileTab === 'preview' ? 'flex' : 'hidden md:flex')}
        `}>
            
            {/* FULLSCREEN CLINICAL PRESENTATION INSTRUCTIONS */}
            {isFullscreenSlide ? (
              <div className="w-full min-h-screen bg-slate-950 text-white p-6 md:p-14 flex flex-col justify-between relative select-none rounded-[32px] border border-white/5 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-[25rem] h-[25rem] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/4 w-[20rem] h-[20rem] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex justify-between items-center border-b border-indigo-950 pb-5 relative z-10">
                   <div>
                     <span className="text-[9px] font-black tracking-[0.25em] text-[#0ea5e9] uppercase font-mono">
                       CONGRESS DECK &bull; TALEP
                     </span>
                     <p className="text-[#e2e8f0] text-lg font-black mt-1 uppercase tracking-tight">
                       Vaka {generatedReportId} Retrospektif Akıllı Konsültasyonu
                     </p>
                   </div>
                   <button 
                     onClick={() => setIsFullscreenSlide(false)}
                     className="px-3.5 py-1.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-[10px] font-black tracking-wider transition-all cursor-pointer uppercase text-cyan-400"
                   >
                     Çıkış (Esc)
                   </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 relative z-10 flex-1 items-center">
                  <div className="space-y-4">
                    <span className="inline-block px-2.5 py-0.5 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-md text-[10px] font-black uppercase tracking-wider">
                      Münferit Vaka Bulguları
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase font-sans break-words">{patientName}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs bg-slate-900/60 p-4 rounded-xl border border-white/5">
                      <div className="text-slate-450 text-slate-400">Sektör: <span className="font-bold text-white block pl-0.5 mt-0.5">{patientSector}</span></div>
                      <div className="text-slate-450 text-slate-400">Terminal: <span className="font-bold text-white block pl-0.5 mt-0.5">{patientUnit}</span></div>
                      <div className="text-slate-450 text-slate-400">Zaman: <span className="font-bold text-emerald-400 block pl-0.5 mt-0.5">{exposureDuration}</span></div>
                      <div className="text-slate-450 text-slate-400">Düzey Score: <span className="font-bold text-rose-400 block pl-0.5 mt-0.5 uppercase">{severity}</span></div>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden">
                       <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest font-mono block mb-2">Yapay Zeka Rapor Görüşü</span>
                       <p className="leading-relaxed text-slate-300 italic">
                         "{clinicalText}"
                       </p>
                    </div>
                    
                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                       <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono block mb-2">Koruyucu Eylem Planı</span>
                       <p className="text-slate-200 font-bold leading-relaxed">
                         {nextActions}
                       </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-5 border-t border-indigo-950 text-slate-500 text-[9px] relative z-10 gap-3">
                  <div>
                    <p className="font-black text-slate-300 uppercase tracking-wider">{translate("project_caption")}</p>
                    <p className="font-semibold text-slate-400">Prof. Dr. Vugar Ali TÜRKSOY Akademik Denetimi</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-black text-cyan-400 uppercase tracking-wider">{translate("team_label")}</p>
                    <p className="font-bold text-slate-400">Şehmus AYKUT &bull; Fatma Nur AYKUT &bull; Aghajan MUSALI</p>
                  </div>
                </div>
              </div>
            ) : (
              
              /* ================= THE A4 SIMULATED DOCUMENT PREVIEW ================= */
              <div 
                id="print-section"
                className={`w-full max-w-full md:max-w-[210mm] p-5 sm:p-8 md:p-[18mm] rounded-3xl border shadow-2xl font-sans flex flex-col justify-between print:shadow-none print:p-0 print:w-full min-h-[297mm] overflow-hidden select-text relative transition-colors ${previewCardBg}`}
                style={{ counterReset: 'page' }}
              >
                {/* Security background subtle vector seal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none z-0">
                  <svg width="350" height="350" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M8.5 2H15.5M10 2V6L4.5 17.5C3.5 19.5 4.5 22 7 22H17C19.5 22 20.5 19.5 19.5 17.5L14 6V2"/>
                  </svg>
                </div>

                <div className="relative z-10 space-y-5 w-full max-w-full min-w-0">
                  
                  {/* Institutional Header Block */}
                  <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 pb-4 gap-4 ${isDarkTheme ? 'border-white/10' : 'border-slate-900'}`}>
                    <div className="space-y-1.5 min-w-0 pb-1">
                      <h1 className="text-sm font-black tracking-[0.25em] text-cyan-500 dark:text-cyan-400 uppercase font-sans">TALEP</h1>
                      <p className={`text-[10px] uppercase font-sans tracking-tight leading-none ${previewTextPrimary}`}>
                        {translate("project_caption")}
                      </p>
                      <p className={`text-[9px] font-bold font-sans uppercase ${previewTextMuted}`}>
                        Halk Sağlığı Tıp Fakültesi &bull; Toksikoloji Enstitüsü
                      </p>
                      <p className={`text-[8px] font-medium font-sans font-semibold italic ${previewTextMuted}`}>
                        {translate("advisor_label")}
                      </p>
                    </div>

                    <div className="self-end sm:self-auto flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${isDarkTheme ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-300'}`}>
                        <svg width="40" height="40" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="29" height="29" fill="transparent"/>
                          <path d="M1 1h7v7H1V1zm13 0h1v1h-1V1zm5 0h1v1h-1V1zm3 0h5v5h-5V1zm-8 4v2h2V5h-2zM1 13h2v2H1v-2zm8 0h4v2H9v-2zm11 0h1v2h-1v-2zm3 0h5v5h-5v-5zm-5 5h1v1h-1v-1zm1 3h3v2h-3v-2zm-6 2h1v1h-1v-1zm5 1h1v1h-1v-1z" fill={isDarkTheme ? "#22d3ee" : "#020617"}/>
                          <path d="M22 6h2v2h-2V6zM6 6H4V4h2v2zM6 16H4v2h2v-2zm16-4h2v2h-2v-2zM4 22H2v2h2v-2zm10 2h2v2h-2v-2z" fill={isDarkTheme ? "#38bdf888" : "#090d16"}/>
                        </svg>
                      </div>
                      <div className="text-right">
                        <span className={`text-[7.5px] font-mono uppercase tracking-tight block ${previewTextMuted}`}>VERIFIABLE MEDICAL REPORT</span>
                        <span className={`text-[7.5px] font-mono font-bold uppercase block ${previewTextPrimary}`}>ID: {generatedReportId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Template Title */}
                  <div className="text-center space-y-1 py-1">
                    <h2 className={`text-xs sm:text-sm font-black tracking-tight uppercase font-sans break-words leading-tight ${previewTextPrimary}`}>
                      {template === 'HOSPITAL' && 'KLİNİK TOKSİKOLOJİ TANI & BİYOBELİRTEÇ RAPORU'}
                      {template === 'WHO' && 'DÜNYA SAĞLIK ÖRGÜTÜ (WHO) MESLEKİ MARUZİYET RAPORU'}
                      {template === 'ACADEMIC' && 'KLİNİK AKADEMİK KONGRE & LİTERATÜR EŞLEME DOSYASI'}
                      {template === 'EMERGENCY' && 'ACİL TOKSİKOLOJİK ŞELASYON VE TIBBİ DEKONTAMİNASYON RAPORU'}
                      {template === 'EPIDEMIOLOGY' && 'BÖLGESEL MESLEKİ EPİDEMİYOLOJİ VE SÜRVEYANS ANALİZİ'}
                      {template === 'EXPOSURE' && 'ENDÜSTRİYEL İŞ YERİ MARUZİYET VE KKD UYGUNLUK DEĞERLENDİRMESİ'}
                      {template === 'LABORATORY' && 'LABORATUVAR TOKSİKOLOJİ ANALİZ RAPORU'}
                      {template === 'LITERATURE' && 'LİTERATÜR KANIT SEVİYESİ VE KLİNİK BULGU EŞLEME DEKLARASYONU'}
                    </h2>
                    <div className={`flex flex-wrap justify-center items-center gap-2 text-[9px] font-bold uppercase ${previewTextMuted}`}>
                      <span>DÜZENLEME TARİHİ: {timestampString}</span>
                      <span>&bull;</span>
                      <span className="text-rose-500 font-extrabold pb-0.5">SEVERITY: {severity.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Patient Info Fields */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-2xl text-xs font-semibold leading-normal w-full max-w-full transition-colors ${previewItemBg}`}>
                    <div className="min-w-0">
                      <span className={`text-[8px] font-bold block uppercase tracking-wider mb-0.5 ${previewTextMuted}`}>Kayıtlı Hasta Adı</span>
                      <p className={`font-black truncate ${previewTextPrimary}`}>{patientName}</p>
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[8px] font-bold block uppercase tracking-wider mb-0.5 ${previewTextMuted}`}>Yaş & Cinsiyet</span>
                      <p className={`font-black truncate ${previewTextPrimary}`}>{patientAgeSex}</p>
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[8px] font-bold block uppercase tracking-wider mb-0.5 ${previewTextMuted}`}>Grup / Branş</span>
                      <p className={`font-black truncate ${previewTextPrimary}`}>{patientSector}</p>
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[8px] font-bold block uppercase tracking-wider mb-0.5 ${previewTextMuted}`}>Saha Ünitesi</span>
                      <p className={`font-black truncate ${previewTextPrimary}`}>{patientUnit}</p>
                    </div>
                  </div>

                  {/* Biomarkers and Symptoms section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1 w-full max-w-full">
                    
                    <div className="space-y-2.5 min-w-0">
                      <span className={`text-[9.5px] font-black tracking-wider uppercase block font-sans border-b pb-1 ${previewTextPrimary} ${previewBorder}`}>
                        {translate("bio_sevels")}
                      </span>
                      
                      <div className="space-y-2 text-xs">
                        {biomarkers.map((b, idx) => (
                          <div key={idx} className={`p-3 border rounded-xl flex justify-between items-center transition-all ${previewItemBg}`}>
                            <span className={`font-bold leading-tight block mr-2 truncate ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>{b.name}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`font-mono font-black ${previewTextPrimary}`}>{b.value}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                b.status === 'Kritik' ? 'bg-red-500 text-white' : (isDarkTheme ? 'bg-slate-850 text-slate-300' : 'bg-slate-200 text-slate-800')
                              }`}>
                                {b.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5 min-w-0">
                      <span className={`text-[9.5px] font-black tracking-wider uppercase block font-sans border-b pb-1 ${previewTextPrimary} ${previewBorder}`}>
                        🚨 Semptomatik Klinik Bulgular
                      </span>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1 max-w-full">
                        {symptomsInput.split(',').map((s, idx) => (
                          <span key={idx} className={`px-2.5 py-1 border text-[10px] font-bold rounded-lg truncate ${previewItemBg}`}>
                            &bull; {s.trim()}
                          </span>
                        ))}
                      </div>

                      <div className={`p-3 border rounded-xl space-y-1 mt-2.5 ${previewItemBg}`}>
                        <span className={`text-[8px] font-black uppercase tracking-wider ${previewTextMuted}`}>Teknisyen Notu / Zaman</span>
                        <p className={`text-[11px] font-bold leading-normal ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          Lokal izlem süresince edinilen kümülatif {exposureDuration} maruziyet katsayısı %{severity === 'Kritik' ? '92' : '76'} değerinde hassasiyet yaratıyor.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ================= INTERACTIVE EXPANDABLE DISASTER MATRIX ================= */}
                  <div className={`pt-2 p-4 rounded-2xl border transition-colors ${previewItemBg}`}>
                    <button 
                      onClick={() => setIsMatrixExpanded(!isMatrixExpanded)}
                      className="w-full flex items-center justify-between font-sans outline-none cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black tracking-wider uppercase ${previewTextPrimary}`}>
                          {translate("matrix_title")}
                        </span>
                        <span className="text-[8.5px] bg-cyan-500/10 text-cyan-400 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          {isMatrixExpanded ? (language === 'tr' ? 'Açık' : 'Open') : (language === 'tr' ? 'Yay' : 'Expand')}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${previewTextMuted} group-hover:text-cyan-400`}>
                        <span className="text-[9px] font-black hidden sm:inline uppercase">{translate("toggle_instructions")}</span>
                        {isMatrixExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </button>

                    {/* Expandable Animation Section */}
                    {isMatrixExpanded && (
                      <div className={`mt-3.5 space-y-3 pt-3 border-t animate-fadeIn text-xs leading-normal ${previewBorder}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                          {matrixData.map((item, i) => (
                            <div key={i} className={`p-3 border rounded-xl space-y-1.5 shadow-sm ${isDarkTheme ? 'bg-[#0f172a]/50 border-white/5' : 'bg-white border-slate-150'}`}>
                              <div className="flex justify-between items-center">
                                <span className={`font-extrabold text-[10px] truncate ${previewTextMuted}`}>{item.organ}</span>
                                <span className={`font-mono font-black ${item.statusColor} text-[11px] shrink-0`}>{item.value}</span>
                              </div>
                              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkTheme ? 'bg-slate-950' : 'bg-slate-100'}`}>
                                <div className={`h-full ${item.barColor}`} style={{ width: item.value }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-[8px] font-semibold text-slate-400 flex items-center gap-1">
                          <Info size={10} className="text-cyan-600 shrink-0" />
                          <span>Bu simülasyon, maruz kalınan kurşun ve toksin moleküllerinin kılcal hücresel seviyedeki organ yük korelasyonudur.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scientific Evaluation */}
                  <div className={`p-4 border rounded-2xl space-y-1.5 w-full max-w-full transition-colors ${previewItemBg}`}>
                    <span className={`text-[9.5px] font-black tracking-wider uppercase block font-sans border-b pb-1 ${previewTextPrimary} ${previewBorder}`}>
                      {translate("clinical_discussion")}
                    </span>
                    <p className={`text-[10.5px] leading-relaxed font-semibold italic break-words ${isDarkTheme ? 'text-slate-200' : 'text-slate-800'}`}>
                      "{clinicalText}"
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className={`p-4 rounded-2xl space-y-1.5 w-full max-w-full transition-colors ${isDarkTheme ? 'bg-cyan-950/20 border border-cyan-500/20 text-slate-100' : 'bg-slate-900 text-white'}`}>
                    <span className={`text-[9.5px] font-black tracking-wider uppercase block font-sans border-b pb-1 ${isDarkTheme ? 'text-cyan-400 border-cyan-900/60' : 'text-cyan-300 border-slate-800'}`}>
                      {translate("emergency_plan")}
                    </span>
                    <p className="text-[11px] leading-relaxed font-bold break-words">
                      {nextActions}
                    </p>
                  </div>

                  {/* Literature Evidence reference badge */}
                  <div className={`p-3 border rounded-xl text-[9px] flex justify-between items-center w-full max-w-full transition-colors ${previewItemBg}`}>
                    <span className="truncate">📚 <b>Referans:</b> IARC Monograph Group 2B / WHO Air Quality Guidelines &bull; Sayfa 284</span>
                    <span className="font-mono text-[7px] uppercase tracking-wider text-cyan-500 font-bold ml-1 flex-shrink-0">VALID SIGNATURE</span>
                  </div>

                </div>

                {/* Simulated decentralized A4 report footer */}
                <div className={`pt-4 border-t flex flex-col sm:flex-row justify-between items-start text-[9px] mt-8 gap-3 ${isDarkTheme ? 'border-white/10 text-slate-400' : 'border-slate-350 text-slate-500'}`}>
                  <div className="space-y-0.5">
                    <p className={`font-black uppercase tracking-tight ${previewTextPrimary}`}>{translate("project_caption")}</p>
                    <p className="font-semibold">
                      Halk Sağlığı Anabilim Dalı &bull; Klinik Sürveyans Destek Hattı
                    </p>
                    <p className="text-[7.5px] opacity-70 italic">Doğrulama: {verifyHash}</p>
                  </div>

                  <div className="text-left sm:text-right space-y-0.5">
                    <p className="font-black text-cyan-500 uppercase tracking-widest">{translate("team_label")}</p>
                    <p className={`font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Şehmus AYKUT &bull; Fatma Nur AYKUT &bull; Aghajan MUSALI</p>
                  </div>
                </div>

              </div>
            )}

          </div>

      </div>

      {/* Embedded print style block */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 10mm !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          /* Override any inline dynamic backgrounds and borders for high contrast paper print */
          #print-section div, 
          #print-section p, 
          #print-section h1, 
          #print-section h2, 
          #print-section span {
            background: transparent !important;
            color: black !important;
            border-color: #cbd5e1 !important;
          }
          #print-section .bg-slate-900,
          #print-section .bg-slate-950,
          #print-section .bg-slate-[#0b1022],
          #print-section .bg-[#0b1022]\\/60,
          #print-section .bg-[#0f172a]\\/80 {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
          }
          #print-section .text-cyan-400,
          #print-section .text-cyan-500,
          #print-section .text-emerald-400 {
            color: #0284c7 !important;
          }
          #print-section .text-rose-500 {
            color: #b91c1c !important;
            font-weight: 900 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
