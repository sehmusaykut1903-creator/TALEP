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
    sectors: ["Solvent", "Boya", "Kimya", "Petrol", "Rafineri", "Karsinojen", "Mesleki"],
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
    sectors: ["Ağır Metal", "Metaloid", "Pestisit", "Karsinojen", "Mesleki", "Su/Kanalizasyon"],
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
    sectors: ["Karsinojen", "Gaz", "Mesleki", "Hastane", "Patoloji Lab", "Sterilizasyon"],
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
    sectors: ["Ağır Metal", "Nörotoksin", "Nefrotoksin", "Mesleki", "Hepatotoksin", "Maden", "Akü İmalatı"],
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
    sectors: ["Ağır Metal", "Nörotoksin", "Nefrotoksin", "Mesleki", "Klor-Alkali Tesisleri", "Atık Yönetimi"],
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
    sectors: ["Pestisit", "Organofosfat", "Nörotoksin", "Gıda", "Mesleki", "Tarım"],
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
    sectors: ["Solvent", "Mesleki", "Nörotoksin", "Hepatotoksin", "Nefrotoksin", "Cilt", "Boya"],
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
  },
  {
    id: "cadmium",
    name: "Kadmiyum",
    cas: "7440-43-9",
    chemicalFormula: "Cd",
    sectors: ["Ağır Metal", "Karsinojen", "Nefrotoksin", "Mesleki", "Pil İmalatı"],
    exposureRoutes: ["İnhalasyon", "Gastrointestinal"],
    iarcClassification: "Grup 1 (İnsanlar İçin Kesin Karsinojen)",
    oshaPel: "0.005 mg/m³",
    nioshRel: "En düşük saptanabilir seviye",
    targetOrgans: ["Böbrek", "Akciğer", "Kemik", "Prostat"],
    acuteEffects: [
      "Metal dumanı ateşi (titreme, ateş, kas ağrısı)",
      "Kimyasal pnömonit",
      "Gastrointestinal tahriş (oral maruziyette)"
    ],
    chronicEffects: [
      "Böbrek hasarı (Proksimal tübüler disfonksiyon, proteinüri)",
      "Osteomalazi ve Osteoporoz (Itai-itai hastalığı)",
      "Akciğer kanseri ve KOAH",
      "Koku kaybı (Anozmi)"
    ],
    ppeRequirements: [
      "P100 veya HEPA filtreli respiratörler",
      "Tam vücut koruyucu tulum",
      "Eldiven ve gözlük"
    ],
    clinicalRecommendations: [
      "İdrar ve kan kadmiyum takibi",
      "Beta-2 mikroglobulin (idrar) analizi",
      "Böbrek fonksiyon testleri",
      "Akciğer grafisi ve SFT"
    ],
    riskIndicators: [
      { label: "Beta-2 Mikroglobulin", description: "Böbrek tübül hasarı göstergesi", threshold: "> 300 µg/g kreatinin" }
    ],
    biologicalBiomarkers: [
      { marker: "İdrar Kadmiyum", specimen: "Urine", normalRange: "< 3 µg/g", exposureLimit: "5 µg/g kreatinin" },
      { marker: "Kan Kadmiyum", specimen: "Blood", normalRange: "< 1 µg/L", exposureLimit: "5 µg/L" }
    ],
    academicReferences: [
      { citation: "ATSDR Toxicological Profile for Cadmium", agency: "ATSDR" },
      { citation: "IARC Monograph: Cadmium and Calcium Compounds", agency: "IARC" }
    ]
  },
  {
    id: "cyanide",
    name: "Siyanür",
    cas: "74-90-8",
    chemicalFormula: "HCN",
    sectors: ["Nörotoksin", "Mesleki", "Gaz", "Maden", "Madencilik (Altın çıkarma)"],
    exposureRoutes: ["İnhalasyon", "Gastrointestinal", "Dermal"],
    iarcClassification: "Sınıflandırılmamış",
    oshaPel: "10 ppm",
    nioshRel: "4.7 ppm (STEL)",
    targetOrgans: ["Merkezi Sinir Sistemi", "Kardiyovasküler Sistem", "Solunum Sistemi"],
    acuteEffects: [
      "Hücresel asfiksi (Sitokrom oksidaz inhibisyonu)",
      "Hızlı solunum, çarpıntı, baş ağrısı",
      "Bilinç kaybı, konvülsiyon, koma",
      "Parlak kırmızı venöz kan",
      "Acı badem kokusu"
    ],
    chronicEffects: [
      "Tiroid disfonksiyonu (tiyosiyanat nedeniyle)",
      "Nörolojik sekeller (Parkinsonizm)",
      "Optik nöropati"
    ],
    ppeRequirements: [
      "Siyanür onaylı tam yüz gaz maskesi",
      "Kimyasal koruyucu giysi",
      "Butil kauçuk eldiven"
    ],
    clinicalRecommendations: [
      "Laktik asidoz takibi (Anyon açığı yüksek asidoz)",
      "Acil antidot uygulaması (Hidroksokobalamin veya Sodyum Nitrit + Sodyum Tiyosülfat)",
      "%100 oksijen desteği"
    ],
    riskIndicators: [
      { label: "Laktat", description: "Hücre içi asfiksi göstergesi", threshold: "> 8 mmol/L" }
    ],
    biologicalBiomarkers: [
      { marker: "Kan Siyanür", specimen: "Blood", normalRange: "< 0.2 µg/mL", exposureLimit: "> 1.0 µg/mL (Toksik)" }
    ],
    academicReferences: [
      { citation: "ATSDR Medical Management Guidelines for Hydrogen Cyanide", agency: "ATSDR" }
    ]
  },
  {
    id: "carbon_monoxide",
    name: "Karbon Monoksit",
    cas: "630-08-0",
    chemicalFormula: "CO",
    sectors: ["Gaz", "Nörotoksin", "Maden", "Mesleki", "Madencilik", "İtfaiye"],
    exposureRoutes: ["İnhalasyon"],
    iarcClassification: "Sınıflandırılmamış",
    oshaPel: "50 ppm",
    nioshRel: "35 ppm (TWA), 200 ppm (Ceiling)",
    targetOrgans: ["Beyin", "Kalp"],
    acuteEffects: [
      "Baş ağrısı, bulantı, baş dönmesi",
      "Konfüzyon, senkop",
      "Miyokardiyal iskemi, disritmi",
      "Koma ve ölüm",
      "Kiraz kırmızısı cilt (nadir, geç bulgu)"
    ],
    chronicEffects: [
      "Gecikmiş Nörolojik Sekel Sendromu (GNSS)",
      "Kognitif bozukluklar, hafıza kaybı",
      "Parkinsonizm"
    ],
    ppeRequirements: [
      "Temiz havalı solunum cihazı (SCBA - ortamda CO ölçümü yapılamıyorsa)",
      "Kişisel sürekli CO monitörü"
    ],
    clinicalRecommendations: [
      "Derhal ortamdan uzaklaştırma, %100 normobarik oksijen",
      "Endikasyon varsa Hiperbarik Oksijen (COHb >25%, gebede >15%, senkop, EKG değişikliği)",
      "Kardiyak enzim (Troponin) ve EKG takibi"
    ],
    riskIndicators: [
      { label: "Karboksihemoglobin (COHb)", description: "Karbonmonoksit zehirlenmesi göstergesi", threshold: "> %5 (Sigara içmeyende)" }
    ],
    biologicalBiomarkers: [
      { marker: "Karboksihemoglobin (Kan)", specimen: "Blood", normalRange: "< %3", exposureLimit: "%3.5 (Tıbbi müdahale eşiği)" }
    ],
    academicReferences: [
      { citation: "WHO Guidelines for indoor air quality: selected pollutants", agency: "WHO" },
      { citation: "ATSDR Toxicological Profile for Carbon Monoxide", agency: "ATSDR" }
    ]
  },
  {
    id: "hydrogen_sulfide",
    name: "Hidrojen Sülfür",
    cas: "7783-06-4",
    chemicalFormula: "H2S",
    sectors: ["Gaz", "Su/Kanalizasyon", "Nörotoksin", "Mesleki", "Kanalizasyon / Atık Su"],
    exposureRoutes: ["İnhalasyon"],
    iarcClassification: "Sınıflandırılmamış",
    oshaPel: "20 ppm (Tavan)",
    nioshRel: "10 ppm (10 dk Tavan)",
    targetOrgans: ["Merkezi Sinir Sistemi", "Solunum Sistemi"],
    acuteEffects: [
      "Çürük yumurta kokusu (düşük dozlarda)",
      "Olfactory fatigue (koku siniri felci - yüksek dozda koku alınamaz)",
      "Gözlerde tahriş, keratit",
      "Ani bilinç kaybı ('Knockdown' etkisi)",
      "Pulmoner ödem ve hücresel asfiksi (sitokrom oksidaz inhibisyonu)"
    ],
    chronicEffects: [
      "Kronik bronşit",
      "Nörodavranışsal bozukluklar",
      "Kalıcı anosmi (koku alamama)"
    ],
    ppeRequirements: [
      "SCBA (Bağımsız solunum cihazı) - Kapalı alan çalışmalarında zorunlu",
      "Kişisel H2S gaz dedektörü"
    ],
    clinicalRecommendations: [
      "Acil rescue (kurtarıcılar da risk altındadır, uygun koruma şarttır)",
      "%100 oksijen desteği",
      "Uygun vakalarda Nitrit tedavisi (Siyanür gibi sitokrom enzimlerini hedefler, tiyosülfat önerilmez)"
    ],
    riskIndicators: [
      { label: "Klinik Prezantasyon", description: "Knockdown anamnezi", threshold: "Ani Kollaps" }
    ],
    biologicalBiomarkers: [
      { marker: "Kan Tiyosülfat", specimen: "Blood", normalRange: "Belirlenemez", exposureLimit: "Sadece adli vakalarda kullanılır" }
    ],
    academicReferences: [
      { citation: "OSHA Fact Sheet: Hydrogen Sulfide", agency: "OSHA" },
      { citation: "ATSDR Medical Management Guidelines for H2S", agency: "ATSDR" }
    ]
  },
  {
    id: "chlorine_gas",
    name: "Klor Gazı",
    cas: "7782-50-5",
    chemicalFormula: "Cl2",
    sectors: ["Gaz", "Su/Kanalizasyon", "Korozif", "Mesleki", "Su Arıtma"],
    exposureRoutes: ["İnhalasyon", "Dermal/Göz (Sıçrama)"],
    iarcClassification: "Sınıflandırılmamış",
    oshaPel: "1 ppm (Tavan)",
    nioshRel: "0.5 ppm",
    targetOrgans: ["Solunum Sistemi", "Gözler"],
    acuteEffects: [
      "Şiddetli göz, burun ve boğaz tahrişi",
      "Boğulma hissi, spazmodik öksürük",
      "Toksik pulmoner ödem / ARDS",
      "Hava yolu yanıkları"
    ],
    chronicEffects: [
      "Reaktif Havayolu Disfonksiyon Sendromu (RADS)",
      "Kronik obstrüktif akciğer hastalığı (KOAH)",
      "Kornea hasarı"
    ],
    ppeRequirements: [
      "Tam yüz maskesi (Asit gazı kartuşu)",
      "Yüksek konsantrasyonlar için SCBA",
      "Kimyasal koruyucu giysi"
    ],
    clinicalRecommendations: [
      "Oksijen desteği, bronkodilatörler (Albuterol)",
      "İnhale kortikosteroidler veya sistemik steroid (akciğer ödemini önlemek/hafifletmek için)",
      "Gözlerin bol su ile irrigasyonu"
    ],
    riskIndicators: [
      { label: "SFT", description: "Radyolojik/Klinik Obstrüksiyon", threshold: "FEV1 düşüşü" }
    ],
    biologicalBiomarkers: [
      { marker: "Klinik Tanı", specimen: "Alveolar Air", normalRange: "-", exposureLimit: "Spesifik biyobelirteci yoktur, öykü ve kliniğe dayanır" }
    ],
    academicReferences: [
      { citation: "CDC - Facts About Chlorine", agency: "CDC" }
    ]
  },
  {
    id: "toluene",
    name: "Toluen",
    cas: "108-88-3",
    chemicalFormula: "C7H8",
    sectors: ["Solvent", "Nörotoksin", "Hepatotoksin", "Nefrotoksin", "Mesleki", "Boya"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    iarcClassification: "Grup 3 (İnsana karsinojenik olarak sınıflandırılamaz)",
    oshaPel: "200 ppm (TWA)",
    nioshRel: "100 ppm",
    targetOrgans: ["Merkezi Sinir Sistemi", "Karaciğer", "Böbrekler"],
    acuteEffects: [
      "Öfori, ataksi, konfüzyon",
      "Solunum yolu tahrişi",
      "Gözlerde yanma, dermatit"
    ],
    chronicEffects: [
      "Santral ve periferik nöropati",
      "Hafıza bozuklukları, ensefalopati",
      "Renal tübüler asidoz",
      "Deride kuruluk ve çatlama"
    ],
    ppeRequirements: [
      "Organik buhar kartuşlu maske",
      "Nitril eldivenler"
    ],
    clinicalRecommendations: [
      "İdrar hipürik asit ve o-kresol takibi",
      "Nörolojik muayene",
      "Karaciğer fonksiyon testleri"
    ],
    riskIndicators: [
      { label: "ALT/AST", description: "Hepatik tahribat", threshold: "> 2x Normal Üst Sınır" }
    ],
    biologicalBiomarkers: [
      { marker: "İdrar Hipürik Asit", specimen: "Urine", normalRange: "< 0.5 g/L", exposureLimit: "1.6 g/g kreatinin" },
      { marker: "İdrar o-Kresol", specimen: "Urine", normalRange: "Belirlenemez", exposureLimit: "0.3 mg/g kreatinin" }
    ],
    academicReferences: [
      { citation: "ATSDR Toxicological Profile for Toluene", agency: "ATSDR" }
    ]
  },
  {
    id: "xylene",
    name: "Ksilen",
    cas: "1330-20-7",
    chemicalFormula: "C8H10",
    sectors: ["Solvent", "Nörotoksin", "Mesleki", "Cilt", "Boya", "Matbaa"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    iarcClassification: "Grup 3 (İnsana karsinojenik olarak sınıflandırılamaz)",
    oshaPel: "100 ppm (TWA)",
    nioshRel: "100 ppm",
    targetOrgans: ["Merkezi Sinir Sistemi", "Solunum Yolları", "Kardiyovasküler Sistem"],
    acuteEffects: [
      "Göz, burun, boğaz tahrişi",
      "Baş ağrısı, bulantı, kusma",
      "Yüksek dozda akciğer ödemi",
      "Aritmiler"
    ],
    chronicEffects: [
      "Nörodavranışsal bozulma",
      "Ciltte dehidrasyon ve kontakt dermatit",
      "Böbrek ve karaciğer fonksiyonlarında hafif değişiklikler"
    ],
    ppeRequirements: [
      "Teflon veya fluorinasyonlu kauçuk eldiven",
      "Organik solvent filtreli maske"
    ],
    clinicalRecommendations: [
      "İdrar metilhipürik asit takibi",
      "SFT takipleri",
      "EEG ve kognitif testler"
    ],
    riskIndicators: [
      { label: "BFT", description: "Renal parametre", threshold: "BUN/Kre Yüksekliği" }
    ],
    biologicalBiomarkers: [
      { marker: "Metilhipürik Asit", specimen: "Urine", normalRange: "Belirlenemez", exposureLimit: "1.5 g/g kreatinin" }
    ],
    academicReferences: [
      { citation: "ATSDR Toxicological Profile for Xylenes", agency: "ATSDR" }
    ]
  },
  {
    id: "phosgene",
    name: "Fosgen",
    cas: "75-44-5",
    chemicalFormula: "COCl2",
    sectors: ["Gaz", "Mesleki", "Pestisit Üretimi", "Plastik Sentezi"],
    exposureRoutes: ["İnhalasyon"],
    iarcClassification: "Sınıflandırılmamış",
    oshaPel: "0.1 ppm",
    nioshRel: "0.1 ppm",
    targetOrgans: ["Akciğerler"],
    acuteEffects: [
      "Taze biçilmiş saman kokusu",
      "Gecikmiş başlangıçlı (24 saate kadar) masif pulmoner ödem",
      "Ciddi solunum sıkıntısı ve hipoksi"
    ],
    chronicEffects: [
      "Pulmoner fibrozis",
      "Amfizem"
    ],
    ppeRequirements: [
      "Bağımsız hava destekli SCBA cihazı",
      "Gaz sızdırmaz kostüm"
    ],
    clinicalRecommendations: [
      "Mutlak yatak istirahati (Akciğer ödemini hızlandırmamak için fiziksel efor yasaktır)",
      "24-48 saat semptomsuz olsa dahi yoğun bakım gözlemi",
      "Düşük basınçlı oksijen, kortikosteroidler"
    ],
    riskIndicators: [
      { label: "Oksijen Satürasyonu", description: "Hipoksi başlangıç göstergesi", threshold: "< %90" }
    ],
    biologicalBiomarkers: [
      { marker: "Klinik Gözlem", specimen: "Alveolar Air", normalRange: "-", exposureLimit: "Spesifik testi yoktur, akciğer grafisi kullanılır" }
    ],
    academicReferences: [
      { citation: "CDC Facts About Phosgene", agency: "CDC" }
    ]
  },
  {
    id: "sarin",
    name: "Sarin (GB Ajanı)",
    cas: "107-44-8",
    chemicalFormula: "C4H10FO2P",
    sectors: ["Gaz", "Nörotoksin", "Kimyasal Savaş", "Terörizm", "Askeri Tesisler"],
    exposureRoutes: ["İnhalasyon", "Dermal"],
    iarcClassification: "Sınıflandırılmamış",
    oshaPel: "0.0001 mg/m³",
    nioshRel: "0.0001 mg/m³",
    targetOrgans: ["Merkezi ve Periferik Sinir Sistemi (G-Serisi Sinir Gazı)"],
    acuteEffects: [
      "Şiddetli rinore, lakrimasyon, miyozis",
      "Kusma, karın krampları",
      "Fasikülasyonlar, konvülsiyonlar",
      "Diyafram felci ve birkaç dakika içinde apne/ölüm"
    ],
    chronicEffects: [
      "Beyin hasarına bağlı konnektif sekeller",
      "Kalıcı nöromüsküler zayıflık",
      "PTSD ve nöropsikiyatrik sendromlar"
    ],
    ppeRequirements: [
      "MOPP Seviye 4 veya A Sınıfı KBRN kıyafeti",
      "Askeri tip SCBA onaylı maske"
    ],
    clinicalRecommendations: [
      "HAZMAT ekipleri tarafından acil dekontaminasyon",
      "Terapötik antidot: Yüksek doz Atropin + Pralidoksim (Mümkünse Mark-1 Otoenjektörü)",
      "Nöbetler için intravenöz Diazepam"
    ],
    riskIndicators: [
      { label: "Kolinesteraz Enzimi", description: "Ağır inhibisyon", threshold: "< %20 Aktivite" }
    ],
    biologicalBiomarkers: [
      { marker: "RBC Kolinesteraz", specimen: "Blood", normalRange: "Normal", exposureLimit: "Hayati tehlike" }
    ],
    academicReferences: [
      { citation: "CDC NERVE AGENT: SARIN (GB)", agency: "CDC" }
    ]
  },
  {
    id: "ethylene_glycol",
    name: "Etilen Glikol",
    cas: "107-21-1",
    chemicalFormula: "C2H6O2",
    sectors: ["Nefrotoksin", "Nörotoksin", "Mesleki", "Otomotiv (Antifriz)"],
    exposureRoutes: ["Gastrointestinal (Genellikle kazara/suisidal alım)", "İnhalasyon (Düşük risk)"],
    iarcClassification: "Sınıflandırılmamış",
    oshaPel: "50 ppm (Tavan)",
    nioshRel: "Saptanmadı",
    targetOrgans: ["Böbrekler", "Merkezi Sinir Sistemi", "Kardiyovasküler Sistem"],
    acuteEffects: [
      "I. Aşama (0-12s): İnebriasyon (sarhoşluk hali), ataksi, konfüzyon",
      "II. Aşama (12-24s): Kardiyopulmoner sendrom (taşikardi, hipertansiyon, kalp yetmezliği)",
      "III. Aşama (24-72s): Böbrek yetmezliği, oligüri/anüri, bel ağrısı"
    ],
    chronicEffects: [
      "Kalıcı böbrek yetmezliği",
      "Nörolojik sekeller (kraniyal sinir felçleri)"
    ],
    ppeRequirements: [
      "Kimyasal gözlük",
      "Sıçramaya karşı önlük"
    ],
    clinicalRecommendations: [
      "Şiddetli yüksek anyon açıklı metabolik asidoz takibi",
      "Erken dönemde Fomepizol (veya etanol) uygulaması",
      "Şiddetli asidoz veya renal yetmezlik durumunda hemodiyaliz"
    ],
    riskIndicators: [
      { label: "Osmolar Açığı", description: "Bilinmeyen alkol alımı için uyarıcı", threshold: "> 10 mOsm/kg" },
      { label: "Anyon Açığı", description: "Laktik asidoz ve toksik metabolitler (glikolik asit vb.)", threshold: "> 16 mEq/L" }
    ],
    biologicalBiomarkers: [
      { marker: "İdrarda Kalsiyum Oksalat Kristali (Zarf Şeklinde)", specimen: "Urine", normalRange: "Yok", exposureLimit: "Varlığı tanıyı destekler" }
    ],
    academicReferences: [
      { citation: "ATSDR Toxicological Profile for Ethylene Glycol", agency: "ATSDR" }
    ]
  },
  {
    id: "mustard_gas",
    name: "Hardal Gazı (Sulfur Mustard)",
    cas: "505-60-2",
    chemicalFormula: "C4H8Cl2S",
    sectors: ["Gaz", "Kimyasal Savaş", "Karsinojen", "Cilt"],
    exposureRoutes: ["Dermal", "İnhalasyon", "Oküler"],
    iarcClassification: "Grup 1 (İnsanlar İçin Kesin Karsinojen)",
    oshaPel: "Yasaklanmış Madde / Maruziyet İstenmez",
    nioshRel: "0.003 mg/m³",
    targetOrgans: ["Cilt", "Gözler", "Solunum Sistemi", "Kemik İliği"],
    acuteEffects: [
      "Gecikmiş (4-24 saat) vezikülasyon ve büyük büller (deri yanıkları)",
      "Şiddetli göz tahrişi, konjonktivit ve körlük riski",
      "Hava yolu mukozasında nekroz, psödomembran oluşumu"
    ],
    chronicEffects: [
      "Kronik solunum yolu hastalıkları (bronşiolitis obliterans)",
      "Korneal opasite",
      "Akciğer kanseri ve lösemi",
      "Kemik iliği supresyonu (Pansitopeni)"
    ],
    ppeRequirements: [
      "Tam kapsül (Level A) HAZMAT giysisi",
      "Bağımsız solunum cihazı (SCBA)"
    ],
    clinicalRecommendations: [
      "Spesifik antidotu yoktur.",
      "Hızlı (ilk dakikalarda) kuru dekontaminasyon ve su-sabunla yıkama",
      "Gözlerin en az 15 dk aralıksız yıkanması",
      "Yanık merkezi protokolleri ve kemik iliği supresyonu için izolasyon"
    ],
    riskIndicators: [
      { label: "Lökosit (WBC)", description: "3-5 gün sonra başlayan kemik iliği çöküşü", threshold: "< Belirgin Sınırın Altı" }
    ],
    biologicalBiomarkers: [
      { marker: "İdrar tiyodiglikol", specimen: "Urine", normalRange: "Yok", exposureLimit: "Adli/maruziyet kanıtı" }
    ],
    academicReferences: [
      { citation: "CDC NERVE AGENT: SULFUR MUSTARD", agency: "CDC" }
    ]
  },
  {
    id: "asbestos",
    name: "Asbest (Krizotil, Krosidolit)",
    cas: "1332-21-4",
    chemicalFormula: "Mg3Si2O5(OH)4 (Krizotil)",
    sectors: ["Karsinojen", "Mesleki", "Maden", "İnşaat", "Gemi Söküm", "Yalıtım", "Otomotiv Fren Balatası"],
    exposureRoutes: ["İnhalasyon", "Gastrointestinal (Yutulan partiküller)"],
    iarcClassification: "Grup 1 (İnsanlar İçin Kesin Karsinojen)",
    oshaPel: "0.1 lif/cc",
    nioshRel: "0.1 lif/cc",
    targetOrgans: ["Akciğer", "Plevra", "Periton"],
    acuteEffects: [
      "Akut maruziyet genellikle asemptomatiktir",
      "Çok yoğun tozda mekanik havayolu tahrişi"
    ],
    chronicEffects: [
      "Malign Mezotelyoma (Plevral veya Peritoneal)",
      "Asbestozis (İnterstisyel pulmoner fibrozis)",
      "Akciğer kanseri (Sigara ile sinerjistik etki, 50-90 kat artmış risk)",
      "Plevral plaklar ve diffüz plevral kalınlaşma"
    ],
    ppeRequirements: [
      "HEPA (P100) filtreli tam veya yarım yüz maskesi",
      "Tek kullanımlık Tyvek tulum (kapişonlu ve galoşlu)",
      "Islak söküm teknikleri"
    ],
    clinicalRecommendations: [
      "Dekontaminasyon ünitelerinin mutlak kullanımı",
      "Akciğer grafisi (PA) ve Yüksek Çözünürlüklü BT (HRCT) takibi",
      "SFT takipleri",
      "Kesin sigara bırakma önerisi"
    ],
    riskIndicators: [
      { label: "Radyoloji", description: "Plevral Plak, Balpeteği, Asbest Cisimciği", threshold: "Pozitif Bulgular" }
    ],
    biologicalBiomarkers: [
      { marker: "Balgamda Asbest Cisimcikleri", specimen: "Alveolar Air", normalRange: "Yok", exposureLimit: "Maruziyet varlığını kanıtlar, ancak hastalığın şiddetini göstermez" }
    ],
    academicReferences: [
      { citation: "WHO Asbestos: elimination of asbestos-related diseases", agency: "WHO" },
      { citation: "IARC Monograph 100C: Arsenic, Metals, Fibres, and Dusts", agency: "IARC" }
    ]
  },
  {
    id: "paraquat",
    name: "Parakuat (Herbisit)",
    cas: "1910-42-5",
    chemicalFormula: "C12H14N2",
    sectors: ["Pestisit", "Hepatotoksin", "Nefrotoksin", "Nörotoksin", "Tarım"],
    exposureRoutes: ["Gastrointestinal (Oral alım en tehlikelisidir)", "İnhalasyon", "Dermal (Hasarlı ciltten)"],
    iarcClassification: "Grup 3 (İnsana karsinojenik olarak sınıflandırılamaz)",
    oshaPel: "0.5 mg/m³",
    nioshRel: "0.1 mg/m³",
    targetOrgans: ["Akciğer (Hedef organ)", "Böbrek", "Karaciğer", "Gastrointestinal Sistem"],
    acuteEffects: [
      "Ağız içi ve boğazda derin kostik ülserler ('Parakuat dili')",
      "Şiddetli kusma, ishal, abdominal ağrı",
      "Fulminan seyirli toksik akut akciğer hasarı ve nefropati (ilk 24-48 saat)"
    ],
    chronicEffects: [
      "İrreversibl (Geri Dönüşümsüz) Pulmoner Fibrozis (Kurtulan hastalarda tipik 1-2 hafta sonra gelişir)",
      "Parkinson hastalığı ile epidemiyolojik bağlantı (Dopaminerjik nöron hasarı)"
    ],
    ppeRequirements: [
      "Su geçirmez ilaçlama tulumu ve göz koruması",
      "Butil kauçuk veya Nitril tam korumalı eldiven",
      "Respiratör"
    ],
    clinicalRecommendations: [
      "Büyük Miktarda OKSİJEN VERMEKTEN KAÇINILMALIDIR! (Oksijen pulmoner toksisiteyi ve serbest radikal hasarını şiddetlendirir, SpO2 < 92% değilse önerilmez)",
      "Oral alımlarda hızlıca Fuller toprağı veya aktif kömür (ilk birkaç saat içinde)",
      "Hemoperfüzyon (ilk 24 saat içinde, etkinlik tartışmalı)",
      "Siklofosfamid/Steroid nabız tedavisi"
    ],
    riskIndicators: [
      { label: "SpO2 (Hipoksi)", description: "İlerleyici pulmoner fibrozise işaret eder", threshold: "< %90 (ve düşüyor)" }
    ],
    biologicalBiomarkers: [
      { marker: "İdrar Parakuat (Sodyum Ditiyonit Testi / Koyu Mavi Renk)", specimen: "Urine", normalRange: "Negatif", exposureLimit: "Pozitiflik (Erken prognoz için plazma seviyesi altın standarttır)" }
    ],
    academicReferences: [
      { citation: "CDC/NIOSH Pocket Guide - Paraquat", agency: "CDC" },
      { citation: "Clinical Management of Paraquat Poisoning", agency: "PubMed" }
    ]
  }
];
