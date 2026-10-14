import React, { useState } from 'react';
import { QuestionItem, SchoolProfile, QuestionType } from '../types';
import { Calculator, Award, CheckCircle } from 'lucide-react';

interface NormaPenilaianViewProps {
  questions: QuestionItem[];
  schoolProfile: SchoolProfile;
}

export const NormaPenilaianView: React.FC<NormaPenilaianViewProps> = ({
  questions,
  schoolProfile
}) => {
  const totalSkorMaksimal = questions.reduce((acc, q) => acc + q.bobotSkor, 0) || 100;

  // State untuk kalkulator simulasi penskoran siswa interaktif
  const [simulasiSkor, setSimulasiSkor] = useState<number>(85);

  // Klasifikasi bentuk soal
  const uniqueTypes = Array.from(new Set(questions.map((q) => q.type))) as QuestionType[];

  const nilaiAkhirSimulasi = Math.min(
    100,
    Math.round((simulasiSkor / totalSkorMaksimal) * 100)
  );

  return (
    <div id="printable-document-content" className="a4-preview-page printable-document font-serif text-slate-900 leading-normal">
      {/* KOP RESMI */}
      <div className="border-b-4 border-double border-black pb-3 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
            {schoolProfile.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="Logo Sekolah"
                className="max-h-16 max-w-16 object-contain"
              />
            ) : (
              <div className="w-14 h-14 rounded-full border border-indigo-900 flex items-center justify-center text-xl bg-indigo-50">
                🏛️
              </div>
            )}
          </div>

          <div className="flex-1 text-center font-serif text-black leading-tight">
            <h4 className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              PEMERINTAH KABUPATEN BANYUMAS
            </h4>
            <h3 className="text-sm sm:text-base font-bold tracking-wide uppercase">
              DINAS PENDIDIKAN
            </h3>
            <h2 className="text-base sm:text-lg font-extrabold uppercase my-0.5 tracking-wider">
              {schoolProfile.namaSekolah}
            </h2>
            <p className="text-[10px] italic text-slate-800">
              {schoolProfile.alamatSekolah}
            </p>
          </div>

          <div className="w-16 h-16 flex-shrink-0"></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-base sm:text-lg font-bold uppercase underline tracking-wider">
          NORMA PENILAIAN & TABEL PENSKORAN SKOR AKHIR 100
        </h3>
        <h4 className="text-xs sm:text-sm font-semibold uppercase mt-0.5">
          ASESMEN SUMATIF IPS SMP — STANDAR KURIKULUM MERDEKA
        </h4>
        <p className="text-[11px] text-slate-600">
          Tahun Pelajaran {schoolProfile.tahunPelajaran} | Semester {schoolProfile.semester}
        </p>
      </div>

      {/* 1. PEDOMAN PENGHITUNGAN SKOR AKHIR 100 */}
      <div className="mb-6 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wide border-b border-black pb-1">
          A. RUMUS STANDAR PENENTUAN NILAI AKHIR (SKOR AKHIR MAKSIMAL = 100)
        </h4>
        <p className="text-xs text-justify">
          Penilaian Kurikulum Merdeka menggunakan prinsip asesmen autentik dan berkeadilan. Nilai akhir peserta didik diperoleh melalui penghitungan proporsional antara total skor perolehan siswa dengan total skor maksimal instrumen, yang diformulasikan sebagai berikut:
        </p>

        <div className="bg-slate-100 border-2 border-black p-3 text-center my-3 rounded-xs">
          <div className="text-xs sm:text-sm font-bold font-mono text-black">
            NILAI AKHIR (NA) = ( &Sigma; Skor Perolehan Peserta Didik / {totalSkorMaksimal} ) &times; 100
          </div>
          <p className="text-[10px] text-slate-600 mt-1 italic">
            Keterangan: Skor Maksimal = {totalSkorMaksimal} | Nilai Akhir Otomatis Terstandarisasi Rentang 0 s.d. 100
          </p>
        </div>
      </div>

      {/* 2. TABEL DISTRIBUSI BOBOT BENTUK SOAL */}
      <div className="mb-6 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wide border-b border-black pb-1">
          B. DISTRIBUSI BOBOT DAN PERSENTASE KONTRIBUSI TIAP BENTUK SOAL
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black p-2 w-8">No</th>
                <th className="border border-black p-2 text-left">Bentuk Soal</th>
                <th className="border border-black p-2 w-24">Jumlah Butir</th>
                <th className="border border-black p-2 w-28">Rata-rata Bobot / Butir</th>
                <th className="border border-black p-2 w-28">Subtotal Skor</th>
                <th className="border border-black p-2 w-24">Kontribusi (%)</th>
              </tr>
            </thead>
            <tbody>
              {uniqueTypes.map((type, idx) => {
                const groupItems = questions.filter((q) => q.type === type);
                const count = groupItems.length;
                const subtotal = groupItems.reduce((acc, curr) => acc + curr.bobotSkor, 0);
                const avgScore = count > 0 ? (subtotal / count).toFixed(1) : '0';
                const percent = ((subtotal / (totalSkorMaksimal || 1)) * 100).toFixed(1);

                return (
                  <tr key={type} className="hover:bg-slate-50">
                    <td className="border border-black p-2 text-center font-semibold">{idx + 1}</td>
                    <td className="border border-black p-2 font-medium capitalize">
                      {type.replace('_', ' ')}
                    </td>
                    <td className="border border-black p-2 text-center">{count} Soal</td>
                    <td className="border border-black p-2 text-center">{avgScore} Poin</td>
                    <td className="border border-black p-2 text-center font-bold text-indigo-950">
                      {subtotal}
                    </td>
                    <td className="border border-black p-2 text-center font-semibold">{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-200 font-bold text-center">
                <td colSpan={2} className="border border-black p-2 text-right uppercase">
                  TOTAL AKUMULASI SOAL & SKOR:
                </td>
                <td className="border border-black p-2">{questions.length} Butir</td>
                <td className="border border-black p-2">—</td>
                <td className="border border-black p-2 text-indigo-950 text-sm font-extrabold">
                  {totalSkorMaksimal}
                </td>
                <td className="border border-black p-2 text-indigo-950 font-extrabold">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) */}
      <div className="mb-6 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wide border-b border-black pb-1">
          C. TABEL INTERVAL NILAI & KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs leading-snug">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black p-2 w-24">Rentang Skor</th>
                <th className="border border-black p-2 w-28">Kategori Predikat</th>
                <th className="border border-black p-2 text-left">Deskripsi Ketercapaian Kompetensi IPS</th>
                <th className="border border-black p-2 text-left w-1/3">
                  Tindak Lanjut & Intervensi Guru
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center font-bold">86 – 100</td>
                <td className="border border-black p-2 text-center font-bold text-emerald-800 bg-emerald-50/40">
                  Sangat Baik (A)
                </td>
                <td className="border border-black p-2 text-justify">
                  Peserta didik telah menuntaskan seluruh capaian pembelajaran dengan sangat komprehensif, menguasai analisis HOTS, dan mampu mengaitkan konsep IPS dengan konteks lingkungan nyata secara mandiri.
                </td>
                <td className="border border-black p-2 text-justify">
                  Diberikan program pengayaan: riset sosial mini mengenai kearifan lokal Banyumas, proyek literasi finansial keluarga, atau menjadi tutor sebaya.
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">71 – 85</td>
                <td className="border border-black p-2 text-center font-bold text-blue-800 bg-blue-50/40">
                  Baik (B)
                </td>
                <td className="border border-black p-2 text-justify">
                  Peserta didik telah mencapai ketuntasan tujuan pembelajaran IPS, memahami sebagian besar konsep ruang dan waktu, kegiatan ekonomi, serta interaksi kemasyarakatan dengan baik.
                </td>
                <td className="border border-black p-2 text-justify">
                  Melanjutkan ke materi berikutnya dan diberikan latihan penguatan penalaran tingkat evaluasi dan refleksi kritis (HOTS).
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">56 – 70</td>
                <td className="border border-black p-2 text-center font-bold text-amber-800 bg-amber-50/40">
                  Cukup (C)
                </td>
                <td className="border border-black p-2 text-justify">
                  Peserta didik mencapai batas minimal ketuntasan, namun masih mengalami kesulitan dalam menganalisis data grafik, peta kependudukan, atau stimulus kasus nyata.
                </td>
                <td className="border border-black p-2 text-justify">
                  Diberikan bimbingan terfokus pada materi yang belum dikuasai (misal: pembacaan kurva pasar atau dinamika bonus demografi) sebelum tes perbaikan.
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">&lt; 56</td>
                <td className="border border-black p-2 text-center font-bold text-rose-800 bg-rose-50/40">
                  Perlu Bimbingan (D)
                </td>
                <td className="border border-black p-2 text-justify">
                  Peserta didik belum mencapai kriteria ketuntasan tujuan pembelajaran IPS dan membutuhkan pendampingan konsep dasar secara intensif.
                </td>
                <td className="border border-black p-2 text-justify">
                  Wajib mengikuti program remedial individual, pembelajaran ulang dengan metode scaffolding, dan asesmen ulang terarah.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SIMULASI INTERAKTIF PENILAIAN (Khusus Tampilan Layar / No-Print) */}
      <div className="no-print mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2 font-bold text-indigo-900 text-xs">
          <Calculator className="w-4 h-4 text-indigo-600" />
          Kalkulator Simulasi Konversi Skor Siswa (Skala 100):
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-700">Masukkan Total Skor Mentah Siswa:</span>
            <input
              type="number"
              min={0}
              max={totalSkorMaksimal}
              value={simulasiSkor}
              onChange={(e) => setSimulasiSkor(Number(e.target.value) || 0)}
              className="w-20 px-2 py-1 bg-white border border-indigo-300 rounded font-bold text-center text-indigo-950"
            />
            <span className="text-slate-500">/ {totalSkorMaksimal} Poin</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-indigo-200">
            <span className="font-semibold text-slate-700">Nilai Akhir (Skala 100):</span>
            <span className="text-base font-extrabold text-indigo-700">{nilaiAkhirSimulasi}</span>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800">
              {nilaiAkhirSimulasi >= 86
                ? 'Sangat Baik (A)'
                : nilaiAkhirSimulasi >= 71
                ? 'Baik (B)'
                : nilaiAkhirSimulasi >= 56
                ? 'Cukup (C)'
                : 'Perlu Bimbingan (D)'}
            </span>
          </div>
        </div>
      </div>

      {/* TANDA TANGAN */}
      <div className="tanda-tangan-box mt-10 pt-4 text-xs text-black">
        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold">Kepala {schoolProfile.namaSekolah}</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-sm">{schoolProfile.namaKepalaSekolah}</p>
            <p>NIP. {schoolProfile.nipKepalaSekolah}</p>
          </div>

          <div>
            <p>Banyumas, .................................... 2026</p>
            <p className="font-semibold">Guru Pengampu Mata Pelajaran IPS</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-sm">{schoolProfile.namaGuru}</p>
            <p>NIP. {schoolProfile.nipGuru}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
