import React from 'react';
import { QuestionItem, SchoolProfile } from '../types';
import { Edit3 } from 'lucide-react';

interface KisiKisiViewProps {
  questions: QuestionItem[];
  schoolProfile: SchoolProfile;
  onEditQuestion: (question: QuestionItem) => void;
}

export const KisiKisiView: React.FC<KisiKisiViewProps> = ({
  questions,
  schoolProfile,
  onEditQuestion
}) => {
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

      <div className="text-center mb-4">
        <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wider">
          KISI-KISI PENULISAN SOAL ASESMEN SUMATIF
        </h3>
        <h4 className="text-xs font-semibold uppercase mt-0.5">
          MATA PELAJARAN: ILMU PENGETAHUAN SOSIAL (IPS) — KURIKULUM MERDEKA
        </h4>
        <p className="text-[11px] text-slate-600">
          Tahun Pelajaran {schoolProfile.tahunPelajaran} | Semester {schoolProfile.semester}
        </p>
      </div>

      {/* TABEL SPESIFIKASI KISI-KISI */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black text-[11px] leading-snug">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-2 w-7">No</th>
              <th className="border border-black p-2 w-1/5 text-left">Capaian Pembelajaran (CP)</th>
              <th className="border border-black p-2 w-1/5 text-left">Tujuan Pembelajaran / Materi</th>
              <th className="border border-black p-2 text-left">Indikator Soal</th>
              <th className="border border-black p-2 w-20">Level Kognitif</th>
              <th className="border border-black p-2 w-24">Bentuk Soal</th>
              <th className="border border-black p-2 w-10">No.</th>
              <th className="border border-black p-2 w-10">Skor</th>
              <th className="border border-black p-2 w-10 no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.id} className="kisi-kisi-row hover:bg-slate-50/70">
                <td className="border border-black p-1.5 text-center font-semibold">{idx + 1}</td>
                <td className="border border-black p-1.5 text-justify">{q.capaianPembelajaran}</td>
                <td className="border border-black p-1.5">
                  <span className="font-bold block text-indigo-950">{q.materi}</span>
                  <span className="text-[10px] text-slate-600 block mt-0.5">{q.tujuanPembelajaran}</span>
                </td>
                <td className="border border-black p-1.5 text-justify">
                  {q.indikatorSoal}
                  {q.gambar && (
                    <span className="block mt-1 text-[9.5px] italic text-indigo-700">
                      (Disertai stimulus gambar: {q.gambar.tipe})
                    </span>
                  )}
                </td>
                <td className="border border-black p-1.5 text-center">
                  <span className="font-bold block text-slate-900">{q.tingkatKesulitan}</span>
                  <span className="text-[9.5px] text-slate-600 block">({q.pengalamanBelajar})</span>
                </td>
                <td className="border border-black p-1.5 text-center capitalize">
                  {q.type.replace('_', ' ')}
                </td>
                <td className="border border-black p-1.5 text-center font-bold">{q.nomorSoal}</td>
                <td className="border border-black p-1.5 text-center font-bold">{q.bobotSkor}</td>
                <td className="border border-black p-1 text-center no-print">
                  <button
                    onClick={() => onEditQuestion(q)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Kisi-Kisi Soal"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <p className="font-semibold">Guru Penyusun Kisi-Kisi</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-sm">{schoolProfile.namaGuru}</p>
            <p>NIP. {schoolProfile.nipGuru}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
