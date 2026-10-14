import React from 'react';
import { QuestionItem, SchoolProfile } from '../types';
import { Edit3 } from 'lucide-react';

interface KartuSoalViewProps {
  questions: QuestionItem[];
  schoolProfile: SchoolProfile;
  onEditQuestion: (question: QuestionItem) => void;
}

export const KartuSoalView: React.FC<KartuSoalViewProps> = ({
  questions,
  schoolProfile,
  onEditQuestion
}) => {
  return (
    <div id="printable-document-content" className="a4-preview-page printable-document font-serif text-slate-900 leading-normal">
      {/* JUDUL */}
      <div className="text-center mb-6 border-b-2 border-black pb-3">
        <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider">
          KARTU SOAL ASESMEN SUMATIF
        </h3>
        <h4 className="text-xs sm:text-sm font-semibold uppercase">
          MATA PELAJARAN: ILMU PENGETAHUAN SOSIAL (IPS) — KURIKULUM MERDEKA
        </h4>
        <p className="text-[11px] text-slate-700">
          {schoolProfile.namaSekolah} | Tahun Pelajaran {schoolProfile.tahunPelajaran}
        </p>
      </div>

      {/* KARTU PER BUTIR SOAL */}
      <div className="space-y-8">
        {questions.map((q) => {
          return (
            <div
              key={q.id}
              className="kartu-soal-card border-2 border-black p-3.5 bg-white relative rounded-xs text-xs"
            >
              {/* Tombol edit (No-Print) */}
              <div className="no-print absolute top-2 right-2 flex items-center gap-1">
                <button
                  onClick={() => onEditQuestion(q)}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-semibold flex items-center gap-1 hover:bg-indigo-100"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Kartu
                </button>
              </div>

              {/* Header Kartu */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-black pb-2 mb-2 font-medium">
                <div>
                  <span className="text-slate-600 block text-[10px]">Satuan Pendidikan:</span>
                  <span className="font-bold">{schoolProfile.namaSekolah}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Mata Pelajaran:</span>
                  <span className="font-bold">IPS (Kurikulum Merdeka)</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Bentuk Soal:</span>
                  <span className="font-bold capitalize">{q.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Nomor & Skor:</span>
                  <span className="font-bold text-indigo-900">
                    No. {q.nomorSoal} (Skor: {q.bobotSkor})
                  </span>
                </div>
              </div>

              {/* Atribut Pedagogis */}
              <div className="space-y-1.5 border-b border-black pb-2 mb-2 text-[11px]">
                <div className="flex">
                  <span className="w-36 font-semibold flex-shrink-0">Level Kognitif / Pengalaman</span>
                  <span className="mr-1">:</span>
                  <span className="font-bold text-indigo-900">
                    {q.tingkatKesulitan} ({q.pengalamanBelajar})
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold flex-shrink-0">Capaian Pembelajaran (CP)</span>
                  <span className="mr-1">:</span>
                  <span className="text-justify">{q.capaianPembelajaran}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold flex-shrink-0">Tujuan Pembelajaran (TP)</span>
                  <span className="mr-1">:</span>
                  <span className="text-justify">{q.tujuanPembelajaran}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold flex-shrink-0">Lingkup Materi</span>
                  <span className="mr-1">:</span>
                  <span className="font-bold">{q.materi}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold flex-shrink-0">Indikator Soal</span>
                  <span className="mr-1">:</span>
                  <span className="text-justify">{q.indikatorSoal}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold flex-shrink-0">Buku Sumber / Acuan</span>
                  <span className="mr-1">:</span>
                  <span className="italic text-slate-700">{q.bukuSumber}</span>
                </div>
              </div>

              {/* Kotak Butir Soal */}
              <div className="bg-slate-50/50 p-3 border border-slate-300 rounded-xs mb-3 space-y-2">
                <span className="font-bold block uppercase tracking-wide text-[10px] text-slate-700">
                  KUTIPAN BUTIR SOAL:
                </span>
                {q.stimulus && (
                  <p className="italic text-slate-800 text-justify bg-white p-2 border border-slate-200">
                    {q.stimulus}
                  </p>
                )}
                {q.gambar && (
                  <div className="text-center my-2">
                    <img
                      src={q.gambar.url}
                      alt={q.gambar.caption}
                      className="max-h-44 max-w-sm mx-auto border border-slate-300"
                    />
                    <span className="text-[10px] italic text-slate-600 block mt-0.5">
                      {q.gambar.caption}
                    </span>
                  </div>
                )}
                <div className="font-bold text-black text-justify">{q.pertanyaan}</div>

                {/* Opsi Jawaban Menurun */}
                {q.opsi && q.opsi.length > 0 && (
                  <div className="pl-3 space-y-1 mt-1">
                    {q.opsi.map((op, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold min-w-[16px]">
                          {['A', 'B', 'C', 'D'][idx]}.
                        </span>
                        <span>{op}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Menjodohkan Pairs */}
                {q.menjodohkanPairs && q.menjodohkanPairs.length > 0 && (
                  <table className="w-full border-collapse border border-slate-400 mt-2 text-[10px]">
                    <tbody>
                      {q.menjodohkanPairs.map((pair, pIdx) => (
                        <tr key={pIdx}>
                          <td className="border border-slate-400 p-1 w-1/2">{pair.premis}</td>
                          <td className="border border-slate-400 p-1 w-1/2 font-medium">{pair.respon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Kunci Jawaban & Pembahasan */}
              <div className="border border-emerald-300 bg-emerald-50/40 p-2.5 rounded-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-950 uppercase text-[11px]">
                    KUNCI JAWABAN:
                  </span>
                  <span className="font-extrabold text-emerald-800 text-xs bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {q.kunciJawaban}
                  </span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-800 text-[10px]">
                    Pedoman Pembahasan & Penskoran:
                  </span>
                  <p className="text-slate-700 text-justify text-[11px] leading-relaxed">
                    {q.pembahasan}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
