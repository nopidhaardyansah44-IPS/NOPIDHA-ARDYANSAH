export type QuestionType =
  | 'pilihan_ganda'
  | 'pilihan_ganda_kompleks'
  | 'isian_singkat'
  | 'uraian'
  | 'menjodohkan'
  | 'benar_salah';

export type CognitiveLevel = 'LOTS' | 'MOTS' | 'HOTS';

export type LearningExperience = 'Memahami' | 'Mengaplikasi' | 'Merefleksi';

export type GradeLevel = '7' | '8' | '9';

export interface SchoolProfile {
  logoUrl: string;
  namaSekolah: string;
  alamatSekolah: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaGuru: string;
  nipGuru: string;
  tahunPelajaran: string;
  semester: 'Ganjil' | 'Genap';
  alokasiWaktu: string;
  jenisPenilaian: string; // e.g. "Asesmen Sumatif Akhir Semester (SAS)" atau "Asesmen Formatif"
}

export interface QuestionImage {
  url: string; // Base64 data URL or SVG data URI
  caption: string;
  tipe: 'peta' | 'grafik' | 'diagram' | 'foto' | 'infografik';
}

export interface QuestionItem {
  id: string;
  nomorSoal: number;
  type: QuestionType;
  tingkatKesulitan: CognitiveLevel;
  pengalamanBelajar: LearningExperience;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materi: string;
  indikatorSoal: string;
  stimulus?: string; // Teks pengantar / kasus nyata
  gambar?: QuestionImage | null;
  pertanyaan: string;
  opsi?: string[]; // Untuk pilihan ganda: [A, B, C, D]
  kunciJawaban: string; // Kunci jawaban teks atau kode
  rubrikUraian?: { kriteria: string; skor: number }[];
  menjodohkanPairs?: { premis: string; respon: string }[];
  pernyataanBenarSalah?: { pernyataan: string; jawaban: 'Benar' | 'Salah'; alasan?: string }[];
  bobotSkor: number;
  pembahasan: string;
  bukuSumber: string;
}

export interface QuestionTypeConfig {
  enabled: boolean;
  count: number;
}

export interface GeneratorFormState {
  jenjang: 'SMP';
  kelas: GradeLevel;
  temaId: string;
  topikMateri: string;
  tujuanPembelajaran: string;
  bentukSoalConfig: Record<QuestionType, QuestionTypeConfig>;
  tingkatKesulitan: CognitiveLevel[]; // LOTS, MOTS, HOTS
  pengalamanBelajar: LearningExperience[]; // Memahami, Mengaplikasi, Merefleksi
  soalBergambarEnabled: boolean;
  jumlahSoalBergambar: number;
}

export type ActiveTab = 'naskah' | 'kisi_kisi' | 'kartu_soal' | 'kunci_jawaban' | 'norma_penilaian';
