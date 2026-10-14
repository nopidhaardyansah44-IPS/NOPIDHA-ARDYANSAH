import React, { useState } from 'react';
import {
  SchoolProfile,
  GeneratorFormState,
  QuestionType,
  CognitiveLevel,
  LearningExperience,
  GradeLevel
} from '../types';
import { TEMA_KURIKULUM_IPS } from '../data/kurikulumData';
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
  CheckCircle2
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
  if (!isOpen) return null;

  // Filter tema berdasarkan kelas terpilih
  const currentThemes = TEMA_KURIKULUM_IPS.filter((t) => t.kelas === formState.kelas);

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

  const handleKelasChange = (newKelas: GradeLevel) => {
    const firstTema = TEMA_KURIKULUM_IPS.find((t) => t.kelas === newKelas);
    setFormState((prev) => ({
      ...prev,
      kelas: newKelas,
      temaId: firstTema ? firstTema.id : prev.temaId,
      topikMateri: firstTema ? firstTema.judul : prev.topikMateri,
      tujuanPembelajaran: firstTema ? firstTema.tujuanPembelajaranPreset[0] : prev.tujuanPembelajaran
    }));
  };

  const handleTemaChange = (temaId: string) => {
    const tema = TEMA_KURIKULUM_IPS.find((t) => t.id === temaId);
    if (tema) {
      setFormState((prev) => ({
        ...prev,
        temaId: tema.id,
        topikMateri: tema.judul,
        tujuanPembelajaran: tema.tujuanPembelajaranPreset[0] || tema.capaianPembelajaran
      }));
    }
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
                Mata Pelajaran: Ilmu Pengetahuan Sosial (IPS) Jenjang SMP - Kurikulum Merdeka
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

          {/* SECTION 2: Jenjang, Kelas, Tema & Topik Materi / Tujuan Pembelajaran */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                2. Jenjang Pendidikan & Kurikulum IPS SMP
              </h3>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Hanya Jenjang SMP (Fase D)
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
                  onChange={(e) => handleKelasChange(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
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

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pilihan Tema IPS Kurikulum Merdeka (Kelas {formState.kelas}):
                </label>
                <select
                  value={formState.temaId}
                  onChange={(e) => handleTemaChange(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50/50 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  {currentThemes.map((tema) => (
                    <option key={tema.id} value={tema.id}>
                      {tema.judul}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Topik atau Materi Spesifik yang Diinginkan:
                </label>
                <textarea
                  rows={2}
                  value={formState.topikMateri}
                  onChange={(e) => setFormState({ ...formState, topikMateri: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="Ketik materi yang ingin diujikan (contoh: Keberagaman fauna garis Wallace, circular flow diagram pelaku ekonomi, bonus demografi)..."
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="Ketik Tujuan Pembelajaran yang ditargetkan..."
                />
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

            {/* Opsi Soal Bergambar & Jumlah Soal Bergambar */}
            <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white p-3 rounded-lg border">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={formState.soalBergambarEnabled}
                  onChange={(e) => setFormState({ ...formState, soalBergambarEnabled: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Sertakan Butir Soal Bergambar (Peta, Kurva, Diagram, Infografik)
                </span>
              </label>

              {formState.soalBergambarEnabled && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Jumlah Soal Bergambar:</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formState.jumlahSoalBergambar}
                    onChange={(e) => setFormState({ ...formState, jumlahSoalBergambar: Number(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 border border-indigo-300 rounded font-bold text-center text-indigo-900 bg-indigo-50/50"
                  />
                  <span className="text-slate-500 font-semibold">Butir Soal</span>
                </div>
              )}
            </div>

            {formState.soalBergambarEnabled && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  Koleksi Ilustrasi Grafis Edukatif Siap Pakai (Otomatis Disematkan):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {(Object.values(EDUCATIONAL_IMAGES) as EducationalImageItem[]).map((img) => (
                    <div key={img.id} className="border border-slate-200 rounded p-1 text-center bg-slate-50 hover:bg-indigo-50 transition-colors">
                      <img src={img.dataUri} alt={img.title} className="h-12 w-full object-contain mx-auto bg-white rounded border border-slate-100" />
                      <span className="text-[9px] font-semibold text-slate-700 line-clamp-1 block mt-1">
                        {img.title.split('(')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer: Generate & Reset Actions */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Soal & Formulir</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Tutup
            </button>

            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-md shadow-indigo-300 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? 'Menyusun Soal...' : `Buat Soal Kurikulum Merdeka (${totalItems} Butir)`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
