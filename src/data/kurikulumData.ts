import { SchoolProfile, QuestionItem } from '../types';
import { EDUCATIONAL_IMAGES } from '../utils/imageGenerators';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  logoUrl: '', // Fallback SVG rendered in component if empty
  namaSekolah: 'SMP Negeri 2 Gumelar',
  alamatSekolah: 'Jl. Raya Gumelar No. 12, Kec. Gumelar, Kab. Banyumas, Jawa Tengah 53165',
  namaKepalaSekolah: 'Nopidha Ardyansah, S.Pd., M.Pd.',
  nipKepalaSekolah: '19820514 200801 1 009',
  namaGuru: 'Nopidha Ardyansah, S.Pd., M.Pd.',
  nipGuru: '19820514 200801 1 009',
  tahunPelajaran: '2026/2027',
  semester: 'Ganjil',
  alokasiWaktu: '90 Menit',
  jenisPenilaian: 'Asesmen Sumatif Akhir Semester (SAS)'
};

export interface KurikulumTema {
  id: string;
  kelas: '7' | '8' | '9';
  judul: string;
  capaianPembelajaran: string;
  tujuanPembelajaranPreset: string[];
}

export const TEMA_KURIKULUM_IPS: KurikulumTema[] = [
  // Kelas 7
  {
    id: 'k7-t1',
    kelas: '7',
    judul: 'Tema 01: Keberadaan Diri dan Keluarga di Tengah Lingkungan Sosial',
    capaianPembelajaran: 'Peserta didik mampu memahami keberadaan diri dan silsilah keluarga dalam lingkungan sosial terdekat, serta menerapkan nilai-nilai sosialisasi dan interaksi sosial.',
    tujuanPembelajaranPreset: [
      'Menjelaskan proses sosialisasi dalam keluarga dan masyarakat sekitar.',
      'Menganalisis pengaruh interaksi sosial terhadap pembentukan karakter dan norma sosial.',
      'Mengidentifikasi lokasi tempat tinggal melalui pemahaman peta dan koordinat geografis.'
    ]
  },
  {
    id: 'k7-t2',
    kelas: '7',
    judul: 'Tema 02: Keberagaman Lingkungan Sekitar & Potensi Alam',
    capaianPembelajaran: 'Peserta didik mampu mengidentifikasi proses terjadinya bumi, iklim Indonesia, keanekaragaman flora-fauna serta interaksi manusia dengan alam.',
    tujuanPembelajaranPreset: [
      'Menganalisis pembagian zona fauna Indonesia berdasarkan garis Wallace dan Weber.',
      'Mengevaluasi dampak perubahan iklim terhadap aktivitas pertanian dan kelautan lokal.',
      'Merancang aksi nyata pembiasaan melestarikan sumber daya air dan hutan lindung.'
    ]
  },
  {
    id: 'k7-t3',
    kelas: '7',
    judul: 'Tema 03: Potensi Ekonomi Lingkungan & Aktivitas Pelaku Usaha',
    capaianPembelajaran: 'Peserta didik memahami konsep kelangkaan, kebutuhan manusia, kegiatan ekonomi (produksi, distribusi, konsumsi), serta peran pelaku ekonomi.',
    tujuanPembelajaranPreset: [
      'Menganalisis hubungan antara kelangkaan sumber daya dengan skala prioritas kebutuhan.',
      'Menguraikan rantai distribusi barang kebutuhan pokok dari produsen ke konsumen.',
      'Menghubungkan interaksi antarwilayah berbasis keunggulan komparatif komoditas lokal.'
    ]
  },
  {
    id: 'k7-t4',
    kelas: '7',
    judul: 'Tema 04: Pemberdayaan Masyarakat & Literasi Keuangan',
    capaianPembelajaran: 'Peserta didik mampu menganalisis peran komunitas lokal, kearifan budaya daerah, dan pengelolaan keuangan keluarga secara bijak.',
    tujuanPembelajaranPreset: [
      'Menerapkan prinsip pengelolaan keuangan pribadi dan keluarga (pemasukan vs pengeluaran).',
      'Menganalisis kearifan lokal masyarakat dalam melestarikan tatanan sosial dan tradisi.',
      'Mengevaluasi program pemberdayaan UMKM lokal dalam meningkatkan kesejahteraan warga.'
    ]
  },

  // Kelas 8
  {
    id: 'k8-t1',
    kelas: '8',
    judul: 'Tema 01: Kondisi Geografis dan Pelestarian Sumber Daya Alam',
    capaianPembelajaran: 'Peserta didik mampu menganalisis letak astronomis, geografis, dan geologis Indonesia serta implikasinya terhadap sumber daya tambang, maritim, dan agraris.',
    tujuanPembelajaranPreset: [
      'Menganalisis keuntungan posisi geologis Indonesia di antara lempeng tektonik dunia.',
      'Mengevaluasi pemanfaatan potensi ekonomi maritim secara berkelanjutan tanpa merusak terumbu karang.',
      'Mengidentifikasi pola mobilitas sosial masyarakat pedesaan menuju perkotaan.'
    ]
  },
  {
    id: 'k8-t2',
    kelas: '8',
    judul: 'Tema 02: Kemajemukan Masyarakat Indonesia & Sejarah Kolonialisme',
    capaianPembelajaran: 'Peserta didik memahami pluralitas masyarakat, integrasi nasional, serta perjuangan rakyat menentang penjajahan menuju Kebangkitan Nasional 1908.',
    tujuanPembelajaranPreset: [
      'Menganalisis faktor pendorong integrasi sosial dalam masyarakat multikultural.',
      'Menjelaskan dampak monopoli perdagangan VOC dan sistem tanam paksa (Cultuurstelsel).',
      'Mengevaluasi peran Sumpah Pemuda 1928 dalam merekatkan persatuan pergerakan kebangsaan.'
    ]
  },
  {
    id: 'k8-t3',
    kelas: '8',
    judul: 'Tema 03: Nasionalisme dan Pengembangan Ekonomi Antar-Pulau',
    capaianPembelajaran: 'Peserta didik mampu menganalisis keunggulan dan keterbatasan ekonomi antardaerah, perdagangan internasional, serta semangat kemerdekaan 1945.',
    tujuanPembelajaranPreset: [
      'Menganalisis mekanisme perdagangan antar-pulau dalam menjaga stabilitas harga nasional.',
      'Menilai pengaruh kebijakan proteksi dan tarif bea masuk dalam perdagangan ekspor-impor.',
      'Meneladani semangat nasionalisme para pendiri bangsa dalam sidang BPUPKI dan PPKI.'
    ]
  },
  {
    id: 'k8-t4',
    kelas: '8',
    judul: 'Tema 04: Pembangunan Perekonomian & Bonus Demografi',
    capaianPembelajaran: 'Peserta didik mampu menganalisis dinamika kependudukan, struktur piramida penduduk, peran lembaga keuangan, dan pemerataan pembangunan daerah.',
    tujuanPembelajaranPreset: [
      'Menganalisis peluang dan tantangan Indonesia dalam menghadapi puncak Bonus Demografi.',
      'Mengidentifikasi peran Bank Sentral (BI) dan Otoritas Jasa Keuangan (OJK) dalam menjaga stabilitas moneter.',
      'Mengevaluasi kesenjangan pembangunan antara wilayah Jawa dan Luar Jawa.'
    ]
  },

  // Kelas 9
  {
    id: 'k9-t1',
    kelas: '9',
    judul: 'Tema 01: Manusia dan Perubahan Sosial di Era Modern',
    capaianPembelajaran: 'Peserta didik mampu menganalisis faktor pendorong dan penghambat perubahan sosial budaya, modernisasi, serta ketahanan kearifan lokal.',
    tujuanPembelajaranPreset: [
      'Menganalisis dampak globalisasi terhadap gaya hidup, pola konsumsi, dan jati diri remaja.',
      'Mengevaluasi strategi melestarikan budaya dan kearifan lokal di tengah arus westernisasi.',
      'Mengidentifikasi bentuk disorganisasi sosial dan upaya resolusi konflik sosial di masyarakat.'
    ]
  },
  {
    id: 'k9-t2',
    kelas: '9',
    judul: 'Tema 02: Perkembangan Ekonomi Digital dan Kewirausahaan Masa Depan',
    capaianPembelajaran: 'Peserta didik memahami transformasi ekonomi digital, sistem pembayaran non-tunai, marketplace, literasi keamanan siber, dan fintech.',
    tujuanPembelajaranPreset: [
      'Menganalisis manfaat transaksi QRIS dan dompet digital dalam percepatan sirkulasi uang.',
      'Merancang rencana kewirausahaan digital berbasis pemanfaatan media sosial dan marketplace.',
      'Mengevaluasi risiko penipuan online, pinjaman online ilegal, dan pentingnya literasi finansial digital.'
    ]
  },
  {
    id: 'k9-t3',
    kelas: '9',
    judul: 'Tema 03: Tantangan Pembangunan Berkelanjutan (SDGs) di Indonesia',
    capaianPembelajaran: 'Peserta didik mampu menganalisis isu ketimpangan sosial, pengelolaan sampah, energi terbarukan, dan komitmen target SDGs 2030.',
    tujuanPembelajaranPreset: [
      'Menganalisis implementasi energi terbarukan (surya, angin, geotermal) sebagai solusi krisis energi fosil.',
      'Mengevaluasi penanganan masalah sampah perkotaan dengan prinsip sirkular ekonomi (3R).',
      'Merumuskan ide solutif untuk mengurangi kesenjangan ekonomi di lingkungan sekitar tempat tinggal.'
    ]
  },
  {
    id: 'k9-t4',
    kelas: '9',
    judul: 'Tema 04: Kerja Sama Dunia & Peran Diplomasi Indonesia',
    capaianPembelajaran: 'Peserta didik mampu menganalisis peran diplomasi Indonesia dalam perdamaian dunia, organisasi regional (ASEAN), dan forum multilateral (G20, PBB).',
    tujuanPembelajaranPreset: [
      'Menilai kontribusi politik luar negeri bebas aktif Indonesia dalam Konferensi Asia Afrika (KAA) dan GNB.',
      'Menganalisis manfaat integrasi Masyarakat Ekonomi ASEAN (MEA) bagi tenaga kerja terampil Indonesia.',
      'Mengevaluasi peran strategis Indonesia sebagai presidensi forum internasional dalam penyelesaian isu global.'
    ]
  }
];

export const INITIAL_QUESTION_BANK: QuestionItem[] = [
  // 1. Pilihan Ganda (Dengan Gambar Peta Wallace & Weber) - HOTS
  {
    id: 'soal-1',
    nomorSoal: 1,
    type: 'pilihan_ganda',
    tingkatKesulitan: 'HOTS',
    pengalamanBelajar: 'Mengaplikasi',
    capaianPembelajaran: 'Peserta didik mampu mengidentifikasi proses keanekaragaman flora-fauna dan biogeografi Indonesia.',
    tujuanPembelajaran: 'Menganalisis pembagian zona fauna Indonesia berdasarkan garis Wallace dan Weber.',
    materi: 'Keberagaman Lingkungan Alam: Garis Wallace & Weber',
    indikatorSoal: 'Disajikan peta biogeografi Indonesia, peserta didik dapat menganalisis karakteristik fauna di zona peralihan dengan tepat.',
    stimulus: 'Kondisi geografis Indonesia yang berada di antara dua benua dan dua dangkalan purba (Paparan Sunda dan Paparan Sahul) menciptakan keunikan persebaran makhluk hidup. Perhatikan peta pembagian wilayah fauna di bawah ini!',
    gambar: {
      url: EDUCATIONAL_IMAGES.petaWallaceWeber.dataUri,
      caption: 'Gambar 1. Peta Garis Wallace dan Garis Weber Pembagi Zona Fauna Indonesia',
      tipe: 'peta'
    },
    pertanyaan: 'Berdasarkan garis khayal yang digambarkan oleh Alfred Russel Wallace dan Max Weber pada peta tersebut, wilayah fauna Kepulauan Sulawesi, Maluku, dan Nusa Tenggara dikelompokkan ke dalam zona peralihan. Ciri utama hewan yang mendiami kawasan zona peralihan tersebut adalah...',
    opsi: [
      'Memiliki kemiripan fisik dengan mamalia besar yang ada di daratan Benua Asia seperti gajah dan badak bercula.',
      'Merupakan satwa endemik khas kepulauan yang tidak ditemukan di belahan benua Asia maupun Australia, seperti anoa, babirusa, dan burung maleo.',
      'Didominasi oleh binatang berkantung (marsupialia) dan burung dengan warna bulu mencolok seperti cenderawasih.',
      'Hanya terdiri atas hewan mamalia air tawar yang bermigrasi musiman dari Samudra Hindia ke Samudra Pasifik.'
    ],
    kunciJawaban: 'B',
    bobotSkor: 15,
    pembahasan: 'Zona peralihan (Wallacea) dibatasi oleh Garis Wallace di barat dan Garis Weber di timur. Wilayah ini meliputi Sulawesi, Maluku, dan Nusa Tenggara yang memiliki fauna endemik unik (anoa, babirusa, komodo, burung maleo) yang tidak dijumpai di kawasan Asiatis maupun Australis.',
    bukuSumber: 'Buku Siswa IPS SMP Kelas VII Kemendikbudristek (Kurikulum Merdeka), Bab II Lingkungan Sekitar.'
  },

  // 2. Pilihan Ganda (Dengan Gambar Kurva Ekuilibrium Pasar) - MOTS
  {
    id: 'soal-2',
    nomorSoal: 2,
    type: 'pilihan_ganda',
    tingkatKesulitan: 'MOTS',
    pengalamanBelajar: 'Memahami',
    capaianPembelajaran: 'Peserta didik memahami konsep kelangkaan, permintaan, penawaran, dan terbentuknya harga pasar.',
    tujuanPembelajaran: 'Menganalisis mekanisme terbentuknya harga keseimbangan pasar (ekuilibrium).',
    materi: 'Aktivitas Ekonomi: Permintaan, Penawaran, dan Harga Keseimbangan',
    indikatorSoal: 'Disajikan grafik kurva permintaan dan penawaran, peserta didik dapat menentukan kondisi titik temu ekuilibrium pasar.',
    stimulus: 'Di sebuah pasar tradisional di Kabupaten Banyumas, terjadi interaksi transaksi jual beli komoditas cabai merah antara pedagang dan pembeli setiap pagi. Perhatikan grafik pembentukan harga pasar berikut!',
    gambar: {
      url: EDUCATIONAL_IMAGES.kurvaPermintaanPenawaran.dataUri,
      caption: 'Gambar 2. Kurva Keseimbangan Harga dan Jumlah Barang di Pasar',
      tipe: 'grafik'
    },
    pertanyaan: 'Titik E (Ekuilibrium) pada grafik di atas terbentuk pada perpotongan antara kurva permintaan (D) dan kurva penawaran (S). Kondisi ekonomi yang terjadi secara tepat pada titik E tersebut adalah...',
    opsi: [
      'Jumlah barang yang diminta pembeli sama persis dengan jumlah barang yang ditawarkan pedagang pada tingkat harga tertentu.',
      'Terjadi kelebihan penawaran (surplus) karena penjual menetapkan harga di atas kemampuan rata-rata pembeli.',
      'Pemerintah memberikan subsidi penuh kepada pembeli sehingga harga cabai turun hingga mencapai nilai nol rupiah.',
      'Jumlah barang yang ditawarkan produsen jauh lebih sedikit dibandingkan jumlah pembeli yang membutuhkan barang.'
    ],
    kunciJawaban: 'A',
    bobotSkor: 15,
    pembahasan: 'Titik ekuilibrium (keseimbangan pasar) terjadi ketika perpotongan kurva permintaan (Demand) dan kurva penawaran (Supply) tercapai, di mana kuantitas barang yang diminta pembeli (Qd) sama dengan kuantitas yang ditawarkan pedagang (Qs) pada tingkat harga keseimbangan (Pe).',
    bukuSumber: 'Buku Siswa IPS SMP Kelas VII & VIII Kemendikbudristek, Bab Potensi Ekonomi.'
  },

  // 3. Pilihan Ganda Kompleks - HOTS
  {
    id: 'soal-3',
    nomorSoal: 3,
    type: 'pilihan_ganda_kompleks',
    tingkatKesulitan: 'HOTS',
    pengalamanBelajar: 'Merefleksi',
    capaianPembelajaran: 'Peserta didik mampu menganalisis dinamika kependudukan dan tantangan pembangunan Indonesia.',
    tujuanPembelajaran: 'Mengevaluasi peluang strategis Indonesia dalam memanfaatkan Bonus Demografi.',
    materi: 'Dinamika Kependudukan dan Pembangunan Nasional',
    indikatorSoal: 'Disajikan data narasi tentang piramida penduduk, peserta didik dapat menentukan pernyataan-pernyataan yang benar mengenai strategi optimalisasi bonus demografi.',
    stimulus: 'Berdasarkan data Badan Pusat Statistik (BPS), Indonesia saat ini tengah memasuki era Bonus Demografi, di mana proporsi penduduk usia produktif (15–64 tahun) mencapai lebih dari 68% dari total populasi. Fenomena ini diperkirakan mencapai puncaknya hingga dekade mendatang. Keberhasilan memanfaatkan bonus demografi akan membawa Indonesia keluar dari jebakan pendapatan menengah (middle-income trap).',
    gambar: {
      url: EDUCATIONAL_IMAGES.piramidaPenduduk.dataUri,
      caption: 'Gambar 3. Grafik Struktur Usia Penduduk dan Peluang Bonus Demografi',
      tipe: 'grafik'
    },
    pertanyaan: 'Berdasarkan narasi dan grafik di atas, manakah langkah-langkah strategis yang BENAR dan realistis bagi pemerintah serta generasi muda untuk mengoptimalkan potensi bonus demografi tersebut? (Pilihlah lebih dari satu jawaban yang benar!)',
    opsi: [
      'Meningkatkan mutu pendidikan vokasi, pelatihan keterampilan digital, dan sertifikasi keahlian bagi angkatan kerja muda.',
      'Mendorong iklim kewirausahaan (entrepreneurship) berbasis UMKM dan ekonomi kreatif agar tercipta banyak lapangan kerja baru.',
      'Membatasi partisipasi kaum perempuan dalam dunia kerja formal guna menekan angka persaingan kerja.',
      'Memperluas akses layanan kesehatan gizi dan pencegahan stunting sejak usia dini guna menghasilkan generasi yang sehat dan cerdas.'
    ],
    kunciJawaban: 'Pilihan (A), (B), dan (D)',
    bobotSkor: 15,
    pembahasan: 'Kunci keberhasilan bonus demografi bertumpu pada kualitas SDM (pendidikan vokasi/keahlian digital), keterbukaan lapangan kerja (kewirausahaan dan UMKM), serta kesehatan fisik (pengentasan stunting). Membatasi peran perempuan (opsi C) justru merugikan produktivitas nasional.',
    bukuSumber: 'Buku Panduan Guru IPS SMP Kelas VIII & IX Kurikulum Merdeka.'
  },

  // 4. Menjodohkan (Matching) - MOTS
  {
    id: 'soal-4',
    nomorSoal: 4,
    type: 'menjodohkan',
    tingkatKesulitan: 'MOTS',
    pengalamanBelajar: 'Mengaplikasi',
    capaianPembelajaran: 'Peserta didik mampu menghubungkan peran 4 pelaku ekonomi dalam kegiatan perekonomian nasional.',
    tujuanPembelajaran: 'Menjodohkan pelaku ekonomi dengan peran utamanya dalam circular flow diagram.',
    materi: 'Pelaku Ekonomi dan Perannya dalam Perekonomian',
    indikatorSoal: 'Disajikan tabel dua kolom, peserta didik dapat menjodohkan peran pelaku ekonomi dengan pihak yang bertanggung jawab secara tepat.',
    stimulus: 'Dalam kehidupan sehari-hari, empat pelaku ekonomi (RTK, RTP, Pemerintah/RTN, dan Masyarakat Luar Negeri) saling berinteraksi membentuk arus melingkar pendapatan dan barang/jasa.',
    gambar: {
      url: EDUCATIONAL_IMAGES.pelakuEkonomiCircularFlow.dataUri,
      caption: 'Gambar 4. Circular Flow Diagram Interaksi Empat Pelaku Ekonomi',
      tipe: 'diagram'
    },
    pertanyaan: 'Jodohkanlah peran kegiatan ekonomi pada Kolom A (Sebelah Kiri) dengan Pelaku Ekonomi yang tepat pada Kolom B (Sebelah Kanan)!',
    menjodohkanPairs: [
      {
        premis: '1. Menyediakan faktor produksi (tanah, tenaga kerja, modal) dan menerima balas jasa berupa sewa, upah, bunga, laba.',
        respon: 'Rumah Tangga Konsumen (RTK)'
      },
      {
        premis: '2. Mengombinasikan faktor produksi untuk menghasilkan barang dan jasa yang dibutuhkan masyarakat.',
        respon: 'Rumah Tangga Produsen (RTP)'
      },
      {
        premis: '3. Menarik pajak dan membelanjakannya untuk subsidi, jaminan sosial, serta pembangunan fasilitas umum.',
        respon: 'Pemerintah / Rumah Tangga Negara (RTN)'
      },
      {
        premis: '4. Melakukan kegiatan ekspor komoditas unggulan dan impor barang yang belum dapat diproduksi di dalam negeri.',
        respon: 'Masyarakat Luar Negeri (MLN)'
      }
    ],
    kunciJawaban: '1 -> RTK; 2 -> RTP; 3 -> Pemerintah/RTN; 4 -> Masyarakat Luar Negeri',
    bobotSkor: 15,
    pembahasan: 'Pasangan peran dan pelaku ekonomi: RTK adalah pemilik faktor produksi; RTP penghasil output barang/jasa; Pemerintah regulator fiskal/pajak; Masyarakat Luar Negeri mitra ekspor/impor.',
    bukuSumber: 'Buku IPS SMP Kelas VIII Kemendikbudristek, Bab Pelaku Ekonomi.'
  },

  // 5. Benar - Salah - LOTS / MOTS
  {
    id: 'soal-5',
    nomorSoal: 5,
    type: 'benar_salah',
    tingkatKesulitan: 'LOTS',
    pengalamanBelajar: 'Memahami',
    capaianPembelajaran: 'Peserta didik memahami peninggalan peradaban masa Hindu-Buddha dan Islam di Nusantara.',
    tujuanPembelajaran: 'Mengidentifikasi peninggalan bersejarah dan nilai kearifan leluhur nusantara.',
    materi: 'Kehidupan Masyarakat Masa Kerajaan Tradisional',
    indikatorSoal: 'Disajikan tabel pernyataan sejarah, peserta didik dapat menentukan kebenaran pernyataan terkait candi dan peradaban Mataram Kuno.',
    stimulus: 'Peradaban Mataram Kuno di Jawa Tengah meninggalkan mahakarya arsitektur batu berundak yang memadukan ajaran agama dengan filosofi kearifan arsitektur lokal Nusantara.',
    gambar: {
      url: EDUCATIONAL_IMAGES.candiPeninggalanSejarah.dataUri,
      caption: 'Gambar 5. Struktur Bangunan Berundak Candi Borobudur di Jawa Tengah',
      tipe: 'foto'
    },
    pertanyaan: 'Tentukanlah apakah masing-masing pernyataan berikut bernilai BENAR atau SALAH berdasarkan fakta sejarah dan arsitektur peradaban Mataram Kuno!',
    pernyataanBenarSalah: [
      {
        pernyataan: 'Candi Borobudur dibangun pada masa Dinasti Syailendra yang bercorak agama Buddha Mahayana.',
        jawaban: 'Benar',
        alasan: 'Didirikan sekitar abad ke-8 hingga ke-9 Masehi di bawah naungan raja-raja Wangsa Syailendra.'
      },
      {
        pernyataan: 'Struktur stupa Arupadhatu yang berada di puncak teratas menggambarkan alam manusia yang masih terbelenggu nafsu duniawi.',
        jawaban: 'Salah',
        alasan: 'Arupadhatu melambangkan alam tanpa rupa/tanpa wujud, yaitu puncak kesucian spiritual tertinggi bebas nafsu.'
      },
      {
        pernyataan: 'Pembangunan Candi Prambanan dan Candi Borobudur membuktikan adanya toleransi dan keharmonisan antarumat beragama di Jawa Tengah masa lampau.',
        jawaban: 'Benar',
        alasan: 'Masyarakat Dinasti Sanjaya (Hindu) dan Syailendra (Buddha) hidup berdampingan secara rukun bahkan terjadi pernikahan politik.'
      }
    ],
    kunciJawaban: '1 = BENAR, 2 = SALAH, 3 = BENAR',
    bobotSkor: 15,
    pembahasan: 'Pernyataan 1 Benar (Syailendra - Buddha). Pernyataan 2 Salah (Arupadhatu adalah puncak kesempurnaan tanpa hawa nafsu; hawa nafsu ada di Kamadhatu). Pernyataan 3 Benar (Simbol toleransi kuno).',
    bukuSumber: 'Buku IPS SMP Kelas VII Kemendikbudristek, Bab Sejarah Peradaban Kuno.'
  },

  // 6. Isian Singkat - MOTS
  {
    id: 'soal-6',
    nomorSoal: 6,
    type: 'isian_singkat',
    tingkatKesulitan: 'MOTS',
    pengalamanBelajar: 'Mengaplikasi',
    capaianPembelajaran: 'Peserta didik memahami perkembangan teknologi finansial dan transaksi ekonomi masa kini.',
    tujuanPembelajaran: 'Menjelaskan sistem pembayaran digital nasional yang berlaku di Indonesia.',
    materi: 'Transformasi Ekonomi Digital: Sistem Pembayaran Non-Tunai',
    indikatorSoal: 'Peserta didik dapat menyebutkan nama standar kode batang dua dimensi nasional untuk pembayaran digital di Indonesia.',
    stimulus: 'Saat ini, warung kelontong, pedagang pasar tradisional, hingga gerai modern di berbagai daerah di Indonesia menggunakan stiker kode matriks dua dimensi yang distandardisasi oleh Bank Indonesia dan ASPI. Pembeli cukup memindai kode tersebut menggunakan aplikasi dompet digital atau mobile banking dari bank mana pun tanpa perlu membawa uang tunai fisik.',
    pertanyaan: 'Standar kode matriks dua dimensi nasional yang diterbitkan oleh Bank Indonesia untuk mengintegrasikan semua aplikasi pembayaran non-tunai di seluruh Indonesia dikenal dengan singkatan...',
    kunciJawaban: 'QRIS (Quick Response Code Indonesian Standard)',
    bobotSkor: 10,
    pembahasan: 'QRIS (dibaca KRIS) merupakan singkatan dari Quick Response Code Indonesian Standard, yaitu standarisasi pembayaran digital menggunakan metode QR Code yang diluncurkan oleh Bank Indonesia pada 17 Agustus 2019.',
    bukuSumber: 'Buku IPS SMP Kelas IX Kurikulum Merdeka, Bab Ekonomi Digital.'
  },

  // 7. Uraian Komprehensif (Dengan Infografis Pelestarian Alam) - HOTS
  {
    id: 'soal-7',
    nomorSoal: 7,
    type: 'uraian',
    tingkatKesulitan: 'HOTS',
    pengalamanBelajar: 'Merefleksi',
    capaianPembelajaran: 'Peserta didik mampu merumuskan solusi atas permasalahan lingkungan dan melestarikan kearifan lokal.',
    tujuanPembelajaran: 'Merancang aksi solutif pelestarian sumber daya hutan berbasis kearifan lokal.',
    materi: 'Pembangunan Berkelanjutan dan Kearifan Lokal',
    indikatorSoal: 'Disajikan infografik mengenai tantangan hutan dan kearifan lokal, peserta didik dapat menguraikan 3 solusi konkret pelestarian alam yang relevan diterapkan di daerahnya.',
    stimulus: 'Degradasi kawasan hutan dan alih fungsi lahan yang tidak terkendali menimbulkan ancaman nyata berupa banjir bandang, kekeringan, dan berkurangnya cadangan mata air bersih. Di sisi lain, para leluhur Nusantara telah mewariskan beragam kearifan lokal dalam menjaga kesucian hutan lindung. Cermatilah infografik berikut!',
    gambar: {
      url: EDUCATIONAL_IMAGES.pelestarianSDAHutan.dataUri,
      caption: 'Gambar 6. Infografik Ancaman Hutan, Upaya Konservasi, dan Kearifan Tradisional',
      tipe: 'infografik'
    },
    pertanyaan: 'Sebagai seorang pelajar generasi penerus di wilayah Kabupaten Banyumas/Jawa Tengah, uraikanlah analisis Anda mengenai:\na. Dua penyebab utama kerusakan kawasan resapan air di daerah perbukitan/pegunungan!\nb. Bagaimana cara mengintegrasikan nilai kearifan lokal masyarakat (seperti tradisi hutan larangan/hutan lindung desa) ke dalam aksi nyata para pelajar dan warga sekolah saat ini?\nc. Rancanglah satu program kegiatan sederhana dan realistis yang dapat dilakukan oleh OSIS sekolah Anda untuk menjaga kelestarian lingkungan sekitar!',
    kunciJawaban: 'Pedoman Penilaian Uraian Terperinci Tercantum pada Rubrik Penskoran.',
    rubrikUraian: [
      { kriteria: 'Menyebutkan dan menjelaskan 2 penyebab kerusakan kawasan resapan air (alih fungsi lahan, penebangan tak terkontrol, kurangnya terasering).', skor: 4 },
      { kriteria: 'Menghubungkan filosofi kearifan lokal dengan sikap hormat terhadap alam pada kehidupan modern secara logis dan runtut.', skor: 5 },
      { kriteria: 'Merumuskan ide program aksi OSIS sekolah yang realistis, aplikatif, dan berdampak nyata (misal: Gerakan Sedekah Pohon, Adiwiyata, Bank Sampah).', skor: 6 }
    ],
    bobotSkor: 15,
    pembahasan: 'Jawaban yang diharapkan mencakup: (a) Analisis antropogenik alih fungsi lereng bukit menjadi perkebunan monokultur tanpa penahan erosi; (b) Menanamkan kesadaran bahwa merawat pohon adalah menjaga keselamatan bersama; (c) Program nyata seperti pembuatan lubang biopori di sekolah dan pembibitan tanaman keras lokal.',
    bukuSumber: 'Buku Siswa IPS SMP Kelas VII & IX Kemendikbudristek.'
  }
];
