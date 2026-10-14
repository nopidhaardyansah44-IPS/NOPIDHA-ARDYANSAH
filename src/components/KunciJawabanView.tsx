import React from 'react';
import { QuestionItem, SchoolProfile } from '../types';
import { Edit3 } from 'lucide-react';

interface KunciJawabanViewProps {
  questions: QuestionItem[];
  schoolProfile: SchoolProfile;
  onEditQuestion: (question: QuestionItem) => void;
}

export const KunciJawabanView: React.FC<KunciJawabanViewProps> = ({
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

      <div className="text-center mb-5">
        <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wider">
          KUNCI JAWABAN & PEDOMAN PENSKORAN
        </h3>
        <h4 className="text-xs font-semibold uppercase mt-0.5">
          MATA PELAJARAN: ILMU PENGETAHUAN SOSIAL (IPS) — KURIKULUM MERDEKA
        </h4>
        <p className="text-[11px] text-slate-600">
          Tahun Pelajaran {schoolProfile.tahunPelajaran} | Semester {schoolProfile.semester}
        </p>
      </div>

      {/* TABEL KUNCI JAWABAN & PEMBAHASAN */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black text-[11px] leading-snug">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-2 w-10">No</th>
              <th className="border border-black p-2 w-28">Bentuk Soal</th>
              <th className="border border-black p-2 w-44">Kunci Jawaban</th>
              <th className="border border-black p-2 text-left">
                Pedoman Pembahasan Konseptual & Rubrik Penilaian
              </th>
              <th className="border border-black p-2 w-16">Skor Maks.</th>
              <th className="border border-black p-2 w-10 no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/70">
                <td className="border border-black p-2 text-center font-bold">{q.nomorSoal}</td>
                <td className="border border-black p-2 text-center capitalize">
                  {q.type.replace('_', ' ')}
                </td>
                <td className="border border-black p-2 font-bold text-indigo-900 bg-indigo-50/20 text-center">
                  {q.kunciJawaban}
                </td>
                <td className="border border-black p-2 text-justify">
                  <p className="text-slate-800">{q.pembahasan}</p>

                  {/* Rubrik Penskoran Uraian jika ada */}
                  {q.rubrikUraian && q.rubrikUraian.length > 0 && (
                    <div className="mt-2 p-2 bg-slate-50 border border-slate-300 rounded-xs text-[10px]">
                      <span className="font-bold block text-slate-800 mb-1">
                        Rubrik Rincian Skor Uraian:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                        {q.rubrikUraian.map((r, rIdx) => (
                          <li key={rIdx}>
                            {r.kriteria} <span className="font-bold text-indigo-900">(Skor: {r.skor})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="border border-black p-2 text-center font-extrabold text-black">
                  {q.bobotSkor}
                </td>
                <td className="border border-black p-1 text-center no-print">
                  <button
                    onClick={() => onEditQuestion(q)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Kunci & Pembahasan"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold text-center">
              <td colSpan={4} className="border border-black p-2 text-right uppercase">
                Total Akumulasi Skor Maksimal:
              </td>
              <td className="border border-black p-2 text-indigo-950 font-extrabold text-xs">
                {questions.reduce((sum, q) => sum + q.bobotSkor, 0)}
              </td>
              <td className="border border-black p-2 no-print"></td>
            </tr>
          </tfoot>
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
