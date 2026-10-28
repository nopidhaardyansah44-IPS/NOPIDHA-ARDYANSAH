import {
  GeneratorFormState,
  QuestionItem,
  QuestionType,
  CognitiveLevel,
  LearningExperience
} from '../types';
import { TEMA_KURIKULUM_IPS, KurikulumTema } from '../data/kurikulumData';
import { EDUCATIONAL_IMAGES } from './imageGenerators';

/**
 * Mesin Generator Soal IPS SMP Kurikulum Merdeka
 * Memproduksi butir soal heterogen, variatif, dan selaras dengan capaian pembelajaran.
 * Mendukung pemilihan sebagian tema atau SEMUA TEMA lintas Kelas 7, 8, dan 9.
 */
export async function generateQuestionSet(
  form: GeneratorFormState,
  existingQuestions: QuestionItem[]
): Promise<QuestionItem[]> {
  // Ambil seluruh tema yang dipilih oleh pengguna
  const selectedIds =
    form.selectedTemaIds && form.selectedTemaIds.length > 0
      ? form.selectedTemaIds
      : [form.temaId || 'k7-t1'];

  const selectedThemes = TEMA_KURIKULUM_IPS.filter((t) => selectedIds.includes(t.id));
  const effectiveThemes = selectedThemes.length > 0 ? selectedThemes : [TEMA_KURIKULUM_IPS[0]];

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

    const temaJudulSummary =
      effectiveThemes.length === TEMA_KURIKULUM_IPS.length
        ? 'Seluruh Tema IPS Kurikulum Merdeka (Kelas 7, 8, dan 9 - 12 Tema Lengkap)'
        : effectiveThemes.map((t) => `[Kelas ${t.kelas}] ${t.judul}`).join('; ');

    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kelas: form.kelas,
        temaJudul: temaJudulSummary,
        temaList: effectiveThemes.map((t) => ({
          id: t.id,
          kelas: t.kelas,
          judul: t.judul,
          capaianPembelajaran: t.capaianPembelajaran
        })),
        topikMateri: form.topikMateri || temaJudulSummary,
        tujuanPembelajaran: form.tujuanPembelajaran || effectiveThemes.map((t) => t.tujuanPembelajaranPreset[0] || t.capaianPembelajaran).join('; '),
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
        return formatAiGeneratedQuestions(data.questions, form, effectiveThemes);
      }
    }
  } catch (error) {
    console.warn('Pemanggilan server Gemini beralih ke generator kurikulum bawaan:', error);
  }

  // Fallback: Generator Kurikulum Cerdas Bawaan (Heterogen, Kaya, Terdistribusi ke seluruh tema terpilih)
  return generateDeterministicQuestions(form, effectiveThemes, activeTypes);
}

function formatAiGeneratedQuestions(
  rawList: any[],
  form: GeneratorFormState,
  themes: KurikulumTema[]
): QuestionItem[] {
  const imageKeys = Object.keys(EDUCATIONAL_IMAGES);
  let imageCounter = 0;
  const maxImages = form.soalBergambarEnabled ? form.jumlahSoalBergambar : 0;

  const result: QuestionItem[] = rawList.map((q, idx) => {
    const nomor = idx + 1;
    let gambarObj = null;
    const currentTema = themes[idx % themes.length];

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
      capaianPembelajaran: q.capaianPembelajaran || currentTema.capaianPembelajaran,
      tujuanPembelajaran:
        q.tujuanPembelajaran ||
        currentTema.tujuanPembelajaranPreset[idx % currentTema.tujuanPembelajaranPreset.length] ||
        currentTema.capaianPembelajaran,
      materi: q.materi || currentTema.judul,
      indikatorSoal:
        q.indikatorSoal ||
        `Peserta didik mampu menganalisis materi ${q.materi || currentTema.judul} dengan tepat.`,
      stimulus:
        q.stimulus ||
        (gambarObj ? `Perhatikan ${gambarObj.caption} di bawah ini untuk menjawab pertanyaan berikut!` : undefined),
      gambar: gambarObj,
      pertanyaan: q.pertanyaan || 'Jelaskan fenomena berikut...',
      opsi: q.opsi || (q.type === 'pilihan_ganda' ? ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'] : undefined),
      kunciJawaban: q.kunciJawaban || 'A',
      bobotSkor: q.bobotSkor || 10,
      pembahasan: q.pembahasan || 'Pembahasan mendalam sesuai konsep IPS.',
      bukuSumber:
        q.bukuSumber ||
        `Buku Panduan Guru & Siswa IPS SMP Kelas ${currentTema.kelas} Kemendikbudristek Kurikulum Merdeka.`,
      rubrikUraian:
        q.type === 'uraian'
          ? [
              { kriteria: 'Menyajikan analisis awal yang tepat dan relevan', skor: 4 },
              { kriteria: 'Menyampaikan data atau contoh nyata di masyarakat', skor: 4 },
              { kriteria: 'Memberikan kesimpulan dan rekomendasi solutif', skor: 7 }
            ]
          : undefined
    };
  });

  return normalizeScoresTo100(result);
}

function generateDeterministicQuestions(
  form: GeneratorFormState,
  themes: KurikulumTema[],
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
      const cognitiveLevels =
        form.tingkatKesulitan.length > 0 ? form.tingkatKesulitan : (['LOTS', 'MOTS', 'HOTS'] as CognitiveLevel[]);
      const diff = cognitiveLevels[i % cognitiveLevels.length];

      // Pilih pengalaman belajar berputar dari yang dipilih user
      const expLevels =
        form.pengalamanBelajar.length > 0
          ? form.pengalamanBelajar
          : (['Memahami', 'Mengaplikasi', 'Merefleksi'] as LearningExperience[]);
      const exp = expLevels[i % expLevels.length];

      // Distribusikan butir soal ke seluruh tema yang dipilih secara merata (Kelas 7, 8, 9)
      const tema = themes[(currentNumber - 1) % themes.length];

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
        tema.kelas,
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
  tema: KurikulumTema,
  customTopic: string,
  customTP: string,
  gambar: any,
  selectedImageKey: string,
  variationIndex: number
): QuestionItem {
  // Jika pengguna memilih banyak tema atau seluruh tema (Kelas 7, 8, 9),
  // cantumkan judul tema yang bersangkutan pada materi masing-masing butir soal
  const topic =
    customTopic && !customTopic.includes('Seluruh Tema') && !customTopic.includes('Gabungan')
      ? `${tema.judul} - ${customTopic}`
      : tema.judul;

  const tp =
    tema.tujuanPembelajaranPreset[variationIndex % tema.tujuanPembelajaranPreset.length] ||
    tema.capaianPembelajaran;

  const baseItem: QuestionItem = {
    id: `soal-gen-${Date.now()}-${no}`,
    nomorSoal: no,
    type,
    tingkatKesulitan: diff,
    pengalamanBelajar: exp,
    capaianPembelajaran: tema.capaianPembelajaran,
    tujuanPembelajaran: tp,
    materi: topic,
    indikatorSoal: `Disajikan konteks ${tema.judul.toLowerCase()}, peserta didik mampu ${exp.toLowerCase()} konsep dengan tingkat penalaran ${diff}.`,
    stimulus: '',
    pertanyaan: '',
    kunciJawaban: '',
    bobotSkor: 10,
    pembahasan: '',
    bukuSumber: `Buku Siswa IPS SMP Kelas ${tema.kelas} Kemendikbudristek Kurikulum Merdeka.`,
    gambar: gambar
  };

  // KASUS 1: BUTIR SOAL BERGAMBAR
  if (gambar && selectedImageKey) {
    if (selectedImageKey === 'petaWallaceWeber') {
      baseItem.materi = 'Biogeografi Indonesia: Garis Wallace & Weber (Kelas 7)';
      baseItem.stimulus =
        'Kondisi geografis Indonesia yang berada di antara dua paparan dangkalan purba (Paparan Sunda dan Paparan Sahul) memicu keunikan flora dan fauna nusantara. Cermatilah peta garis khayal biogeografi di bawah ini!';
      baseItem.pertanyaan =
        'Berdasarkan garis khayal pembagi fauna pada peta tersebut, wilayah fauna Kepulauan Sulawesi, Maluku, dan Nusa Tenggara dikelompokkan ke dalam zona peralihan (Wallacea). Karakteristik satwa yang mendiami kawasan zona peralihan tersebut adalah...';
      baseItem.opsi = [
        'Memiliki kesamaan ciri fisik dengan mamalia besar di daratan Asia seperti gajah dan badak bercula.',
        'Merupakan satwa endemik khas kepulauan yang tidak dijumpai di benua Asia maupun Australia, seperti anoa, babirusa, dan burung maleo.',
        'Didominasi oleh binatang berkantung (marsupialia) dan burung berbulu indah seperti cenderawasih.',
        'Hanya terdiri atas hewan mamalia air tawar yang bermigrasi musiman dari Samudra Hindia ke Samudra Pasifik.'
      ];
      baseItem.kunciJawaban = 'B';
      baseItem.pembahasan =
        'Zona peralihan (Wallacea) dibatasi oleh Garis Wallace di barat dan Garis Weber di timur, mencakup Sulawesi, Maluku, dan Nusa Tenggara dengan satwa endemik unik (anoa, babirusa, burung maleo, komodo).';
      return baseItem;
    }

    if (selectedImageKey === 'kurvaPermintaanPenawaran') {
      baseItem.materi = 'Mekanisme Pasar: Kurva Ekuilibrium Permintaan & Penawaran (Kelas 7)';
      baseItem.stimulus =
        'Di pasar tradisional Kabupaten Banyumas, terjadi interaksi tawar-menawar harga komoditas pokok antara pedagang dan pembeli. Perhatikan grafik pembentukan harga keseimbangan berikut!';
      baseItem.pertanyaan =
        'Titik E (Ekuilibrium) pada grafik di atas terbentuk pada perpotongan kurva permintaan (D) dan penawaran (S). Kondisi ekonomi yang terjadi secara tepat pada titik E tersebut adalah...';
      baseItem.opsi = [
        'Jumlah barang yang diminta pembeli sama persis dengan jumlah barang yang ditawarkan pedagang pada tingkat harga tertentu.',
        'Terjadi kelebihan penawaran (surplus) karena penjual mematok harga jauh di atas kemampuan rata-rata pembeli.',
        'Pemerintah memberikan subsidi total kepada pembeli sehingga harga komoditas turun drastis hingga nol rupiah.',
        'Jumlah barang yang ditawarkan produsen jauh lebih sedikit dibandingkan kebutuhan seluruh pembeli di pasar.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan =
        'Titik ekuilibrium tercapai saat kuantitas permintaan (Qd) seimbang dengan kuantitas penawaran (Qs) pada harga keseimbangan (Pe).';
      return baseItem;
    }

    if (selectedImageKey === 'pelakuEkonomiCircularFlow') {
      baseItem.materi = 'Interaksi Pelaku Ekonomi: Circular Flow Diagram (Kelas 8)';
      baseItem.stimulus =
        'Aktivitas perekonomian digerakkan oleh interaksi timbal balik antara rumah tangga konsumen, produsen, pemerintah, dan masyarakat luar negeri. Perhatikan bagan arus kegiatan ekonomi berikut!';
      baseItem.pertanyaan =
        'Berdasarkan bagan arus melingkar di atas, arus barang/jasa dan faktor produksi yang ditunjukkan oleh hubungan antara Rumah Tangga Konsumen (RTK) dan Rumah Tangga Produsen (RTP) adalah...';
      baseItem.opsi = [
        'RTK menyerahkan faktor produksi (tenaga kerja, tanah, modal) ke RTP dan menerima imbalan berupa upah, sewa, dan laba.',
        'RTP memberikan subsidi dan pajak gratis kepada seluruh masyarakat tanpa melalui mekanisme pasar.',
        'RTK hanya membeli barang dari luar negeri tanpa mengonsumsi barang buatan pabrik dalam negeri.',
        'Pemerintah menguasai seluruh faktor produksi sehingga RTK dan RTP tidak memiliki peran ekonomi mandiri.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan =
        'RTK adalah penyedia faktor produksi bagi RTP, dan menerima pendapatan (rent, wage, interest, profit) yang digunakan untuk membeli output barang/jasa dari RTP.';
      return baseItem;
    }

    if (selectedImageKey === 'piramidaPenduduk') {
      baseItem.materi = 'Dinamika Kependudukan & Puncak Bonus Demografi (Kelas 8)';
      baseItem.stimulus =
        'Berdasarkan sensus Badan Pusat Statistik (BPS), Indonesia tengah berada pada periode struktur penduduk yang sangat menguntungkan. Cermatilah grafik komposisi piramida penduduk di bawah ini!';
      baseItem.pertanyaan =
        'Berdasarkan struktur usia pada grafik piramida penduduk tersebut, fenomena Bonus Demografi yang dialami Indonesia ditandai dengan kondisi...';
      baseItem.opsi = [
        'Jumlah penduduk usia produktif (15–64 tahun) mendominasi secara signifikan dibandingkan usia non-produktif (0–14 tahun dan 65+ tahun).',
        'Tingkat kelahiran bayi melesat tinggi melampaui jumlah seluruh angkatan kerja dewasa di perkotaan.',
        'Jumlah lansia di atas 65 tahun lebih banyak daripada jumlah usia anak-anak dan remaja sekolah.',
        'Terjadinya penurunan drastis jumlah tenaga kerja terampil di sektor industri manufaktur.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan =
        'Bonus demografi adalah kondisi di mana rasio ketergantungan (dependency ratio) rendah karena kelompok usia produktif (15-64 tahun) mencapai lebih dari 68% populasi.';
      return baseItem;
    }

    if (selectedImageKey === 'candiPeninggalanSejarah') {
      baseItem.materi = 'Sejarah Peradaban Tradisional: Mahakarya Arsitektur Mataram Kuno (Kelas 8)';
      baseItem.stimulus =
        'Peninggalan candi batu megah di Jawa Tengah membuktikan tingginya penguasaan ilmu rancang bangun dan keharmonisan sosial masyarakat pada abad ke-8 Masehi. Perhatikan gambar berikut!';
      baseItem.pertanyaan =
        'Struktur bangunan berundak pada Candi Borobudur terbagi menjadi tiga tingkatan filosofi. Teras melingkar paling atas yang memuat stupa-stupa berlubang dan stupa induk (Arupadhatu) melambangkan...';
      baseItem.opsi = [
        'Alam tanpa wujud fisik (nirwana), simbol kesucian spiritual tertinggi yang bebas dari belenggu hawa nafsu keduniawian.',
        'Dunia manusia yang masih terbelenggu oleh hawa nafsu dan keserakahan materi (alam Kamadhatu).',
        'Kawasan pemakaman khusus bagi para raja dan bangsawan Wangsa Syailendra yang gugur di medan perang.',
        'Tempat penyimpanan upeti dan hasil bumi masyarakat desa yang diserahkan kepada penguasa kerajaan.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan =
        'Tingkatan Candi Borobudur: Kamadhatu (kaki candi = nafsu duniawi), Rupadhatu (teras relief = alam wujud), dan Arupadhatu (teras bundar stupa puncak = alam tanpa wujud/spiritual mutlak).';
      return baseItem;
    }

    if (selectedImageKey === 'pelestarianSDAHutan') {
      baseItem.materi = 'Pembangunan Berkelanjutan (SDGs) & Kearifan Lokal (Kelas 9)';
      baseItem.stimulus =
        'Pelestarian lingkungan hidup memerlukan perpaduan antara penegakan hukum modern dan pelestarian tradisi leluhur. Cermatilah infografik konservasi hutan berikut!';
      baseItem.pertanyaan =
        'Berdasarkan infografik tersebut, salah satu wujud nyata implementasi kearifan lokal masyarakat dalam menjaga kelestarian ekosistem tanah dan air adalah...';
      baseItem.opsi = [
        'Tradisi Nyabuk Gunung / Terasering di Jawa dan Subak di Bali untuk mengelola air serta mencegah longsor.',
        'Penebangan pohon di hutan lindung secara menyeluruh untuk mempercepat pembukaan perkebunan sawit.',
        'Penggunaan pestisida kimia sintetis secara berlebihan di kawasan lereng pegunungan dekat mata air.',
        'Pembakaran semak belukar pada musim kemarau guna menghemat biaya pengolahan lahan pertanian.'
      ];
      baseItem.kunciJawaban = 'A';
      baseItem.pembahasan =
        'Kearifan lokal seperti Nyabuk Gunung, Subak, Hutan Larangan, dan Lubuk Larangan merupakan praktik tradisional ramah lingkungan yang mencegah erosi dan menjaga kelestarian air.';
      return baseItem;
    }
  }

  // KASUS 2: BUTIR SOAL STANDAR SESUAI TEMA KELAS 7, 8, DAN 9
  if (type === 'pilihan_ganda') {
    // Bank soal berbobot tinggi disesuaikan dengan jenjang kelas tema
    if (tema.kelas === '7') {
      const bankPGKls7 = [
        {
          stimulus:
            'Di daerah lereng Gunung Slamet Kabupaten Banyumas, masyarakat mengolah lahan miring menggunakan sistem terasering bertingkat guna menanam sayuran sekaligus mengontrol laju aliran air permukaan.',
          pertanyaan:
            'Aktivitas adaptasi manusia terhadap kondisi topografi alam sekitar tersebut merupakan wujud nyata penerapan prinsip...',
          opsi: [
            'Eksploitasi sumber daya alam semata untuk mengejar keuntungan finansial instan.',
            'Pemanfaatan potensi geografis secara berkelanjutan dengan menjaga keseimbangan ekosistem tanah.',
            'Alih fungsi hutan lindung menjadi kawasan industri tekstil berat secara menyeluruh.',
            'Ketergantungan pasrah masyarakat pada alam tanpa melakukan upaya mitigasi bencana tanah longsor.'
          ],
          kunci: 'B',
          pembahasan:
            'Sistem terasering merupakan kearifan ekologis dalam mengolah lahan miring agar air meresap optimal dan mencegah bahaya longsor.'
        },
        {
          stimulus:
            'Keluarga merupakan lingkungan sosial primer pertama bagi seorang anak untuk mempelajari norma, nilai kesopanan, dan bahasa ibu sebelum berinteraksi dengan lingkungan masyarakat luas.',
          pertanyaan:
            'Fungsi keluarga dalam menanamkan nilai-nilai dasar moral dan tata krama kehidupan bermasyarakat tersebut dikenal sebagai fungsi...',
          opsi: [
            'Sosialisasi dan edukasi primer',
            'Reproduksi biologis semata',
            'Proteksi hukum internasional',
            'Monopoli ekonomi keluarga'
          ],
          kunci: 'A',
          pembahasan:
            'Fungsi sosialisasi dalam keluarga menanamkan nilai luhur, norma kesantunan, dan pembentukan kepribadian awal anak.'
        },
        {
          stimulus:
            'Menjelang hari raya, terjadi peningkatan permintaan terhadap daging sapi dan minyak goreng di pasar tradisional, sementara pasokan dari peternak tetap, sehingga harga barang merangkak naik.',
          pertanyaan:
            'Berdasarkan hukum permintaan dan penawaran, langkah paling bijak yang dapat dilakukan oleh keluarga konsumen dalam menyikapi lonjakan harga tersebut adalah...',
          opsi: [
            'Membeli daging dalam jumlah sebesar-besarnya untuk ditimbun di rumah.',
            'Menyusun skala prioritas kebutuhan dan mencari komoditas pangan alternatif yang bergizi setara.',
            'Mengajukan pinjaman uang tanpa perhitungan matang demi menuruti seluruh keinginan konsumtif.',
            'Menuntut pedagang pasar untuk menjual barang di bawah harga modal pokok.'
          ],
          kunci: 'B',
          pembahasan:
            'Skala prioritas dan substitusi komoditas pangan adalah strategi rasional konsumen dalam mengelola keuangan keluarga di tengah kenaikan harga.'
        }
      ];
      const pick = bankPGKls7[variationIndex % bankPGKls7.length];
      baseItem.stimulus = pick.stimulus;
      baseItem.pertanyaan = pick.pertanyaan;
      baseItem.opsi = pick.opsi;
      baseItem.kunciJawaban = pick.kunci;
      baseItem.pembahasan = pick.pembahasan;
    } else if (tema.kelas === '8') {
      const bankPGKls8 = [
        {
          stimulus:
            'Indonesia terletak di antara pertemuan tiga lempeng tektonik utama dunia, yaitu Lempeng Indo-Australia, Lempeng Eurasia, dan Lempeng Pasifik (Ring of Fire).',
          pertanyaan:
            'Implikasi positif dari letak geologis tersebut bagi sektor pertanian dan pertambangan di Indonesia adalah...',
          opsi: [
            'Tanah di sekitar kawasan vulkanik sangat subur karena abu vulkanik kaya unsur hara, serta melimpahnya deposit mineral logam dan panas bumi.',
            'Seluruh wilayah Indonesia bebas dari ancaman bencana gempa tektonik dan tsunami.',
            'Hilangnya keanekaragaman hayati karena tertutup lava gunung berapi secara permanen.',
            'Menurunnya potensi sumber daya air tanah akibat tingginya aktivitas magma di perut bumi.'
          ],
          kunci: 'A',
          pembahasan:
            'Vulkanisme menyuburkan tanah pertanian melalui pelapukan abu vulkanik dan membentuk cadangan mineral logam serta energi geothermal berharga.'
        },
        {
          stimulus:
            'Komoditas rempah unggulan Maluku seperti cengkih dan pala dikirimkan melalui kapal kargo menuju Pulau Jawa, sementara mesin perkakas dan hasil pabrik tekstil dari Jawa didistribusikan ke kawasan Indonesia Timur.',
          pertanyaan:
            'Faktor pendorong utama yang mendasari kelancaran perdagangan antarpulau dan antardaerah tersebut adalah...',
          opsi: [
            'Adanya keunggulan komparatif dan perbedaan potensi sumber daya alam yang dimiliki oleh masing-masing wilayah.',
            'Kesamaan mutlak jenis komoditas yang dihasilkan sehingga tidak perlu ada transaksi jual beli.',
            'Kebijakan pembatasan transportasi laut yang ketat oleh otoritas pelabuhan nasional.',
            'Ketiadaan uang sebagai alat pembayaran resmi sehingga masyarakat hanya melakukan sistem barter.'
          ],
          kunci: 'A',
          pembahasan:
            'Perdagangan antarpulau terdorong oleh perbedaan karunia sumber daya alam (keunggulan komparatif) dan spesialisasi produksi antarwilayah.'
        },
        {
          stimulus:
            'Peristiwa Sumpah Pemuda pada tanggal 28 Oktober 1928 menandai tonggak sejarah bersatunya berbagai perkumpulan pemuda kedaerahan (Jong Java, Jong Sumatranen Bond, Jong Ambon, dll) menjadi satu tekad kebangsaan.',
          pertanyaan:
            'Makna historis paling mendasar dari ikrar Sumpah Pemuda bagi perjuangan kemerdekaan Indonesia adalah...',
          opsi: [
            'Perubahan strategi perjuangan dari yang semula bersifat kedaerahan menjadi perjuangan nasional yang terorganisasi dan bersatu padu.',
            'Penolakan terhadap seluruh bentuk perundingan diplomasi dengan penjajah kolonial.',
            'Pembentukan partai politik tunggal yang membawahi seluruh serikat buruh di Hindia Belanda.',
            'Pemisahan urusan pertahanan militer antarpulau untuk menjaga kedaulatan masing-masing suku.'
          ],
          kunci: 'A',
          pembahasan:
            'Sumpah Pemuda 1928 mengubah paradigma kedaerahan (primordialisme) menjadi kesadaran persatuan nasional bertanah air, berbangsa, dan berbahasa satu: Indonesia.'
        }
      ];
      const pick = bankPGKls8[variationIndex % bankPGKls8.length];
      baseItem.stimulus = pick.stimulus;
      baseItem.pertanyaan = pick.pertanyaan;
      baseItem.opsi = pick.opsi;
      baseItem.kunciJawaban = pick.kunci;
      baseItem.pembahasan = pick.pembahasan;
    } else {
      // Kelas 9
      const bankPGKls9 = [
        {
          stimulus:
            'Transformasi sistem pembayaran digital melalui standarisasi QRIS (Quick Response Code Indonesian Standard) kini menjangkau hingga pedagang kaki lima dan pasar tradisional di pelosok daerah.',
          pertanyaan:
            'Manfaat signifikan dari pemanfaatan pembayaran non-tunai berbasis QRIS bagi pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) adalah...',
          opsi: [
            'Meningkatkan transparansi dan efisiensi pencatatan transaksi penjualan secara langsung ke rekening bank usaha tanpa risiko uang palsu.',
            'Membebaskan seluruh pelaku usaha dari kewajiban menyediakan pasokan barang dagangan.',
            'Menghilangkan interaksi sosial ramah tamah antara penjual dan pembeli secara permanen.',
            'Mewajibkan konsumen membeli produk dalam jumlah partai besar setiap kali bertransaksi.'
          ],
          kunci: 'A',
          pembahasan:
            'QRIS memudahkan rekam jejak keuangan usaha mikro, higienis, terbebas dari peredaran uang palsu, dan mempercepat inklusi keuangan digital.'
        },
        {
          stimulus:
            'Arus globalisasi dan kemudahan akses internet membawa masuk beragam tren budaya mancanegara (westernisasi, K-Pop, gaya busana modern) yang digemari generasi muda.',
          pertanyaan:
            'Sikap bijak dan kritis yang patut diinternalisasi oleh peserta didik dalam merespons fenomena globalisasi tersebut adalah...',
          opsi: [
            'Menyaring (memfilter) setiap pengaruh asing dengan berlandaskan nilai-nilai Pancasila dan kearifan budaya luhur bangsa.',
            'Menutup diri sepenuhnya dari ilmu pengetahuan dan perkembangan teknologi modern dunia luar.',
            'Meniru seluruh gaya hidup luar negeri tanpa seleksi agar dinilai kekinian dan tidak ketinggalan zaman.',
            'Menganggap budaya lokal daerah sendiri sebagai sesuatu yang kuno dan tidak pantas dibanggakan.'
          ],
          kunci: 'A',
          pembahasan:
            'Sikap selektif berbasis nilai kepribadian bangsa dan Pancasila memungkinkan generasi muda menyerap teknologi positif tanpa kehilangan jati diri luhur bangsa.'
        },
        {
          stimulus:
            'Dalam forum internasional Konferensi Asia Afrika (KAA) 1955 di Bandung hingga Presidensi G20 tahun 2022 di Bali, Indonesia senantiasa menyuarakan perdamaian dunia dan kemerdekaan bangsa-bangsa.',
          pertanyaan:
            'Arah kebijakan luar negeri Indonesia yang mendasari peran aktif diplomasi internasional tersebut adalah...',
          opsi: [
            'Politik luar negeri Bebas dan Aktif yang tidak memihak blok kekuatan militer tertentu demi perdamaian dunia.',
            'Politik isolasi tertutup dari pergaulan internasional guna mengamankan kekayaan dalam negeri.',
            'Keterikatan mutlak pada pakta pertahanan militer salah satu negara adidaya dunia.',
            'Prinsip mengutamakan ekspansi wilayah teritorial ke negara-negara tetangga di kawasan Asia Tenggara.'
          ],
          kunci: 'A',
          pembahasan:
            'Politik luar negeri bebas aktif menegaskan kedaulatan Indonesia untuk tidak terikat blok geopolitik manapun dan aktif memperjuangkan ketertiban dunia berdasarkan kemerdekaan dan perdamaian abadi.'
        }
      ];
      const pick = bankPGKls9[variationIndex % bankPGKls9.length];
      baseItem.stimulus = pick.stimulus;
      baseItem.pertanyaan = pick.pertanyaan;
      baseItem.opsi = pick.opsi;
      baseItem.kunciJawaban = pick.kunci;
      baseItem.pembahasan = pick.pembahasan;
    }
  } else if (type === 'pilihan_ganda_kompleks') {
    baseItem.stimulus = `Dalam implementasi Kurikulum Merdeka IPS SMP [Tema: ${tema.judul}], pemahaman konsep sosial dan ekonomi menuntut peserta didik berpikir komparatif dan analitis.`;
    baseItem.pertanyaan = `Cermatilah butir-butir pernyataan terkait materi ${tema.judul} berikut! Manakah yang merupakan pernyataan yang TEPAT dan bernilai BENAR? (Pilihlah lebih dari satu jawaban yang benar!)`;
    baseItem.opsi = [
      `Konsep dasar pada ${tema.judul} bertujuan membangun kesadaran kritis peserta didik terhadap dinamika kehidupan nyata di masyarakat.`,
      'Kearifan lokal dan potensi wilayah merupakan modal sosial penting dalam menjaga ketahanan lingkungan dan ekonomi masyarakat.',
      'Perkembangan zaman mengharuskan masyarakat mengabaikan seluruh tradisi leluhur demi mengejar modernisasi materi semata.',
      'Pemanfaatan teknologi dan literasi informasi yang sehat memperkuat persatuan serta meningkatkan kesejahteraan bersama.'
    ];
    baseItem.kunciJawaban = 'Pilihan (A), (B), dan (D)';
    baseItem.pembahasan =
      'Pernyataan (A), (B), dan (D) selaras dengan Capaian Pembelajaran Kurikulum Merdeka IPS yang menekankan kesadaran sosial, kearifan lokal, dan pemanfaatan bijak teknologi.';
  } else if (type === 'menjodohkan') {
    baseItem.stimulus = `Kajian IPS SMP [Kelas ${tema.kelas} - ${tema.judul}] menekankan keterkaitan erat antara konsep teoritis dan wujud penerapannya di lingkungan masyarakat.`;
    baseItem.pertanyaan =
      'Jodohkanlah pernyataan / konsep permasalahan pada Kolom A dengan istilah / pasangan yang tepat pada Kolom B!';
    baseItem.menjodohkanPairs = [
      {
        premis: `1. Bentuk interaksi timbal balik dalam ${tema.judul.split(':')[0]} di lingkungan terdekat.`,
        respon: 'Interaksi Sosial Dinamis'
      },
      {
        premis: '2. Upaya mengelola sumber daya yang terbatas guna memenuhi kebutuhan hidup secara bijak.',
        respon: 'Tindakan Ekonomi Rasional'
      },
      {
        premis: '3. Tata nilai dan norma adat istiadat yang diwariskan turun-temurun untuk menjaga keharmonisan.',
        respon: 'Kearifan Lokal (Local Wisdom)'
      },
      {
        premis: '4. Sikap menyaring budaya asing dengan berpegang teguh pada jati diri dan kepribadian bangsa.',
        respon: 'Filter Ketahanan Budaya'
      }
    ];
    baseItem.kunciJawaban =
      '1 -> Interaksi Sosial Dinamis; 2 -> Tindakan Ekonomi Rasional; 3 -> Kearifan Lokal; 4 -> Filter Ketahanan Budaya';
    baseItem.pembahasan =
      'Pasangan konsep mencerminkan pilar utama pendidikan IPS SMP: sosiologis, ekonomi, kultural, dan geografis.';
  } else if (type === 'benar_salah') {
    baseItem.stimulus = `Cermatilah teks analisis kontekstual terkait materi [Kelas ${tema.kelas} - ${tema.judul}] berikut ini!`;
    baseItem.pertanyaan =
      'Tentukan apakah setiap pernyataan analisis kondisi sosial ekonomi masyarakat berikut bernilai BENAR atau SALAH!';
    baseItem.pernyataanBenarSalah = [
      {
        pernyataan: `Pemahaman mendalam terhadap materi ${tema.judul} membantu peserta didik mengambil keputusan yang bertanggung jawab di era modern.`,
        jawaban: 'Benar',
        alasan: 'Pembelajaran IPS membekali peserta didik dengan kecakapan hidup sosial dan literasi kritis.'
      },
      {
        pernyataan:
          'Kesenjangan sosial dan kerusakan lingkungan dapat diminimalisasi melalui kolaborasi aktif antara pemerintah, masyarakat, dan dunia usaha.',
        jawaban: 'Benar',
        alasan: 'Pembangunan berkelanjutan memerlukan sinergi multisektoral (pentahelix).'
      },
      {
        pernyataan:
          'Kemajuan teknologi informasi hanya membawa dampak buruk bagi generasi muda dan sama sekali tidak memiliki manfaat positif.',
        jawaban: 'Salah',
        alasan:
          'Teknologi memiliki segudang manfaat positif (akses ilmu, efisiensi usaha, konektivitas) jika digunakan secara bijak.'
      }
    ];
    baseItem.kunciJawaban = '1 = BENAR, 2 = BENAR, 3 = SALAH';
    baseItem.pembahasan =
      'Pernyataan 1 dan 2 bernilai Benar sesuai prinsip ilmu sosial; pernyataan 3 Salah karena menggeneralisasi teknologi secara keliru.';
  } else if (type === 'isian_singkat') {
    baseItem.stimulus = `Dalam konteks kurikulum IPS SMP [Materi: ${tema.judul}], terdapat konsep fundamental yang menjadi pilar pemahaman keruangan dan sosial.`;
    baseItem.pertanyaan = `Sebutkan istilah yang tepat untuk kemampuan seseorang dalam mengidentifikasi, mengelola, dan mengambil keputusan finansial atau sosial secara bijak dalam materi ${tema.judul.split(':')[0]}!`;
    baseItem.kunciJawaban = 'Literasi Keuangan / Literasi Sosial';
    baseItem.pembahasan =
      'Literasi finansial dan literasi sosial merupakan kecakapan esensial dalam Capaian Pembelajaran IPS Fase D.';
  } else if (type === 'uraian') {
    baseItem.stimulus = `Dinamika masyarakat di era Kurikulum Merdeka [Kajian: ${tema.judul}] memperlihatkan adanya pergeseran pola kehidupan masyarakat akibat perkembangan iptek dan tuntutan pembangunan berkelanjutan.`;
    baseItem.pertanyaan = `Berdasarkan materi ${tema.judul}, analisislah permasalahan berikut secara mendalam:\na. Jelaskan 2 faktor pendorong perubahan yang terjadi pada topik tersebut dalam kehidupan masyarakat sekitar Anda!\nb. Mengapa pelestarian nilai luhur dan kearifan lokal tetap penting dipertahankan di tengah derasnya arus modernisasi?\nc. Rumuskan 2 langkah nyata yang dapat Anda lakukan sebagai peserta didik SMP untuk berkontribusi positif terhadap lingkungan sosial Anda!`;
    baseItem.kunciJawaban = 'Pedoman Penilaian Tercantum pada Rubrik Penskoran Terurai.';
    baseItem.rubrikUraian = [
      {
        kriteria:
          'Menjelaskan 2 faktor pendorong perubahan sosial/ekonomi secara runut dan kontekstual sesuai materi',
        skor: 4
      },
      {
        kriteria:
          'Menganalisis urgensi kearifan lokal sebagai perekat sosial dan benteng moral bangsa secara komprehensif',
        skor: 5
      },
      {
        kriteria:
          'Merumuskan 2 aksi nyata yang realistis, solutif, dan dapat diterapkan di lingkungan sekolah/keluarga',
        skor: 6
      }
    ];
    baseItem.pembahasan =
      'Soal uraian menguji kompetensi berpikir kritis (HOTS) dan kemampuan metakognitif siswa dalam merespons fenomena sosial sekitar.';
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
    const targetIdx =
      normalized.findIndex((q) => q.type === 'uraian') !== -1
        ? normalized.findIndex((q) => q.type === 'uraian')
        : normalized.length - 1;
    normalized[targetIdx].bobotSkor += diff;
    if (normalized[targetIdx].bobotSkor < 1) normalized[targetIdx].bobotSkor = 1;
  }

  return normalized;
}
