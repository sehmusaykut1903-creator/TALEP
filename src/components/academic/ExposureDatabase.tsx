import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Search, 
  Download, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  BookMarked, 
  HelpCircle, 
  AlertCircle,
  Skull,
  FileText,
  Clock,
  Briefcase,
  HeartCrack,
  Info,
  ExternalLink
} from 'lucide-react';

interface Toxin {
  id: string;
  name: string;
  formula: string;
  cas: string;
  molecularWeight: string;
  ld50: string;
  halfLife: string;
  persistence: 'Çok Yüksek' | 'Yüksek' | 'Orta' | 'Düşük';
  bioaccumulation: 'Hızlı' | 'Yavaş' | 'İhmal Edilebilir' | 'Çok Hızlı';
  oshaPel: string;
  nioshRel: string;
  euOel: string; // Added EU standard
  acgihTlv: string; // Added ACGIH standard
  bei: string; // Biological Exposure Indices (BEI)
  sectors: string[];
  organImpacts: {
    neuro: number; // 1-5 scale
    hepato: number;
    nephro: number;
    reprod: number;
    dermal: number;
    hematotox: number;
  };
  routes: string[];
  ppe: string[];
  svgStructure: React.ReactNode;
}

const chemicalDatabase: Toxin[] = [
  {
    id: "benzene",
    name: "Benzen (Aromatik Solvent)",
    formula: "C6H6",
    cas: "71-43-2",
    molecularWeight: "78.11 g/mol",
    ld50: "930 mg/kg p.o. (Rats)",
    halfLife: "72 saat (Kan)",
    persistence: "Orta",
    bioaccumulation: "Yavaş",
    oshaPel: "1 ppm (TWA)",
    nioshRel: "0.1 ppm (REL)",
    euOel: "0.5 ppm TWA",
    acgihTlv: "0.5 ppm TWA",
    bei: "İdrar trans,trans-mukonik asit (tt-MA) > 500 µg/g kreatinin; veya İdrar S-fenilmercaptürik asit (S-PMA) > 25 µg/g kreatinin.",
    sectors: ["Boya", "Kimya", "Petrol Rafinerisi", "Ayakkabı / Deri sanayi"],
    organImpacts: { neuro: 4, hepato: 3, nephro: 2, reprod: 3, dermal: 4, hematotox: 5 },
    routes: ["Solunum", "Cilt kütlesel emilim", "Kazara sindirim"],
    ppe: ["N95 Solvent Filtreli Maske", "Viton Kimyasal Mukavim Eldiven", "Tip 3 Sızdırmaz Kimyasal Tulum", "Koruyucu Cam Gözlük"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-indigo-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="22" strokeDasharray="6 3" />
        <text x="40" y="53" className="text-[8px] font-mono fill-indigo-600 font-extrabold stroke-none">C₆H₆</text>
      </svg>
    )
  },
  {
    id: "lead",
    name: "Kurşun (Ağır Metal)",
    formula: "Pb",
    cas: "7439-92-1",
    molecularWeight: "207.2 g/mol",
    ld50: "450 mg/kg i.p. (Mice)",
    halfLife: "40 yıl (Kemik Dokusu)",
    persistence: "Çok Yüksek",
    bioaccumulation: "Çok Hızlı",
    oshaPel: "0.05 mg/m³",
    nioshRel: "0.05 mg/m³",
    euOel: "0.15 mg/m³ TWA",
    acgihTlv: "0.05 mg/m³ TWA",
    bei: "Tam Kan Kurşun Düzeyi (BLL) > 30 µg/dL (Çalışanlar için kritik alarm threshold değeri).",
    sectors: ["Akü İmalatı", "E-Atık Geri Dönüşüm", "Metal Eritme / Haddehane", "Döküm"],
    organImpacts: { neuro: 5, hepato: 2, nephro: 4, reprod: 5, dermal: 1, hematotox: 5 },
    routes: ["İnhalasyon (Duman/Toz)", "Sindirim (Kirli ellerle gıda alımı)"],
    ppe: ["P3 Toz/Duman Maskesi (HEPA)", "Ağır İş Nitril Eldivenler", "Partikül Geçirmez Tyvek Tulum", "Koruyucu Toz Gözlüğü"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-slate-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
        <path d="M50,10 L50,90 M10,50 L90,50" strokeDasharray="4 4" />
        <text x="44" y="53" className="text-[10px] font-mono fill-slate-700 font-extrabold stroke-none">Pb</text>
      </svg>
    )
  },
  {
    id: "formaldehyde",
    name: "Formaldehit (Uçucu Organik Gaz)",
    formula: "HCHO",
    cas: "50-00-0",
    molecularWeight: "30.03 g/mol",
    ld50: "100 mg/kg (Rats)",
    halfLife: "12 saat (Plazma)",
    persistence: "Düşük",
    bioaccumulation: "İhmal Edilebilir",
    oshaPel: "0.75 ppm",
    nioshRel: "0.016 ppm (REL-C)",
    euOel: "0.3 ppm TWA",
    acgihTlv: "0.1 ppm TWA (Cilt Hassasiyeti)",
    bei: "Doğrudan kan tayini zordur. Mesane idrar format katsayısı ve spesifik mukoza mikronükleus artış hızı.",
    sectors: ["Hastaneler / Patoloji Lab.", "MDF / Sunta Kereste Sanayi", "Mukoza Fiksasyonu", "Kimya imalatı"],
    organImpacts: { neuro: 3, hepato: 2, nephro: 2, reprod: 2, dermal: 5, hematotox: 4 },
    routes: ["Solunum", "Nazal direkt temas", "Cilt ve göz konjunktival hasar"],
    ppe: ["Kombine ABEK Gaz Filtreli Maske", "Butil Koruyucu Kimyasal Eldiven", "Kimyasal Sızdırmaz Önlük", "Koruyucu Siperlik"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-amber-500" stroke="currentColor" fill="none" strokeWidth="3">
        <line x1="50" y1="50" x2="50" y2="20" strokeWidth="4" />
        <line x1="46" y1="50" x2="46" y2="20" strokeWidth="4" />
        <line x1="50" y1="50" x2="25" y2="75" />
        <line x1="50" y1="50" x2="75" y2="75" />
        <text x="44" y="16" className="text-[10px] font-mono fill-amber-600 font-extrabold stroke-none">O</text>
        <text x="18" y="85" className="text-[10px] font-mono fill-amber-600 font-bold stroke-none">H</text>
        <text x="74" y="85" className="text-[10px] font-mono fill-amber-600 font-bold stroke-none">H</text>
        <text x="46" y="53" className="text-[10px] font-mono fill-amber-850 font-black stroke-none">C</text>
      </svg>
    )
  },
  {
    id: "organo",
    name: "Klorpirifos (Organofosfat)",
    formula: "C9H11Cl3NO3PS",
    cas: "2921-88-2",
    molecularWeight: "350.59 g/mol",
    ld50: "135 mg/kg p.o. (Rats)",
    halfLife: "27 gün",
    persistence: "Yüksek",
    bioaccumulation: "Hızlı",
    oshaPel: "0.2 mg/m³",
    nioshRel: "0.2 mg/m³ (Dermal)",
    euOel: "0.1 mg/m³ TWA",
    acgihTlv: "0.1 mg/m³ TWA",
    bei: "Eritrosit Asetilkolinesteraz (AChE) aktivitesi tespiti (Referans değere göre %30 ve üstü eksilme maruziyet can alıcı teyididir).",
    sectors: ["Tarım Sektörü", "Zirai İlaçlama Serası", "Pest Kontrol Hizmetleri"],
    organImpacts: { neuro: 5, hepato: 4, nephro: 3, reprod: 4, dermal: 3, hematotox: 2 },
    routes: ["Cilt absorbsiyonu (%85)", "Mist inhalasyonu", "Kazara sindirim"],
    ppe: ["Su Geçirmez Tyvek İlaçlama Tulumu", "Bariyer Kimyasal Nitril Eldivenler (Uzun)", "A2P3 Aktif Karbon Maske", "Tam Siperlik"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-emerald-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <polygon points="50,15 75,30 75,60 50,75 25,60 25,30" />
        <circle cx="50" cy="45" r="8" />
        <line x1="50" y1="45" x2="50" y2="75" strokeWidth="3" />
        <text x="46" y="49" className="text-[8px] font-mono fill-emerald-700 font-extrabold stroke-none">P</text>
        <text x="46" y="86" className="text-[7px] font-mono fill-slate-700 stroke-none">Cl₃</text>
      </svg>
    )
  },
  {
    id: "tce",
    name: "Trikloroetilen (Klorlu Solvent)",
    formula: "C2HCl3",
    cas: "79-01-6",
    molecularWeight: "131.39 g/mol",
    ld50: "4920 mg/kg p.o. (Rats)",
    halfLife: "21 saat (Böbrek/Karaciğer)",
    persistence: "Orta",
    bioaccumulation: "Yavaş",
    oshaPel: "100 ppm TWA",
    nioshRel: "25 ppm TWA",
    euOel: "10 ppm TWA",
    acgihTlv: "10 ppm TWA",
    bei: "Mesa sonu idrar trikloroasetik asit (TCA) seviyesi > 15 mg/L.",
    sectors: ["Metal Yağ Çözme", "Kuru Temizleme fabrikaları", "Kimyasal Kimya Sentezi"],
    organImpacts: { neuro: 4, hepato: 5, nephro: 5, reprod: 3, dermal: 3, hematotox: 3 },
    routes: ["Solunum", "Dermal absorpsiyon", "Sindirim"],
    ppe: ["N95 Klorlu Solvent Karşıtı Yarım Yüz Maskesi", "PVA Koruyucu Kimyasal Eldiven", "Kimyasal Koruyucu Apron", "Gözlük"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-blue-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <line x1="30" y1="45" x2="70" y2="45" strokeWidth="4" />
        <line x1="30" y1="52" x2="70" y2="52" strokeWidth="4" />
        <line x1="30" y1="48" x2="15" y2="25" />
        <line x1="30" y1="48" x2="15" y2="75" />
        <line x1="70" y1="48" x2="85" y2="25" />
        <line x1="70" y1="48" x2="85" y2="75" />
        <text x="8" y="24" className="text-[8px] font-mono fill-blue-600 font-bold stroke-none">Cl</text>
        <text x="8" y="80" className="text-[8px] font-mono fill-blue-600 font-bold stroke-none">Cl</text>
        <text x="86" y="24" className="text-[8px] font-mono fill-blue-600 font-bold stroke-none">Cl</text>
        <text x="86" y="80" className="text-[8px] font-mono fill-blue-600 font-bold stroke-none">H</text>
      </svg>
    )
  },
  {
    id: "manganese",
    name: "Manganez (Kaynak ve Eritme Dumanı)",
    formula: "Mn",
    cas: "7439-96-5",
    molecularWeight: "54.94 g/mol",
    ld50: "9000 mg/kg (Rats)",
    halfLife: "40 gün (Beyin/Dokularda)",
    persistence: "Çok Yüksek",
    bioaccumulation: "Hızlı",
    oshaPel: "5 mg/m³ (Metal ve Diğerleri)",
    nioshRel: "1 mg/m³ (REL)",
    euOel: "0.2 mg/m³ (İnhale toz)",
    acgihTlv: "0.02 mg/m³ (Solunabilir Fraksiyon)",
    bei: "Mesa sonu kan manganez konsantrasyonu > 1.0 µg/dL karsinojenik olmayan nöropati katsayısı.",
    sectors: ["Paslanmaz çelik kaynağı", "Alaşım Döküm fırınları", "Kuru Pil İmalatı"],
    organImpacts: { neuro: 5, hepato: 3, nephro: 2, reprod: 4, dermal: 1, hematotox: 3 },
    routes: ["Solunum (Mangan dumanı)", "Kazara yutma"],
    ppe: ["P3 Solunum Maskesi (Kaynak duman korumalı)", "Deri Ağır Kaynak Eldiveni", "Metal Splas korumalı Kıyafet"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-cyan-600" stroke="currentColor" fill="none" strokeWidth="2.5">
        <rect x="25" y="25" width="50" height="50" rx="8" />
        <circle cx="50" cy="50" r="15" strokeDasharray="4 2" />
        <text x="40" y="55" className="text-[14px] font-mono fill-cyan-700 font-black stroke-none">Mn</text>
      </svg>
    )
  },
  {
    id: "chromium6",
    name: "Ekzavalan Krom (Chromium-VI)",
    formula: "Cr(VI)",
    cas: "18540-29-9",
    molecularWeight: "51.99 g/mol",
    ld50: "50 mg/kg p.o. (Rats)",
    halfLife: "14 gün",
    persistence: "Yüksek",
    bioaccumulation: "Hızlı",
    oshaPel: "5 µg/m³ TWA",
    nioshRel: "0.2 µg/m³ TWA",
    euOel: "5 µg/m³ TWA",
    acgihTlv: "0.05 µg/m³ TWA",
    bei: "Post-shift idrar toplam krom seviyesi > 25 µg/g kreatinin.",
    sectors: ["Elektrokaplama", "Krom Sentezi", "Paslanmaz Çelik Kaynak", "Boya Pigmentasyon"],
    organImpacts: { neuro: 2, hepato: 4, nephro: 5, reprod: 4, dermal: 5, hematotox: 4 },
    routes: ["Solunum (Aerodinamik Tozlar)", "Dermal Temas (Septum delinme ve alerjiler)"],
    ppe: ["P3 Seviye HEPA Süzgeçli Maske", "Butil veya Neopren Koruyucu Eldiven", "Tyvek Kimyasal Koruyucu Giysi"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-purple-600" stroke="currentColor" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="50" r="25" />
        <path d="M50,15 L50,35 M50,65 L50,85 M15,50 L35,50 M65,50 L85,50" />
        <text x="42" y="54" className="text-[10px] font-mono fill-purple-700 font-black stroke-none">Cr⁺⁶</text>
      </svg>
    )
  },
  {
    id: "asbestos",
    name: "Asbest Mineralleri (Krizotil/Amfibol)",
    formula: "Mg3Si2O5(OH)4",
    cas: "1332-21-4",
    molecularWeight: "277.11 g/mol",
    ld50: "Bilinmiyor (Akut toksik değil)",
    halfLife: "Süresiz (Akciğer Parankiminde)",
    persistence: "Çok Yüksek",
    bioaccumulation: "İhmal Edilebilir",
    oshaPel: "0.1 fibers/cm³ (8 saat)",
    nioshRel: "0.1 fibers/cm³ (REL)",
    euOel: "0.1 fibers/cm³ (Sıfır Hedefli İndirgeme)",
    acgihTlv: "0.1 fibers/cm³ TWA",
    bei: "Spesifik kromatografik biyobelirteç yoktur. SMRP (Serum Mesothelin-Related Protein) klinikte erken taramada izlenebilir.",
    sectors: ["Kentsel Dönüşüm / Yıkım", "Eski Gemi Söküm", "Yalıtım ve Conta imalatı"],
    organImpacts: { neuro: 1, hepato: 1, nephro: 1, reprod: 2, dermal: 2, hematotox: 2 },
    routes: ["Solunum (İntratorasik Lifler)"],
    ppe: ["N100 Tam Yüz Maskesi (HEPA Filtreli)", "Tek Kullanımlık Geçirimsiz Koruyucu Tulum", "Sızdırmaz İş Botu"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-orange-600" stroke="currentColor" fill="none" strokeWidth="2">
        <path d="M10,25 Q30,5 50,25 T90,25 M10,45 Q30,25 50,45 T90,45 M10,65 Q30,45 50,65 T90,65" strokeWidth="3" />
        <text x="35" y="85" className="text-[7.5px] font-mono fill-orange-700 font-bold stroke-none">Lif Yapısı (Fibrous)</text>
      </svg>
    )
  },
  {
    id: "toluene",
    name: "Toluen (Uçucu Solvent)",
    formula: "C7H8",
    cas: "108-88-3",
    molecularWeight: "92.14 g/mol",
    ld50: "5000 mg/kg p.o. (Rats)",
    halfLife: "24 saat",
    persistence: "Düşük",
    bioaccumulation: "Yavaş",
    oshaPel: "200 ppm TWA",
    nioshRel: "100 ppm TWA",
    euOel: "50 ppm TWA",
    acgihTlv: "20 ppm TWA",
    bei: "İdrar ortofosfat veya idrarda hipürik asit > 1.6 g/g kreatinin (Mesa sonu).",
    sectors: ["Boya Mürekkep İmalatı", "Plastik Sentez Fabrikaları", "Yapıştırıcı ve Sentetik Tiner"],
    organImpacts: { neuro: 5, hepato: 4, nephro: 3, reprod: 4, dermal: 4, hematotox: 3 },
    routes: ["Solunum", "Dermal bariyer geçişi", "Oral sızıntılar"],
    ppe: ["A2 Serisi Solvent Koruyucu Maske", "Viton veya Kalrez Kimyasal Eldiven", "Koruyucu Kimyasal Maske Gözlüğü"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-teal-600" stroke="currentColor" fill="none" strokeWidth="2.5">
        <polygon points="50,25 75,40 75,70 50,85 25,70 25,40" strokeLinejoin="round" />
        <line x1="50" y1="25" x2="50" y2="8" strokeWidth="3" />
        <circle cx="50" cy="55" r="16" strokeDasharray="3 3" />
        <text x="43" y="14" className="text-[7px] font-mono fill-teal-700 font-bold stroke-none">CH₃</text>
      </svg>
    )
  },
  {
    id: "cadmium",
    name: "Kadmiyum (Toksik Ağır Metal)",
    formula: "Cd",
    cas: "7440-43-9",
    molecularWeight: "112.41 g/mol",
    ld50: "225 mg/kg (Rats)",
    halfLife: "30 yıl (Böbrek/Kemikte)",
    persistence: "Çok Yüksek",
    bioaccumulation: "Çok Hızlı",
    oshaPel: "5 µg/m³ TWA",
    nioshRel: "Potansiyel Kanser (Minimum)",
    euOel: "1 µg/m³ TWA (Solunabilir)",
    acgihTlv: "0.002 mg/m³ TWA",
    bei: "İdrar kadmiyum düzeyi > 5 µg/g kreatinin veya kanda kadmiyum tespiti.",
    sectors: ["Pas önleyici kaplamalar", "Nikel-Kadmiyum Pil Üretimi", "Cam Renklendirme kısımları"],
    organImpacts: { neuro: 3, hepato: 3, nephro: 5, reprod: 5, dermal: 1, hematotox: 4 },
    routes: ["Inhalasyon (Duman)", "Oral temas"],
    ppe: ["P3 Seviye Solunum Maskesi (Toz/Metal Duman korumalı)", "Uzun kollu kimyasal koruyucu eldiven", "Tulum"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-rose-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <rect x="25" y="25" width="50" height="50" rx="8" />
        <circle cx="50" cy="50" r="18" strokeDasharray="6 2" />
        <text x="40" y="55" className="text-[13px] font-mono fill-rose-600 font-black stroke-none">Cd</text>
      </svg>
    )
  },
  {
    id: "mercury",
    name: "Cıva (Elementel ve Organik)",
    formula: "Hg",
    cas: "7439-97-6",
    molecularWeight: "200.59 g/mol",
    ld50: "20 mg/kg p.o. (Organik formlar)",
    halfLife: "60 gün (Karaciğer/Plazmada)",
    persistence: "Çok Yüksek",
    bioaccumulation: "Çok Hızlı",
    oshaPel: "0.1 mg/m³",
    nioshRel: "0.05 mg/m³ (REL)",
    euOel: "0.02 mg/m³ TWA",
    acgihTlv: "0.025 mg/m³ TWA",
    bei: "Post-shift idrar toplam cıva konsantrasyonu > 20 µg/g kreatinin veya tam kanda cıva.",
    sectors: ["Diş Amalgam Hazırlama Lab.", "Altın Madenciliği (Sarı Maden)", "Klor-Alkali kimya fabrikaları"],
    organImpacts: { neuro: 5, hepato: 3, nephro: 4, reprod: 4, dermal: 2, hematotox: 3 },
    routes: ["Buhar halinde direkt inhalasyon", "Cilt penetrasyonu", "Balık diyet transferi"],
    ppe: ["Cıva Buhar Filtreli Özel Kombine Gaz Maskesi", "Sızdırmaz Nitril Ağır Sanayi Eldiveni", "Çizme"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-sky-500" stroke="currentColor" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="50" r="25" />
        <path d="M50,15 L50,30 M50,70 L50,85" />
        <text x="42" y="54" className="text-[12px] font-mono fill-sky-700 font-black stroke-none">Hg</text>
      </svg>
    )
  },
  {
    id: "hexane",
    name: "n-Hekzan (Alifatik Solvent)",
    formula: "C6H14",
    cas: "110-54-3",
    molecularWeight: "86.18 g/mol",
    ld50: "25 g/kg p.o. (Rats)",
    halfLife: "48 saat (Klinik regülasyon)",
    persistence: "Orta",
    bioaccumulation: "Yavaş",
    oshaPel: "500 ppm TWA",
    nioshRel: "50 ppm TWA",
    euOel: "20 ppm TWA",
    acgihTlv: "50 ppm TWA",
    bei: "İdrar post-shift serbest 2,5-hekzandion düzeyi > 0.4 mg/L.",
    sectors: ["Ayakkabı imalat yapıştırıcıları", "Bitkisel yağ çıkarma üniteleri", "Bant ve ambalaj sektörü"],
    organImpacts: { neuro: 5, hepato: 3, nephro: 2, reprod: 3, dermal: 3, hematotox: 2 },
    routes: ["Yoğun inhalasyon dumanı", "Cilt absorbsiyonu"],
    ppe: ["Mekanik A2 Filtreli Gaz Maskesi", "Viton kimyasal koruyucu eldiven", "Antistatik iş elbiseleri"],
    svgStructure: (
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto text-emerald-600" stroke="currentColor" fill="none" strokeWidth="2.5">
        <path d="M10,50 L26,30 L42,50 L58,30 L74,50 L90,30" strokeLinejoin="round" />
        <text x="35" y="75" className="text-[7.5px] font-mono fill-emerald-800 font-bold stroke-none">n-Hexane (C₆H₁₄)</text>
      </svg>
    )
  }
];

export default function ExposureDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToxin, setSelectedToxin] = useState<Toxin>(chemicalDatabase[0]);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('All');

  // Filter Toxins
  const filteredToxins = chemicalDatabase.filter(tox => {
    const matchesSearch = tox.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tox.cas.includes(searchQuery) || 
                          tox.formula.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSector = selectedSector === 'All' || tox.sectors.some(sec => sec.includes(selectedSector));
    
    // Check organ impacts mapping
    let matchesOrgan = true;
    if (selectedOrgan !== 'All') {
      if (selectedOrgan === 'neuro') matchesOrgan = tox.organImpacts.neuro >= 4;
      else if (selectedOrgan === 'hepato') matchesOrgan = tox.organImpacts.hepato >= 4;
      else if (selectedOrgan === 'nephro') matchesOrgan = tox.organImpacts.nephro >= 4;
      else if (selectedOrgan === 'reprod') matchesOrgan = tox.organImpacts.reprod >= 4;
      else if (selectedOrgan === 'hematotox') matchesOrgan = tox.organImpacts.hematotox >= 4;
    }

    return matchesSearch && matchesSector && matchesOrgan;
  });

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-[2.2rem] p-8 border border-teal-900/45 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="text-teal-400" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-teal-400 uppercase font-mono">LABORATUVAR MARUZİYET MATRİSİ</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Endüstriyel Kimyasal Maruziyet & Standartlar Matrisi</h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Prof. Dr. Vugar Ali Türksoy rehberliğinde derlenmiş, uluslararası limit değerleri (OSHA, NIOSH, EU-OEL, ACGIH) ve biyobelirteç izlem parametrelerini barındıran zengin veri konsolu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT SEARCH AND LIST */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-5 flex flex-col h-[700px]">
          <div className="space-y-3 shrink-0">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Dinamik İnceleme</span>
            
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Toksin, CAS veya formül ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector filter */}
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-[10.5px] font-black text-slate-600 outline-none cursor-pointer"
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
            >
              <option value="All">Tüm Sektörler</option>
              <option value="Boya">Boya / Solvent Sanayi</option>
              <option value="Metal">Ağır Metal & Haddehane</option>
              <option value="Akü">Akü ve Pil İmalatı</option>
              <option value="Hastane">Hastane & Patoloji</option>
              <option value="Tarım">Pestisit / Tarım</option>
              <option value="Kentsel">Gemi Söküm & Yıkım</option>
            </select>

            {/* Organ filter */}
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-[10.5px] font-black text-slate-600 outline-none cursor-pointer"
              value={selectedOrgan}
              onChange={e => setSelectedOrgan(e.target.value)}
            >
              <option value="All">Tüm Hedef Organlar</option>
              <option value="neuro">Nörotoksinler (Skor 4+)</option>
              <option value="hepato">Hepatotoksinler (Skor 4+)</option>
              <option value="nephro">Nefrotoksinler (Skor 4+)</option>
              <option value="reprod">Üreme Riski (Skor 4+)</option>
              <option value="hematotox font-black">Miyelotoksinler (Skor 4+)</option>
            </select>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredToxins.map((tox) => (
              <button 
                key={tox.id}
                onClick={() => setSelectedToxin(tox)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-bold flex items-center justify-between group cursor-pointer ${
                  selectedToxin.id === tox.id 
                    ? 'bg-gradient-to-r from-teal-900 to-slate-900 border-teal-950 text-white shadow-md' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="truncate font-black text-sm">{tox.name.split(' (')[0]}</p>
                  <p className={`text-[9.5px] font-mono mt-0.5 ${selectedToxin.id === tox.id ? 'text-teal-300' : 'text-slate-400'}`}>CAS {tox.cas} | {tox.formula}</p>
                </div>
              </button>
            ))}
            {filteredToxins.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 font-bold italic">Sorguya uygun toksik kimyasal bulunamadı.</div>
            )}
          </div>
        </div>

        {/* RIGHT DETAILS VIEW */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-7 h-[700px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedToxin ? (
              <motion.div
                key={selectedToxin.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Top Name, Formula & SVG Molecular Drawing */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 -m-8 mb-4 p-8 border-b border-slate-100 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest font-mono block">Kimyasal Bilgi Kartı</span>
                    <h3 className="text-xl font-black text-slate-900 uppercase leading-none">{selectedToxin.name}</h3>
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      <span className="px-2.5 py-1 bg-white text-indigo-700 font-mono text-[10px] font-bold rounded-lg border border-indigo-100">CAS: {selectedToxin.cas}</span>
                      <span className="px-2.5 py-1 bg-white text-emerald-700 font-mono text-[10px] font-bold rounded-lg border border-emerald-100">Ağırlık: {selectedToxin.molecularWeight}</span>
                      <span className="px-2.5 py-1 bg-white text-purple-700 font-mono text-[10px] font-bold rounded-lg border border-purple-100">Persistans: {selectedToxin.persistence}</span>
                    </div>
                  </div>

                  {/* Molecular geometry preview */}
                  <div className="p-3 bg-white rounded-3xl border border-slate-200 flex items-center justify-center shadow-inner relative group shrink-0 w-36 h-36">
                    <span className="absolute top-2 left-3 text-[8px] font-black text-slate-350 uppercase tracking-wider font-mono">Molekül Geometrisi</span>
                    {selectedToxin.svgStructure}
                  </div>
                </div>

                {/* Sektör ve Maruziyet Yolları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10 space-y-2">
                    <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest font-mono flex items-center gap-1">
                      <Briefcase size={12} /> Sık Karşılaşılan İş Kolları
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedToxin.sectors.map((sec, idx) => (
                        <span key={idx} className="bg-white/80 border border-teal-100 text-teal-800 text-[10px] font-black px-2.5 py-1 rounded-lg">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest font-mono flex items-center gap-1">
                      <Clock size={12} /> Absorpsiyon ve Toksikokinetik
                    </span>
                    <div className="text-[11px] text-slate-700 font-bold space-y-1">
                      <div>Yarı Ömür: <span className="font-bold text-slate-900">{selectedToxin.halfLife}</span></div>
                      <div>Geçiş Yolu: <span className="font-bold text-slate-900">{selectedToxin.routes.join(', ')}</span></div>
                    </div>
                  </div>
                </div>

                {/* Multi-Scale Tox Rating Indicators */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Hedef Sistemik Toksisite Spektrumu (Score 1-5)</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {[
                      { label: "Miyelotoksisite", score: selectedToxin.organImpacts.hematotox, color: 'bg-red-500 text-red-700' },
                      { label: "Nörotoksisite", score: selectedToxin.organImpacts.neuro, color: 'bg-orange-500 text-orange-700' },
                      { label: "Hepatotoksisite", score: selectedToxin.organImpacts.hepato, color: 'bg-amber-500 text-amber-700' },
                      { label: "Nefrotoksisite", score: selectedToxin.organImpacts.nephro, color: 'bg-blue-500 text-blue-700' },
                      { label: "Reprodüktif Toks.", score: selectedToxin.organImpacts.reprod, color: 'bg-teal-500 text-teal-700' },
                      { label: "Dermal İrritasyon", score: selectedToxin.organImpacts.dermal, color: 'bg-slate-500 text-slate-700' },
                    ].map((org, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 shadow-sm">
                        <p className="text-[8.5px] font-black text-slate-400 uppercase leading-none truncate">{org.label}</p>
                        <div className="flex items-center gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div 
                              key={s} 
                              className={`h-2.5 w-full rounded-sm ${s <= org.score ? org.color.split(' ')[0] : 'bg-slate-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[9.5px] font-black text-slate-700 font-mono mt-1 block">Score: {org.score}/5</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limit ve Akut Derecelendirmeleri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-3.5 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Mevzuat Eşikleri ve Sınır Değerler</h4>
                    
                    <div className="space-y-2 text-xs font-semibold">
                      <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-500">OSHA PEL (TWA)</span>
                        <span className="font-black font-mono text-slate-800">{selectedToxin.oshaPel}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-500">NIOSH REL</span>
                        <span className="font-black font-mono text-slate-800">{selectedToxin.nioshRel}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-500">EU-OEL (8 Saat)</span>
                        <span className="font-black font-mono text-slate-800">{selectedToxin.euOel}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-500">ACGIH TLV Threshold</span>
                        <span className="font-black font-mono text-indigo-700">{selectedToxin.acgihTlv}</span>
                      </div>
                    </div>
                  </div>

                  {/* Biological Indices */}
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-3 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono mb-2 flex items-center gap-1 text-teal-700">
                        <Activity size={12} /> Biyobelirteç İzlem İndeksleri (BEI)
                      </h4>
                      <div className="p-4 bg-white border border-slate-150 rounded-2xl text-[11px] font-bold leading-relaxed text-slate-700">
                        {selectedToxin.bei}
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex gap-2 text-[10px] leading-relaxed font-semibold text-indigo-800 mt-3 sm:mt-0">
                      <Skull size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      <p>LD50 Sınırı: <span className="text-rose-600 font-bold">{selectedToxin.ld50}</span>. Akut letalite testi.</p>
                    </div>
                  </div>
                </div>

                {/* Arındırma ve Koruyucu Donanım (PPE) */}
                <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl border border-slate-800 space-y-3 shadow-md">
                  <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest font-mono flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-400" /> Sızdırmaz Kişisel Koruyucu Donanım (PPE) Reçetesi
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {selectedToxin.ppe.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs font-semibold">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] font-black">{idx + 1}</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <Database size={48} className="text-slate-200 mb-2" />
                <p className="text-xs font-black uppercase tracking-wider">Seçili Toksin Detay Kartı</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs">İncelemek istediğiniz toksinin üzerine listeden tıklayarak spektral parametrelerini açın.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
