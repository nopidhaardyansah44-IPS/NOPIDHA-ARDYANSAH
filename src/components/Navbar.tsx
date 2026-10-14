import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ActiveTab, QuestionItem, SchoolProfile } from '../types';
import { exportToWordDocument } from '../utils/exportWord';
import { exportToPdfDocument, triggerDirectPrint } from '../utils/exportPdf';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  questions: QuestionItem[];
  schoolProfile: SchoolProfile;
  onOpenConfig: () => void;
  onResetQuestions: () => void;
  isGenerating: boolean;
  onNotify?: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  questions,
  schoolProfile,
  onOpenConfig,
  onResetQuestions,
  isGenerating,
  onNotify
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setPdfStatus('Memproses simpan PDF...');
    const filename = `Naskah_Soal_IPS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}_${activeTab}`;
    
    if (onNotify) {
      onNotify('Memulai pembuatan file PDF otomatis (resolusi tinggi)...');
    }

    const success = await exportToPdfDocument('printable-document-content', filename, (msg) => {
      setPdfStatus(msg);
    });

    if (success && onNotify) {
      onNotify(`File PDF "${filename}.pdf" berhasil diunduh ke folder Downloads!`);
    }

    setTimeout(() => {
      setDownloadingPdf(false);
      setPdfStatus(null);
    }, 1800);
  };

  const handlePrintDocument = () => {
    if (onNotify) {
      onNotify('Membuka dialog cetak dokumen (Printer / PDF)...');
    }
    triggerDirectPrint('printable-document-content');
  };

  const handleExportWord = async () => {
    if (onNotify) {
      onNotify('Memproses ekspor file Microsoft Word (.doc)...');
    }
    await exportToWordDocument(activeTab, questions, schoolProfile);
    if (onNotify) {
      onNotify('Dokumen Microsoft Word berhasil diunduh!');
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Pengembang Resmi */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-indigo-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
              Kurikulum Merdeka IPS SMP
            </span>
            <span className="font-medium text-indigo-100 hidden md:inline">
              Standar Asesmen Kemendikbudristek RI
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-200 text-center sm:text-right">
            <span className="text-slate-400">Pengembang:</span>
            <span className="font-semibold text-white">Nopidha Ardyansah, S.Pd., M.Pd.</span>
            <span className="text-indigo-300 hidden lg:inline">
              (Kepala SMP Negeri 2 Gumelar Kab. Banyumas Propinsi Jawa Tengah)
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 font-bold text-lg">
            IPS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Si-IPS Merdeka
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                v2.6 Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Generator Naskah Soal, Kisi-Kisi, Kartu Soal, & Norma Penilaian (Skor 100)
            </p>
          </div>
        </div>

        {/* Action Buttons: Cetak, Simpan PDF, Ekspor Word, Konfigurasi, Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenConfig}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors shadow-xs"
            title="Buka Dasbor Konfigurasi Soal & Sekolah"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>Pengaturan & Buat Soal</span>
          </button>

          <button
            onClick={handleExportWord}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-300 transition-colors shadow-xs"
            title="Ekspor ke Microsoft Word (.doc) Rapi Kertas A4"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Ekspor Word (A4)</span>
          </button>

          {/* Tombol Simpan PDF Otomatis Aktif & Berfungsi */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
            title="Simpan dokumen otomatis langsung terunduh sebagai file PDF ke folder Downloads"
          >
            <Download className={`w-4 h-4 text-indigo-100 ${downloadingPdf ? 'animate-bounce' : ''}`} />
            <span>{downloadingPdf ? (pdfStatus || 'Menyimpan PDF...') : 'Simpan PDF Otomatis'}</span>
          </button>

          {/* Tombol Cetak Dokumen Aktif & Berfungsi */}
          <button
            onClick={handlePrintDocument}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 rounded-lg border border-emerald-300 transition-all shadow-xs cursor-pointer"
            title="Cetak Naskah Dokumen Langsung via Printer atau Dialog Cetak Browser"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Cetak Dokumen</span>
          </button>

          <button
            onClick={onResetQuestions}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors shadow-xs"
            title="Reset Seluruh Soal & Formulir"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Reset Soal</span>
          </button>
        </div>
      </div>

      {/* Progress Toast Bar if PDF is downloading */}
      {downloadingPdf && (
        <div className="bg-indigo-50 border-t border-indigo-200 px-4 py-2 text-xs text-indigo-900 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="font-medium">{pdfStatus} File PDF Anda akan otomatis tersimpan di folder Unduhan (Downloads).</span>
        </div>
      )}
    </header>
  );
};
