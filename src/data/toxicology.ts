export interface Chemical {
  id: string;
  name: string;
  cas?: string;
  sectors: string[];
  units?: string[];
  exposureRoutes?: string[];
  acuteSymptoms: string[];
  chronicSymptoms: string[];
  labs: string[];
  organs: string[];
  riskInfo: string;
  riskLevelBase?: 'Low' | 'Medium' | 'High';
}

export const chemicals: Chemical[] = [
  {
    id: "benzene",
    name: "Benzen",
    cas: "71-43-2",
    sectors: ["Boya", "Kimya", "Petrol"],
    units: ["Boya Karışım", "Rafineri", "Laboratuvar"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    acuteSymptoms: ["Baş dönmesi", "Baş ağrısı", "Bulantı"],
    chronicSymptoms: ["Lökopeni", "Anemi", "Halsizlik"],
    labs: ["Hemogram (Lökosit <4.0)", "İdrarda Fenol"],
    organs: ["Kemik İliği", "Kan"],
    riskInfo: "Karsinojenik (Grup 1). Hematolojik malignite riski yüksektir.",
    riskLevelBase: "High"
  },
  {
    id: "toluene",
    name: "Toluen",
    cas: "108-88-3",
    sectors: ["Boya", "Ayakkabı", "Yapıştırıcı"],
    units: ["Yapıştırma Hattı", "Baskı Bölümü"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    acuteSymptoms: ["Baş ağrısı", "Uyuşukluk", "Göz yanması"],
    chronicSymptoms: ["Nöropati", "Hafıza sorunları", "Halsizlik"],
    labs: ["İdrar Hipürik Asit", "ALT/AST (>50)"],
    organs: ["Merkezi Sinir Sistemi", "Karaciğer"],
    riskInfo: "Nörotoksik etkiler baskındır.",
    riskLevelBase: "Medium"
  },
  {
    id: "lead",
    name: "Kurşun",
    cas: "7439-92-1",
    sectors: ["Metal", "Boya", "Akü"],
    units: ["Dökümhane", "Lehimleme", "Geri Dönüşüm"],
    exposureRoutes: ["İnhalasyon", "Oral"],
    acuteSymptoms: ["Karın ağrısı", "Kusma"],
    chronicSymptoms: ["Anemi", "Nöropati", "Diş eti çizgisi (Burton çizgisi)"],
    labs: ["Kan Kurşun (>40 µg/dL)", "Bazofilik noktalanma"],
    organs: ["Kemik", "Kan", "Böbrek", "Sinir Sistemi"],
    riskInfo: "Kümülatif zehirdir. Ciddi nörotoksisite riski.",
    riskLevelBase: "High"
  },
  {
    id: "arsenic",
    name: "Arsenik",
    cas: "7440-38-2",
    sectors: ["Metal", "Madencilik", "Pestisit"],
    units: ["Maden Sahası", "İlaçlama Karışım"],
    exposureRoutes: ["İnhalasyon", "Oral"],
    acuteSymptoms: ["Bulantı", "Kusma", "Karın ağrısı", "İshal"],
    chronicSymptoms: ["Hiperkeratoz", "Pigmentasyon", "Nöropati"],
    labs: ["İdrar Arsenik (>35 µg/L)", "AST/ALT"],
    organs: ["Cilt", "GI Sistem", "Karaciğer"],
    riskInfo: "Akut ve kronik etkileri hayatı tehdit edebilir.",
    riskLevelBase: "High"
  },
  {
    id: "organophosphate",
    name: "Organofosfat",
    sectors: ["Tarım"],
    units: ["İlaçlama", "Depolama"],
    exposureRoutes: ["Dermal", "İnhalasyon"],
    acuteSymptoms: ["Miyozis", "Aşırı tükürük", "İshal", "Nefes darlığı"],
    chronicSymptoms: ["Kas güçsüzlüğü", "Nöropati"],
    labs: ["Kolinesteraz (<5000 U/L)"],
    organs: ["Sinir Sistemi", "Kaslar"],
    riskInfo: "Kolinerjik kriz riski yüksektir.",
    riskLevelBase: "High"
  },
  {
    id: "formaldehyde",
    name: "Formaldehit",
    cas: "50-00-0",
    sectors: ["Hastane", "Boya", "Mobilya"],
    units: ["Patoloji Lab", "Sterilizasyon", "Mobilya Atölyesi"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    acuteSymptoms: ["Göz yanması", "Öksürük", "Nefes darlığı"],
    chronicSymptoms: ["Dermatit", "Mesleki Astım"],
    labs: ["SFT (Obstrüktif bulgular)"],
    organs: ["Üst Solunum Yolları", "Cilt"],
    riskInfo: "Karsinojeniktir (Nazofarenks kanseri).",
    riskLevelBase: "Medium"
  },
  {
    id: "hexane",
    name: "n-Hekzan",
    cas: "110-54-3",
    sectors: ["Ayakkabı", "Tekstil", "Yapıştırıcı"],
    units: ["Yapıştırma Hattı", "Baskı"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    acuteSymptoms: ["Baş dönmesi", "Bulantı"],
    chronicSymptoms: ["Periferik Nöropati", "Kas güçsüzlüğü"],
    labs: ["İdrar 2,5-Heksandion"],
    organs: ["Sinir Sistemi"],
    riskInfo: "Özellikle ayakkabı sektöründe nörotoksisite riski yüksektir.",
    riskLevelBase: "High"
  },
  {
    id: "mercury",
    name: "Cıva",
    cas: "7439-97-6",
    sectors: ["Metal", "Kimya", "Madencilik"],
    units: ["Dökümhane", "Laboratuvar"],
    exposureRoutes: ["İnhalasyon", "Oral"],
    acuteSymptoms: ["Öksürük", "Metalik tat"],
    chronicSymptoms: ["Tremor", "Sinirlilik", "Diş eti sorunları"],
    labs: ["Kan Cıva", "İdrar Cıva"],
    organs: ["Böbrek", "Sinir Sistemi"],
    riskInfo: "Nörolojik ve renal hasar riski taşır.",
    riskLevelBase: "High"
  }
];

export const sectors = [
  "Boya", 
  "Ayakkabı", 
  "Hastane", 
  "Metal", 
  "Tarım", 
  "Madencilik", 
  "Kimya", 
  "Petrol", 
  "Mobilya",
  "Tekstil"
];

export const unitMap: Record<string, string[]> = {
  "Boya": ["Boya Karışım", "Boya Hattı", "Laboratuvar"],
  "Ayakkabı": ["Yapıştırma Hattı", "Kesim Bölümü", "Baskı"],
  "Hastane": ["Patoloji Lab", "Sterilizasyon", "Ameliyathane"],
  "Metal": ["Dökümhane", "Lehimleme", "Geri Dönüşüm"],
  "Tarım": ["İlaçlama", "Hasat", "Depolama"],
  "Madencilik": ["Maden Sahası", "Zenginleştirme Ünitesi"],
  "Kimya": ["Laboratuvar", "Üretim Hattı"],
  "Petrol": ["Rafineri", "Saha Operasyonu"],
  "Mobilya": ["Atölye", "Cila Bölümü"],
  "Tekstil": ["Dokuma", "Boya Hattı"]
};

export const symptoms = [
  "Baş ağrısı", "Baş dönmesi", "Bulantı", "Karın ağrısı", "Halsizlik",
  "Nefes darlığı", "Öksürük", "Cilt tahrişi", "Göz yanması", 
  "Diş eti çizgisi", "Tremor", "Nöropati", "Sarılık", "Kusma",
  "İshal", "Kas güçsüzlüğü", "Hiperkeratoz", "Pigmentasyon",
  "Miyozis", "Metalik Tat", "Sinirlilik"
];
