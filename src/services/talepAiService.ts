import { aiTemplates } from '../data/aiResponseTemplates';

export interface AiContext {
  sector?: string;
  unit?: string;
  symptoms?: string[];
  labResults?: Record<string, any>;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface StructuredAiResponse {
  summary: string;
  factors: string[];
  recommendations: string[];
  riskLevel: 'Düşük' | 'Orta' | 'Orta-Yüksek' | 'Yüksek' | 'Kritik';
  alert?: string;
}

// Utility to get a random item from a list
const getRandom = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export const generateTalepAIResponse = (question: string, context?: AiContext): StructuredAiResponse | string => {
  const q = question.toLowerCase();
  
  if (!context || (!context.sector && !context.unit && q.length < 3)) {
    return "TALEP AI AKTİF. Sektör, semptom ve laboratuvar verilerine göre toksikolojik risk analizi hazır. Klinik değerlendirme için veri girişi bekleniyor.";
  }

  // Keywords to template category mapping
  if (q.includes('solvent') || (context.sector?.toLowerCase().includes('boya')) || (context.sector?.toLowerCase().includes('ayakkabı'))) {
    return getRandom(aiTemplates.solvent);
  }

  if (q.includes('metal') || (context.sector?.toLowerCase().includes('metal'))) {
    return getRandom(aiTemplates.heavyMetal);
  }

  if (q.includes('tarım') || q.includes('ilaç') || q.includes('pestisit')) {
    return getRandom(aiTemplates.agriculture);
  }

  if (q.includes('sft') || q.includes('solunum') || q.includes('nefes')) {
    return getRandom(aiTemplates.sft);
  }

  // Quick Action Specific fallbacks
  if (q.includes('iş kazası') || q.includes('güvenlik')) {
    return {
      summary: "Akut risk ve güvenlik değerlendirmesi: İş kazası potansiyeli saptandı.",
      factors: ["Yetersiz KKE kullanımı", "Yorgunluk/Vardiya düzensizliği", "Makine koruyucu eksikliği"],
      recommendations: ["Acil saha denetimi", "Güvenlik prosedürlerinin revizyonu", "İşbaşı eğitimi"],
      riskLevel: "Yüksek",
      alert: "Hayati tehlike arz eden fiziksel riskler mevcuttur."
    };
  }

  if (q.includes('ppe') || q.includes('kke') || q.includes('maske') || q.includes('donanım')) {
    return {
      summary: "KKE (Kişisel Koruyucu Ekipman) Uygunluk Değerlendirmesi.",
      factors: ["Solvent maskesi (A tipi filtre)", "Nitril eldiven", "Kimyasal koruyucu gözlük"],
      recommendations: ["Filtre değişim periyodunun denetimi", "Sızdırmazlık testlerinin (Fit test) yapılması", "Ekipman temizlik prosedürü"],
      riskLevel: "Orta",
    };
  }

  if (q.includes('alt') || q.includes('ast') || q.includes('karaciğer') || q.includes('enzim')) {
    return {
      summary: "Hepatotoksisite Analizi: Karaciğer enzim değerleri değerlendiriliyor.",
      factors: ["Solvent maruziyeti (Karma)", "Hepatosteatoz riski", "İlaç/Alkol etkileşimi"],
      recommendations: ["GGT ve İndirekt Bilirubin takibi", "Batın USG incelemesi", "Maruziyet dışı izleme periyodu"],
      riskLevel: "Yüksek",
      alert: "ALT > 2x Normal değer saptandığında iş yeri hekimi konsültasyonu zorunludur."
    };
  }

  if (q.includes('msds')) {
    return {
      summary: "MSDS Veri Özeti: Kimyasal maruziyet profili oluşturuldu.",
      factors: ["Hedef organ: Karaciğer/Böbrek", "Maruziyet yolu: İnhalasyon/Dermal"],
      recommendations: ["LD50 değerlerinin kontrolü", "Spesifik antidot araştırması", "Depolama koşullarının iyileştirilmesi"],
      riskLevel: "Orta",
    };
  }

  // Default fallback
  return getRandom(aiTemplates.general);
};

