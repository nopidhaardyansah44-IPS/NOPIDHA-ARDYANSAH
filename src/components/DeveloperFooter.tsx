import React from 'react';
import { School, Award, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const DeveloperFooter: React.FC = () => {
  return (
    <footer className="no-print app-footer bg-slate-900 text-white border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom 1: Profil Pengembang */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-400/30">
              <Award className="w-3.5 h-3.5" />
              <span>Pengembang Aplikasi</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Nopidha Ardyansah, S.Pd., M.Pd.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kepala SMP Negeri 2 Gumelar Kabupaten Banyumas Propinsi Jawa Tengah.
            </p>
            <p className="text-[11px] text-slate-400">
              Penggerak transformasi pembelajaran berdiferensiasi dan instrumen asesmen Kurikulum Merdeka berbasis penalaran bermakna (LOTS, MOTS, HOTS).
            </p>
          </div>

          {/* Kolom 2: Satuan Pendidikan & Lokasi */}
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <School className="w-4 h-4 text-indigo-400" />
              Satuan Pendidikan Pengembang
            </h4>
            <p className="font-semibold text-slate-200">
              SMP Negeri 2 Gumelar
            </p>
            <div className="flex items-start gap-1.5 text-slate-400">
              <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>
                Kecamatan Gumelar, Kabupaten Banyumas, Provinsi Jawa Tengah, Indonesia.
              </span>
            </div>
            <div className="pt-2 text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terintegrasi Standar BSKAP Kemendikbudristek RI</span>
            </div>
          </div>

          {/* Kolom 3: Petunjuk Cetak & Fitur Unggulan */}
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Fitur Lengkap Administrasi Evaluasi
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>• Format Naskah Soal A4 Resmi dengan Kop Dinas Ganda</li>
              <li>• Opsi jawaban vertikal menurun rapi (A, B, C, D)</li>
              <li>• Kisi-kisi Matriks Spesifikasi Kurikulum Merdeka</li>
              <li>• Kartu Soal Lengkap dengan Pedoman Penskoran</li>
              <li>• Tabel Norma Penilaian dengan Skor Akhir 100</li>
              <li>• Simpan PDF Otomatis Langsung Terunduh ke Folder</li>
              <li>• Ekspor File Word (.doc) Rapi Kertas A4</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>
            &copy; {new Date().getFullYear()} Si-IPS Merdeka — Aplikasi Pembuatan Soal & Administrasi Evaluasi IPS SMP.
          </p>
          <p className="font-medium text-slate-300">
            Karya: Nopidha Ardyansah, S.Pd., M.Pd. • Banyumas, Jawa Tengah
          </p>
        </div>
      </div>
    </footer>
  );
};
