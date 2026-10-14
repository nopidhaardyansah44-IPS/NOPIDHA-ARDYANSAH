import {
  GeneratorFormState,
  QuestionItem,
  QuestionType,
  CognitiveLevel,
  LearningExperience
} from '../types';
import { TEMA_KURIKULUM_IPS } from '../data/kurikulumData';
import { EDUCATIONAL_IMAGES } from './imageGenerators';

/**
 * Mesin Generator Soal IPS SMP Kurikulum Merdeka
 * Memproduksi butir soal heterogen, variatif, dan selaras dengan capaian pembelajaran.
 * Menjamin butir soal bergambar memiliki ilustrasi bermutu tinggi yang 100% tampil dan terunduh.
 */
export async function generateQuestionSet(
  form: GeneratorFormState,
  existingQuestions: QuestionItem[]
): Promise<QuestionItem[]> {
  const selectedTema = TEMA_KURIKULUM_IPS.find((t) => t.id === form.temaId) || TEMA_KURIKULUM_IPS[0];
  const activeTypes = (Object.keys(form.bentukSoalConfig) as QuestionType[]).filter(
    (t) => form.bentukSoalConfig[t].enabled
  );

  // Jika tidak ada bentuk soal yang dipilih, default ke pilihan ganda
  if (activeTypes.length === 0) {
    activeTypes.push('pilihan_ganda');
  }

  // Coba panggil server-side Gemini terlebih dahulu jika memungkinkan
  try {
    const totalSoalPerBentuk: Record<string, number> = {};
    activeTypes.forEach((t) => {
      totalSoalPerBentuk[t] = form.bentukSoalConfig[t].count || 5;
    });

    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kelas: form.kelas,
        temaJudul: selectedTema.judul,
        topikMateri: form.topikMateri || selectedTema.judul,
        tujuanPembelajaran: form.tujuanPembelajaran || selectedTema.capaianPembelajaran,
        bentukSoalList: activeTypes,
        tingkatKesulitanList: form.tingkatKesulitan,
        pengalamanBelajarList: form.pengalamanBelajar,
        totalSoalPerBentuk: totalSoalPerBentuk,
        soalBergambarEnabled: form.soalBergambarEnabled,
        jumlahSoalBergambar: form.jumlahSoalBergambar
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        return formatAiGeneratedQuestions(data.questions, form, selectedTema);
      }
    }
  } catch (error) {
    console.warn('Pemanggilan server Gemini beralih ke generator kurikulum bawaan:', error);
  }

  // Fallback: Generator Kurikulum Cerdas Bawaan (Heterogen, Kaya, Cepat & Pasti Berhasil)
  return generateDeterministicQuestions(form, selectedTema, activeTypes);
}

function formatAiGeneratedQuestions(
  rawList: any[],
  form: GeneratorFormState,
  tema: any
): QuestionItem[] {
  const imageKeys = Object.keys(EDUCATIONAL_IMAGES);
  let imageCounter = 0;
  const maxImages = form.soalBergambarEnabled ? form.jumlahSoalBergambar : 0;

  const result: QuestionItem[] = rawList.map((q, idx) => {
    const nomor = idx + 1;
    let gambarObj = null;

    if (imageCounter < maxImages && (q.hasVisualImage || idx % 2 === 0 || imageCounter === idx)) {
      const imgKey = imageKeys[imageCounter % imageKeys.length];
      const imgTemplate = (EDUCATIONAL_IMAGES as any)[imgKey];
      gambarObj = {
        url: imgTemplate.dataUri,
        caption: `Gambar ${imageCounter + 1}. ${imgTemplate.title}`,
        tipe: imgTemplate.tipe
      };
      imageCounter++;
    }

    return {
      id: `ai-soal-${Date.now()}-${nomor}`,
      nomorSoal: nomor,
      type: (q.type as QuestionType) || 'pilihan_ganda',
      tingkatKesulitan: (q.tingkatKesulitan as CognitiveLevel) || 'MOTS',
      pengalamanBelajar: (q.pengalamanBelajar as LearningExperience) || 'Mengaplikasi',
      capaianPembelajaran: q.capaianPembelajaran || tema.capaianPembelajaran,
      tujuanPembelajaran: q.tujuanPembelajaran || form.tujuanPembelajaran || 'Menganalisis konsep IPS dalam kehidupan bermasyarakat.',
      materi: q.materi || form.topikMateri || tema.judul,
      indikatorSoal: q.indikatorSoal || `Peserta didik mampu menganalisis materi ${q.materi || tema.judul} dengan tepat.`,
      stimulus: q.stimulus || (gambarObj ? `Perhatikan ${gambarObj.caption} di bawah ini untuk menjawab pertanyaan berikut!` : undefined),
      gambar: gambarObj,
      pertanyaan: q.pertanyaan || 'Jelaskan fenomena berikut...',
      opsi: q.opsi || (q.type === 'pilihan_ganda' ? ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'] : undefined),
      kunciJawaban: q.kunciJawaban || 'A',
      bobotSkor: q.bobotSkor || 10,
      pembahasan: q.pembahasan || 'Pembahasan mendalam sesuai konsep IPS.',
      bukuSumber: q.bukuSumber || `Buku Panduan Guru & Siswa IPS SMP Kelas ${form.kelas} Kemendikbudristek`,
      rubrikUraian: q.type === 'uraian' ? [
        { kriteria: 'Menyajikan analisis awal yang tepat dan relevan', skor: 4 },
        { kriteria: 'Menyampaikan data atau contoh nyata di masyarakat', skor: 4 },
        { kriteria: 'Memberikan kesimpulan dan rekomendasi solutif', skor: 7 }
      ] : undefined
    };
  });

  return normalizeScoresTo100(result);
}

function generateDeterministicQuestions(
  form: GeneratorFormState,
  tema: any,
  activeTypes: QuestionType[]
): QuestionItem[] {
  const result: QuestionItem[] = [];
  const imageKeys = Object.keys(EDUCATIONAL_IMAGES);
  let imageCounter = 0;
  const maxImages = form.soalBergambarEnabled ? form.jumlahSoalBergambar : 0;

  let currentNumber = 1;

  activeTypes.forEach((type) => {
    const count = form.bentukSoalConfig[type].count || 5;

    for (let i = 0; i < count; i++) {
      // Pilih tingkat kesulitan berputar dari yang dipilih user
      const cognitiveLevels = form.tingkatKesulitan.length > 0 ? form.tingkatKesulitan : (['LOTS', 'MOTS', 'HOTS'] as CognitiveLevel[]);
      const diff = cognitiveLevels[i % cognitiveLevels.length];

      // Pilih pengalaman belajar berputar dari yang dipilih user
      const expLevels = form.pengalamanBelajar.length > 0 ? form.pengalamanBelajar : (['Memahami', 'Mengaplikasi', 'Merefleksi'] as LearningExperience[]);
      const exp = expLevels[i % expLevels.length];

      // Berikan gambar jika kuota soal bergambar masih tersedia
      let gambarObj = null;
      let selectedImageKey = '';
      if (imageCounter < maxImages) {
        selectedImageKey = imageKeys[imageCounter % imageKeys.length];
        const imgTemplate = (EDUCATIONAL_IMAGES as any)[selectedImageKey];
        gambarObj = {
          url: imgTemplate.dataUri,
          caption: `Gambar ${imageCounter + 1}. ${imgTemplate.title}`,
          tipe: imgTemplate.tipe
        };
        imageCounter++;
      }

      // Variasi stimulus dan materi IPS yang kaya & heterogen
      const question = createCurriculumItem(
        type,
        currentNumber,
        diff,
        exp,
        form.kelas,
        tema,
        form.topikMateri,
        form.tujuanPembelajaran,
        gambarObj,
        selectedImageKey,
        i
      );

      result.push(question);
      currentNumber++;
    }
  });

  return normalizeScoresTo100(result);
}

function createCurriculumItem(
  type: QuestionType,
  no: number,
  diff: CognitiveLevel,
  exp: LearningExperience,
  kelas: string,
  tema: any,
  customTopic: string,
  customTP: string,
  gambar: any,
  selectedImageKey: string,
  variationIndex: number
): QuestionItem {
  const topic = customTopic || tema.judul;
  const tp = customTP || tema.tujuanPembelajaranPreset[variationIndex % tema.tujuanPembelajaranPreset.length] || tema.capaianPembelajaran;

  const baseItem: QuestionItem = {
    id: `soal-gen-${Date.now()}-${no}`,
    nomorSoal: no,
    type,
    tingkatKesulitan: diff,
    pengalamanBelajar: exp,
    capaianPembelajaran: tema.capaianPembelajaran,
    tujuanPembelajaran: tp,
    materi: topic,
    indikatorSoal: `Disajikan konteks ${topic.toLowerCase()}, peserta didik mampu ${exp.toLowerCase()} konsep dengan tingkat penalaran ${diff}.`,
    stimulus: '',
    pertanyaan: '',
    kunciJawaban: '',
    bobotSkor: 10,
    pembahasan: '',
    bukuSumber: `Buku Siswa IPS SMP Kelas ${kelas} Kemendikbudristek Kurikulum Merdeka.`,
    gambar: gambar
  };

  // KASUS 1: BUTIR SOAL BERGAMBAR
  // Pertanyaan dan stimulus secara khusus dan kontekstual menguji isi gambar
  if (gambar && selectedImageKey) {
    if (selectedImageKey === 'petaWallaceWeber') {
      baseItem.materi = 'Biogeografi Indonesia: Garis Wallace & Weber';
      baseItem.stimulus = 'Kondisi geografis Indonesia yang berada di antara dua paparan dangkalan purba (Paparan Sunda dan Paparan Sahul) memicu keunikan flora dan fauna nusantara. Cermatilah peta garis khayal biogeografi di bawah ini!';
      baseItem.pertanyaan = 'Berdasarkan garis khayal pembagi fauna pada peta tersebut, wilayah fauna Kepulauan Sulawesi, Maluku, dan Nusa Tenggara dikelompokkan ke dalam zona peralihan (Wallacea). Karakteristik satwa yang mendiami kawasan zona peralihan tersebut adalah...';
      baseItem.opsi = [
        'Memiliki kesamaan ciri fisik dengan mamalia besar di daratan Asia seperti gajah dan badak bercula.',
        'Merupakan satwa endemik khas kepulauan yang tidak dijumpai di benua Asia maupun Australia, seperti anoa, babirusa, dan burung maleo.',
        'Didominasi oleh binatang berkantung (marsupialia) dan burung berbulu indah seperti cenderawasih.',
        'Hanya terdiri atas hewan mamalia air tawar yang bermigrasi musiman dari Samudra Hindia ke Samudra Pasifik.'
      ];
      baseItem.kunciJawaban = 'B';
      baseItem.pembahasan = 'Zona peralihan (Wallacea) dibatasi oleh Garis Wallace di barat dan Garis Weber di timur, mencakup Sulawesi, Maluku, dan Nusa Tenggara dengan satwa endemik unik (anoa, babirusa, burung maleo, komodo).';
      return baseItem;
    }

    if (selectedImageKey === 'kurvaPermintaanPenawaran') {
      baseItem.materi = 'Mekanisme Pasar: Kurva Ekuilibrium Permintaan & Penawaran';
      baseItem.stimulus = 'Di pasar tradisional Kabupaten Banyumas, terjadi interaksi tawar-menawar harga komoditas pokok antara pedagang dan pembeli. Perhatikan grafik pembentukan harga keseimbangan berikut!';
      baseItem.pertanyaan = 'Titik E (Ekuilibrium) pada grafik di atas terbentuk pada perpotongan kurva permintaan (D) dan penawaran (S). Kondisi ekonomi yang terjadi secara tepat pada titik E tersebut adalah...';
      baseItem.opsi = [
        'Jumlah barang yang diminta pembeli sama persis dengan jumlah barang yang ditawarkan pedagang pada tingkat harga tertentu.',
        'Terjadi kelebihan penawaran (surplus) karena penjual mematok harga jauh di atas kemampuan rata-rata pembeli.',
        'Pemerintah memberikan subsidi total kepada pembeli sehingga harga komoditas turun drastis hingga nol rupiah.',
        'Jumlah barang yang ditawarkan produsen jauh lebih sedikit dibandingkan kebutuhan seluruh pembeli di pasar.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan = 'Titik ekuilibrium tercapai saat kuantitas permintaan (Qd) seimbang dengan kuantitas penawaran (Qs) pada harga keseimbangan (Pe).';
      return baseItem;
    }

    if (selectedImageKey === 'pelakuEkonomiCircularFlow') {
      baseItem.materi = 'Interaksi Pelaku Ekonomi (Circular Flow Diagram)';
      baseItem.stimulus = 'Aktivitas perekonomian digerakkan oleh interaksi timbal balik antara rumah tangga konsumen, produsen, pemerintah, dan masyarakat luar negeri. Perhatikan bagan arus kegiatan ekonomi berikut!';
      baseItem.pertanyaan = 'Berdasarkan bagan arus melingkar di atas, arus barang/jasa dan faktor produksi yang ditunjukkan oleh hubungan antara Rumah Tangga Konsumen (RTK) dan Rumah Tangga Produsen (RTP) adalah...';
      baseItem.opsi = [
        'RTK menyerahkan faktor produksi (tenaga kerja, tanah, modal) ke RTP dan menerima imbalan berupa upah, sewa, dan laba.',
        'RTP memberikan subsidi dan pajak gratis kepada seluruh masyarakat tanpa melalui mekanisme pasar.',
        'RTK hanya membeli barang dari luar negeri tanpa mengonsumsi barang buatan pabrik dalam negeri.',
        'Pemerintah menguasai seluruh faktor produksi sehingga RTK dan RTP tidak memiliki peran ekonomi mandiri.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan = 'RTK adalah penyedia faktor produksi bagi RTP, dan menerima pendapatan (rent, wage, interest, profit) yang digunakan untuk membeli output barang/jasa dari RTP.';
      return baseItem;
    }

    if (selectedImageKey === 'piramidaPenduduk') {
      baseItem.materi = 'Dinamika Kependudukan & Puncak Bonus Demografi';
      baseItem.stimulus = 'Berdasarkan sensus Badan Pusat Statistik (BPS), Indonesia tengah berada pada periode struktur penduduk yang sangat menguntungkan. Cermatilah grafik komposisi piramida penduduk di bawah ini!';
      baseItem.pertanyaan = 'Berdasarkan struktur usia pada grafik piramida penduduk tersebut, fenomena Bonus Demografi yang dialami Indonesia ditandai dengan kondisi...';
      baseItem.opsi = [
        'Jumlah penduduk usia produktif (15–64 tahun) mendominasi secara signifikan dibandingkan usia non-produktif (0–14 tahun dan 65+ tahun).',
        'Tingkat kelahiran bayi melesat tinggi melampaui jumlah seluruh angkatan kerja dewasa di perkotaan.',
        'Jumlah lansia di atas 65 tahun lebih banyak daripada jumlah usia anak-anak dan remaja sekolah.',
        'Terjadinya penurunan drastis jumlah tenaga kerja terampil di sektor industri manufaktur.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan = 'Bonus demografi adalah kondisi di mana rasio ketergantungan (dependency ratio) rendah karena kelompok usia produktif (15-64 tahun) mencapai lebih dari 68% populasi.';
      return baseItem;
    }

    if (selectedImageKey === 'candiPeninggalanSejarah') {
      baseItem.materi = 'Sejarah Peradaban Tradisional: Mahakarya Arsitektur Mataram Kuno';
      baseItem.stimulus = 'Peninggalan candi batu megah di Jawa Tengah membuktikan tingginya penguasaan ilmu rancang bangun dan keharmonisan sosial masyarakat pada abad ke-8 Masehi. Perhatikan gambar berikut!';
      baseItem.pertanyaan = 'Struktur bangunan berundak pada Candi Borobudur terbagi menjadi tiga tingkatan filosofi. Teras melingkar paling atas yang memuat stupa-stupa berlubang dan stupa induk (Arupadhatu) melambangkan...';
      baseItem.opsi = [
        'Alam tanpa wujud fisik (nirwana), simbol kesucian spiritual tertinggi yang bebas dari belenggu hawa nafsu keduniawian.',
        'Dunia manusia yang masih terbelenggu oleh hawa nafsu dan keserakahan materi (alam Kamadhatu).',
        'Kawasan pemakaman khusus bagi para raja dan bangsawan Wangsa Syailendra yang gugur di medan perang.',
        'Tempat penyimpanan upeti dan hasil bumi masyarakat desa yang diserahkan kepada penguasa kerajaan.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan = 'Tingkatan Candi Borobudur: Kamadhatu (kaki candi = nafsu duniawi), Rupadhatu (teras relief = alam wujud), dan Arupadhatu (teras bundar stupa puncak = alam tanpa wujud/spiritual mutlak).';
      return baseItem;
    }

    if (selectedImageKey === 'pelestarianSDAHutan') {
      baseItem.materi = 'Pembangunan Berkelanjutan (SDGs) & Kearifan Lokal';
      baseItem.stimulus = 'Pelestarian lingkungan hidup memerlukan perpaduan antara penegakan hukum modern dan pelestarian tradisi leluhur. Cermatilah infografik konservasi hutan berikut!';
      baseItem.pertanyaan = 'Berdasarkan infografik tersebut, salah satu wujud nyata implementasi kearifan lokal masyarakat dalam menjaga kelestarian ekosistem tanah dan air adalah...';
      baseItem.opsi = [
        'Tradisi Nyabuk Gunung / Terasering di Jawa dan Subak di Bali untuk mengelola air serta mencegah longsor.',
        'Penebangan pohon di hutan lindung secara menyeluruh untuk mempercepat pembukaan perkebunan sawit.',
        'Penggunaan pestisida kimia sintetis secara berlebihan di kawasan lereng pegunungan dekat mata air.',
        'Pembakaran semak belukar pada musim kemarau guna menghemat biaya pengolahan lahan pertanian.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan = 'Kearifan lokal seperti Nyabuk Gunung, Subak, Hutan Larangan, dan Lubuk Larangan merupakan praktik tradisional ramah lingkungan yang mencegah erosi dan menjaga kelestarian air.';
      return baseItem;
    }
  }

  // KASUS 2: BUTIR SOAL STANDAR BERDASARKAN BENTUK SOAL
  if (type === 'pilihan_ganda') {
    const bankPG = [
      {
        stimulus: 'Di daerah pedesaan pegunungan seperti lereng Gunung Slamet di Kabupaten Banyumas, masyarakat memanfaatkan lereng perbukitan dengan sistem terasering untuk menanam sayuran sekaligus mencegah erosi tanah.',
        pertanyaan: 'Aktivitas adaptasi manusia terhadap kondisi geografis lingkungan sekitar tersebut merupakan wujud nyata dari konsep interaksi manusia dengan alam dalam rangka...',
        opsi: [
          'Eksploitasi sumber daya alam secara maksimal tanpa memikirkan keberlanjutan tanah.',
          'Pemanfaatan potensi lingkungan secara bijak dengan menjaga keseimbangan daya dukung ekosistem.',
          'Peralihan mata pencaharian tradisional agraris menjadi sektor industri manufaktur berat.',
          'Monopolisasi kepemilikan lahan hutan lindung oleh kelompok pemodal perkebunan swasta.'
        ],
        kunci: 'B',
        pembahasan: 'Sistem terasering merupakan kearifan lokal konservasi tanah lereng agar air meresap dan mencegah erosi permukaan, mencerminkan pemanfaatan bijak berwawasan lingkungan.'
      },
      {
        stimulus: 'Perkembangan perdagangan antarpulau di Indonesia memungkinkan komoditas unggulan rempah dari Maluku dikirim ke Pulau Jawa, sementara hasil industri mesin dan tekstil dari Jawa dikirim ke Maluku.',
        pertanyaan: 'Faktor pendorong utama yang mendasari terjadinya perdagangan antarpulau atau antardaerah tersebut adalah...',
        opsi: [
          'Perbedaan potensi sumber daya alam dan keunggulan komparatif yang dimiliki oleh masing-masing wilayah.',
          'Adanya kesamaan jenis tanah dan iklim sehingga hasil komoditas yang dipanen persis sama.',
          'Keinginan pemerintah untuk membatasi pergerakan kapal barang antarpulau demi keamanan teritorial.',
          'Ketiadaan sarana komunikasi modern antardaerah sehingga hanya mengandalkan transaksi barter.'
        ],
        kunci: 'A',
        pembahasan: 'Perdagangan antarpulau terdorong oleh perbedaan karunia sumber daya alam (keunggulan komparatif) dan perbedaan tingkat harga komoditas antarwilayah.'
      },
      {
        stimulus: 'Seorang remaja aktif menggunakan media sosial dan mulai meniru gaya pakaian, bahasa gaul, serta pola konsumsi cepat saji dari budaya luar yang bertentangan dengan norma kesantunan di lingkungannya.',
        pertanyaan: 'Sikap kritis dan bijak yang seharusnya dikembangkan oleh peserta didik dalam menghadapi pengaruh arus globalisasi tersebut adalah...',
        opsi: [
          'Menutup diri sepenuhnya dari segala bentuk teknologi internet dan komunikasi modern.',
          'Menyaring (memfilter) setiap pengaruh asing dengan berlandaskan pada nilai Pancasila dan kearifan budaya luhur bangsa.',
          'Menerima seluruh tren luar negeri tanpa seleksi agar dianggap modern dan tidak ketinggalan zaman.',
          'Menyalahkan kebudayaan daerah sendiri yang dianggap kuno dan tidak relevan dengan zaman sekarang.'
        ],
        kunci: 'B',
        pembahasan: 'Menghadapi globalisasi memerlukan sikap selektif: menyerap ilmu pengetahuan dan teknologi positif, namun tetap memegang teguh jati diri dan nilai budaya luhur bangsa.'
      }
    ];

    const pick = bankPG[variationIndex % bankPG.length];
    baseItem.stimulus = pick.stimulus;
    baseItem.pertanyaan = pick.pertanyaan;
    baseItem.opsi = pick.opsi;
    baseItem.kunciJawaban = pick.kunci;
    baseItem.pembahasan = pick.pembahasan;
  } else if (type === 'pilihan_ganda_kompleks') {
    baseItem.stimulus = 'Modernisasi dan perkembangan teknologi informasi telah membawa transformasi besar pada tatanan ekonomi dan interaksi sosial masyarakat pedesaan maupun perkotaan di Indonesia.';
    baseItem.pertanyaan = 'Cermatilah pernyataan-pernyataan berikut! Manakah yang merupakan dampak positif dari adanya transformasi ekonomi digital bagi pelaku usaha mikro dan kecil (UMKM)? (Pilihlah lebih dari satu jawaban yang benar!)';
    baseItem.opsi = [
      'Memperluas jangkauan pasar penjualan produk hingga ke luar daerah bahkan mancanegara melalui marketplace online.',
      'Memudahkan sistem pencatatan transaksi dan pembayaran non-tunai yang lebih transparan dan cepat menggunakan kode QRIS.',
      'Meningkatkan ketergantungan mutlak pada tengkulak konvensional untuk menentukan harga pasaran produk.',
      'Membuka akses pelatihan kewirausahaan digital dan pemasaran kreatif melalui media sosial secara mandiri.'
    ];
    baseItem.kunciJawaban = 'Pilihan (A), (B), dan (D)';
    baseItem.pembahasan = 'Dampak positif ekonomi digital mencakup perluasan pangsa pasar (A), kemudahan transaksi digital QRIS (B), dan literasi kewirausahaan online (D).';
  } else if (type === 'menjodohkan') {
    baseItem.stimulus = 'Dalam kajian IPS, mobilitas sosial mengacu pada perpindahan status atau posisi sosial seseorang/kelompok dalam lapisan struktur masyarakat.';
    baseItem.pertanyaan = 'Jodohkanlah contoh peristiwa mobilitas sosial pada Kolom A dengan bentuk mobilitas sosial yang sesuai pada Kolom B!';
    baseItem.menjodohkanPairs = [
      {
        premis: '1. Seorang anak petani desa berhasil menyelesaikan kuliah keguruan dan diangkat menjadi Kepala Sekolah berprestasi.',
        respon: 'Mobilitas Sosial Vertikal Naik (Social Climbing)'
      },
      {
        premis: '2. Seorang manajer perusahaan mengalami pemutusan hubungan kerja lalu beralih menjadi buruh harian lepas.',
        respon: 'Mobilitas Sosial Vertikal Turun (Social Sinking)'
      },
      {
        premis: '3. Seorang guru IPS SMP dari Kabupaten Cilacap dipindahtugaskan ke SMP di Kabupaten Banyumas dengan jabatan dan golongan yang sama.',
        respon: 'Mobilitas Sosial Horisontal'
      },
      {
        premis: '4. Perbedaan tingkat pendidikan dan status sosial yang diraih antara kakek, orang tua, dan anak dalam satu silsilah keluarga.',
        respon: 'Mobilitas Sosial Antargenerasi'
      }
    ];
    baseItem.kunciJawaban = '1 -> Social Climbing; 2 -> Social Sinking; 3 -> Mobilitas Horisontal; 4 -> Mobilitas Antargenerasi';
    baseItem.pembahasan = 'Social climbing adalah kenaikan status sosial; social sinking penurunan status; horisontal peralihan posisi sederajat; antargenerasi mencakup perubahan antargenerasi keluarga.';
  } else if (type === 'benar_salah') {
    baseItem.stimulus = 'Kondisi iklim di Indonesia dipengaruhi oleh letak astronomis di zona khatulistiwa serta hembusan angin monsun barat dan angin monsun timur secara bergantian setiap enam bulan sekali.';
    baseItem.pertanyaan = 'Tentukan apakah pernyataan mengenai dinamika iklim dan pengaruhnya terhadap aktivitas masyarakat berikut bernilai BENAR atau SALAH!';
    baseItem.pernyataanBenarSalah = [
      {
        pernyataan: 'Angin monsun barat yang bertiup dari Benua Asia menuju Benua Australia melewati samudra luas menyebabkan Indonesia mengalami musim hujan.',
        jawaban: 'Benar',
        alasan: 'Monsun barat membawa uap air melimpah dari Samudra Hindia dan Laut Cina Selatan menuju kepulauan Indonesia.'
      },
      {
        pernyataan: 'Musim kemarau di Indonesia terjadi saat angin monsun timur bertiup dari Benua Australia yang bersifat kering melintasi wilayah gurun pasir.',
        jawaban: 'Benar',
        alasan: 'Massa udara dari Australia melintasi wilayah gurun gersang sehingga memiliki kelembapan udara yang rendah.'
      },
      {
        pernyataan: 'Para petani tradisional di Pulau Jawa selalu menanam padi di lahan tadah hujan pada saat puncak musim kemarau karena membutuhkan cuaca terik.',
        jawaban: 'Salah',
        alasan: 'Padi di lahan tadah hujan membutuhkan curah hujan mencukupi di awal musim hujan, bukan saat puncak kemarau.'
      }
    ];
    baseItem.kunciJawaban = '1 = BENAR, 2 = BENAR, 3 = SALAH';
    baseItem.pembahasan = 'Monsun barat = hujan; monsun timur = kemarau. Petani tadah hujan menanam saat pasokan air hujan tersedia.';
  } else if (type === 'isian_singkat') {
    baseItem.stimulus = 'Pada tanggal 28 Oktober 1928, pemuda-pemudi dari berbagai perkumpulan kedaerahan mengikrarkan janji suci persatuan tanah air, bangsa, dan bahasa persatuan di Jakarta.';
    baseItem.pertanyaan = 'Peristiwa bersejarah yang menjadi tonggak peleburan sekat kedaerahan menuju persatuan nasional bangsa Indonesia tersebut dikenal dengan nama...';
    baseItem.kunciJawaban = 'Kerapatan Pemuda II / Sumpah Pemuda';
    baseItem.pembahasan = 'Peristiwa Sumpah Pemuda pada 28 Oktober 1928 merupakan ikrar kebangsaan pemuda Indonesia.';
  } else if (type === 'uraian') {
    baseItem.stimulus = 'Wilayah Indonesia kaya akan warisan tradisi gotong royong dan kearifan lokal seperti tradisi Sambatan di Jawa, Subak di Bali, dan Rambu Solo di Toraja. Namun, individualisme di era globalisasi mulai mengikis nilai-nilai kebersamaan tersebut di kalangan generasi muda.';
    baseItem.pertanyaan = 'Berdasarkan fenomena sosial tersebut, jawablah pertanyaan berikut secara komprehensif:\na. Jelaskan 2 faktor internal dan eksternal yang menyebabkan pudarnya semangat gotong royong di kalangan generasi muda saat ini!\nb. Mengapa kearifan lokal gotong royong tetap krusial dipertahankan sebagai modal sosial pembangunan bangsa?\nc. Berikan 2 contoh konkret penerapan budaya gotong royong yang dapat Anda inisiasi di lingkungan sekolah SMP!';
    baseItem.kunciJawaban = 'Pedoman Penilaian Tercantum pada Rubrik Penskoran Terperinci.';
    baseItem.rubrikUraian = [
      { kriteria: 'Menjelaskan faktor penyebab individualisme (pengaruh gawai/gadget berlebihan, gaya hidup konsumtif, kurangnya keteladanan sosial).', skor: 4 },
      { kriteria: 'Menganalisis urgensi gotong royong sebagai modal sosial (perekat persatuan, efisiensi penanganan musibah, memperkuat kohesi sosial).', skor: 5 },
      { kriteria: 'Merumuskan 2 contoh aksi nyata di sekolah (Jumat Bersih terorganisir, program peduli teman asuh, piket kelas kooperatif).', skor: 6 }
    ];
    baseItem.pembahasan = 'Uraian menganalisis pergeseran sosial budaya dan merumuskan langkah restorasi modal sosial melalui pendidikan karakter di satuan pendidikan.';
  }

  return baseItem;
}

function normalizeScoresTo100(questions: QuestionItem[]): QuestionItem[] {
  if (questions.length === 0) return [];

  const typeWeights: Record<QuestionType, number> = {
    pilihan_ganda: 2,
    pilihan_ganda_kompleks: 4,
    menjodohkan: 4,
    benar_salah: 3,
    isian_singkat: 3,
    uraian: 8
  };

  const rawSum = questions.reduce((sum, q) => sum + (typeWeights[q.type] || 2), 0);
  const factor = 100 / (rawSum || 1);

  let accumulated = 0;
  const normalized = questions.map((q) => {
    let score = Math.round((typeWeights[q.type] || 2) * factor);
    if (score < 1) score = 1;
    accumulated += score;
    return {
      ...q,
      bobotSkor: score
    };
  });

  const diff = 100 - accumulated;
  if (diff !== 0 && normalized.length > 0) {
    const targetIdx = normalized.findIndex((q) => q.type === 'uraian') !== -1
      ? normalized.findIndex((q) => q.type === 'uraian')
      : normalized.length - 1;
    normalized[targetIdx].bobotSkor += diff;
    if (normalized[targetIdx].bobotSkor < 1) normalized[targetIdx].bobotSkor = 1;
  }

  return normalized;
}
