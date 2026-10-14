/**
 * Generator Ilustrasi Grafis Edukatif IPS SMP Kurikulum Merdeka
 * Menghasilkan gambar berformat PNG Base64 murni dan SVG Base64 standar
 * yang 100% tampil di layar, 100% terunduh di file PDF, dan 100% tampil di Microsoft Word (.doc).
 */

function createSvgBase64(svgString: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    try {
      return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString.trim())));
    } catch {
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString.trim());
    }
  }
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString.trim());
}

// 1. Raw SVG Strings dengan ukuran dan viewBox eksplisit
export const SVG_RAW: Record<string, string> = {
  petaWallaceWeber: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 320" width="700" height="320" style="background:#f0f9ff; font-family:'Segoe UI', Arial, sans-serif;">
      <rect width="700" height="320" fill="#f0f9ff" />
      <rect x="10" y="8" width="680" height="30" rx="5" fill="#1e3a8a" />
      <text x="350" y="28" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff" letter-spacing="1">PETA WILAYAH BIOGEOGRAFI INDONESIA (GARIS WALLACE &amp; GARIS WEBER)</text>
      
      <!-- Samudra -->
      <text x="50" y="285" font-size="11" fill="#0284c7" font-style="italic" font-weight="bold">Samudra Hindia</text>
      <text x="540" y="65" font-size="11" fill="#0284c7" font-style="italic" font-weight="bold">Samudra Pasifik</text>
      
      <!-- Pulau Sumatera -->
      <path d="M 60,70 L 140,160 L 125,180 L 50,90 Z" fill="#22c55e" stroke="#15803d" stroke-width="2" />
      <text x="80" y="125" font-size="12" font-weight="bold" fill="#0f172a">Sumatera</text>
      
      <!-- Pulau Jawa -->
      <path d="M 130,205 L 250,215 L 245,230 L 125,220 Z" fill="#22c55e" stroke="#15803d" stroke-width="2" />
      <text x="180" y="215" font-size="12" font-weight="bold" fill="#0f172a">Jawa</text>
      
      <!-- Pulau Kalimantan -->
      <path d="M 170,80 L 250,75 L 260,140 L 210,165 L 165,130 Z" fill="#22c55e" stroke="#15803d" stroke-width="2" />
      <text x="200" y="115" font-size="12" font-weight="bold" fill="#0f172a">Kalimantan</text>
      
      <!-- Garis Wallace -->
      <line x1="275" y1="45" x2="265" y2="280" stroke="#dc2626" stroke-width="3" stroke-dasharray="6,4" />
      <rect x="230" y="255" width="95" height="24" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" />
      <text x="277" y="271" text-anchor="middle" font-size="10" font-weight="bold" fill="#b91c1c">Garis Wallace</text>
      
      <!-- Pulau Sulawesi -->
      <path d="M 310,100 L 330,95 L 345,130 L 370,120 L 340,150 L 355,185 L 325,175 L 315,135 Z" fill="#eab308" stroke="#a16207" stroke-width="2" />
      <text x="330" y="145" font-size="12" font-weight="bold" fill="#0f172a">Sulawesi</text>
      
      <!-- Kepulauan Nusa Tenggara -->
      <path d="M 265,228 L 360,225 L 355,235 L 265,236 Z" fill="#eab308" stroke="#a16207" stroke-width="2" />
      <text x="300" y="246" font-size="10" font-weight="bold" fill="#0f172a">Nusa Tenggara</text>
      
      <!-- Garis Weber -->
      <line x1="435" y1="45" x2="425" y2="280" stroke="#2563eb" stroke-width="3" stroke-dasharray="6,4" />
      <rect x="390" y="255" width="85" height="24" rx="4" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5" />
      <text x="432" y="271" text-anchor="middle" font-size="10" font-weight="bold" fill="#1d4ed8">Garis Weber</text>
      
      <!-- Kepulauan Maluku -->
      <circle cx="410" cy="120" r="14" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
      <circle cx="440" cy="150" r="15" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
      <text x="400" y="145" font-size="11" font-weight="bold" fill="#0f172a">Maluku</text>
      
      <!-- Papua -->
      <path d="M 470,120 L 530,110 L 610,125 L 610,185 L 530,180 L 485,150 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
      <text x="530" y="150" font-size="13" font-weight="bold" fill="#ffffff">Papua</text>
      
      <!-- Legenda Tipe Fauna -->
      <rect x="30" y="225" width="180" height="85" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" rx="6" />
      <text x="40" y="242" font-size="11" font-weight="bold" fill="#0f172a">Zona Karakteristik Fauna:</text>
      <circle cx="48" cy="258" r="6" fill="#22c55e" />
      <text x="60" y="262" font-size="10" fill="#1e293b" font-weight="600">Asiatis (Gajah, Badak, Harimau)</text>
      <circle cx="48" cy="276" r="6" fill="#eab308" />
      <text x="60" y="280" font-size="10" fill="#1e293b" font-weight="600">Peralihan (Anoa, Babirusa, Komodo)</text>
      <circle cx="48" cy="294" r="6" fill="#3b82f6" />
      <text x="60" y="298" font-size="10" fill="#1e293b" font-weight="600">Australis (Kasuari, Cenderawasih)</text>
    </svg>
  `,

  kurvaPermintaanPenawaran: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 320" width="540" height="320" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
      <rect width="540" height="320" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
      <rect x="15" y="8" width="510" height="28" rx="4" fill="#0f172a" />
      <text x="270" y="27" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff" letter-spacing="0.5">KURVA KESEIMBANGAN HARGA PASAR (EQUILIBRIUM)</text>
      
      <!-- Sumbu P dan Q -->
      <line x1="80" y1="260" x2="80" y2="50" stroke="#334155" stroke-width="2.5" />
      <line x1="80" y1="260" x2="480" y2="260" stroke="#334155" stroke-width="2.5" />
      <polygon points="76,50 84,50 80,42" fill="#334155" />
      <polygon points="480,256 480,264 488,260" fill="#334155" />
      
      <text x="35" y="60" font-size="12" font-weight="bold" fill="#0f172a">Harga (P)</text>
      <text x="430" y="285" font-size="12" font-weight="bold" fill="#0f172a">Kuantitas / Jumlah (Q)</text>
      
      <!-- Kurva Permintaan D (Merah) -->
      <line x1="110" y1="80" x2="420" y2="235" stroke="#dc2626" stroke-width="3.5" />
      <text x="430" y="240" font-size="13" font-weight="bold" fill="#dc2626">D (Permintaan)</text>
      
      <!-- Kurva Penawaran S (Biru) -->
      <line x1="110" y1="235" x2="420" y2="80" stroke="#2563eb" stroke-width="3.5" />
      <text x="430" y="85" font-size="13" font-weight="bold" fill="#2563eb">S (Penawaran)</text>
      
      <!-- Titik Ekuilibrium E (Hijau) -->
      <circle cx="265" cy="157" r="7" fill="#16a34a" stroke="#ffffff" stroke-width="2" />
      <text x="278" y="152" font-size="13" font-weight="bold" fill="#15803d">E (Titik Ekuilibrium)</text>
      
      <!-- Garis Titik-titik Pe dan Qe -->
      <line x1="80" y1="157" x2="265" y2="157" stroke="#64748b" stroke-dasharray="5,4" stroke-width="2" />
      <text x="25" y="162" font-size="11" font-weight="bold" fill="#1e293b">Pe (Harga)</text>
      
      <line x1="265" y1="157" x2="265" y2="260" stroke="#64748b" stroke-dasharray="5,4" stroke-width="2" />
      <text x="238" y="280" font-size="11" font-weight="bold" fill="#1e293b">Qe (Jumlah)</text>
      
      <!-- Penjelasan Kotak -->
      <rect x="90" y="55" width="160" height="52" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="98" y="72" font-size="10" font-weight="bold" fill="#0f172a">• Titik E: Qd = Qs</text>
      <text x="98" y="87" font-size="10" fill="#334155">• Pe = Rp 15.000 / kg</text>
      <text x="98" y="101" font-size="10" fill="#334155">• Qe = 100 Kwintal Barang</text>
    </svg>
  `,

  pelakuEkonomiCircularFlow: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 340" width="620" height="340" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
      <rect width="620" height="340" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
      <rect x="15" y="8" width="590" height="28" rx="4" fill="#1e293b" />
      <text x="310" y="27" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">DIAGRAM ARUS MELINGKAR 4 PELAKU EKONOMI (CIRCULAR FLOW)</text>
      
      <!-- Kotak RTK (Konsumen) -->
      <rect x="35" y="105" width="135" height="75" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5" />
      <text x="102" y="135" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">Rumah Tangga</text>
      <text x="102" y="153" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">Konsumen (RTK)</text>
      <text x="102" y="170" text-anchor="middle" font-size="9" fill="#1e40af">Pemilik Faktor Produksi</text>
      
      <!-- Kotak RTP (Produsen) -->
      <rect x="450" y="105" width="135" height="75" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />
      <text x="517" y="135" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">Rumah Tangga</text>
      <text x="517" y="153" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">Produsen (RTP)</text>
      <text x="517" y="170" text-anchor="middle" font-size="9" fill="#78350f">Penghasil Barang/Jasa</text>
      
      <!-- Kotak Pemerintah (RTN) -->
      <rect x="235" y="105" width="150" height="75" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5" />
      <text x="310" y="135" text-anchor="middle" font-size="13" font-weight="bold" fill="#166534">Pemerintah</text>
      <text x="310" y="153" text-anchor="middle" font-size="11" font-weight="bold" fill="#166534">(RTN / Regulator)</text>
      <text x="310" y="170" text-anchor="middle" font-size="9" fill="#14532d">Pajak &amp; Subsidi Fasilitas</text>
      
      <!-- Pasar Faktor Produksi (Atas) -->
      <rect x="180" y="45" width="260" height="35" rx="6" fill="#f1f5f9" stroke="#475569" stroke-width="1.5" />
      <text x="310" y="67" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Pasar Faktor Produksi (Tanah, Tenaga Kerja, Modal)</text>
      
      <!-- Pasar Barang & Jasa (Bawah) -->
      <rect x="180" y="210" width="260" height="35" rx="6" fill="#f1f5f9" stroke="#475569" stroke-width="1.5" />
      <text x="310" y="232" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Pasar Barang dan Jasa (Hasil Output Industri)</text>
      
      <!-- Garis Panah Atas -->
      <line x1="102" y1="105" x2="102" y2="62" stroke="#2563eb" stroke-width="2" />
      <line x1="102" y1="62" x2="180" y2="62" stroke="#2563eb" stroke-width="2" />
      <line x1="440" y1="62" x2="517" y2="62" stroke="#d97706" stroke-width="2" />
      <line x1="517" y1="62" x2="517" y2="105" stroke="#d97706" stroke-width="2" />
      
      <!-- Garis Panah Bawah -->
      <line x1="517" y1="180" x2="517" y2="227" stroke="#d97706" stroke-width="2" />
      <line x1="517" y1="227" x2="440" y2="227" stroke="#d97706" stroke-width="2" />
      <line x1="180" y1="227" x2="102" y2="227" stroke="#2563eb" stroke-width="2" />
      <line x1="102" y1="227" x2="102" y2="180" stroke="#2563eb" stroke-width="2" />
      
      <!-- Masyarakat Luar Negeri (Bawah Sekali) -->
      <rect x="220" y="275" width="180" height="38" rx="6" fill="#fae8ff" stroke="#9333ea" stroke-width="2" />
      <text x="310" y="295" text-anchor="middle" font-size="11" font-weight="bold" fill="#581c87">Masyarakat Luar Negeri</text>
      <text x="310" y="308" text-anchor="middle" font-size="9" fill="#6b21a8">(Aktivitas Ekspor &amp; Impor)</text>
    </svg>
  `,

  piramidaPenduduk: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 320" width="540" height="320" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
      <rect width="540" height="320" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
      <rect x="15" y="8" width="510" height="28" rx="4" fill="#0f172a" />
      <text x="270" y="27" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">PIRAMIDA PENDUDUK: KOMPOSISI USIA &amp; BONUS DEMOGRAFI</text>
      
      <!-- Sumbu Tengah -->
      <line x1="270" y1="45" x2="270" y2="270" stroke="#475569" stroke-width="2" />
      <text x="180" y="55" font-size="11" font-weight="bold" fill="#2563eb">LAKI-LAKI</text>
      <text x="320" y="55" font-size="11" font-weight="bold" fill="#db2777">PEREMPUAN</text>
      
      <!-- Kelompok Usia 65+ (Tua) -->
      <rect x="235" y="68" width="35" height="18" fill="#93c5fd" />
      <rect x="270" y="68" width="38" height="18" fill="#f9a8d4" />
      <text x="270" y="81" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e293b">65+</text>
      
      <!-- Kelompok Usia 50-64 -->
      <rect x="210" y="93" width="60" height="18" fill="#93c5fd" />
      <rect x="270" y="93" width="62" height="18" fill="#f9a8d4" />
      <text x="270" y="106" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e293b">50-64</text>
      
      <!-- Kelompok Usia Produktif 30-49 (Besar) -->
      <rect x="145" y="122" width="125" height="24" fill="#2563eb" />
      <rect x="270" y="122" width="130" height="24" fill="#db2777" />
      <text x="270" y="138" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">30-49</text>
      
      <!-- Kelompok Usia Produktif Muda 15-29 (Sangat Besar - Puncak Demografi) -->
      <rect x="125" y="152" width="145" height="26" fill="#1d4ed8" />
      <rect x="270" y="152" width="150" height="26" fill="#be185d" />
      <text x="270" y="169" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">15-29</text>
      
      <!-- Kelompok Usia Muda 0-14 -->
      <rect x="160" y="188" width="110" height="22" fill="#93c5fd" />
      <rect x="270" y="188" width="112" height="22" fill="#f9a8d4" />
      <text x="270" y="203" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e293b">0-14</text>
      
      <!-- Keterangan Usia Produktif -->
      <path d="M 85,122 L 115,122 L 115,178 L 85,178" fill="none" stroke="#059669" stroke-width="2.5" />
      <text x="75" y="145" text-anchor="end" font-size="11" font-weight="bold" fill="#059669">Usia Produktif</text>
      <text x="75" y="160" text-anchor="end" font-size="10" fill="#047857">(15 - 64 Tahun &gt; 68%)</text>
      
      <!-- Catatan Bawah -->
      <rect x="60" y="235" width="420" height="42" rx="5" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5" />
      <text x="270" y="252" text-anchor="middle" font-size="11" font-weight="bold" fill="#166534">Peluang Emas Bonus Demografi Indonesia</text>
      <text x="270" y="267" text-anchor="middle" font-size="9.5" fill="#15803d">Jumlah angkatan kerja produktif mendominasi dan menjadi modal besar kemajuan ekonomi.</text>
    </svg>
  `,

  candiPeninggalanSejarah: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 290" width="540" height="290" style="background:#f8fafc; font-family:'Segoe UI', Arial, sans-serif;">
      <rect width="540" height="290" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
      <rect x="15" y="8" width="510" height="28" rx="4" fill="#1e293b" />
      <text x="270" y="27" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">PENINGGALAN ARSITEKTUR KERAJAAN MATARAM KUNO (CANDI BOROBUDUR)</text>
      
      <!-- Langit Senja -->
      <rect x="30" y="42" width="480" height="150" fill="#ffedd5" rx="4" />
      
      <!-- Siluet Gunung -->
      <polygon points="30,160 170,75 300,165" fill="#94a3b8" opacity="0.65" />
      <polygon points="260,165 390,85 510,160" fill="#64748b" opacity="0.65" />
      
      <!-- Tingkatan Candi -->
      <rect x="60" y="172" width="420" height="32" fill="#475569" />
      <rect x="100" y="145" width="340" height="27" fill="#334155" />
      <rect x="155" y="122" width="230" height="23" fill="#1e293b" />
      
      <!-- Stupa Utama di Puncak -->
      <path d="M 235,122 C 235,90 270,70 270,65 C 270,70 305,90 305,122 Z" fill="#0f172a" />
      <line x1="270" y1="65" x2="270" y2="48" stroke="#0f172a" stroke-width="3" />
      
      <!-- Stupa-Stupa Lingkaran -->
      <circle cx="190" cy="115" r="9" fill="#334155" />
      <circle cx="225" cy="115" r="9" fill="#334155" />
      <circle cx="315" cy="115" r="9" fill="#334155" />
      <circle cx="350" cy="115" r="9" fill="#334155" />
      
      <!-- Tangga Batu -->
      <rect x="250" y="122" width="40" height="82" fill="#64748b" opacity="0.6" />
      
      <!-- Teks Filosofi Tingkatan -->
      <rect x="30" y="212" width="480" height="65" rx="5" fill="#ffffff" stroke="#cbd5e1" />
      <text x="45" y="230" font-size="11" font-weight="bold" fill="#0f172a">Tiga Zona Filosofi Kehidupan pada Candi Borobudur:</text>
      <text x="45" y="247" font-size="9.5" fill="#334155">1. Kamadhatu (Kaki Candi): Melambangkan dunia manusia yang masih terikat hawa nafsu duniawi.</text>
      <text x="45" y="261" font-size="9.5" fill="#334155">2. Rupadhatu (Empat Teras Berelief): Alam wujud di mana manusia mulai meninggalkan nafsu.</text>
      <text x="45" y="274" font-size="9.5" fill="#334155">3. Arupadhatu (Teras Bundar &amp; Stupa Induk): Alam tanpa wujud, lambang kesucian spiritual mutlak.</text>
    </svg>
  `,

  pelestarianSDAHutan: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 290" width="540" height="290" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
      <rect width="540" height="290" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5" />
      <rect x="15" y="8" width="510" height="28" rx="4" fill="#14532d" />
      <text x="270" y="27" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">INFOGRAFIK: PELESTARIAN HUTAN &amp; KEARIFAN LOKAL NUSANTARA</text>
      
      <!-- Kolom 1: Ancaman -->
      <rect x="25" y="45" width="155" height="155" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" />
      <text x="102" y="68" text-anchor="middle" font-size="11" font-weight="bold" fill="#991b1b">Ancaman Hutan</text>
      <text x="35" y="92" font-size="9.5" fill="#7f1d1d">• Penebangan liar (Illegal logging)</text>
      <text x="35" y="112" font-size="9.5" fill="#7f1d1d">• Kebakaran hutan cuaca kemarau</text>
      <text x="35" y="132" font-size="9.5" fill="#7f1d1d">• Alih fungsi lahan tanpa AMDAL</text>
      <text x="35" y="152" font-size="9.5" fill="#7f1d1d">• Hilangnya habitat satwa langka</text>
      <text x="35" y="172" font-size="9.5" fill="#7f1d1d">• Erosi lereng dan kekeringan air</text>
      
      <!-- Kolom 2: Upaya Konservasi -->
      <rect x="192" y="45" width="155" height="155" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
      <text x="269" y="68" text-anchor="middle" font-size="11" font-weight="bold" fill="#075985">Upaya Konservasi</text>
      <text x="202" y="92" font-size="9.5" fill="#0c4a6e">• Reboisasi kawasan kritis</text>
      <text x="202" y="112" font-size="9.5" fill="#0c4a6e">• Tebang pilih tanam Indonesia</text>
      <text x="202" y="132" font-size="9.5" fill="#0c4a6e">• Perlindungan suaka margasatwa</text>
      <text x="202" y="152" font-size="9.5" fill="#0c4a6e">• Penegakan sanksi hukum kehutanan</text>
      <text x="202" y="172" font-size="9.5" fill="#0c4a6e">• Program perhutanan sosial warga</text>
      
      <!-- Kolom 3: Kearifan Tradisional -->
      <rect x="360" y="45" width="155" height="155" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5" />
      <text x="437" y="68" text-anchor="middle" font-size="11" font-weight="bold" fill="#854d0e">Kearifan Lokal</text>
      <text x="370" y="92" font-size="9.5" fill="#713f12">• Hutan Larangan (Masyarakat Adat)</text>
      <text x="370" y="112" font-size="9.5" fill="#713f12">• Subak di Bali (Irigasi selaras)</text>
      <text x="370" y="132" font-size="9.5" fill="#713f12">• Lubuk Larangan (Sungai Sumatera)</text>
      <text x="370" y="152" font-size="9.5" fill="#713f12">• Pranata Mangsa (Pertanian Jawa)</text>
      <text x="370" y="172" font-size="9.5" fill="#713f12">• Nyabuk Gunung (Terasering Jawa)</text>
      
      <!-- Footer Prinsip SDGs -->
      <rect x="25" y="212" width="490" height="65" rx="5" fill="#ffffff" stroke="#86efac" stroke-width="1.5" />
      <text x="270" y="232" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">Prinsip Pembangunan Berkelanjutan (Sustainable Development Goals)</text>
      <text x="270" y="250" text-anchor="middle" font-size="9.5" fill="#334155">Pemanfaatan kekayaan alam harus menyeimbangkan kepentingan ekonomi, kelestarian lingkungan,</text>
      <text x="270" y="265" text-anchor="middle" font-size="9.5" fill="#334155">dan keadilan sosial demi menjamin masa depan generasi penerus bangsa.</text>
    </svg>
  `
};

export interface EducationalImageItem {
  id: string;
  title: string;
  tipe: 'peta' | 'grafik' | 'diagram' | 'foto' | 'infografik';
  dataUri: string;
}

export const EDUCATIONAL_IMAGES: Record<string, EducationalImageItem> = {
  petaWallaceWeber: {
    id: 'petaWallaceWeber',
    title: 'Peta Pembagian Wilayah Fauna Indonesia (Garis Wallace & Weber)',
    tipe: 'peta',
    dataUri: createSvgBase64(SVG_RAW.petaWallaceWeber)
  },
  kurvaPermintaanPenawaran: {
    id: 'kurvaPermintaanPenawaran',
    title: 'Kurva Keseimbangan Pasar (Permintaan & Penawaran)',
    tipe: 'grafik',
    dataUri: createSvgBase64(SVG_RAW.kurvaPermintaanPenawaran)
  },
  pelakuEkonomiCircularFlow: {
    id: 'pelakuEkonomiCircularFlow',
    title: 'Diagram Arus Melingkar 4 Pelaku Ekonomi (Circular Flow)',
    tipe: 'diagram',
    dataUri: createSvgBase64(SVG_RAW.pelakuEkonomiCircularFlow)
  },
  piramidaPenduduk: {
    id: 'piramidaPenduduk',
    title: 'Grafik Piramida Penduduk Indonesia & Peluang Bonus Demografi',
    tipe: 'grafik',
    dataUri: createSvgBase64(SVG_RAW.piramidaPenduduk)
  },
  candiPeninggalanSejarah: {
    id: 'candiPeninggalanSejarah',
    title: 'Artefak Arsitektur Candi Borobudur (Masa Mataram Kuno)',
    tipe: 'foto',
    dataUri: createSvgBase64(SVG_RAW.candiPeninggalanSejarah)
  },
  pelestarianSDAHutan: {
    id: 'pelestarianSDAHutan',
    title: 'Infografik Pelestarian Hutan, Upaya Konservasi & Kearifan Lokal',
    tipe: 'infografik',
    dataUri: createSvgBase64(SVG_RAW.pelestarianSDAHutan)
  }
};

/**
 * Mengonversi data URI SVG ke PNG Data URI murni (Base64) di peramban
 * agar 100% kompatibel saat diekspor ke Microsoft Word (.doc) dan jsPDF.
 */
export function convertSvgToPngDataUri(svgDataUri: string, width = 640, height = 320): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !svgDataUri.startsWith('data:image/svg+xml')) {
      resolve(svgDataUri);
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/png', 0.95));
            return;
          }
        } catch (e) {
          console.warn('Canvas rasterization warning:', e);
        }
        resolve(svgDataUri);
      };
      img.onerror = () => {
        resolve(svgDataUri);
      };
      img.src = svgDataUri;
    } catch {
      resolve(svgDataUri);
    }
  });
}
