/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  QuestionItem,
  SchoolProfile,
  GeneratorFormState,
  QuestionType,
  CognitiveLevel,
  LearningExperience
} from './types';
import {
  DEFAULT_SCHOOL_PROFILE,
  TEMA_KURIKULUM_IPS,
  INITIAL_QUESTION_BANK
} from './data/kurikulumData';
import { Navbar } from './components/Navbar';
import { DocumentNavigation } from './components/DocumentNavigation';
import { AdminDashboard } from './components/AdminDashboard';
import { NaskahSoalView } from './components/NaskahSoalView';
import { KisiKisiView } from './components/KisiKisiView';
import { KartuSoalView } from './components/KartuSoalView';
import { KunciJawabanView } from './components/KunciJawabanView';
import { NormaPenilaianView } from './components/NormaPenilaianView';
import { EditQuestionModal } from './components/EditQuestionModal';
import { DeveloperFooter } from './components/DeveloperFooter';
import { generateQuestionSet } from './utils/questionGeneratorEngine';
import { exportToPdfDocument, triggerDirectPrint } from './utils/exportPdf';
import { exportToWordDocument } from './utils/exportWord';
import {
  Sparkles,
  Download,
  Printer,
  FileText,
  Sliders,
  CheckCircle2,
  Info,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

export default function App() {
  // 1. Profil Sekolah (disimpan di LocalStorage jika tersedia)
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem('si_ips_school_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_SCHOOL_PROFILE;
  });

  // Simpan perubahan profil sekolah ke LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('si_ips_school_profile', JSON.stringify(schoolProfile));
    } catch (e) {
      // ignore
    }
  }, [schoolProfile]);

  // 2. Daftar Butir Soal (Bank Soal Aktif)
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem('si_ips_questions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_QUESTION_BANK;
  });

  // Simpan butir soal ke LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('si_ips_questions', JSON.stringify(questions));
    } catch (e) {
      // ignore
    }
  }, [questions]);

  // 3. Tab Dokumen Aktif
  const [activeTab, setActiveTab] = useState<ActiveTab>('naskah');

  // 4. Modal Admin Konfigurasi Terbuka / Tertutup
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // 5. State Modal Edit Soal
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);

  // 6. State Loading Generator
  const [isGenerating, setIsGenerating] = useState(false);

  // 7. Notifikasi Toast
  const [notification, setNotification] = useState<string | null>(null);

  // 8. State Proses Unduh PDF
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // 9. Konfigurasi Generator Default
  const [formState, setFormState] = useState<GeneratorFormState>({
    jenjang: 'SMP',
    kelas: '7',
    temaId: 'k7-t1',
    selectedTemaIds: ['k7-t1', 'k7-t2', 'k7-t3', 'k7-t4'],
    topikMateri: 'Tema 01 s.d. 04: Kurikulum Merdeka IPS SMP Kelas 7',
    tujuanPembelajaran: 'Menjelaskan proses sosialisasi, keberagaman lingkungan alam, aktivitas ekonomi, dan pemberdayaan masyarakat.',
    bentukSoalConfig: {
      pilihan_ganda: { enabled: true, count: 5 },
      pilihan_ganda_kompleks: { enabled: true, count: 5 },
      isian_singkat: { enabled: true, count: 5 },
      uraian: { enabled: true, count: 5 },
      menjodohkan: { enabled: true, count: 5 },
      benar_salah: { enabled: true, count: 5 }
    },
    tingkatKesulitan: ['LOTS', 'MOTS', 'HOTS'],
    pengalamanBelajar: ['Memahami', 'Mengaplikasi', 'Merefleksi'],
    soalBergambarEnabled: true,
    jumlahSoalBergambar: 3
  });

  // Handler Generate Soal Baru
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateQuestionSet(formState, questions);
      setQuestions(generated);
      setIsAdminOpen(false);
      showNotification(`Berhasil membuat ${generated.length} butir soal Kurikulum Merdeka standar asesmen nasional!`);
    } catch (err) {
      console.error(err);
      showNotification('Gagal membuat paket soal. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler Reset Soal
  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh naskah soal ke pengaturan awal?')) {
      setQuestions(INITIAL_QUESTION_BANK);
      setSchoolProfile(DEFAULT_SCHOOL_PROFILE);
      setFormState({
        jenjang: 'SMP',
        kelas: '7',
        temaId: 'k7-t1',
        selectedTemaIds: ['k7-t1', 'k7-t2', 'k7-t3', 'k7-t4'],
        topikMateri: 'Tema 01 s.d. 04: Kurikulum Merdeka IPS SMP Kelas 7',
        tujuanPembelajaran: 'Menjelaskan proses sosialisasi, keberagaman lingkungan alam, aktivitas ekonomi, dan pemberdayaan masyarakat.',
        bentukSoalConfig: {
          pilihan_ganda: { enabled: true, count: 5 },
          pilihan_ganda_kompleks: { enabled: true, count: 5 },
          isian_singkat: { enabled: true, count: 5 },
          uraian: { enabled: true, count: 5 },
          menjodohkan: { enabled: true, count: 5 },
          benar_salah: { enabled: true, count: 5 }
        },
        tingkatKesulitan: ['LOTS', 'MOTS', 'HOTS'],
        pengalamanBelajar: ['Memahami', 'Mengaplikasi', 'Merefleksi'],
        soalBergambarEnabled: true,
        jumlahSoalBergambar: 3
      });
      setIsAdminOpen(false);
      showNotification('Naskah soal dan pengaturan telah berhasil direset!');
    }
  };

  // Handler Hapus Butir Soal
  const handleDeleteQuestion = (id: string) => {
    const updated = questions
      .filter((q) => q.id !== id)
      .map((q, idx) => ({ ...q, nomorSoal: idx + 1 }));
    setQuestions(updated);
    showNotification('Butir soal berhasil dihapus.');
  };

  // Handler Simpan Butir Soal yang Diedit
  const handleSaveEditedQuestion = (updated: QuestionItem) => {
    const exists = questions.some((q) => q.id === updated.id);
    let newArr: QuestionItem[];
    if (exists) {
      newArr = questions.map((q) => (q.id === updated.id ? updated : q));
    } else {
      newArr = [...questions, updated].map((q, idx) => ({ ...q, nomorSoal: idx + 1 }));
    }
    setQuestions(newArr);
    setEditingQuestion(null);
    showNotification(`Perubahan butir soal nomor ${updated.nomorSoal} berhasil disimpan!`);
  };

  // Handler Tambah Soal Manual
  const handleAddNewQuestion = () => {
    const nextNo = questions.length + 1;
    const newQ: QuestionItem = {
      id: `manual-soal-${Date.now()}`,
      nomorSoal: nextNo,
      type: 'pilihan_ganda',
      tingkatKesulitan: 'MOTS',
      pengalamanBelajar: 'Mengaplikasi',
      capaianPembelajaran: formState.topikMateri,
      tujuanPembelajaran: formState.tujuanPembelajaran,
      materi: formState.topikMateri,
      indikatorSoal: 'Peserta didik dapat menganalisis permasalahan dengan tepat.',
      stimulus: 'Tulis stimulus atau narasi bacaan di sini...',
      pertanyaan: 'Tulis pertanyaan baru Anda di sini...',
      opsi: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      kunciJawaban: 'A',
      bobotSkor: 10,
      pembahasan: 'Tulis pembahasan dan alasan jawaban yang benar.',
      bukuSumber: `Buku Siswa IPS SMP Kelas ${formState.kelas} Kemendikbudristek Kurikulum Merdeka.`
    };
    setEditingQuestion(newQ);
  };

  // Handler Cetak Dokumen Langsung (Printer / Print Dialog)
  const handleDirectPrint = () => {
    showNotification('Membuka dialog cetak dokumen (Printer / PDF)...');
    triggerDirectPrint('printable-document-content');
  };

  // Handler Simpan PDF Otomatis
  const handleSavePdfAutomatic = async () => {
    setIsPdfProcessing(true);
    setPdfProgressText('Menyiapkan file PDF otomatis...');
    showNotification('Memulai pembuatan file PDF otomatis (resolusi tinggi)...');

    const filename = `Naskah_Soal_IPS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}_${activeTab}`;
    const success = await exportToPdfDocument('printable-document-content', filename, (msg) => {
      setPdfProgressText(msg);
    });

    if (success) {
      showNotification(`File PDF "${filename}.pdf" berhasil terunduh ke folder Downloads!`);
    }

    setTimeout(() => {
      setIsPdfProcessing(false);
      setPdfProgressText(null);
    }, 1800);
  };

  // Handler Ekspor Word
  const handleExportWord = async () => {
    showNotification('Memproses ekspor file Microsoft Word (.doc)...');
    await exportToWordDocument(activeTab, questions, schoolProfile);
    showNotification('Dokumen Microsoft Word berhasil diunduh!');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#f1f5f9' }}>
      {/* 1. TOP NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        questions={questions}
        schoolProfile={schoolProfile}
        onOpenConfig={() => setIsAdminOpen(true)}
        onResetQuestions={handleReset}
        isGenerating={isGenerating}
        onNotify={showNotification}
      />

      {/* 2. SUB-NAVBAR DOKUMEN (TAB & METRIK) */}
      <DocumentNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        questions={questions}
        onAddNewQuestion={handleAddNewQuestion}
        onOpenConfig={() => setIsAdminOpen(true)}
      />

      {/* 3. NOTIFICATION POPUP / TOAST */}
      {notification && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-fade-in text-xs max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Progress Floating Toast Bar if PDF is downloading from anywhere */}
      {isPdfProcessing && (
        <div className="no-print fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-indigo-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-indigo-500 text-xs">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <span className="font-medium">{pdfProgressText || 'Memproses PDF...'}</span>
        </div>
      )}

      {/* 4. MAIN WORKSPACE / DOCUMENT PREVIEW AREA */}
      <main className="flex-1 py-6 px-2 sm:px-4">
        {/* Quick Helper Ribbon on Top of Document (Hidden on Print) */}
        <div className="no-print max-w-4xl mx-auto mb-4 bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-slate-700">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              <strong>Mode Pratinjau Kertas A4:</strong> Dokumen siap cetak dan ekspor dengan opsi jawaban vertikal menurun (A, B, C, D) dan butir soal bergambar ikut terunduh.
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tombol Cetak Dokumen Cepat */}
            <button
              onClick={handleDirectPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors shadow-xs cursor-pointer"
              title="Cetak Naskah Dokumen Langsung via Printer atau Dialog Cetak Browser"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cetak Dokumen</span>
            </button>

            {/* Tombol Simpan PDF Otomatis Cepat */}
            <button
              onClick={handleSavePdfAutomatic}
              disabled={isPdfProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              title="Simpan dokumen otomatis langsung terunduh sebagai file PDF ke folder Downloads"
            >
              <Download className={`w-3.5 h-3.5 text-indigo-100 ${isPdfProcessing ? 'animate-bounce' : ''}`} />
              <span>{isPdfProcessing ? 'Menyimpan PDF...' : 'Simpan PDF Otomatis'}</span>
            </button>

            <button
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors shadow-xs"
              title="Ekspor ke Microsoft Word (.doc) Rapi Kertas A4"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Word (A4)</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-300 transition-colors shadow-xs"
              title="Sesuaikan Komposisi Soal"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Sesuaikan</span>
            </button>
          </div>
        </div>

        {/* The Printable A4 Container */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'naskah' && (
            <NaskahSoalView
              questions={questions}
              schoolProfile={schoolProfile}
              onEditQuestion={(q) => setEditingQuestion(q)}
              onDeleteQuestion={handleDeleteQuestion}
            />
          )}

          {activeTab === 'kisi_kisi' && (
            <KisiKisiView
              questions={questions}
              schoolProfile={schoolProfile}
              onEditQuestion={(q) => setEditingQuestion(q)}
            />
          )}

          {activeTab === 'kartu_soal' && (
            <KartuSoalView
              questions={questions}
              schoolProfile={schoolProfile}
              onEditQuestion={(q) => setEditingQuestion(q)}
            />
          )}

          {activeTab === 'kunci_jawaban' && (
            <KunciJawabanView
              questions={questions}
              schoolProfile={schoolProfile}
              onEditQuestion={(q) => setEditingQuestion(q)}
            />
          )}

          {activeTab === 'norma_penilaian' && (
            <NormaPenilaianView
              questions={questions}
              schoolProfile={schoolProfile}
            />
          )}
        </div>

        {/* Bottom Document Action Bar (Hidden on Print) */}
        <div className="no-print max-w-4xl mx-auto mt-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Dokumen Asesmen Siap Dicetak &amp; Diunduh</span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Format lembar A4 resmi sesuai standar Kemendikbudristek, butir soal bergambar tersimpan tajam.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleDirectPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer text-xs"
              title="Cetak Naskah Dokumen Langsung via Printer atau Dialog Cetak Browser"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen Sekarang</span>
            </button>

            <button
              onClick={handleSavePdfAutomatic}
              disabled={isPdfProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-xs disabled:opacity-50"
              title="Simpan dokumen otomatis langsung terunduh sebagai file PDF ke folder Downloads"
            >
              <Download className={`w-4 h-4 ${isPdfProcessing ? 'animate-bounce' : ''}`} />
              <span>{isPdfProcessing ? 'Menyimpan PDF...' : 'Simpan PDF Otomatis'}</span>
            </button>

            <button
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-200 font-semibold rounded-xl border border-slate-700 transition-all text-xs"
              title="Ekspor ke Microsoft Word (.doc) Rapi Kertas A4"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Ekspor Word (.doc)</span>
            </button>
          </div>
        </div>
      </main>

      {/* 5. MODAL ADMIN KONFIGURASI SOAL */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        schoolProfile={schoolProfile}
        setSchoolProfile={setSchoolProfile}
        formState={formState}
        setFormState={setFormState}
        onGenerate={handleGenerateQuestions}
        onReset={handleReset}
        isGenerating={isGenerating}
      />

      {/* 6. MODAL EDIT BUTIR SOAL */}
      <EditQuestionModal
        question={editingQuestion}
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        onSave={handleSaveEditedQuestion}
      />

      {/* 7. DEVELOPER ATTRIBUTION FOOTER */}
      <DeveloperFooter />
    </div>
  );
}
