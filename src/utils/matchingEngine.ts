import { Chemical, chemicals } from '../data/toxicology';

export interface MatchingResult {
  chemical: Chemical;
  score: number;
  reasons: string[];
}

export interface AssessmentInput {
  sector: string;
  unit: string;
  symptoms: string[];
  labResults: {
    alt?: number;
    ast?: number;
    creatinine?: number;
    cholinesterase?: number;
    bloodLead?: number;
    urineArsenic?: number;
    wbc?: number;
    sft?: string; // normal, obstructive, restrictive
    xray?: string; // normal, irritation, infiltration
  };
}

export function calculateRisk(input: AssessmentInput): MatchingResult[] {
  const results: MatchingResult[] = [];

  for (const chemical of chemicals) {
    let score = 0;
    const reasons: string[] = [];

    // 1. Sector Compatibility (+20 points base)
    if (chemical.sectors.includes(input.sector)) {
      score += 20;
      reasons.push(`Sektör uyumu: ${input.sector}`);
    }

    // 2. Unit Compatibility (+30 points base - MSDS Advanced Logic)
    if (chemical.units?.includes(input.unit)) {
      score += 30;
      reasons.push(`${input.unit} birimi spesifik maruziyet riski`);
    }

    // 3. Symptom Compatibility (+15 per match - MSDS Advanced Logic)
    const matchedAcute = input.symptoms.filter(s => chemical.acuteSymptoms.includes(s));
    const matchedChronic = input.symptoms.filter(s => chemical.chronicSymptoms.includes(s));
    
    if (matchedAcute.length > 0) {
      score += matchedAcute.length * 15;
      reasons.push(`Akut bulgu uyumu: ${matchedAcute.join(', ')}`);
    }
    if (matchedChronic.length > 0) {
      score += matchedChronic.length * 20;
      reasons.push(`Kronik bulgu uyumu: ${matchedChronic.join(', ')}`);
    }

    // 4. Lab & Advanced Diagnostics (+30 points base)
    if (chemical.id === 'benzene' && input.labResults.wbc && input.labResults.wbc < 4.0) {
      score += 30;
      reasons.push('Hematolojik bulgu: Lökopeni');
    }

    if (chemical.id === 'lead' && input.labResults.bloodLead && input.labResults.bloodLead > 40) {
      score += 40;
      reasons.push('Kritik biyolojik izlem: Kan Kurşun > 40µg/dL');
    }

    if (chemical.id === 'organophosphate' && input.labResults.cholinesterase && input.labResults.cholinesterase < 5000) {
      score += 50;
      reasons.push('Kritik biyolojik izlem: Düşük Kolinesteraz');
    }

    // 5. SFT & Lung X-ray Entegrasyonu
    if (input.labResults.sft === 'obstructive' && chemical.id === 'formaldehyde') {
      score += 30;
      reasons.push('SFT: Obstrüktif bulgular (Formaldehit uyumlu)');
    }

    if (input.labResults.xray === 'irritation' && chemical.id === 'formaldehyde') {
      score += 25;
      reasons.push('Akciğer Grafisi: Solunum İrritasyonu');
    }

    if (chemical.id === 'hexane' && input.symptoms.includes('Nöropati') && input.unit === 'Yapıştırma Hattı') {
      score += 40;
      reasons.push('Karakteristik yapıştırma birimi nöropatisi (n-Hekzan)');
    }

    if (score > 15) {
      results.push({
        chemical,
        score: Math.min(score, 99),
        reasons
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
