export interface ToxicAgentProfile {
  id: string;
  name: string;
  nameTr: string;
  overview: string;
  exposureSources: string[];
  acuteToxicity: string;
  chronicToxicity: string;
  carcinogenicity: string;
  mutagenicity: string;
  teratogenicity: string;
  organEffects: { system: string; effect: string }[];
  biomarkers: string[];
  labMarkers: string[];
  epidemiologicRisks: string;
  prevention: string;
  ppe: string[];
  standards: { authority: string; limit: string }[];
  emergencyInterventions: string[];
  antidote: string;
  iarcClassification: string;
  nihoshLimit: string;
  oshaStandard: string;
}

export const toxicAgentsDatabase: ToxicAgentProfile[] = [
  {
    id: "arsenic",
    name: "Arsenic",
    nameTr: "Arsenik",
    overview: "Arsenik, yer kabuğunda doğal olarak bulunan yarı metalik bir elementtir. Hücre içi solunumu inhibe eden ve sülfhidril gruplarına bağlanarak çoklu organ hasarına yol açan sistemik bir toksindir.",
    exposureSources: [
      "Metal ergitme tesisleri ve dökümhaneler",
      "Pestisit, herbisit üretim sahaları",
      "Cam ve yarı iletken (mikroçip) imalatı",
      "Kömürle çalışan enerji santralleri"
    ],
    acuteToxicity: "Kardiyojenik şok, şiddetli gastrointestinal gastroenterit ('pirinç suyu' benzeri ishal), akut böbrek hasarı, sarımsak kokulu nefes.",
    chronicToxicity: "Hiperkeratoz (özellikle el ayası ve ayak tabanında), 'yağmur damlası' tarzında cilt hiperpigmentasyonu, periferik nöropati, periferal vasküler hastalık (Blackfoot hastalığı).",
    carcinogenicity: "Akciğer kanseri, skuamöz hücreli cilt kanseri, mesane kanseri ve karaciğer anjiyosarkomu riski.",
    mutagenicity: "DNA metilasyon profilini bozar, kromozomal aberasyonları ve mikronükleus oluşumunu indükler.",
    teratogenicity: "Gelişimsel malformasyonlar ve nöral tüp defektleri ile ilişkilidir.",
    organEffects: [
      { system: "Dermatolojik", effect: "Hiperkeratoz, hiperpigmentasyon, Bowen hastalığı şeklindeki lezyonlar." },
      { system: "Kardiyovasküler", effect: "QT uzaması, aritmiler, uç kılcal vasküler daralmalar." },
      { system: "Renal", effect: "Tübüler nekroz ve GFR kaybı." }
    ],
    biomarkers: [
      "İdrarda İnorganik Arsenik seviyesi (HPLC-ICP-MS kullanılarak spesiasyon)",
      "Monometilarsonik asit (MMA) / Dimetilarsonik asit (DMA) oranı (metilasyon kapasitesi için)"
    ],
    labMarkers: [
      "Toplam arsenik seviyesi (Saç ve tırnakta kronik birikim analizi)",
      "Karaciğer fonksiyon enzimleri (ALT/AST yükselmesi)"
    ],
    epidemiologicRisks: "Geri dönüştürülmemiş su kaynakları çevresindeki dökümhane işçilerinde 6.4 kat artmış mesane ve skuamöz hücreli karsinom risk çarpanı.",
    prevention: "Kapalı döngü ergitme fırınları, lokal egzoz ventilasyonu, periyodik arsenik spesiasyon testleri.",
    ppe: [
      "P3 seviyesinde partikül filtreli tam yüz maskeleri",
      "Kimyasallara dayanıklı nitril koruyucu eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.01 mg/m3" },
      { authority: "OSHA PEL", limit: "10 µg/m3" }
    ],
    emergencyInterventions: [
      "Tıbbi dekontaminasyon ve hemodiyaliz",
      "Şiddetli maruziyette şelasyon ajanlarının derhal başlanması"
    ],
    antidote: "Dimercaprol (BAL) veya Dimercaptosuccinic acid (DMSA / Succimer)",
    iarcClassification: "Group 1 (İnsan için kesin kanserojen)",
    nihoshLimit: "Ceiling 0.002 mg/m3 [15-min]",
    oshaStandard: "TWA 10 µg/m3"
  },
  {
    id: "mercury",
    name: "Mercury",
    nameTr: "Cıva (Civa)",
    overview: "Cıva, oda sıcaklığında sıvı halde bulunan tek ağır metaldir. Elementel, inorganik ve organik formları vardır; kan-beyin bariyerini aşarak nöronal lipid peroksidasyonunu tetikler.",
    exposureSources: [
      "Klor-alkali fabrikaları",
      "Florasan lamba ve termometre üretimi",
      "Kuyumculuk, altın madenciliği ve cıva amalgam işlemleri",
      "Kömür yanması kaynaklı emisyonlar"
    ],
    acuteToxicity: "Kimyasal pnömoni (cıva buharı inhalasyonunda), akut tübüler nekroz, hemorajik gastroenterit.",
    chronicToxicity: "Nörolojik üçleme: Erethism (şiddetli utangaçlık, sinirlilik, kişilik değişimi), kaba el titremesi (tremor), stomatit/gingivit.",
    carcinogenicity: "IARC tarafından Group 3 olarak sınıflandırılmıştır; doğrudan hücresel mutasyon kanıtı zayıftır ancak epigenetik hasar verebilir.",
    mutagenicity: "Kromozomal düzensizlikler ve iğ ipliği harabiyeti yapabilir.",
    teratogenicity: "Gebelikte plasentayı ve fetal kan-beyin bariyerini geçerek Minamata benzeri infantil serebral palsi semptomlarına yol açar.",
    organEffects: [
      { system: "Merkezi Sinir Sistemi", effect: "Serebellar atrofi, görme alanı daralması, duyusal kayıp." },
      { system: "Renal", effect: "Membranöz glomerülonefrit (inorganik formda)." },
      { system: "Pulmoner", effect: "İnterstisyel fibrozis ve difüz alveoler harabiyet." }
    ],
    biomarkers: [
      "Post-shift idrarda inorganik cıva (elementel ve inorganik cıva maruziyeti için)",
      "Tam kanda organik cıva tayini (Metilcıva - balık tüketimi kirliliği)"
    ],
    labMarkers: [
      "Proteinüri tespiti (Glomerüler süzme hasarı için)",
      "Gingival çizgi kalıntı muayenesi"
    ],
    epidemiologicRisks: "Altın madencilerinde motor sinir iletim hızlarında ve kognitif test skorlarında anlamlı gerileme oranları (%34 sapma).",
    prevention: "Cıva emisyon filtreleri, dökülme kitleri kullanımı, amalgam yerine kompozit dolgu dolgularının tercih edilmesi.",
    ppe: [
      "Hg kartuşlu gaz maskeleri",
      "Kimyasallara dirençli kovanlı uzun eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.025 mg/m3" },
      { authority: "OSHA PEL", limit: "0.1 mg/m3" }
    ],
    emergencyInterventions: [
      "İnhalasyon durumunda derhal temiz havaya çıkarma ve oksijen desteği",
      "Şelatör tedavisi monitorizasyonu"
    ],
    antidote: "DMPS (Dimercaptopropanesulfonate) veya DMSA (Succimer). Akut inorganik zehirlenmede BAL kullanılabilir.",
    iarcClassification: "Group 3 (Sınıflandırılamayan metaller)",
    nihoshLimit: "TWA 0.05 mg/m3",
    oshaStandard: "Ceiling 0.1 mg/m3"
  },
  {
    id: "lead",
    name: "Lead",
    nameTr: "Kurşun",
    overview: "Kurşun, kemik matrisinde biriken kronik kümülatif bir toksindir. Hem sentez döngüsünü bozarak anemiye yol açar ve proksimal nitelikli renal hasarlar üretir.",
    exposureSources: [
      "Akü/batarya imalatı ve geri dönüşümü",
      "Kablo kılıfı kaplama ve kurşun mermisi üretimi",
      "Eski binaların restorasyonu (kurşunlu boyalar)",
      "Pikap ve radyatör lehimleme işleri"
    ],
    acuteToxicity: "Şiddetli kramp tarzında karın ağrısı (kurşun koliği), ensefalopati, akut böbrek yetmezliği.",
    chronicToxicity: "Anemi, 'düşük el' deformitesi (periferik ekstremite nöropatisi), gingivada koyu mor çizgi (Burton çizgisi), saturnus gutu.",
    carcinogenicity: "İnorganik kurşun bileşikleri insan için muhtemel kanser yapıcıdır.",
    mutagenicity: "Kromozom kırılmaları ve DNA zincir kırıklarını artırır.",
    teratogenicity: "Düşük doğum ağırlığı, zeka geriliği ve fetal ölüm riskinde artış.",
    organEffects: [
      { system: "Hematopoetik", effect: "ALAD inhibisyonu, mikroksiter hipokromik anemi ve bazofilik noktalanma." },
      { system: "Renal", effect: "Proksimal tübül fonksiyon bozuklukları, intranükleer inklüzyon cisimcikleri." },
      { system: "Üreme Sistemi", effect: "Oligospermi, anormal morfolojili sperm oranında artış." }
    ],
    biomarkers: [
      "Kan Kurşun Seviyesi (BLL - ICP-MS ile doğrulanmış)",
      "Çinko Protoporfirin (ZPP) - eritrosit içi sentez göstergesi"
    ],
    labMarkers: [
      "Tam kan sayımında bazofilik noktalanma gösteren eritrositler",
      "İdrarda delta-aminolevülinik asit (ALA) miktarının ölçümü"
    ],
    epidemiologicRisks: "ALAD-2 polimorfizmi olan işçilerde BLL seviyelerinde ve nörotoksisite hassasiyetinde 2.8 kat artış.",
    prevention: "Duş odası entegrasyonu, iş kıyafetlerinin evde yıkanmasının yasaklanması, 15 günde bir kan kurşun seviyesi takibi.",
    ppe: [
      "HEPA filtreli toz maskeleri",
      "Toz geçirmeyen endüstriyel Tyvek tulumlar"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.05 mg/m3" },
      { authority: "OSHA PEL", limit: "50 µg/m3" }
    ],
    emergencyInterventions: [
      "Destekleyici hidrasyon",
      "BLL > 70 µg/dL veya nörolojik bulgular varlığında IV şelasyon"
    ],
    antidote: "CaNa2EDTA, Dimercaprol (BAL) veya Succimer (DMSA)",
    iarcClassification: "Group 2B (Olası kanserojen)",
    nihoshLimit: "TWA 0.050 mg/m3",
    oshaStandard: "TWA 50 µg/m3 (Action Level: 30 µg/m3)"
  },
  {
    id: "cadmium",
    name: "Cadmium",
    nameTr: "Kadmiyum",
    overview: "Kadmiyum, akümülatör üretimi ve alaşımlarda kullanılan nefrotoksik ve osteotoksik bir geçiş metalidir. Proksimal tübül hücrelerinde yaklaşık 30 yıllık yarı ömre sahiptir.",
    exposureSources: [
      "Nikel-kadmiyum batarya/pil üretimi",
      "Galvanizasyon ve elektrokaplama işleri",
      "Plastik pigment ve stabilizatör sanayii",
      "Fosfatlı gübrelerin yoğun tarımsal uygulanması"
    ],
    acuteToxicity: "Kimyasal pnömoni ve akciğer ödemi (kadmiyum dumanı solunmasında), akut gastroenterit (kontamine gıdalarda).",
    chronicToxicity: "Proksimal tübüler hasara bağlı beta-2 mikroglobulinüri, osteomalazi ve osteoporoz (İtai-İtai hastalığı), amfizem.",
    carcinogenicity: "IARC Group 1 kanserojenidir; akciğer kanseri gelişim mekanizmasıyla doğrudan ilişkilidir.",
    mutagenicity: "DNA mismatch tamir mekanizmasını inhibe ederek mutasyon birikimini hızlandırır.",
    teratogenicity: "Fetal büyüme geriliği ve iskelet sistemi deformiteleri.",
    organEffects: [
      { system: "Böbrek", effect: "Gözle görülür proteinüri, glukozüri, aminoasidüri ve kalsiyum atılımı artışı." },
      { system: "Solunum", effect: "İlerleyici tıkayıcı akciğer hastalığı, bronş alveoler hasarlar." },
      { system: "İskelet Sistemi", effect: "Osteopeni, kalsiyum eksikliğine bağlı kemik kırılganlığı." }
    ],
    biomarkers: [
      "İdrarda Kadmiyum (Cd-U - birikimsel maruziyeti yansıtır)",
      "Kan Kadmiyum seviyesi (Cd-B - güncel aktif maruziyet için)"
    ],
    labMarkers: [
      "İdrarda Beta-2-Mikroglobulin veya RBP (Retinol Bağlayıcı Protein)",
      "Kreatinin klirensi takibi"
    ],
    epidemiologicRisks: "İdrar kadmiyum seviyesi > 2 µg/g kreatinin olan fabrikalarda glomerüler filtrasyon hızında yıllık %4 dramatik düşüş.",
    prevention: "Yoğun lokal cebri çekiş sistemleri, kadmiyum toz emici özel zeminler, kalsiyum destekli beslenme programları.",
    ppe: [
      "N100 veya P100 onaylı respiratör filtreleri",
      "Sıvı sızdırmaz iş önlükleri"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.01 mg/m3" },
      { authority: "OSHA PEL", limit: "5 µg/m3" }
    ],
    emergencyInterventions: [
      "Solunum maruziyetinde derhal nemlendirilmiş oksijen ve bronkodilatörler",
      "Kortikosteroid tedavisi"
    ],
    antidote: "Özel bir antidotu yoktur. Klasik şelatörler (EDTA gibi) böbrek yükünü artırabileceğinden sınırlı olgularda çok yavaş dozda DMSA düşünülür.",
    iarcClassification: "Group 1 (Kesin kanserojen)",
    nihoshLimit: "Potansiyel işyeri kanserojeni (En düşük saptanabilir seviye)",
    oshaStandard: "TWA 5 µg/m3"
  },
  {
    id: "chromium",
    name: "Chromium-VI",
    nameTr: "Krom (Özellikle Cr-VI)",
    overview: "Hekzavalan Krom (Cr-VI), hücre zarlarını sülfat taşıyıcı kanalları aracılığıyla aşarak sitoplazmada Cr-III'e indirgenirken reaktif oksijen radikalleri üreten bir karsinojendir.",
    exposureSources: [
      "Paslanmaz çelik kaynak ve kesme işleri",
      "Krom kaplama ve metal yüzey işlemleri",
      "Deri tabaklama (deri işleme fabrikaları)",
      "Ahşap koruyucu emprenye maddeleri imalatı"
    ],
    acuteToxicity: "Şiddetli korozif bronşit, gastroenterit (oral alımda), akut şok tablosu, böbrek kortis nekrozu.",
    chronicToxicity: "Burun septumu perforasyonu, derin cilt ülserleri (krom delme delikleri), alerjik kontakt dermatit.",
    carcinogenicity: "Akciğer kanseri ve paranazal sinüs maligniteleri için IARC Group 1 bileşendir.",
    mutagenicity: "Cr-III hücre içinde DNA ile doğrudan kovalent bağlar (DNA-Cr-DNA adducts) ve çapraz bağlar kurar.",
    teratogenicity: "Fetal kayıp ve gelişim defektleri riskini hafifçe artırır.",
    organEffects: [
      { system: "Solunum", effect: "Mesleki astım, septum nekrozu, akciğer karsinogenezi." },
      { system: "Dermatolojik", effect: "Krom delikleri (aşındırıcı ağrısız dairesel ülserler), duyarlılaşma dermatitisi." },
      { system: "Renal", effect: "Proksimal nekrotik tübül dejenerasyonları." }
    ],
    biomarkers: [
      "Eritrosit içi krom (yalnızca Cr-VI eritrositlere girebildiğinden maruziyeti net seçer)",
      "Post-shift idrar toplam krom konsantrasyonu"
    ],
    labMarkers: [
      "Burun mukozası sitolojisi",
      "Tam idrar tahlilinde eritrositüri"
    ],
    epidemiologicRisks: "Elektrokaplama/kaynak işçilerinde genel popülasyona göre 8.2 kat artmış bronkojenik karsinom riski.",
    prevention: "Lokal emme sistemlerinin doğrudan ark noktasına yerleştirilmesi, hekzavalan krom azaltıcı kimyasal inhibitör uygulamaları.",
    ppe: [
      "Kaynak dumanı için aktif karbonlu hepa maskeler",
      "Koruyucu eldiven ve önlük takımı"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.0002 mg/m3" },
      { authority: "OSHA PEL", limit: "5 µg/m3" }
    ],
    emergencyInterventions: [
      "Aşınan mukoza ve gözün derhal ringer laktat solüsyonuyla yıkanması",
      "Cilt maruziyetinde Cr-VI sökücü askorbat jeli uygulaması"
    ],
    antidote: "Askorbik asit (C Vitamini - Cr-VI'yı hücre dışında daha az toksik olan Cr-III'e indirgeyerek alımı engeller).",
    iarcClassification: "Group 1 (Hekzavalan form)",
    nihoshLimit: "TWA 0.2 µg/m3",
    oshaStandard: "TWA 5 µg/m3 (Action Level: 2.5 µg/m3)"
  },
  {
    id: "benzene",
    name: "Benzene",
    nameTr: "Benzen",
    overview: "Benzen, endüstride ara kimyasal olarak kullanılan aromatik bir hidrokarbondur. Kemik iliğinde hematopoetik rejenerasyonu inhibe ederek aplastik anemi ve lösemi üretir.",
    exposureSources: [
      "Petrokimya rafine tesisleri",
      "Akaryakıt dolum ve depolama istasyonları",
      "Kauçuk, plastik ve boya imalat sanayii",
      "Kok fırınları yan emisyonları"
    ],
    acuteToxicity: "MSS depresyonu, baş dönmesi, öfori, kardiyak aritmiler, solunum yetmezliği ve yüksek konsantrasyonda anında ölüm.",
    chronicToxicity: "Pansitopeni (aplastik anemi), miyelodisplastik sendrom (MDS), bağışıklık yetmezliği (lenfositopeni).",
    carcinogenicity: "Akut Miyeloid Lösemi (AML) başta olmak üzere tüm lösemi tipleri için IARC Group 1 karsinojendir.",
    mutagenicity: "Hematopoetik progenitör hücrelerde lökositojenik anöploidi ve translokasyonlar.",
    teratogenicity: "Fetal iskelet gecikmeleri ve organ gelişim zayıflığı.",
    organEffects: [
      { system: "Hematopoetik Sistem", effect: "Kemik iliği hipoplazisi, pluripotent kök hücre apoptozu, AML." },
      { system: "Bağışıklık", effect: "B ve T lenfosit sayılarında azalma, antikor sönümlenmesi." },
      { system: "Sinir Sistemi", effect: "Distal hiporefleksi, baş ağrısı krizleri." }
    ],
    biomarkers: [
      "İdrarda S-fenilmercaptürik asit (S-PMA - en güvenilir düşük doz göstergesi)",
      "İdrar trans,trans-mukonik asit (tt-MA)"
    ],
    labMarkers: [
      "Periyodik Tam Kan Sayımı (özellikle lenfosit ve trombosit sayıları)",
      "Retikülosit sayımı"
    ],
    epidemiologicRisks: "Yıllık ortalama > 1 ppm maruz kalan rafineri kohortlarında miyelodisplazi gelişme şansı genel popülasyona kıyasla %540 fazladır.",
    prevention: "Buhar geri kazanım üniteleri (VRU), tam kapalı transfer boru hatları, aylık lökosit trend takipleri.",
    ppe: [
      "Organik buhar kartuşlu maske veya basınçlı temiz hava tulumu",
      "Viton direnç sınıfı eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.5 ppm" },
      { authority: "OSHA PEL", limit: "1 ppm" }
    ],
    emergencyInterventions: [
      "Oksijenizasyon, kardiyak ritim izlemi (epinefrinden kaçınılmalıdır çünkü miyokardı hassaslaştırır)",
      "Hafif sedasyon"
    ],
    antidote: "Özgün bir antidotu yoktur. Destekleyici kan transfüzyonları ve nötropenik koruma.",
    iarcClassification: "Group 1 (Kesin kanserojen)",
    nihoshLimit: "TWA 0.1 ppm (STEL 1 ppm)",
    oshaStandard: "TWA 1 ppm (STEL 5 ppm)"
  },
  {
    id: "formaldehyde",
    name: "Formaldehyde",
    nameTr: "Formaldehit",
    overview: "Formaldehit, oda sıcaklığında gaz halinde bulunan, suda yüksek çözünürlüğe sahip, protein çapraz bağlayıcı dezenfektan ve sentez maddesidir.",
    exposureSources: [
      "Tıp, patoloji ve anatomi diseksiyon laboratuvarları (koruyucu solüsyon)",
      "MDF, sunta ve kontrplak üretim tesisleri",
      "Tekstil apreleme ve sentetik reçine üretimi",
      "Kozmetik ve tırnak sertleştirici imalatı"
    ],
    acuteToxicity: "Şiddetli laringeal ödem, bronkospazm, pulmoner ödem, korozif özofajit (kazara yutulduğunda).",
    chronicToxicity: "Kronik rinit, mesleki astım, kontakt dermatit, koku kaybı (anosmi).",
    carcinogenicity: "IARC Group 1 sınıfındadır; nazofarenks kanseri ve myeloid lösemi ile nedensel bağları saptanmıştır.",
    mutagenicity: "DNA-protein çapraz bağları (DPX) oluşturur ve sitogenetik lezyon frekansını artırır.",
    teratogenicity: "Düşük fetal ağırlık potansiyeli.",
    organEffects: [
      { system: "Solunum Sistemi", effect: "Nazofaringeal hiperplazi, mukosilier klirens felci, astım." },
      { system: "Oftalmik", effect: "Şiddetli lakrimasyon, kornea epitel hücre lezyonları." },
      { system: "İmmünolojik", effect: "IgE aracılı bronşial spazmlar." }
    ],
    biomarkers: [
      "Bakal mukoza döküntü sitolojisinde Mikronükleus (MN) frekansı",
      "Kanda formaldehit-albümin adduct seviyeleri (spesifik araştırma laboratuvarlarında)"
    ],
    labMarkers: [
      "Solunum fonksiyon testi (FEV1/FVC oran analizi)",
      "Nazofaringeal endoskopik fırçalama hücre testi"
    ],
    epidemiologicRisks: "Anatomi ve patoloji teknisyenlerinde nazofaringeal karsinom insidans hızı kümülatif çalışma yılıyla doğrusal artmaktadır.",
    prevention: "Formaldehit gaz emici filtre üniteleri, diseksiyon masalarında aşağı çekişli (down-draft) havalandırma, formaldehit yerine güvenli fiksatif seçimi.",
    ppe: [
      "Multigaz/formaldehit kartuşlu yarım yüz maskeleri",
      "Butil kauçuk kimyasal dirençli eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.1 ppm border" },
      { authority: "OSHA PEL", limit: "0.75 ppm" }
    ],
    emergencyInterventions: [
      "Oksijen nefes inhalatörü desteği, gerekirse acil laringotomi ve nebülizör steroid",
      "Gözlerin en az 15 dakika bol izotonik su ile yıkanması"
    ],
    antidote: "Spesifik kimyasal nötralizanı yoktur; semptomatik havayolu yönetimi ve solunum desteği esastır.",
    iarcClassification: "Group 1 (Kesin kanserojen)",
    nihoshLimit: "TWA 0.016 ppm (Ceiling 0.1 ppm [15-min])",
    oshaStandard: "TWA 0.75 ppm (STEL 2 ppm)"
  },
  {
    id: "toluene",
    name: "Toluene",
    nameTr: "Tolüen (Toluen)",
    overview: "Tolüen, sanayide tinerlerin ve yapıştırıcıların ana bileşeni olan mono-metil benzen aromatik halkasıdır. Lipofilik yapısı sebebiyle yoğun nörotoksik etkiye sahiptir.",
    exposureSources: [
      "Boya imalatı ve sanayi boyama işlemleri",
      "Matbaacılık, gravür baskı sanayii",
      "Yapıştırıcı ve tiner dolum tesisleri",
      "Kozmetik parfüm sentezleri"
    ],
    acuteToxicity: "MSS depresyonu, 'tiner sarhoşluğu', öfori, ataksi, işitme kaybı riskleri, kardiyak aritmiler.",
    chronicToxicity: "Kronik solvent kaynaklı ensefalopati (baş ağrısı, demans, hafıza zayıflığı), sensorinöral işitme kaybı, tırnak distrofisi.",
    carcinogenicity: "IARC tarfından Group 3 olarak değerlendirilmiştir; tek başına karsinojenik gücü düşüktür ancak diğer ajanlarla sinerji kurar.",
    mutagenicity: "Kromozomal kırılmaları zayıf düzeyde indükler.",
    teratogenicity: "Fetal solvent sendromu (mikrosefali, gelişimsel gecikmeler, kafa yanak anomalileri).",
    organEffects: [
      { system: "Sinir Sistemi", effect: "Miyelin kılıf korozyonu, serebellar disfonksiyon, polinöropati." },
      { system: "Otolojik", effect: "Seçici koklear saç hücresi harabiyeti (işitme kaybı)." },
      { system: "Renal", effect: "Distal renal tübüler asidoz." }
    ],
    biomarkers: [
      "İdrarda O-Kresol seviyesi (matbaacılık sektörü için ana biomarker)",
      "İdrarda Hipürik Asit (tolüenin ana idrar asit metaboliti, besin katkılarından etkilenebilir)"
    ],
    labMarkers: [
      "Kanda doğrudan toluen düzeyi",
      "Rutin odyometri (işitme eşik taramaları)"
    ],
    epidemiologicRisks: "Yüksek toluen dumanına maruz kalan gravür matbaa işçilerinde 4000 Hz frekanstaki işitme kaybı bazali %64 artmaktadır.",
    prevention: "Kapalı havalı maske sistemleri, solvent geri kazanım döngüleri, boyaların su bazlı muadilleriyle değişimi.",
    ppe: [
      "Organik gaz filtre pilleri",
      "Poliüretan bazlı eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "20 ppm" },
      { authority: "OSHA PEL", limit: "200 ppm" }
    ],
    emergencyInterventions: [
      "Vücut ısısının korunması, oksijen desteği, kardiyak izlem, solventle temas etmiş kıyafetlerin derhal çıkarılması.",
      "Semptomatik tedavi"
    ],
    antidote: "Yoktur. MSS depresyonu ve asidoz durumunda sistemik destekleyici algoritmalar işletilir.",
    iarcClassification: "Group 3 (İnsan için kanserojenliği kanıtlanmamış)",
    nihoshLimit: "TWA 100 ppm (STEL 150 ppm)",
    oshaStandard: "TWA 200 ppm (Ceiling 300 ppm)"
  },
  {
    id: "xylene",
    name: "Xylene",
    nameTr: "Ksilen (Xylol)",
    overview: "Ksilen (dimetil benzen), patoloji laboratuvarlarında doku takibinde dehidrasyon ve endüstriyel çözücü olarak kullanılan, nörotoksik ve hepatotoksik lipofilik aromatik hidrokarbondur.",
    exposureSources: [
      "Patoloji ve histoloji laboratuvarları (açma ve doku şeffaflaştırma)",
      "Oto boyama ve endüstriyel kaplama fırınları",
      "Deri imalatı ve baskı mürekkepleri üretimi",
      "Tarımsal ilaç formülasyon bileşenleri"
    ],
    acuteToxicity: "Nistagmus, ataksi, solunum yolları irritasyonu, kusma ve akut karaciğer yükü.",
    chronicToxicity: "Bilişsel performans zayıflığı, baş ağrısı, kronik egzamalar, hafif böbrek fonksiyon sapması.",
    carcinogenicity: "IARC tarafından Group 3 olarak listelenmiştir.",
    mutagenicity: "Genotoksik potansiyeli düşüktür.",
    teratogenicity: "Gebelikte maruziyet kısıtlanmalıdır; embriyotoksik etkiler belirlenmiştir.",
    organEffects: [
      { system: "Sinir Sistemi", effect: "Vestibüler sistem bozunması, reaksiyon süresinde uzama." },
      { system: "Karaciğer", effect: "Karaciğer yağlanması ve transaminazların hafif elevasyonu." },
      { system: "Dermatolojik", effect: "Geniş eritmatöz kontakt egzama oluşumu." }
    ],
    biomarkers: [
      "İdrarda Metilhipürik Asit (en spesifik ksilen maruziyet indikatörü)",
      "Kanda ksilen konsantrasyonu"
    ],
    labMarkers: [
      "Karaciğer panel enzimleri (AST, ALT, GGT)",
      "Karaciğer ve safra yolları ultrasonografisi"
    ],
    epidemiologicRisks: "Ksilen buharlarına sürekli maruz kalan patoloji laborantlarında vizüel reaksiyon süreleri %12.8 oranında yavaşlar.",
    prevention: "Çeker ocak kabinlerinin (<0.3 m/s emme hızı olmaksızın) stabil kullanımı, ksilen yerine limonen bazlı şeffaflaştırıcı alternatifleri.",
    ppe: [
      "Gelişmiş organik gaz maskeleri",
      "Özel bariyer laminasyonlu koruyucu eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "100 ppm" },
      { authority: "OSHA PEL", limit: "100 ppm" }
    ],
    emergencyInterventions: [
      "Sıvı maruziyetinde tüm vücut yıkama ve göz irrigasyonu",
      "Kusma durumunda aspirasyon pnömonisinden korunmak için sola yatış"
    ],
    antidote: "Spesifik antidotu yoktur; solunumsal ve kardiyovasküler destek verilir.",
    iarcClassification: "Group 3 (Sınıflandırılamayan)",
    nihoshLimit: "TWA 100 ppm (STEL 150 ppm)",
    oshaStandard: "TWA 100 ppm"
  },
  {
    id: "asbestos",
    name: "Asbestos",
    nameTr: "Asbest",
    overview: "Asbest, ısıya, elektriğe ve aşınmaya dayanıklı lifli silikat mineralidir. Akciğerlerde çözünmeyerek kronik inflamasyona, fibrozise ve ölümcül plevral malignitelere yol açar.",
    exposureSources: [
      "Eski binaların yıkım ve kentsel dönüşüm süreçleri",
      "Gemi söküm tersaneleri ve parça sökme işleri",
      "Fren balatası ve endüstriyel debriyaj üretimi",
      "Isı yalıtımı, boru izolasyonu ve asbestli çimento üretimi"
    ],
    acuteToxicity: "Akut toksisitesi düşüktür; akut solunum yolu irritasyonu yapabilir.",
    chronicToxicity: "Asbestozis (ilerleyici parankimal interstisyel akciğer fibrozisi), plevral plaklar, plevral efüzyon.",
    carcinogenicity: "Akciğer kanseri ve plevral/peritoneal Mezotelyoma için IARC Group 1 kesin karsinojendir. Sigara ile sinerjik etkisi akciğer kanseri riskini 50 kata kadar artırır.",
    mutagenicity: "Lifler fiziksel olarak iğ ipliklerini kırar, hücre bölünmesini sabote eder ve karsinojenez başlangıcı tetikler.",
    teratogenicity: "Zayıf bir risk kanıtı vardır.",
    organEffects: [
      { system: "Akciğer Parankimi", effect: "Alveoler septum kalınlaşması, ilerleyici asbestozis fibrozisi." },
      { system: "Pleura", effect: "Plevral kalsifiye plaklar, malign mezotelyoma." },
      { system: "Gastrointestinal", effect: "Yutulan lifler nedeniyle periton mezotelyoması." }
    ],
    biomarkers: [
      "Balgamda ferruginöz cisimcik tayini (asbest liflerinin demir kaplanmış hali)",
      "Plevral efüzyon sıvısı sitolojisi"
    ],
    labMarkers: [
      "Yüksek Çözünürlüklü Akciğer Tomografisi (HRCT - plevral plak ve bazal fibrozis tespiti)",
      "Solunum Fonksiyon Testleri (Restriktif patern: FVC kaybı ve DLCO azalması)"
    ],
    epidemiologicRisks: "Gemi söküm ve balata sanayiinde çalışan sigara içen bireylerde mezotelyomaya yakalanma sıklığı normların 48 kat üzerindedir.",
    prevention: "Asbest söküm yetki belgeli uzmanlarca kontrollü ıslak söküm, negatif basınçlı kabin söküm çadırları, asbest lif sayımı.",
    ppe: [
      "P3 filtreli tam yüz maskesi veya kasklı tulumlar",
      "Tek kullanımlık toz sızdırmaz tulum setleri"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.1 fiber/cc" },
      { authority: "OSHA PEL", limit: "0.1 fiber/cc" }
    ],
    emergencyInterventions: [
      "İlerleyen asbestoziste destekleyici oksipresyon ve gerekli palyasyon",
      "Malignite durumunda onkolojik protokoller"
    ],
    antidote: "Antidotu yoktur. Akciğer hasarı kalıcı ve geri dönüşsüzdür. Erken tanı hayati önem taşır.",
    iarcClassification: "Group 1 (Tüm asbest tipleri)",
    nihoshLimit: "TWA 0.1 f/cc (En düşük sınır)",
    oshaStandard: "TWA 0.1 fiber/cm3 (30-min Excursion Limit: 1.0 f/cm3)"
  },
  {
    id: "pesticides",
    name: "Pesticides",
    nameTr: "Pestisitler (Tarım İlaçları)",
    overview: "Pestisitler; herbisitler, insektisitler, fungisitler ve rodentisitler dahil olmak üzere tarımsal zararlıları kontrol etmek üzere sentezlenmiş geniş bir kimyasal ailesidir. Çevresel yarılanma ömürleri uzundur.",
    exposureSources: [
      "Tarım ve peyzaj çalışanları (püskürtme ve ilaçlama)",
      "Pestisit üretim fırınları ve paketleme tesisleri",
      "Seracılık sektörü toprak ve hava maruziyetleri",
      "Gıda işleme ve depolama sahaları"
    ],
    acuteToxicity: "Karın krampları, diyare, parasteziler, döküntüler, ağır zehirlenmede solunum felci ve kardiyak şok.",
    chronicToxicity: "Nörodejeneratif bozukluklar (Parkinson hastalığı riskinde artış), endokrin yıkımı, karaciğer rejenerasyon kaybı.",
    carcinogenicity: "Birçok organoklorlu pestisit IARC Group 2A veya 2B karsinojendir; hodgkin-dışı lenfoma ve lösemi risk çarpanları yüksektir.",
    mutagenicity: "Mikronükleus oluşum hızında artış ve DNA zincir kırılmaları.",
    teratogenicity: "Spontan abortus, konjenital malformasyonlar ve doğum kusurları.",
    organEffects: [
      { system: "Sinir Sistemi", effect: "Periferik sensorimotor nöropatiler, kognitif disfonksiyon." },
      { system: "Endokrin", effect: "Tiroid hormonu sentezi blokajı, östrojenik modülasyonlar." },
      { system: "Dermatolojik", effect: "Şiddetli akneiform döküntüler, kontakt dermatit." }
    ],
    biomarkers: [
      "İdrarda dialkil fosfat (DAP) metabolitleri",
      "Kan organoklor konsantrasyonu"
    ],
    labMarkers: [
      "Akut karaciğer enzimleri panel testi",
      "Eritrosit asetilkolinesteraz testi (pestisit türüne göre)"
    ],
    epidemiologicRisks: "Yoğun pestisit uygulayan çiftçilerde saptanan parkinsonizm sıklığı kentsel popülasyona kıyasla 2.4 kat daha fazladır.",
    prevention: "Biyolojik pestisit alternatiflerinin seçimi, drone tabanlı uzaktan otomatik püskürtme, koruyucu giysi dezenfeksiyonu.",
    ppe: [
      "A tipi organik gaz filtreli tam yüz maskeleri",
      "Sıvı sızdırmaz tulumlar ve PVC koruyucu botlar"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "Varying types (0.1 mg/m3 to 1 mg/m3)" },
      { authority: "OSHA PEL", limit: "0.5 mg/m3 average" }
    ],
    emergencyInterventions: [
      "Kirlenmiş tüm giysilerin hızlıca çıkarılması ve cildin bol sabunlu ılık suyla yıkanması",
      "Havayolu korunması ve entübasyon hazırlığı"
    ],
    antidote: "Türe bağlıdır. Organofosfat ve karbamat zehirlenmesinde fizostigmin, atropin ve pralidoksim tercih edilir.",
    iarcClassification: "Group 2A/2B (Pestisit sınıflarına göre)",
    nihoshLimit: "TWA 0.5 mg/m3",
    oshaStandard: "TWA 0.5 mg/m3"
  },
  {
    id: "organophosphates",
    name: "Organophosphates",
    nameTr: "Organofosfatlar (AChE İnhibitörleri)",
    overview: "Organofosfatlar, sinapslarda asetilkolinesteraz (AChE) enzimini kovalent bağ kurarak kalıcı inhibe eden toksik kimyasallardır. Aşırı asetilkolin birikmesi kolinerjik krize (SLUDGE sendromu) yol açar.",
    exposureSources: [
      "Tarım ilaçlama işçileri (organofosfatlı insektisitler)",
      "Kimyasal üretim hatları ve formülatör tesisleri",
      "Zararlı kontrol ilaçlama takımları"
    ],
    acuteToxicity: "SLUDGE (Salivation, Lacrimation, Urination, Defecation, GI Distress, Emesis) sendromu, bronkospazm, miyozis (nokta bebek göz), bradikardi, kas fasikülasyonları.",
    chronicToxicity: "Organofosfat indüklü gecikmiş nöropati (OPIDN - maruziyetten 1-3 hafta sonra başlayan alt ekstremite felci).",
    carcinogenicity: "IARC Group 2A (Malathion, Diazinon) veya Group 2B olarak sınıflandırılır.",
    mutagenicity: "Sitogenetik DNA hasarı yapma kabiliyeti düşüktür ancak serbest radikal hasarını artırır.",
    teratogenicity: "Gelişimsel nörotoksisite yaratabilir.",
    organEffects: [
      { system: "Kolinerjik Kavşak", effect: "Sürekli muskarinik ve nikotinik aşırı uyarım." },
      { system: "Kas Sistemi", effect: "Diyafram dahil tüm çizgili kaslarda yorulma, paraliz." },
      { system: "Sinir Sistemi", effect: "Gecikmiş aksonal dejenerasyon (OPIDN)." }
    ],
    biomarkers: [
      "Eritrosit Asetilkolinesteraz (AChE) aktivitesi (gerçek nöronal durumu iyi yansıtır)",
      "Plazma Pseudokolinesteraz (Butirilkolinesteraz) aktivitesi (maruziyete daha duyarlıdır ancak daha erken yükselir)"
    ],
    labMarkers: [
      "Tam kan sayımı, kan gazı analizi (solunumsal asidoz)",
      "Elektrokardiyografi (QT uzaması ve bradikardi)"
    ],
    epidemiologicRisks: "Eritrosit AChE seviyesi bazale göre %30 ve üzeri düşen işçilerde solunum yetmezliği ve yoğun bakım yatış hızı %80 oranında artar.",
    prevention: "Enzimatik pestisit degrade edici ajanların püskürtme sonrası kullanımı, işçilerin haftalık AChE kan taramalarına tabi tutulması.",
    ppe: [
      "Solunum koruma havasından beslemeli başlıklar",
      "Kimyasal sıvı sızdırmaz nitril önlük ve eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.05 mg/m3" },
      { authority: "OSHA PEL", limit: "0.1 mg/m3" }
    ],
    emergencyInterventions: [
      "Tıbbi personelin korunması (sekonder zehirlenmeyi önlemek için KKD giyilmesi)",
      "Havayolu sekresyonlarının hızla aspirasyonu"
    ],
    antidote: "Atropin (muskarinik sekresyonları ve bradikardiyi çözmek için) ve Pralidoksim / 2-PAM (kovalent bağlı kolinesteraz enzimini yaşlanmadan önce kurtarmak için).",
    iarcClassification: "Group 2A (Malathion / Diazinon)",
    nihoshLimit: "TWA 0.05 mg/m3",
    oshaStandard: "TWA 0.1 mg/m3"
  },
  {
    id: "cyanide",
    name: "Cyanide",
    nameTr: "Siyanür",
    overview: "Siyanür, mitokondrideki Sitokrom c Oksidaz enzimindeki demire (Fe3+) bağlanarak hücresel oksijen kullanımını (oksidatif fosforilasyon) bloke eden hızlı ve ölümcül bir hücresel boğucudur.",
    exposureSources: [
      "Altın ve gümüş cevher ergitme madenleri",
      "Elektrokaplama ve metal temizleme sanayii",
      "Plastik ve poliüretan yangınlarında çıkan zehirli dumanlar",
      "Akrilat ve siyanür tuzu üretim laboratuvarları"
    ],
    acuteToxicity: "Şiddetli taşipne, baş ağrısı, konvülsiyonlar, koma, parlak kırmızı venöz kan (hücreler oksijen çekemediği için), laktik asidoz.",
    chronicToxicity: "Nörolojik defisitler, parkinsoniyen semptomlar, tiroid fonksiyon bozukluğu (iyot alımı engellendiği için guatr).",
    carcinogenicity: "IARC tarafından sınıflandırılmamıştır.",
    mutagenicity: "Doğrudan mutajenik etkisi yoktur, ancak hücre içi enerji yetersizliğine bağlı ikincil hasar yapar.",
    teratogenicity: "Gelişim geriliği ve neonatal malformasyonlar.",
    organEffects: [
      { system: "Hücresel Solunum", effect: "Sitokrom oksidaz inhibisyonu, anaerobik glikoliz artışı, laktik asidoz." },
      { system: "Kardiyovasküler", effect: "Şiddetli hipotansiyon, asistoli, kardiyak yetmezlik." },
      { system: "Merkezi Sinir Sistemi", effect: "Solunum kontrol merkezi paralizi, nöbet krizleri." }
    ],
    biomarkers: [
      "Kan Siyanür konsantrasyonu (özellikle acil servisler için)",
      "İdrarda Tiyosiyanat (siyanürün rodanez ile detoksifiye edilmiş formu)"
    ],
    labMarkers: [
      "Arteriyel Kan Gazında şiddetli anyon açığı ve metabolik laktik asidoz (Laktat > 8 mmol/L)",
      "Venöz kan gazında oksijen satürasyonu artışı (parlak kırmızı kan)"
    ],
    epidemiologicRisks: "Cevher işleme sızıntısı yaşayan bölgelerde akrilik duman soluyan reaksiyon odası operatörlerinde koma ve akut ölüm fatalite katsayısı %45'dir.",
    prevention: "Sürekli siyanür gaz dedektör aktivasyonu, maden atık sularının sülfatlar ile nötralizasyonu, acil panzehir kiti bulundurulması.",
    ppe: [
      "SCBA (Kendinden tüplü oksijen başlığı) solunum seti",
      "Sıvı siyanür tuzlarına karşı kloropren kauçuk eldiven"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "5 mg/m3 (Skin)" },
      { authority: "OSHA PEL", limit: "10 ppm as HCN" }
    ],
    emergencyInterventions: [
      "Operatörün alandan çıkarılması ve %100 saf oksijen desteği verilmesi",
      "IV antidot setlerinin derhal uygulanması"
    ],
    antidote: "Siyanokit (Hidroksokobalamin - siyanürü bağlayarak direkt B12 formuna dönüştürür) veya Sodyum Nitrit + Sodyum Tiyosiyanat.",
    iarcClassification: "Not Classified",
    nihoshLimit: "STEL 4.7 ppm (5 mg/m3)",
    oshaStandard: "TWA 10 ppm"
  },
  {
    id: "carbon_monoxide",
    name: "Carbon Monoxide",
    nameTr: "Karbonmonoksit",
    overview: "Karbonmonoksit (CO), renksiz, kokusuz halk arasında 'sessiz katil' olarak bilinen toksik bir gazdır. Hemoglobine oksihemoglobinden 200 kat daha yüksek afiniteyle bağlanarak Karboksihemoglobin (COHb) oluşturur.",
    exposureSources: [
      "Eksik yanmalı kazanlar, döküm ocakları",
      "Oto tamirhaneleri ve kapalı otoparklar",
      "Madencilikte göçük yangınları ve patlatma sonrası birikimler",
      "Portatif jeneratörlerin kapalı alanda çalıştırılması"
    ],
    acuteToxicity: "Şiddetli baş ağrısı ('zonklayıcı' tarzda), baş dönmesi, konfüzyon, bayılma, kiraz kırmızısı cilt rengi (geç bulgudur).",
    chronicToxicity: "Nöro-psikiyatrik sendrom (temas sonrası 2-40 gün içinde hafıza kaybı, kişilik değişimleri, parkinsonizm), kalıcı miyokard hasarı.",
    carcinogenicity: "IARC tarafından sınıflandırılmamıştır.",
    mutagenicity: "Doğrudan mutajenik etkisi saptanmamıştır.",
    teratogenicity: "Sıradışı derecede fetal beyin hasarı ve fetal hipoksiye bağlı ölüm riski.",
    organEffects: [
      { system: "Oksijen Taşıma", effect: "COHb oluşumu, dokulara oksijen salınımının engellenmesi (sol sola kayma)." },
      { system: "Kardiyak", effect: "Kardiyak dokuda iskemi, dökümhane işçilerinde akut MI." },
      { system: "Sinir", effect: "Globus pallidus nekrozu, demiyelinizasyon lezyonları." }
    ],
    biomarkers: [
      "Kanda Karboksihemoglobin (COHb) seviyesi (co-oksimetre ile ölçülür, standart nabız oksimetreler yanıltır)",
      "Ekspirasyon havasında CO konsantrasyonu"
    ],
    labMarkers: [
      "Arteriyel laktat seviyesi ölçümü",
      "Kardiyak troponin T/I seviyeleri (iskemik yük için)"
    ],
    epidemiologicRisks: "COHb seviyesi %25'i aşan durumlarda kalıcı nöropsikiyatrik sekellerin gelişme oranı %14'tür.",
    prevention: "Doğal gaz brülörlerinin yıllık bakımı, iç mekan CO dedektör entegrasyonu, egzoz gazı havalandırma tünelleri.",
    ppe: [
      "Tüp destekli solunum respiratörü (SCBA - standart karbon filtre gazı tutmaz)",
      "CO dedektörlü yaka kartları"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "25 ppm" },
      { authority: "OSHA PEL", limit: "50 ppm" }
    ],
    emergencyInterventions: [
      "İşçinin derhal açık havaya alınması ve havayolunun açılması",
      "Gerekirse Hiperbarik Oksijen (HBO) odasına sevk edilmesi"
    ],
    antidote: "%100 Normobarik Oksijen (yarı ömrü 320 dakikadan 80 dakikaya düşürür) veya Hiperbarik Oksijen (yarı ömrü 20 dakikaya düşürür).",
    iarcClassification: "Not Classified",
    nihoshLimit: "TWA 35 ppm (Ceiling 200 ppm)",
    oshaStandard: "TWA 50 ppm"
  },
  {
    id: "silica",
    name: "Silica",
    nameTr: "Silika (Kristal Kuvars)",
    overview: "Solunabilir kristal silika (SiO2) tozları parankimde alveoler makrofajlarca fagosite edilir. Fiziksel fagozomal yırtılma sonucu açığa çıkan sitokinler ilerleyici akciğer fibrozisine (Silikozis) yol açar.",
    exposureSources: [
      "Kumlama, kırma ve mermer atölyeleri",
      "Seramik ve porselen fırın ve döküm kalıp sanayii",
      "Kuvars içeren taş tezgah kesim atölyeleri",
      "Yol, tünel ve madencilik kazı çalışmaları"
    ],
    acuteToxicity: "Akut silikoproteinosis (haftalar-aylar içinde gelişen hırıldama, dispne ve ölümcül alveoler dolgu).",
    chronicToxicity: "Kronik nodüler silikozis (ilerleyici solunum yetmezliği), tüberküloz duyarlılığı (silicotuberculosis), Caplan sendromu.",
    carcinogenicity: "IARC Group 1 kanserojenidir; bronkojenik karsinom gelişimi ile doğrudan ilişkilidir.",
    mutagenicity: "Dolaylı genotoksiktir; kronik inflamasyon ve serbest radikaller DNA'yı hasarlar.",
    teratogenicity: "Kanıt bulunmamaktadır.",
    organEffects: [
      { system: "Akciğer Parankimi", effect: "Kollajenize silikotik nodüller, ilerleyici masif fibrozis (PMF)." },
      { system: "Lenf düğümleri", effect: "Hiler lenfadenopati ve hiler lenf bezlerinde yumurta kabuğu (eggshell) görünümü." },
      { system: "Lökositer", effect: "Makrofaj hücre apoptozu nedeniyle baskılanmış tüberküloz bağışıklığı." }
    ],
    biomarkers: [
      "Balgam sitolojisinde ve bronkoalveoler lavajda kuvars lif tayini",
      "Serum TNF-alfa ve IL-1 beta seviyeleri (kronik yüksek seyir)"
    ],
    labMarkers: [
      "Yüksek Çözünürlüklü Akciğer Tomografisi (HRCT - üst loblarda bilateral mikronodüller)",
      "PPD Deri testi ( latent tüberküloz enfeksiyonunun tespiti için)",
      "SFT ve DLCO kaybı takipleri"
    ],
    epidemiologicRisks: "Kuvars tezgah kesim işçilerinde 5 yıllık ortalama çalışma sonucu silikozis gelişme yüzdesi %38'dir.",
    prevention: "Islak kesim ve sulu kumlama yöntemlerinin zorunlu kılınması, tozsuzlaştırma barajları, periyodik mini-grafiler.",
    ppe: [
      "P100 standardında toz respiratörleri veya hava beslemeli maskeler",
      "Sızdırmaz tulumlar"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.025 mg/m3" },
      { authority: "OSHA PEL", limit: "0.05 mg/m3" }
    ],
    emergencyInterventions: [
      "Akut krizlerde solunum desteği, bronkodilatörler, akut silikoproteinoriste bronkoalveoler lavaj.",
      "İnflamasyon baskılama"
    ],
    antidote: "Antidotu yoktur. Alınan silis tozlarını geri akciğerden sökecek bir tedavi formülü mevcut değildir.",
    iarcClassification: "Group 1 (Kristal form)",
    nihoshLimit: "TWA 0.05 mg/m3",
    oshaStandard: "TWA 0.05 mg/m3"
  },
  {
    id: "industrial_solvents",
    name: "Industrial Solvents",
    nameTr: "Endüstriyel Çözücüler",
    overview: "Endüstriyel çözücüler; klorlu, alifatik ve aromatik formlarda olabilen, yağı çözmek üzere tasarlanmış uçucu organik sıvılardır. Lipofilik maruziyetleri MSS korozyonu yaratır.",
    exposureSources: [
      "Kuru temizleme atölyeleri (tetrakloroetilen / perkloroetilen)",
      "Metal yağ giderme tesisleri (trikloroetilen)",
      "Boya tiner ve sprey kaplama sanayii",
      "Yapıştırıcı, plastik ve sentetik kumaş entegrasyonları"
    ],
    acuteToxicity: "Solvent uyuşukluğu, vestibüler dengesizlik, solunum yollarında spazmlar, bulantı, kardiyovasküler aritmi.",
    chronicToxicity: "Kalıcı kognitif gerileme, toksik demans (solvent ensefalopatisi), periferik nöropatiler, karaciğer ve böbrek dejenerasyonları.",
    carcinogenicity: "Trikloroetilen ve tetrakloroetilen IARC Group 1 karsinojendir; böbrek ve karaciğer kanserine yol açar.",
    mutagenicity: "Çeşitli klorlu türevler kovalent DNA hasarı kurarak genotoksik etki üretir.",
    teratogenicity: "Konjenital kalp anomalileri riskini artırır.",
    organEffects: [
      { system: "Nörolojik", effect: "Aksonal demiyelinizasyon, bilişsel erozyon." },
      { system: "Hepatobiliyer", effect: "Karaciğer parankim nekrozu ve portal fibrozis." },
      { system: "Böbrek", effect: "B-liyaz metabolit yoluyla glomerüler ve tübüler dejenerasyon." }
    ],
    biomarkers: [
      "İdrarda Trikloroasetik asit (TCA - klorlu solvent maruziyetinde)",
      "İdrarda S-Fenilmercaptürik asit (aromatik solventlerde)"
    ],
    labMarkers: [
      "Elektromiyografi (EMG - iletim hızı kayıpları takibi)",
      "Rutin idrar tahlili (hematüri, tübüler proteinüri)"
    ],
    epidemiologicRisks: "Kuru temizleme işyerlerindeki perkloroetilen sızıntıları, lenfoma ve karaciğer malignitelerinde 3.1 kat bağıl risk oluşturur.",
    prevention: "Kapalı kuru temizleme kabin dönüşümleri, hava havalandırma katsayılarının artırılması, solventlerin su bazlı solüsyonlarla ikamesi.",
    ppe: [
      "Organik buhar adsorban filtreleri",
      "Poliüretan veya özel lamine eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "Varies (e.g. TCE: 10 ppm)" },
      { authority: "OSHA PEL", limit: "Varies by chemical" }
    ],
    emergencyInterventions: [
      "Alandan uzaklaştırma, nemlendirilmiş maskeyle oksijen takviyesi, kardiyak monitörizasyon.",
      "Arteriyel kalsiyum takviyesi"
    ],
    antidote: "Spesifik antidotu yoktur; solunum ve renal parametreler desteklenir.",
    iarcClassification: "Group 1/2A (Kimyasal türüne göre)",
    nihoshLimit: "Kanserojen sınır değerleri esas alınır",
    oshaStandard: "Kapsamlı kimyasal listesine göre belirlenmiştir"
  },
  {
    id: "hydrocarbons",
    name: "Hydrocarbons",
    nameTr: "Hidrokarbonlar (Alifatik / PAH)",
    overview: "Hidrokarbonlar petrol bazlı uzun organik zincirlerdir. Polisiklik Aromatik Hidrokarbonlar (PAH) kok, asfalt ve dökümhanelerde kömürün eksik yanmasıyla oluşan mutajenik ajanlardır.",
    exposureSources: [
      "Asfalt serim işleri ve çatı izolasyon kaplamaları",
      "Kok fırınları ve petrokimya tesisleri",
      "Dökümhaneler ve dizel motor emisyon sahaları",
      "Petrol sondaj ve rafine platformları"
    ],
    acuteToxicity: "Aspire edilirse ağır kimyasal pnömoni ve akciğer nekrozu, letarji, MSS uyuşukluğu.",
    chronicToxicity: "Açık hava işçilerinde kontakt dermatit, kronik bronşit, karaciğer yağlanması, kognitif disfonksiyon.",
    carcinogenicity: "IARC Group 1 (PAH'lar arasında Benzo[a]piren) kesin karsinojendir; akciğer, mesane ve mesleki deri kanserini indükler.",
    mutagenicity: "Benzo[a]piren metabolitleri doğrudan DNA'ya kovalent katılarak DNA adducts oluşturur.",
    teratogenicity: "Gelişim yetersizlikleri ve düşük ağırlık.",
    organEffects: [
      { system: "Dermatolojik", effect: "Katran siğilleri, foto-hassasiyet, melanodermi." },
      { system: "Pulmoner", effect: "Kimyasal pnömoni (aspirasyon), kronik bronşit." },
      { system: "Onkolojik", effect: "Skuamöz hücreli deri karsinomu, mesane karsinogenezi." }
    ],
    biomarkers: [
      "İdrarda 1-Hidroksipiren (1-OHP - kümülatif PAH maruziyeti için altın standart)",
      "Kanda PAH-DNA Adduct seviyeleri"
    ],
    labMarkers: [
      "Aylık dermatolojik malformasyon taramaları",
      "Spirometri solunum testleri"
    ],
    epidemiologicRisks: "Kok fırını operatörlerinde PAH maruziyet endeksine bağlı olarak akciğer kanseri mortalite oranı genel popülasyondan 4.9 kat fazladır.",
    prevention: "Asfalt serpme mekanizmalarının otomasyonu, kok fırını kapaklarının sızdırmaz sızdırmazlığı, temiz duş bölgesi.",
    ppe: [
      "Ayna korumalı yüksek sıcaklık maskeleri ve PAH önleyici respiratorler",
      "Isıya dayanıklı PAH sızdırmaz deri eldivenler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "0.2 mg/m3 as coal tar pitch volatiles" },
      { authority: "OSHA PEL", limit: "0.2 mg/m3" }
    ],
    emergencyInterventions: [
      "Aspirasyon durumunda asla KUSTURULMAMALIDIR (sekonder aspirasyon pnömonisini önlemek için)",
      "Aktif akciğer lavage desteği"
    ],
    antidote: "Spesifik antidotu yoktur; aspirasyon önlenmesi ve semptomatik tedavi esastır.",
    iarcClassification: "Group 1 (Benzo[a]piren içeren PAH fraksiyonları)",
    nihoshLimit: "TWA 0.1 mg/m3",
    oshaStandard: "TWA 0.2 mg/m3 (Coal Tar Pitch Volatiles)"
  },
  {
    id: "heavy_metals",
    name: "Heavy Metals Bundle",
    nameTr: "Ağır Metaller Kompleksi",
    overview: "Ağır metaller; kurşun, cıva, kadmiyum, arsenik, krom, nikel, manganez ve talyum gibi yoğunlukları yüksek toksik element grubudur. Sistemik birikim ve organ harabiyeti üretirler.",
    exposureSources: [
      "Hurda metal geri dönüşüm tesisleri",
      "Ergitme, dökümhane ve lehimleme fabrikaları",
      "Cam, seramik, akü ve batarya üretim birimleri",
      "Kuyumculuk, kaplama ve alaşım endüstrisi"
    ],
    acuteToxicity: "Metal dumanı ateşi (titreme, ateş, lökositoz), akut tübüler nekroz, ağır kardiyovasküler şok.",
    chronicToxicity: "Kalıcı renal disfonksiyon (nefropati), santral nörondepresyon, kemik osteomalazisi, anemi.",
    carcinogenicity: "Gruptaki birçok üye (Cd, As, Cr-VI, Ni) IARC Group 1 kesin karsinojendir.",
    mutagenicity: "Serbest oksijen radikali üretimi, DNA onarım mekanizması inhibisyonu, kırık mutasyonları.",
    teratogenicity: "Neonatal mental inhibisyon, zeka gerilikleri.",
    organEffects: [
      { system: "Böbrek", effect: "Kademeli nefroz, tübüler atrofi ve protein kaçışı." },
      { system: "Sinir Sistemi", effect: "Ekstrapiramidal Parkinson benzeri Parkinsonizm (Manganez), ensefalopatiler." },
      { system: "Hematopoetik", effect: "Enzim blokajı ile mikrositer demir dirençli anemi." }
    ],
    biomarkers: [
      "Tam kanda ICP-MS ile toksik metal paneli",
      "24 saatlik idrar metal klirens saptaması (şelasyon öncesi ve sonrası)"
    ],
    labMarkers: [
      "Beta-2 mikroglobulin tespiti",
      "Eritrosit protoporfirin ve hemoglobin dizini"
    ],
    epidemiologicRisks: "Geri dönüşüm havzasında çalışan ve çoklu metal dumanı soluyan işçilerde proteinüri katsayısı normların %320 üzerindedir.",
    prevention: "Fırın üstü lokal davlumbaz cebri çekiş, toz nemlendirme sistemleri, rotasyonel çalışma takvimi.",
    ppe: [
      "Metal buharı ve ozon filtreli P100 maskeleri",
      "Kullan-at kimyasal koruyucu bariyer iş tulumları"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "Varies by individual metal" },
      { authority: "OSHA PEL", limit: "Metal tipine göre katı sınırlar" }
    ],
    emergencyInterventions: [
      "Metal dumanı ateşinde istirahat, oksijen, ateş düşürücüler ve bol rehidrasyon",
      "Şelasyon tedavisine idrar renal çıktısını izleyerek başlamak"
    ],
    antidote: "Spesifik şelatörler: CaNa2EDTA (Kurşun), Penisilamin (Bakır, Talyum), BAL (Cıva, Arsenik), Succimer (DMSA).",
    iarcClassification: "Group 1 (Çoğu metal türü)",
    nihoshLimit: "Metal bazlı ulusal mevzuata tabidir",
    oshaStandard: "Mevzuat cetveli ile sınırlandırılmıştır"
  },
  {
    id: "toxic_gases",
    name: "Toxic Gases",
    nameTr: "Toksik Gazlar (Irritan / Sistemik)",
    overview: "Toksik gazlar, solunum yollarında korozif asit/baz oluşturan (irritan gazlar: klor, amonyak, fosgen, kükürt dioksit) veya hücresel solunumu boğan sistemik boğucu gaz grubudur.",
    exposureSources: [
      "Kimya sanayii sentez reaktör odaları",
      "Klorlama, kağıt ve tekstil ağartma tesisleri",
      "Gübre, soğutma ve kompresör dairesi sızıntıları (amonyak)",
      "Atık su arıtma ve kanalizasyon çalışmaları (hidrojen sülfür)"
    ],
    acuteToxicity: "Laringospazm, pulmoner ödem, kimyasal boğulma, asfiksi, gözlerde kornea erimesi.",
    chronicToxicity: "Reaktif Havayolu Disfonksiyonu Sendromu (RADS - tek maruziyet sonrası kalıcı astım), kronik bronşit, koku felci.",
    carcinogenicity: "Çoğu irritan gaz doğrudan kanserojen değildir ancak kronik inflamatuar hasar plevral hassasiyet yaratabilir.",
    mutagenicity: "Doğrudan mutajenik etkileri zayıftır, asidoz kaynaklı dolaylı hasar yapabilirler.",
    teratogenicity: "Fetal hipoksi nedeni.",
    organEffects: [
      { system: "Solunum Mukozası", effect: "Korozif mukozal yanık, larenks ödemi, ARDS pulmoner ödem." },
      { system: "Asit-Baz", effect: "H2S ve siyanür benzeri sistemik gazlarda anaerobik metabolik asidoz." },
      { system: "Oftalmik", effect: "Amonyak sızıntısıyla korneal perforasyon ve körlük." }
    ],
    biomarkers: [
      "Kanda Sülfhemoglobin konsantrasyonu (H2S şüphesinde)",
      "Arteriyel Kan Gazında asidoz ve O2 açığı"
    ],
    labMarkers: [
      "Akciğer grafisi (pulmoner ödem ve sızıntı takibi için yatak başı)",
      "Solunum spirometri parametreleri"
    ],
    epidemiologicRisks: "Fosgen sızıntısına reaksiyoner solunum hasarı yaşayan kimyager operatörlerinde kriz sonrası RADS astımı sıklığı %42'dir.",
    prevention: "Gerçek zamanlı gaz algılama ve otomatik acil kapatma (scram) vanaları, rüzgar yön göstergeleri, kaçış respiratör pilleri.",
    ppe: [
      "Kaçış başlıkları ve kimyasal sızdırmaz gaz tulumu",
      "SCBA kendinden tüplü maske seti"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "Varies (Ammonia: 25 ppm, Chlorine: 0.1 ppm)" },
      { authority: "OSHA PEL", limit: "Katı gaz limitleri" }
    ],
    emergencyInterventions: [
      "İşçiyi rüzgarı arkaya alarak hemen açık havaya taşımak",
      "Laringeal spazmda erken entübasyon veya trakeostomi"
    ],
    antidote: "Asit/Baz yaratan irritan gaza bağlıdır. Hidrojen sülfür zehirlenmesinde Amil Nitrit + Sodyum Nitrit (methemoglobin oluşturarak gazı bağlar) uygulanabilir.",
    iarcClassification: "Not Classified (Çoğu)",
    nihoshLimit: "Kimyasal bazlı IDLH seviyelerine tabidir",
    oshaStandard: "Gaz türüne göre TWA/STEL tabloludur"
  },
  {
    id: "industrial_dust",
    name: "Industrial Dust Exposure",
    nameTr: "Endüstriyel Toz Maruziyeti (Pnömokonyozlar)",
    overview: "Endüstriyel tozlar; kömür, metal, pamuk, kenevir ve ahşap lifleri gibi işyeri ortamında solunabilir fraksiyonda (< 5 mikron) asılı kalan partiküllerdir. Akciğer parankiminde pnömokonyoz ve fibrojenik hasar üretirler.",
    exposureSources: [
      "Kömür madenciliği (Kömür İşçisi Pnömokonyozu - Kara Akciğer)",
      "Tekstil iplik ve pamuk çırçır fabrikaları (Bissinozis - Pazartesi Hastalığı)",
      "Kereste, mobilya ve ahşap yonga döküm sahaları",
      "Tahıl siloları, un değirmenleri ve tarımsal depolama birimleri"
    ],
    acuteToxicity: "Akut saman nezlesi benzeri alerjik krizler, akut bronşiyal astım nöbetleri, bissinozis pazartesi sabah göğüs sıkışması.",
    chronicToxicity: "Pnömokonyoz nodülleri, ilerleyici masif parankim fibrozisi, KOAH benzeri tıkayıcı solunum yetmezliği, burun tümörleri (sert ağaç tozu).",
    carcinogenicity: "Sert ağaç tozları (wood dust) nazal kavite ve sinüs kanserleri için IARC Group 1 kesin karsinojendir. Kömür tozu Group 3'dür.",
    mutagenicity: "Sitogenetik kanıtlar odun tozunun polifenol türevleri nedeniyle mutajenik etkileri olduğunu doğrulamaktadır.",
    teratogenicity: "Zayıf kanıtlar.",
    organEffects: [
      { system: "Solunum Kanalları", effect: "Kömüre bağlı kömür makrofaj plakları (coal macules), parankim fibrozisi." },
      { system: "Nazal Sinüsler", effect: "Yonga ve sert odun tozu birikmesiyle adenokarsinom gelişimi." },
      { system: "Bronşlar", effect: "Pamuk liflerine bağlı histamin salınımı ve bronşiyal spazmlar." }
    ],
    biomarkers: [
      "BAL sıvısı makrofaj sitolojisinde kömür tozu veya lif birikim yükü",
      "Spesifik IgE antikor paneli (alerjik odun tozu için)"
    ],
    labMarkers: [
      "Akciğer Grafisi (ILO Uluslararası Pnömokonyoz Sınıflandırma normlarına göre okuma)",
      "Periyodik SFT (FVC kaybı ve obstrüktif bulgular)"
    ],
    epidemiologicRisks: "Pamuk ipliği işletmelerinde çalışan kardo dairesi işçilerinde Bissinozis gelişme sıklığı %28 oranında izlenmektedir.",
    prevention: "Toz bastırma su pülverizatörleri, toz toplama siklonları ve torba filtre entegrasyonu, ILO standartlarında yıllık grafi takipleri.",
    ppe: [
      "FFP2 veya FFP3 kategorisinde toz ventilli maskeler",
      "Antistatik toz geçirmeyen koruyucu elbiseler"
    ],
    standards: [
      { authority: "ACGIH TLV", limit: "Varies (Respirable Coal Dust: 0.9 mg/m3)" },
      { authority: "OSHA PEL", limit: "Toz türüne göre mg/m3 tabloludur" }
    ],
    emergencyInterventions: [
      "Dispne krizinde oksijen desteği ve antikolinerjik nebül inhalerleri başlanması",
      "Alandan uzaklaştırma"
    ],
    antidote: "Antidotu yoktur. Hasarlar mesleki sınıfta kalıcı fibrojenik süreçlerdir; erken evrelerde iş rotasyonu esastır.",
    iarcClassification: "Sert ağaç tozu: Group 1, Kömür tozu: Group 3",
    nihoshLimit: "Toz tipine göre mm3 katsayılı hassasiyet",
    oshaStandard: "TWA 15 mg/m3 (Toplam toz), TWA 5 mg/m3 (Solunabilir toz)"
  }
];

