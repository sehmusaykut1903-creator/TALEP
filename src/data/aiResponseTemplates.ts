export const aiTemplates = {
  solvent: [
    {
      summary: "Solvent maruziyeti ile uyumlu biyokimyasal bulgular saptandı.",
      factors: ["Toluen", "Ksilen", "Benzen türevleri", "n-Hekzan"],
      recommendations: ["ALT/AST ve GGT takibi", "Solunum fonksiyon testi", "VOC analizi"],
      riskLevel: "Yüksek" as const
    },
    {
      summary: "Organik solvent ilişkili karaciğer etkilenimi olasılığı değerlendirilebilir.",
      factors: ["Etilbenzen", "Stiren", "Metil Etil Keton"],
      recommendations: ["Periyodik muayene tekrarı", "İş yeri hava ölçümü", "Hepatobiliyer USG"],
      riskLevel: "Orta-Yüksek" as const
    },
    {
      summary: "ALT yüksekliği solvent maruziyeti açısından dikkat gerektirmektedir.",
      factors: ["Karma solvent maruziyeti", "Tiner buharı"],
      recommendations: ["Biyolojik izlem (İdrarda hipürik asit)", "KKE denetimi"],
      riskLevel: "Orta" as const
    }
  ],
  heavyMetal: [
    {
      summary: "Ağır metal maruziyeti açısından ileri toksikolojik inceleme önerilir.",
      factors: ["Kurşun (Pb)", "Kadmiyum (Cd)", "Cıva (Hg)"],
      recommendations: ["Kanda ağır metal paneli", "ZPP düzeyi", "Böbrek fonksiyon testleri"],
      riskLevel: "Yüksek" as const
    },
    {
      summary: "Nörolojik semptomlar ağır metal etkilenimi ile ilişkili olabilir.",
      factors: ["Manganez", "Alüminyum", "Arsenik"],
      recommendations: ["Nörolojik konsültasyon", "EMG incelemesi", "İş yeri toz ölçümü"],
      riskLevel: "Orta-Yüksek" as const
    }
  ],
  agriculture: [
    {
      summary: "Organofosfat maruziyeti açısından kolinesteraz değerlendirilmelidir.",
      factors: ["Pestisitler", "İnsektisitler"],
      recommendations: ["Asetilkolinesteraz ölçümü", "Psödokolinesteraz", "Atropin hazırlığı"],
      riskLevel: "Kritik" as const
    }
  ],
  sft: [
    {
      summary: "Obstrüktif patern ile uyumlu solunum fonksiyon kısıtlılığı.",
      factors: ["Kaynak dumanı", "İrritan gazlar"],
      recommendations: ["Akciğer grafisi", "Reversibilite testi", "Maske uygunluk testi"],
      riskLevel: "Orta" as const
    },
    {
      summary: "Restriktif patern: Mesleki akciğer hastalığı riski.",
      factors: ["Kuvars tozu", "Asbest", "Kömür tozu"],
      recommendations: ["HRCT", "DLCO testi", "Toz ölçümü"],
      riskLevel: "Yüksek" as const
    }
  ],
  general: [
    {
      summary: "Mesleki maruziyet değerlendirmesi için ek veri gereklidir.",
      factors: ["Belirlenemeyen kimyasal etkenler"],
      recommendations: ["Semptom günlüğü", "İş yeri ziyareti", "MSDS taraması"],
      riskLevel: "Düşük" as const
    },
    {
      summary: "Semptom ve laboratuvar verileri birlikte değerlendirilmelidir.",
      factors: ["Multifaktöriyel etkilenim"],
      recommendations: ["Kapsamlı fizik muayene", "Eski kayıtların incelenmesi"],
      riskLevel: "Orta" as const
    }
  ]
};
