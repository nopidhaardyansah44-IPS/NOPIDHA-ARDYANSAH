import React, { useState } from 'react';
import {
  SchoolProfile,
  GeneratorFormState,
  QuestionType,
  CognitiveLevel,
  LearningExperience,
  GradeLevel
} from '../types';
import { TEMA_KURIKULUM_IPS, KurikulumTema } from '../data/kurikulumData';
import { EDUCATIONAL_IMAGES, EducationalImageItem } from '../utils/imageGenerators';
import {
  Upload,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Sparkles,
  BookOpen,
  School,
  FileCheck2,
  HelpCircle,
  X,
  Layers,
  RefreshCw,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  schoolProfile: SchoolProfile;
  setSchoolProfile: React.Dispatch<React.SetStateAction<SchoolProfile>>;
  formState: GeneratorFormState;
  setFormState: React.Dispatch<React.SetStateAction<GeneratorFormState>>;
  onGenerate: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

const COUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 50, 75, 100];

const BENTUK_SOAL_LABELS: Record<QuestionType, { title: string; desc: string }> = {
  pilihan_ganda: {
    title: 'Pilihan Ganda',
    desc: '4 pilihan (A, B, C, D) disusun menurun vertikal rapi standar ujian'
  },
  pilihan_ganda_kompleks: {
    title: 'Pilihan Ganda Kompleks',
    desc: 'Memilih lebih dari 1 jawaban benar / pernyataan asosiasi jamak'
  },
  isian_singkat: {
    title: 'Isian Singkat',
    desc: 'Pertanyaan konsep/fakta terarah dengan jawaban ringkas dan pasti'
  },
  uraian: {
    title: 'Uraian (Essay)',
    desc: 'Pertanyaan analitis komprehensif disertai rincian rubrik penskoran'
  },
  menjodohkan: {
    title: 'Menjodohkan (Matching)',
    desc: 'Tabel berpasangan antara premis kolom kiri dan respon kolom kanan'
  },
  benar_salah: {
    title: 'Benar–Salah',
    desc: 'Tabel evaluasi kebenaran pernyataan berdasarkan data stimulus'
  }
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  schoolProfile,
  setSchoolProfile,
  formState,
  setFormState,
  onGenerate,
  onReset,
  isGenerating
}) => {
  // Tab filter untuk tampilan daftar tema (Semua, Kls 7, Kls 8, Kls 9)
  const [temaFilterTab, setTemaFilterTab] = useState<'all' | '7' | '8' | '9'>('all');

  if (!isOpen) return null;

  // Pastikan selectedTemaIds memiliki nilai default yang valid
  const selectedIds: string[] =
    formState.selectedTemaIds && formState.selectedTemaIds.length > 0
      ? formState.selectedTemaIds
      : formState.temaId
      ? [formState.temaId]
      : ['k7-t1', 'k7-t2', 'k7-t3', 'k7-t4'];

  const selectedCount = selectedIds.length;
  const isAll12Selected = selectedCount === TEMA_KURIKULUM_IPS.length;

  // Filter daftar tema yang tampil sesuai tab
  const displayedThemes =
    temaFilterTab === 'all'
      ? TEMA_KURIKULUM_IPS
      : TEMA_KURIKULUM_IPS.filter((t) => t.kelas === temaFilterTab);

  const selectedInGrade = (grade: '7' | '8' | '9') =>
    selectedIds.filter((id) => {
      const t = TEMA_KURIKULUM_IPS.find((item) => item.id === id);
      return t && t.kelas === grade;
    }).length;

  const isAllSelectedInGrade = (grade: '7' | '8' | '9') =>
    selectedInGrade(grade) === 4;

  // Helper untuk memperbarui ringkasan topik materi dan tujuan pembelajaran otomatis
  const updateSummaryText = (newSelectedIds: string[], targetGrade?: GradeLevel) => {
    const chosenThemes = TEMA_KURIKULUM_IPS.filter((t) => newSelectedIds.includes(t.id));
    
    // Tentukan kelas yang tepat
    let determinedGrade: GradeLevel = targetGrade || formState.kelas;
    const has7 = chosenThemes.some((t) => t.kelas === '7');
    const has8 = chosenThemes.some((t) => t.kelas === '8');
    const has9 = chosenThemes.some((t) => t.kelas === '9');

    if ((has7 && has8) || (has7 && has9) || (has8 && has9) || (has7 && has8 && has9)) {
      determinedGrade = 'Semua (7, 8, 9)';
    } else if (has7) {
      determinedGrade = '7';
    } else if (has8) {
      determinedGrade = '8';
    } else if (has9) {
      determinedGrade = '9';
    }

    let topik = '';
    let tp = '';

    if (newSelectedIds.length === TEMA_KURIKULUM_IPS.length) {
      topik = 'Seluruh Tema IPS Kurikulum Merdeka (Kelas 7, 8, dan 9 - 12 Tema Lengkap)';
      tp = 'Menganalisis Capaian Pembelajaran IPS SMP Fase D secara menyeluruh (Keruangan, Interaksi Sosial, Dinamika Kependudukan, Kegiatan Ekonomi, dan Sejarah/Diplomasi).';
    } else if (chosenThemes.length === 1) {
      topik = chosenThemes[0].judul;
      tp = chosenThemes[0].tujuanPembelajaranPreset[0] || chosenThemes[0].capaianPembelajaran;
    } else if (chosenThemes.length > 1) {
      const gradeLabels = [has7 ? 'Kls 7' : '', has8 ? 'Kls 8' : '', has9 ? 'Kls 9' : ''].filter(Boolean).join(', ');
      topik = `Gabungan ${chosenThemes.length} Tema Terpilih IPS SMP (${gradeLabels})`;
      tp = `Menganalisis capaian pembelajaran terpadu pada tema-tema terpilih: ${chosenThemes.map((t) => t.judul.split(':')[0]).join(', ')}.`;
    }

    return { determinedGrade, topik, tp };
  };

  // Handler: Toggle single tema
  const handleToggleTema = (temaId: string) => {
    const exists = selectedIds.includes(temaId);
    let nextIds: string[];

    if (exists) {
      if (selectedIds.length === 1) return; // Minimal 1 tema aktif
      nextIds = selectedIds.filter((id) => id !== temaId);
    } else {
      nextIds = [...selectedIds, temaId];
    }

    const { determinedGrade, topik, tp } = updateSummaryText(nextIds);

    setFormState((prev) => ({
      ...prev,
      kelas: determinedGrade,
      selectedTemaIds: nextIds,
      temaId: nextIds[0],
      topikMateri: topik,
      tujuanPembelajaran: tp
    }));
  };

  // Handler: Pilih SEMUA 12 tema Kelas 7, 8, dan 9
  const handleSelectAllThemes = () => {
    const allIds = TEMA_KURIKULUM_IPS.map((t) => t.id);
    const { determinedGrade, topik, tp } = updateSummaryText(allIds, 'Semua (7, 8, 9)');

    setFormState((prev) => ({
      ...prev,
      kelas: determinedGrade,
      selectedTemaIds: allIds,
      temaId: allIds[0],
      topikMateri: topik,
      tujuanPembelajaran: tp
    }));
  };

  // Handler: Toggle seluruh tema untuk satu kelas tertentu
  const handleToggleAllInGrade = (grade: '7' | '8' | '9') => {
    const gradeThemeIds = TEMA_KURIKULUM_IPS.filter((t) => t.kelas === grade).map((t) => t.id);
    const alreadyAll = isAllSelectedInGrade(grade);

    let nextIds: string[];
    if (alreadyAll) {
      // Hapus tema kelas ini kecuali jika itu akan membuat kosong
      const remaining = selectedIds.filter((id) => !gradeThemeIds.includes(id));
      nextIds = remaining.length > 0 ? remaining : [gradeThemeIds[0]];
    } else {
      // Tambahkan semua tema kelas ini
      nextIds = Array.from(new Set([...selectedIds, ...gradeThemeIds]));
    }

    const { determinedGrade, topik, tp } = updateSummaryText(nextIds);

    setFormState((prev) => ({
      ...prev,
      kelas: determinedGrade,
      selectedTemaIds: nextIds,
      temaId: nextIds[0],
      topikMateri: topik,
      tujuanPembelajaran: tp
    }));
  };

  // Handler: Ganti Tingkat Kelas di dropdown atas
  const handleKelasDropdownChange = (newKelas: GradeLevel) => {
    if (newKelas === 'Semua (7, 8, 9)') {
      handleSelectAllThemes();
    } else {
      // Pilih seluruh tema kelas tersebut
      const gradeThemeIds = TEMA_KURIKULUM_IPS.filter((t) => t.kelas === newKelas).map((t) => t.id);
      const { determinedGrade, topik, tp } = updateSummaryText(gradeThemeIds, newKelas);

      setTemaFilterTab(newKelas);
      setFormState((prev) => ({
        ...prev,
        kelas: determinedGrade,
        selectedTemaIds: gradeThemeIds,
        temaId: gradeThemeIds[0],
        topikMateri: topik,
        tujuanPembelajaran: tp
      }));
    }
  };

  // Handler: Reset pilihan tema
  const handleResetTemaSelection = () => {
    const defaultIds = ['k7-t1', 'k7-t2', 'k7-t3', 'k7-t4'];
    const { determinedGrade, topik, tp } = updateSummaryText(defaultIds, '7');
    setTemaFilterTab('7');
    setFormState((prev) => ({
      ...prev,
      kelas: determinedGrade,
      selectedTemaIds: defaultIds,
      temaId: defaultIds[0],
      topikMateri: topik,
      tujuanPembelajaran: tp
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSchoolProfile((prev) => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleBentukSoal = (type: QuestionType) => {
    setFormState((prev) => ({
      ...prev,
      bentukSoalConfig: {
        ...prev.bentukSoalConfig,
        [type]: {
          ...prev.bentukSoalConfig[type],
          enabled: !prev.bentukSoalConfig[type].enabled
        }
      }
    }));
  };

  const setBentukSoalCount = (type: QuestionType, count: number) => {
    setFormState((prev) => ({
      ...prev,
      bentukSoalConfig: {
        ...prev.bentukSoalConfig,
        [type]: {
          ...prev.bentukSoalConfig[type],
          count
        }
      }
    }));
  };

  const toggleCognitiveLevel = (level: CognitiveLevel) => {
    setFormState((prev) => {
      const exists = prev.tingkatKesulitan.includes(level);
      let updated: CognitiveLevel[];
      if (exists) {
        if (prev.tingkatKesulitan.length === 1) return prev; // Minimal 1 terpilih
        updated = prev.tingkatKesulitan.filter((l) => l !== level);
      } else {
        updated = [...prev.tingkatKesulitan, level];
      }
      return { ...prev, tingkatKesulitan: updated };
    });
  };

  const toggleLearningExperience = (exp: LearningExperience) => {
    setFormState((prev) => {
      const exists = prev.pengalamanBelajar.includes(exp);
      let updated: LearningExperience[];
      if (exists) {
        if (prev.pengalamanBelajar.length === 1) return prev; // Minimal 1 terpilih
        updated = prev.pengalamanBelajar.filter((e) => e !== exp);
      } else {
        updated = [...prev.pengalamanBelajar, exp];
      }
      return { ...prev, pengalamanBelajar: updated };
    });
  };

  // Hitung total butir yang akan dibuat
  const totalItems = Object.entries(formState.bentukSoalConfig)
    .filter(([_, cfg]) => cfg.enabled)
    .reduce((sum, [_, cfg]) => sum + (cfg.count || 5), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <School className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Dasbor Admin & Pengaturan Pembuatan Soal</h2>
              <p className="text-xs text-indigo-200">
                Mata Pelajaran: Ilmu Pengetahuan Sosial (IPS) Jenjang SMP - Kurikulum Merdeka (Kelas 7, 8, 9)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-800">
          {/* SECTION 1: Identitas Sekolah & Kop Naskah Ujian */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <School className="w-4 h-4 text-indigo-600" />
                1. Identitas Satuan Pendidikan & Pejabat Sekolah
              </h3>
              <span className="text-[11px] text-slate-500">Tercetak di Kop Naskah Resmi A4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Logo Upload Box */}
              <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:border-indigo-400 transition-colors text-center">
                {schoolProfile.logoUrl ? (
                  <div className="relative group">
                    <img
                      src={schoolProfile.logoUrl}
                      alt="Logo Sekolah"
                      className="h-20 w-20 object-contain mx-auto mb-2"
                    />
                    <button
                      onClick={() => setSchoolProfile((p) => ({ ...p, logoUrl: '' }))}
                      className="text-[10px] text-rose-600 hover:underline block"
                    >
                      Hapus / Ganti Logo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-7 h-7 text-indigo-500 mb-1" />
                    <span className="text-xs font-semibold text-indigo-700">Unggah Logo Sekolah</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, SVG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Data Sekolah */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Sekolah</label>
                  <input
                    type="text"
                    value={schoolProfile.namaSekolah}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, namaSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Contoh: SMP Negeri 2 Gumelar"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={schoolProfile.tahunPelajaran}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, tahunPelajaran: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="2026/2027"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Alamat Sekolah</label>
                  <input
                    type="text"
                    value={schoolProfile.alamatSekolah}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, alamatSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Jl. Raya Gumelar No. 12, Banyumas, Jawa Tengah"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    value={schoolProfile.namaKepalaSekolah}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, namaKepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Nopidha Ardyansah, S.Pd., M.Pd."
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    value={schoolProfile.nipKepalaSekolah}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, nipKepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="19820514 200801 1 009"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Guru Mata Pelajaran</label>
                  <input
                    type="text"
                    value={schoolProfile.namaGuru}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, namaGuru: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Nama Guru Pengampu IPS"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIP Guru</label>
                  <input
                    type="text"
                    value={schoolProfile.nipGuru}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, nipGuru: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="NIP Guru Pengampu"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Jenjang, Kelas, Tema (Multi-Select / Pilih Semua) & Topik Materi */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                2. Jenjang Pendidikan & Kurikulum IPS SMP (Kelas 7, 8, 9)
              </h3>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Jenjang SMP (Fase D)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenjang Pendidikan</label>
                <div className="w-full px-3 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300">
                  Sekolah Menengah Pertama (SMP)
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tingkat Kelas</label>
                <select
                  value={formState.kelas}
                  onChange={(e) => handleKelasDropdownChange(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Semua (7, 8, 9)">✨ Semua Kelas (Kelas 7, 8, & 9 - Fase D)</option>
                  <option value="7">Kelas VII (Tujuh) SMP</option>
                  <option value="8">Kelas VIII (Delapan) SMP</option>
                  <option value="9">Kelas IX (Sembilan) SMP</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis Asesmen</label>
                <input
                  type="text"
                  value={schoolProfile.jenisPenilaian}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, jenisPenilaian: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="Asesmen Sumatif Akhir Semester"
                />
              </div>
            </div>

            {/* Pilihan Tema Multi-Select: Pengguna Dapat Memilih Sebagian atau Semua Tema Kelas 7, 8, 9 */}
            <div className="space-y-3 text-xs border border-indigo-200 rounded-xl p-3.5 bg-white shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-900 text-sm">
                      Pilihan Tema IPS Kurikulum Merdeka (Kelas 7, 8, 9):
                    </label>
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      {selectedCount} dari 12 Tema Terpilih
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Centang tema yang diinginkan atau klik tombol <strong>"Pilih Semua Tema (7, 8, 9)"</strong> untuk mencakup seluruh kurikulum SMP.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSelectAllThemes}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isAll12Selected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    title="Pilih seluruh 12 tema Kurikulum Merdeka kelas 7, 8, dan 9 sekaligus"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{isAll12Selected ? '✓ Seluruh 12 Tema Terpilih' : '✨ Pilih Semua Tema (7, 8, 9)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetTemaSelection}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Kembalikan ke tema default kelas 7"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs by Grade & Quick Grade Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTemaFilterTab('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      temaFilterTab === 'all'
                        ? 'bg-white text-indigo-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({selectedCount}/12)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemaFilterTab('7')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      temaFilterTab === '7'
                        ? 'bg-white text-indigo-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kelas VII ({selectedInGrade('7')}/4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemaFilterTab('8')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      temaFilterTab === '8'
                        ? 'bg-white text-indigo-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kelas VIII ({selectedInGrade('8')}/4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemaFilterTab('9')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      temaFilterTab === '9'
                        ? 'bg-white text-indigo-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kelas IX ({selectedInGrade('9')}/4)
                  </button>
                </div>

                {/* Per-Class Quick Select Toggles */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 hidden md:inline">Pilih per kelas:</span>
                  <button
                    type="button"
                    onClick={() => handleToggleAllInGrade('7')}
                    className={`px-2 py-0.5 rounded border font-medium transition-colors ${
                      isAllSelectedInGrade('7')
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                    }`}
                  >
                    {isAllSelectedInGrade('7') ? '✓ Semua Kls 7' : '+ Semua Kls 7'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAllInGrade('8')}
                    className={`px-2 py-0.5 rounded border font-medium transition-colors ${
                      isAllSelectedInGrade('8')
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                    }`}
                  >
                    {isAllSelectedInGrade('8') ? '✓ Semua Kls 8' : '+ Semua Kls 8'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAllInGrade('9')}
                    className={`px-2 py-0.5 rounded border font-medium transition-colors ${
                      isAllSelectedInGrade('9')
                        ? 'bg-purple-600 text-white border-purple-700'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
                    }`}
                  >
                    {isAllSelectedInGrade('9') ? '✓ Semua Kls 9' : '+ Semua Kls 9'}
                  </button>
                </div>
              </div>

              {/* Grid of Theme Cards with Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {displayedThemes.map((tema) => {
                  const isChecked = selectedIds.includes(tema.id);
                  const gradeBadgeColor =
                    tema.kelas === '7'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : tema.kelas === '8'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-purple-100 text-purple-800 border-purple-300';

                  return (
                    <div
                      key={tema.id}
                      onClick={() => handleToggleTema(tema.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500/30 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex-shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${gradeBadgeColor}`}>
                              Kelas {tema.kelas}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">
                              {tema.id}
                            </span>
                          </div>
                          <h5 className={`font-semibold text-xs leading-snug ${isChecked ? 'text-indigo-950 font-bold' : 'text-slate-800'}`}>
                            {tema.judul}
                          </h5>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {tema.capaianPembelajaran}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Textareas for Customizing Topic and Learning Objectives */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Topik atau Materi yang Diinginkan (Otomatis menyesuaikan tema terpilih):
                  </label>
                  <textarea
                    rows={2}
                    value={formState.topikMateri}
                    onChange={(e) => setFormState({ ...formState, topikMateri: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                    placeholder="Materi yang diujikan..."
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tujuan Pembelajaran (TP) / Indikator Capaian:
                  </label>
                  <textarea
                    rows={2}
                    value={formState.tujuanPembelajaran}
                    onChange={(e) => setFormState({ ...formState, tujuanPembelajaran: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                    placeholder="Tujuan Pembelajaran yang ditargetkan..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Bentuk Soal & Otomatis Pilihan Jumlah Soal (5, 10, 15, ..., 100) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  3. Bentuk Soal & Jumlah Butir Soal (Dapat Memilih Lebih Dari Satu)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Centang bentuk soal yang diinginkan. Dropdown jumlah butir akan otomatis muncul untuk masing-masing bentuk soal.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-xs">
                Total: {totalItems} Butir
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(Object.keys(BENTUK_SOAL_LABELS) as QuestionType[]).map((type) => {
                const config = formState.bentukSoalConfig[type];
                const meta = BENTUK_SOAL_LABELS[type];
                return (
                  <div
                    key={type}
                    className={`border rounded-xl p-3.5 transition-all ${
                      config.enabled
                        ? 'bg-white border-indigo-500 ring-1 ring-indigo-500/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-2.5 cursor-pointer flex-1 select-none">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={() => toggleBentukSoal(type)}
                          className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{meta.title}</span>
                          <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                            {meta.desc}
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Jika dicentang, OTOMATIS muncul dropdown jumlah soal (5, 10, 15, ..., 100) */}
                    {config.enabled && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-indigo-900">Jumlah Soal:</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={config.count}
                            onChange={(e) => setBentukSoalCount(type, Number(e.target.value))}
                            className="px-2.5 py-1.5 border border-indigo-300 bg-indigo-50/40 rounded-lg font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          >
                            {COUNT_OPTIONS.map((val) => (
                              <option key={val} value={val}>
                                {val} Soal
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Kognitif (LOTS, MOTS, HOTS), Pengalaman Belajar & Opsi Soal Bergambar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide border-b border-slate-200 pb-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              4. Tingkat Kesulitan, Pengalaman Belajar & Soal Bergambar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Tingkat Kognitif LOTS, MOTS, HOTS */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Tingkat Kognitif / Kesulitan (Dapat dipilih ketiganya):
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Pilih kombinasi tingkat kesulitan soal yang diinginkan:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['LOTS', 'MOTS', 'HOTS'] as CognitiveLevel[]).map((level) => {
                    const isSelected = formState.tingkatKesulitan.includes(level);
                    return (
                      <button
                        type="button"
                        key={level}
                        onClick={() => toggleCognitiveLevel(level)}
                        className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                        <span>{level}</span>
                        <span className="text-[10px] font-normal opacity-85">
                          {level === 'LOTS' ? '(C1-C2)' : level === 'MOTS' ? '(C3)' : '(C4-C6)'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pengalaman Belajar */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Target Pengalaman Belajar (Dapat dipilih ketiganya):
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Memahami dasar, aplikasi konteks nyata, atau refleksi kritis:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['Memahami', 'Mengaplikasi', 'Merefleksi'] as LearningExperience[]).map((exp) => {
                    const isSelected = formState.pengalamanBelajar.includes(exp);
                    return (
                      <button
                        type="button"
                        key={exp}
                        onClick={() => toggleLearningExperience(exp)}
                        className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                        <span>{exp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Opsi Soal Bergambar (Aktif & Berfungsi Penuh) */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-indigo-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.soalBergambarEnabled}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        soalBergambarEnabled: e.target.checked
                      }))
                    }
                    className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      Sertakan Butir Soal Bergambar (Peta, Kurva Pasar, Bagan Pelaku Ekonomi, Piramida Penduduk)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Gambar otomatis muncul pada butir soal dan 100% ikut terunduh dalam file PDF &amp; dokumen Word (.doc).
                    </span>
                  </div>
                </label>

                {formState.soalBergambarEnabled && (
                  <div className="flex items-center gap-2 text-xs flex-shrink-0">
                    <span className="font-semibold text-slate-700">Jumlah Soal Bergambar:</span>
                    <select
                      value={formState.jumlahSoalBergambar}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          jumlahSoalBergambar: Number(e.target.value)
                        }))
                      }
                      className="px-2.5 py-1.5 border border-indigo-300 bg-indigo-50/50 rounded-lg font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      <option value={1}>1 Soal Bergambar</option>
                      <option value={2}>2 Soal Bergambar</option>
                      <option value={3}>3 Soal Bergambar</option>
                      <option value={4}>4 Soal Bergambar</option>
                      <option value={5}>5 Soal Bergambar</option>
                      <option value={6}>6 Soal Bergambar</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded-lg transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Pengaturan Awal</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors shadow-2xs"
            >
              Tutup
            </button>

            <button
              onClick={onGenerate}
              disabled={isGenerating || totalItems === 0}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? 'Memproses Paket Soal...'
                  : `Generate & Buat ${totalItems} Soal (${selectedCount} Tema Terpilih)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
