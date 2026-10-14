import React from 'react';
import { QuestionItem, SchoolProfile } from '../types';
import { Edit3, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface NaskahSoalViewProps {
  questions: QuestionItem[];
  schoolProfile: SchoolProfile;
  onEditQuestion: (question: QuestionItem) => void;
  onDeleteQuestion: (id: string) => void;
}

export const NaskahSoalView: React.FC<NaskahSoalViewProps> = ({
  questions,
  schoolProfile,
  onEditQuestion,
  onDeleteQuestion
}) => {
  return (
    <div id="printable-document-content" className="a4-preview-page printable-document font-serif text-slate-900 leading-normal">
      {/* 1. KOP SURAT RESMI SEKOLAH (GARIS GANDA) */}
      <div className="border-b-4 border-double border-black pb-3 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            {schoolProfile.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="Logo Sekolah"
                className="max-h-20 max-w-20 object-contain"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-indigo-900 flex items-center justify-center text-indigo-950 font-bold text-2xl bg-indigo-50">
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
            <h2 className="text-base sm:text-xl font-extrabold uppercase my-0.5 tracking-wider">
              {schoolProfile.namaSekolah}
            </h2>
            <p className="text-[10px] sm:text-xs italic text-slate-800">
              {schoolProfile.alamatSekolah}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-800">
              Tahun Pelajaran {schoolProfile.tahunPelajaran} — Semester {schoolProfile.semester}
            </p>
          </div>

          <div className="w-20 h-20 flex-shrink-0 hidden sm:flex items-center justify-center">
            {/* Lambang Tut Wuri Handayani / Kurikulum Merdeka Watermark */}
            <div className="w-14 h-14 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 text-center leading-none p-1">
              KURIKULUM MERDEKA
            </div>
          </div>
        </div>
      </div>

      {/* 2. JUDUL ASESMEN & IDENTITAS TES */}
      <div className="text-center mb-4">
        <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wider">
          {schoolProfile.jenisPenilaian}
        </h3>
        <h4 className="text-xs sm:text-sm font-semibold uppercase mt-0.5">
          MATA PELAJARAN: ILMU PENGETAHUAN SOSIAL (IPS)
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs border border-slate-300 p-2.5 rounded-xs mb-4 bg-slate-50/50">
        <div className="flex">
          <span className="w-32 font-semibold">Satuan Pendidikan</span>
          <span className="mr-1">:</span>
          <span className="font-medium">{schoolProfile.namaSekolah}</span>
        </div>
        <div className="flex">
          <span className="w-32 font-semibold">Hari, Tanggal</span>
          <span className="mr-1">:</span>
          <span>....................................</span>
        </div>
        <div className="flex">
          <span className="w-32 font-semibold">Mata Pelajaran</span>
          <span className="mr-1">:</span>
          <span className="font-medium">IPS (SMP Kurikulum Merdeka)</span>
        </div>
        <div className="flex">
          <span className="w-32 font-semibold">Alokasi Waktu</span>
          <span className="mr-1">:</span>
          <span className="font-medium">{schoolProfile.alokasiWaktu}</span>
        </div>
        <div className="flex">
          <span className="w-32 font-semibold">Semester / TP</span>
          <span className="mr-1">:</span>
          <span>{schoolProfile.semester} / {schoolProfile.tahunPelajaran}</span>
        </div>
        <div className="flex">
          <span className="w-32 font-semibold">Penyusun / Guru</span>
          <span className="mr-1">:</span>
          <span className="font-medium">{schoolProfile.namaGuru}</span>
        </div>
      </div>

      {/* 3. PETUNJUK UMUM */}
      <div className="border border-slate-300 bg-slate-50/30 p-2.5 rounded-xs mb-6 text-[11px] leading-relaxed">
        <span className="font-bold uppercase tracking-wide block mb-0.5 text-black">
          PETUNJUK UMUM:
        </span>
        <ol className="list-decimal pl-4 space-y-0.5 text-slate-800">
          <li>Berdoalah kepada Tuhan Yang Maha Esa sebelum memulai mengerjakan soal.</li>
          <li>Isikan identitas Anda secara lengkap dan benar pada Lembar Jawaban yang tersedia.</li>
          <li>Periksa dan bacalah setiap butir soal dengan cermat dan teliti sebelum Anda menjawabnya.</li>
          <li>Dahulukan menjawab butir-butir soal yang Anda anggap mudah.</li>
          <li>Periksa kembali pekerjaan Anda secara menyeluruh sebelum diserahkan kepada Pengawas Ujian.</li>
        </ol>
      </div>

      {/* 4. DAFTAR BUTIR SOAL */}
      <div className="space-y-6 text-[12px] sm:text-[13px] leading-relaxed">
        {questions.map((q, index) => {
          return (
            <div
              key={q.id}
              className="question-item relative group border-b border-slate-100 pb-5 last:border-b-0"
            >
              {/* Screen action tools (Hidden on Print) */}
              <div className="no-print absolute top-0 right-0 hidden group-hover:flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                  {q.type.replace('_', ' ')} • {q.tingkatKesulitan}
                </span>
                <button
                  onClick={() => onEditQuestion(q)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit Butir Soal"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteQuestion(q.id)}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                  title="Hapus Butir Soal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-start gap-2.5">
                {/* Nomor Soal */}
                <span className="font-bold text-black min-w-[22px] text-right">
                  {q.nomorSoal}.
                </span>

                <div className="flex-1 space-y-2">
                  {/* Stimulus Teks */}
                  {q.stimulus && (
                    <div className="text-justify text-slate-800 italic leading-relaxed bg-slate-50/50 p-2 border-l-2 border-indigo-400">
                      {q.stimulus}
                    </div>
                  )}

                  {/* Gambar / Diagram / Peta Terlampir */}
                  {q.gambar && q.gambar.url && (
                    <div className="my-3 text-center flex flex-col items-center">
                      <div className="no-print mb-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <span>📷 Soal Bergambar: {q.gambar.tipe ? q.gambar.tipe.toUpperCase() : 'ILUSTRASI'}</span>
                      </div>
                      <div className="p-2 border-2 border-slate-300 bg-white max-w-xl w-full rounded shadow-xs flex items-center justify-center">
                        <img
                          src={q.gambar.url}
                          alt={q.gambar.caption}
                          className="max-h-72 w-auto max-w-full object-contain mx-auto"
                          style={{ minHeight: '140px', display: 'block' }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold italic text-slate-700 mt-1.5 block">
                        {q.gambar.caption}
                      </span>
                    </div>
                  )}

                  {/* Kalimat Pertanyaan */}
                  <div className="font-medium text-black text-justify">
                    {q.pertanyaan}
                  </div>

                  {/* Pilihan Ganda: OPSI MENURUN A, B, C, D (VERTIKAL) */}
                  {q.opsi && q.opsi.length > 0 && (
                    <div className="options-vertical pl-3 pt-1 space-y-1.5">
                      {q.opsi.map((op, optIdx) => {
                        const optLabels = ['A', 'B', 'C', 'D', 'E'];
                        return (
                          <div key={optIdx} className="option-row flex items-start gap-2">
                            <span className="font-bold min-w-[18px]">
                              {optLabels[optIdx]}.
                            </span>
                            <span className="text-slate-800 text-justify">
                              {op}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Format Menjodohkan (Matching) */}
                  {q.menjodohkanPairs && q.menjodohkanPairs.length > 0 && (
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full border-collapse border border-black text-xs">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-black px-3 py-1.5 text-left w-1/2">
                              Pernyataan / Permasalahan (Kolom A)
                            </th>
                            <th className="border border-black px-3 py-1.5 text-left w-1/2">
                              Pilihan Respon / Pasangan (Kolom B)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.menjodohkanPairs.map((pair, pIdx) => (
                            <tr key={pIdx}>
                              <td className="border border-black px-3 py-1.5 align-top">
                                {pair.premis}
                              </td>
                              <td className="border border-black px-3 py-1.5 align-top">
                                {pair.respon}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Format Benar - Salah */}
                  {q.pernyataanBenarSalah && q.pernyataanBenarSalah.length > 0 && (
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full border-collapse border border-black text-xs">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-black px-3 py-1.5 text-left">
                              Pernyataan Fakta / Analisis IPS
                            </th>
                            <th className="border border-black px-2 py-1.5 text-center w-16">
                              Benar
                            </th>
                            <th className="border border-black px-2 py-1.5 text-center w-16">
                              Salah
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.pernyataanBenarSalah.map((item, bIdx) => (
                            <tr key={bIdx}>
                              <td className="border border-black px-3 py-1.5">
                                {item.pernyataan}
                              </td>
                              <td className="border border-black px-2 py-1.5 text-center">
                                <span className="inline-block w-4 h-4 border border-black"></span>
                              </td>
                              <td className="border border-black px-2 py-1.5 text-center">
                                <span className="inline-block w-4 h-4 border border-black"></span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Format Isian Singkat */}
                  {q.type === 'isian_singkat' && (
                    <div className="mt-2 pt-1">
                      <div className="border-b border-dotted border-slate-500 w-full max-w-md h-5"></div>
                    </div>
                  )}

                  {/* Format Uraian */}
                  {q.type === 'uraian' && (
                    <div className="mt-2 space-y-2">
                      <div className="border-b border-dashed border-slate-300 w-full h-4"></div>
                      <div className="border-b border-dashed border-slate-300 w-full h-4"></div>
                      <div className="border-b border-dashed border-slate-300 w-full h-4"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. LEMBAR PENGESAHAN & TANDA TANGAN RESMI */}
      <div className="tanda-tangan-box mt-10 pt-6 border-t border-slate-300 text-xs text-black">
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
