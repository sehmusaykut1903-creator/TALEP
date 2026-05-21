export interface ScientificToxin {
  id: string;
  name: string;
  cas: string;
  chemicalFormula?: string;
  sectors: string[];
  exposureRoutes: string[];
  iarcClassification: string; // e.g. "Group 1 (Carcinogenic to humans)"
  oshaPel: string; // OSHA Permissible Exposure Limit
  nioshRel: string; // NIOSH Recommended Exposure Limit
  targetOrgans: string[];
  acuteEffects: string[];
  chronicEffects: string[];
  ppeRequirements: string[];
  clinicalRecommendations: string[];
  riskIndicators: {
    label: string;
    description: string;
    threshold: string;
  }[];
  academicReferences: {
    citation: string;
    pubmedId?: string;
    link?: string;
    agency: 'WHO' | 'OSHA' | 'CDC' | 'ATSDR' | 'IARC' | 'NIOSH' | 'PubMed';
  }[];
  biologicalBiomarkers: {
    marker: string;
    specimen: 'Urine' | 'Blood' | 'Serum' | 'Alveolar Air';
    normalRange: string;
    exposureLimit: string;
  }[];
}

export const scientificDatabase: ScientificToxin[] = [
  {
    id: "benzene",
    name: "Benzen",
    cas: "71-43-2",
    chemicalFormula: "C6H6",
    sectors: ["Boya", "Kimya", "Petrol", "Rafineri", "Ayakkabı"],
    exposureRoutes: ["İnhalasyon", "Dermal", "Gastrointestinal"],
    iarcClassification: "Grup 1 (İnsanlar İçin Kesin Karsinojen)",
    oshaPel: "1 ppm (TWA), 5 ppm (STEL)",
    nioshRel: "0.1 ppm (TWA), 1 ppm (STEL)",
    targetOrgans: ["Kemik İliği", "Lenfoid Sistem", "Hematopoetik Sistem", "Merkezi Sinir Sistemi"],
    acuteEffects: [
      "Baş dönmesi, öfori ve baş ağrısı",
      "Solunum yollarında mukozal irritasyon",
      "Aritmiler (özellikle katekolamin duyarlılaşması nedeniyle)",
      "Yüksek konsantrasyonlarda bilinç kaybı"
    ],
    chronicEffects: [
      "Aplastik Anemi (Pansitopeni)",
      "Akut Miyeloid Lösemi (AML)",
      "Miyelodisplastik Sendrom (MDS)",
      "Trombositopeni ve lökopeni",
      "Kromozomal aberasyonlar"
    ],
    ppeRequirements: [
      "Solvent maskesi (Aktif karbon A2P3 veya self-contained breathing apparatus)",
      "Viton / Nitril eldivenler (süre limitli koruma)",
      "Antistatik, sızdırmaz kimyasal tulum (Tip 3/4)",
      "Kimyasal koruma gözlükleri"
    ],
    clinicalRecommendations: [
      "Tam kan sayımının (Hemogram) 3 ayda bir periyodik takibi",
      "İdrarda S-fenilmerkaptoürik asit (S-PMA) veya Trans,trans-mukonit asit (tt-MA) seviyelerinin analizi",
      "Maruziyet saptandığında hastanın derhal maruziyet dışı bırakılması",
      "Hematoloji poliklinik konsültasyonu"
    ],
    riskIndicators: [
      { label: "tt-MA (İdrar)", description: "Trans,trans-mukonit asit", threshold: "> 500 µg/g kreatinin" },
      { label: "S-PMA (İdrar)", description: "S-fenilmerkaptoürik asit", threshold: "> 25 µg/g kreatinin" },
      { label: "Lökosit (WBC)", description: "Beyaz kan hücresi baskılanması", threshold: "< 4.0 x 10³/µL" }
    ],
    biologicalBiomarkers: [
      { marker: "t,t-Mukonik Asit", specimen: "Urine", normalRange: "< 100 µg/g", exposureLimit: "500 µg/g kreatinin (Vardiya Sonu)" },
      { marker: "S-Fenilmerkaptoürik Asit", specimen: "Urine", normalRange: "< 2 µg/g", exposureLimit: "25 µg/g kreatinin (Vardiya Sonu)" },
      { marker: "Kan Benzene", specimen: "Blood", normalRange: "Belirlenemez", exposureLimit: "5 µg/L" }
    ],
    academicReferences: [
      { citation: "IARC Monographs on the Evaluation of Carcinogenic Risks to Humans, Volume 120: Benzene (2018).", agency: "IARC", pubmedId: "30263065" },
      { citation: "ATSDR - Toxicological Profile for Benzene (2021). Agency for Toxic Substances and Disease Registry.", agency: "ATSDR" },
      { citation: "CDC/NIOSH Pocket Guide to Chemical Hazards - Benzene (CAS No. 71-43-2).", agency: "NIOSH" }
    ]
  },
  {
    id: "arsenic",
    name: "Arsenik (İnorganik)",
    cas: "7440-38-2",
    chemicalFormula: "As",
    sectors: ["Metal", "Madencilik", "Pestisit", "Elektronik", "Cam Sanayii"],
    exposureRoutes: ["İnhalasyon", "Gastrointestinal (Kontamine su/gıda)", "Dermal"],
    iarcClassification: "Grup 1 (İnsanlar İçin Kesin Karsinojen)",
    oshaPel: "0.010 mg/m³ (TWA)",
    nioshRel: "0.002 mg/m³ (15-dk tavan)",
    targetOrgans: ["Cilt", "Periferik Sinir Sistemi", "Karaciğer", "Böbrekler", "Kardiyovasküler Sistem"],
    acuteEffects: [
      "Şiddetli hemorajik gastroenterit (kusma ve pirinç suyu görünümünde ishal)",
      "Ağızda metalik tat ve sarımsak kokulu nefes",
      "QT uzaması ve torsades de pointes",
      "Akut renal yetmezlik (tübüler nekroz)"
    ],
    chronicEffects: [
      "Avuç içi ve ayak tabanında punktat hiperkeratoz",
      "Yamalı hiperpigmentasyon (yağmur damlası deseni)",
      "Periferik arter hastalığı (Blackfoot Hastalığı)",
      "Sensörimotor polinöropati (eldiven-çorap tarzı uyuşma)",
      "Akciğer ve cilt karsinomu riski"
    ],
    ppeRequirements: [
      "HEPA filtreli toz maskeleri (N100 veya P100)",
      "Kimyasallara dayanıklı bariyer nitril eldivenler",
      "Tam yüz maskesi koruması",
      "Duş ve soyunma odası standardizasyonu (eve toz taşınmasını önlemek için)"
    ],
    clinicalRecommendations: [
      "İdrar arsenik türleme testlerinin yapılması (Organik arsenik balık tüketimiyle karışır, inorganik türevleri ayrıştırılmalıdır)",
      "ALT/AST ve böbrek fonksiyon testlerinin 6 ayda bir takibi",
      "Cilt muayenesinin düzenli yapılması",
      "Şiddetli vakalarda şelasyon tedavisi (Dimerkaprol/BAL veya DMPS)"
    ],
    riskIndicators: [
      { label: "İnorganik As (İdrar)", description: "İdrarda İnorganik Arsenik + Metabolitleri", threshold: "> 35 µg/L" },
      { label: "AST / ALT", description: "Hepatotoksik enzim elevasyonu", threshold: "> 2x Normal Üst Sınır" }
    ],
    biologicalBiomarkers: [
      { marker: "İnorganik Arsenik ve Metabolitleri", specimen: "Urine", normalRange: "< 10 µg/L", exposureLimit: "35 µg/L (Hafta Sonu Vardiya Sonu)" },
      { marker: "Kan Arsenik", specimen: "Blood", normalRange: "< 5 µg/L", exposureLimit: "Akut maruziyet harici güvenilmezdir" }
    ],
    academicReferences: [
      { citation: "World Health Organization (WHO) Guidelines for Drinking-water Quality: Arsenic (2020).", agency: "WHO" },
      { citation: "ATSDR - Toxicological Profile for Arsenic (2019).", agency: "ATSDR" },
      { citation: "OSHA Arsenic Standard (29 CFR 1910.1018).", agency: "OSHA" }
    ]
  },
  {
    id: "formaldehyde",
    name: "Formaldehit",
    cas: "50-00-0",
    chemicalFormula: "CH2O",
    sectors: ["Hastane", "Patoloji Lab", "Sterilizasyon", "Boya", "Mobilya", "Tekstil"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    iarcClassification: "Grup 1 (İnsanlar İçin Kesin Karsinojen)",
    oshaPel: "0.75 ppm (TWA), 2 ppm (STEL)",
    nioshRel: "0.016 ppm (TWA), 0.1 ppm (15-dk tavan)",
    targetOrgans: ["Nazofarenks", "Üst Solunum Yolları", "Cilt", "Gözler"],
    acuteEffects: [
      "Şiddetli lakrimasyon, göz ve boğazda yanma",
      "Bronkospazm ve toksik akciğer ödemi",
      "Kontakt dermatit (Akut alerjik rinit)"
    ],
    chronicEffects: [
      "Nazofarenks kanseri",
      "Sino-nazal kanserler",
      "Miyeloid lösemi ilişkisi",
      "Kalıcı mesleki astım ve KOAH benzeri tıkanıklık",
      "Ciltte ciddi sensitizasyon"
    ],
    ppeRequirements: [
      "Formaldehit filtreli gaz maskesi kartuşları (B tipi veya özel formaldehit kartuşları)",
      "Butil / Nitril eldivenler",
      "Laboratuvar kollu önlüğü veya sıçramaya dayanıklı tulum",
      "Göz yıkama istasyonları yakınlığı"
    ],
    clinicalRecommendations: [
      "Solunum fonksiyon testlerinin (SFT) yıllık takibi (FEV1, FVC, FEV1/FVC oranları)",
      "Göz ve kulak burun boğaz rutin kontrolleri",
      "Cilt yama (Patch) testleri"
    ],
    riskIndicators: [
      { label: "SFT (FEV1/FVC)", description: "Solunum fonksiyon testi obstrüktif bulgu", threshold: "< %70" },
      { label: "Formalit Reaksiyonu", description: "Cilt sensitizasyonu testi", threshold: "Pozitif Reaksiyon" }
    ],
    biologicalBiomarkers: [
      { marker: "Formik Asit", specimen: "Urine", normalRange: "< 15 mg/L", exposureLimit: "Özgünlük düşüktür; tanı SFT ve klinik bulgu ile konulur" }
    ],
    academicReferences: [
      { citation: "IARC Volume 100-F: Formaldehyde (2012). International Agency for Research on Cancer.", agency: "IARC" },
      { citation: "CDC/ATSDR Toxicological Profile for Formaldehyde (2014).", agency: "ATSDR" }
    ]
  },
  {
    id: "lead",
    name: "Kurşun",
    cas: "7439-92-1",
    chemicalFormula: "Pb",
    sectors: ["Metal", "Akü İmalatı", "Geri Dönüşüm", "Maden Sahası", "Lehimleme"],
    exposureRoutes: ["İnhalasyon", "Gastrointestinal (El-Ağız kontaminasyonu)", "Dermal (Minimal)"],
    iarcClassification: "Grup 2B (Muhtemel Karsinojen)",
    oshaPel: "0.050 mg/m³ (TWA)",
    nioshRel: "0.050 mg/m³ (TWA - Kan Pb seviyesini < 30 µg/dL tutmak için)",
    targetOrgans: ["Kemik İliği", "Periferik Sinir Sistemi", "Böbrekler (Proksimal tübüller)", "Merkezi Sinir Sistemi", "Kardiyovasküler Sistem"],
    acuteEffects: [
      "Kurşun koliği (şiddetli kramp tarzı karın ağrıları)",
      "Akut ensefalopati (özellikle çocuklarda ve çok yüksek düzeyde)",
      "Kusma, metalik tat ve dehidrasyon"
    ],
    chronicEffects: [
      "Anemi (Hem sentezinde ALAD ve ferroşelataz enzim inhibisyonu)",
      "Düşük el/ayak (Radial sinir hasarı - Motor polinöropati)",
      "Kurşun nefropatisi (interstisiyel fibrozis)",
      "Diş eti çizgisi (Burton Çizgisi)",
      "Hipertansiyon ve gut (satürnin gut)"
    ],
    ppeRequirements: [
      "P3 partikül filtreli yarım/tam yüz respiratörler",
      "Tek kullanımlık toz geçirmeyen tulumlar (hava sirkülasyonlu alanlar)",
      "Ağır sanayi nitril eldivenleri",
      "Saha içi giysilerle ev kıyafetlerinin kesin olarak ayrılması"
    ],
    clinicalRecommendations: [
      "Kan kurşun seviyesinin (BLL) düzenli periyodik analizi",
      "Hemogram ve periferik yayma (Bazofilik noktalanma varlığı)",
      "Kreatinin ve proteinüri takibi",
      "Şelasyon kriterleri: Semptomatik ve BLL > 50 µg/dL (Süksimer - DMSA veya CaNa2EDTA)"
    ],
    riskIndicators: [
      { label: "Kan Kurşun (PbB)", description: "Blood Lead Level (BLL)", threshold: "> 30 µg/dL (Kritik: > 50)" },
      { label: "Çinko Protoporfirin (ZPP)", description: "Demir yerine çinko bağlanması sonucu", threshold: "> 70 µg/dL" },
      { label: "Hemoglobin", description: "Mikrositer/normositer hipokrom anemi", threshold: "< 11 g/dL" }
    ],
    biologicalBiomarkers: [
      { marker: "Kan Kurşun (BLL)", specimen: "Blood", normalRange: "< 5 µg/dL", exposureLimit: "30 µg/dL (Tıbbi uzaklaştırma sınırı: 50)" },
      { marker: "Çinko Protoporfirin (ZPP)", specimen: "Blood", normalRange: "< 35 µg/dL", exposureLimit: "70 µg/dL" },
      { marker: "İdrarda Delta-Aminolevülinik Asit", specimen: "Urine", normalRange: "< 4.5 mg/g", exposureLimit: "6.0 mg/g kreatinin" }
    ],
    academicReferences: [
      { citation: "World Health Organization. Operational guidance for the assessment of lead exposure (2021).", agency: "WHO" },
      { citation: "CDC National Institute for Occupational Safety and Health (NIOSH) Adult Blood Lead Epidemiology and Surveillance (ABLES).", agency: "NIOSH" }
    ]
  },
  {
    id: "mercury",
    name: "Cıva (Metalik ve İnorganik)",
    cas: "7439-97-6",
    chemicalFormula: "Hg",
    sectors: ["Metal", "Klor-Alkali Tesisleri", "Atık Yönetimi", "Laboratuvar", "Diş Hekimliği"],
    exposureRoutes: ["İnhalasyon (Cıva buharı en tehlikelisidir)", "Dermal (Minimal)", "Gastrointestinal"],
    iarcClassification: "Grup 3 (İnsana karsinojenik olarak sınıflandırılamaz)",
    oshaPel: "0.1 mg/m³ (tavan limit)",
    nioshRel: "0.05 mg/m³ (TWA buharlar için)",
    targetOrgans: ["Merkezi Sinir Sistemi (Serebellum - Bazal Ganglionlar)", "Böbrekler (Akut tübüler nekroz / membranöz nefropati)", "Cilt"],
    acuteEffects: [
      "Kimyasal pnömoni ve bronşiolit (buhar inhalasyonu sonrası)",
      "Metalik tat, ağızda yaralar ve aşırı tükürük salgısı",
      "Hemorajik kolit"
    ],
    chronicEffects: [
      "Erethism (Aşırı utangaçlık, anxiete, emosyonel labilite, uykusuzluk)",
      "İntansiyonel ince tremor (Danbury Tremoru, cıva tremoru)",
      "Mercuria lentis (göz merceğinde kahverengi renk değişikliği)",
      "Akrodini (pembe hastalığı - el/ayaklarda ağrılı kızarıklık ve soyulma)",
      "Sensörimotor kayıplar"
    ],
    ppeRequirements: [
      "HG cıva kartuşlu özel filtreli respiratörler",
      "Sıçramaya ve neme dayanıklı bariyer tulumlar",
      "Özel neopren koruyucu eldivenler",
      "Cıva dökülme kitlerinin (Gold/Zinc tozu ve kükürt barındıran) kullanımı"
    ],
    clinicalRecommendations: [
      "Buhar ve inorganik maruziyette haftalık/aylık İdrar Cıva takibi",
      "Nörolojik muayene ve tremorimetre testleri",
      "Böbrek fonksiyon testleri ve 24 saatlik idrar proteinüri klerensi",
      "Şelasyon tedavisi: DMPS veya DMSA"
    ],
    riskIndicators: [
      { label: "İdrar Cıva (HgU)", description: "Periyodik inorganik cıva takibi", threshold: "> 20 µg/g kreatinin" },
      { label: "Kan Cıva (HgB)", description: "Akut veya organik cıva göstergesi", threshold: "> 15 µg/L" }
    ],
    biologicalBiomarkers: [
      { marker: "Cıva (Vardiya Öncesi)", specimen: "Urine", normalRange: "< 5 µg/g", exposureLimit: "20 µg/g kreatinin" },
      { marker: "Kan Cıva (Vardiya Sonu)", specimen: "Blood", normalRange: "< 2 µg/L", exposureLimit: "15 µg/L" }
    ],
    academicReferences: [
      { citation: "ATSDR - Toxicological Profile for Mercury (2022). Agency for Toxic Substances and Disease Registry.", agency: "ATSDR" },
      { citation: "WHO. Inorganic Mercury Guidance on Assessment and Treatment of Exposures (2019).", agency: "WHO" }
    ]
  },
  {
    id: "organophosphate",
    name: "Organofosfatlı Pestisitler",
    cas: "N/A (Sınıfsal)",
    chemicalFormula: "R2-P(=O/S)-O-R'",
    sectors: ["Tarım", "Pestisit İlaçlama", "Sera İşçiliği", "Park ve Bahçe Düzenleme"],
    exposureRoutes: ["Dermal (En yaygın mesleki yol)", "İnhalasyon", "Gastrointestinal (Kontamine gıda, kazara alım)"],
    iarcClassification: "Maddeye bağlı değişir (Örn: Malatyon Grup 2A, Paratyon Grup 2B)",
    oshaPel: "Maddeye göre değişken (örn. Paratyon için 0.1 mg/m³ TWA)",
    nioshRel: "Maddeye göre değişken",
    targetOrgans: ["Otonom Sinir Sistemi", "Somatik ve Merkezi Sinir Sistemi (Asetilkolinesteraz inhibisyonu)"],
    acuteEffects: [
      "Muzdarip muskarinik kriz: Miyozis, aşırı lakrimasyon, salivasyon, bronkore ve bronkospazm, kusma, ishal (SLUDGE sendromu)",
      "Nikotinik kriz: Kas fasikülasyonları, kramplar, güçsüzlük, taşikardi, diyafram felci",
      "Merkezi kriz: Solunum baskılanması, nöbetler ve koma"
    ],
    chronicEffects: [
      "Organofosfata Bağlı Gecikmiş Nöropati (OPIDN - Akut krizden 1-3 hafta sonra gelişen aksonal hasar)",
      "Kalıcı nörodavranışsal fonksiyon bozuklukları, konsantrasyon kayıpları",
      "Kronik halsizlik sendromu"
    ],
    ppeRequirements: [
      "Su geçirmez, kimyasal koruyucu ilaçlama tulumları (Tyvek Tip 4/5/6)",
      "Uzun dirsek boy kimyasal koruyucu nitril eldivenler (ilaç hazırlamada butil)",
      "A2P3 kombine gaz filtreli maskeler",
      "Yarı yarıya emici olmayan yıkayıcı botlar"
    ],
    clinicalRecommendations: [
      "Eritrosit asetilkolinesteraz (AChE) veya Serum psödokolinesteraz (PChE) seviyelerinin takibi",
      "Akut krizde derhal Atropin (muskarinik bulgular düzelene kadar titrasyon) ve Pralidoksim (2-PAM - kolinesteraz reaktivatörü) başlanmalıdır",
      "Dekontaminasyon (Tüm giysiler çıkarılmalı, cilt bol sabunlu suyla yıkanmalıdır)"
    ],
    riskIndicators: [
      { label: "Asetilkolinesteraz (AChE)", description: "Eritrosit hücre kolinesterazı (güvenilir)", threshold: "< %70 aktivite baskılanması" },
      { label: "Psödokolinesteraz (PChE)", description: "Serum kolinesterazı (erken yanıt verir)", threshold: "< 4000 U/L" }
    ],
    biologicalBiomarkers: [
      { marker: "Eritrosit Kolinesteraz (AChE)", specimen: "Blood", normalRange: "%80 - %120 aktif", exposureLimit: "< %70 bazal değerin altına düşüş (Tıbbi uzaklaştırma sınırı)" },
      { marker: "İdrarda Alkil Fosfatlar (DAP'lar)", specimen: "Urine", normalRange: "Belirlenemez", exposureLimit: "Maruziyet varlığının kalitatif kanıtı" }
    ],
    academicReferences: [
      { citation: "WHO/UNEP. Organophosphorus Pesticides: A Epidemiological and Clinical Review (2020).", agency: "WHO" },
      { citation: "CDC National Center for Environmental Health - Biomonitoring of Pesticides.", agency: "CDC" }
    ]
  },
  {
    id: "aniline_solvents",
    name: "Organik Solventler / Anililer / Karma Solventler",
    cas: "N/A (Sınıfsal)",
    sectors: ["Boya", "Kimya", "Yarım İletken", "Otomotiv", "Ayakkabı"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    iarcClassification: "Karma bileşime göre değişir. n-Hekzan ve Toluen Grup 3'tedir.",
    oshaPel: "Karma solventlerde her ajan için ayrıdır (Toluen: 200 ppm, n-Hekzan: 500 ppm TWA)",
    nioshRel: "Toluen: 100 ppm, n-Hekzan: 50 ppm",
    targetOrgans: ["Merkezi ve Periferic Sinir Sistemi", "Karaciğer", "Böbrek", "Cilt", "Gözler"],
    acuteEffects: [
      "Narkoz, baş dönmesi, ataksi ve baş ağrısı",
      "Dermal tahriş, dermatit",
      "Aspirasyon durumunda kimyasal pnömoni",
      "Mukozal irritasyon"
    ],
    chronicEffects: [
      "Ressam demansı (kronik solvent ensefalopatisi)",
      "Periferik polinöropati (n-Hekzan metaboliti 2,5-heksandion nedeniyle aksonal akış durması)",
      "Toksik hepatit (Karaciğer yağlanması, steatohepatit)",
      "Geri dönüşümsüz renal tübüler asidoz"
    ],
    ppeRequirements: [
      "A tipi (kahverengi) solvent kartuşlu respiratörler",
      "Nitril ve lamine bariyer eldivenler",
      "Göz koruması",
      "Lokal egzoz havalandırma sistemlerinin entegrasyonu"
    ],
    clinicalRecommendations: [
      "Nörolojik muayenenin derinlemesine yapılması, EMG çekilmesi",
      "ALT, AST, GGT, Alkalen Fosfataz takibi",
      "n-Hekzan maruziyetinde idrarda 2,5-Heksandion takibi",
      "Toluen maruziyetinde idrarda Hipürik Asit takibi"
    ],
    riskIndicators: [
      { label: "2,5-Heksandion (İdrar)", description: "n-Hekzan spesifik biyobelirteç", threshold: "> 0.4 mg/L" },
      { label: "Hipürik Asit (İdrar)", description: "Toluen biyobelirteci", threshold: "> 1.6 g/g kreatinin" },
      { label: "ALT / GGT", description: "Hepatotoksisite tarama", threshold: "> ALT 50 U/L" }
    ],
    biologicalBiomarkers: [
      { marker: "İdrar 2,5-Heksandion (n-Hekzan için)", specimen: "Urine", normalRange: "< 0.05 mg/L", exposureLimit: "0.4 mg/L (Vardiya Sonu)" },
      { marker: "İdrar Hipürik Asit (Toluen için)", specimen: "Urine", normalRange: "< 0.2 g/g", exposureLimit: "1.6 g/g kreatinin (Vardiya Sonu)" },
      { marker: "İdrar o-Krezol (Toluen için)", specimen: "Urine", normalRange: "Belirlenemez", exposureLimit: "0.3 mg/g kreatinin" }
    ],
    academicReferences: [
      { citation: "Occupational Exposure to Organic Solvents: A Review of Clinical Syndromes. Occupational Medicine Journal (2019).", agency: "PubMed" },
      { citation: "NIOSH Occupational Exposure Banding: Chemical Solvents.", agency: "NIOSH" }
    ]
  }
];
