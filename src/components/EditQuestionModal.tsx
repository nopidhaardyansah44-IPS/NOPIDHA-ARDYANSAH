import React, { useState } from 'react';
import { QuestionItem, CognitiveLevel, LearningExperience, QuestionType } from '../types';
import { EDUCATIONAL_IMAGES } from '../utils/imageGenerators';
import { X, Save, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface EditQuestionModalProps {
  question: QuestionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestion: QuestionItem) => void;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  question,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !question) return null;

  const [formData, setFormData] = useState<QuestionItem>({ ...question });

  const handleOptionChange = (idx: number, value: string) => {
    const updatedOptions = [...(formData.opsi || ['', '', '', ''])];
    updatedOptions[idx] = value;
    setFormData({ ...formData, opsi: updatedOptions });
  };

  const handleImageSelect = (key: string) => {
    if (key === 'none') {
      setFormData({ ...formData, gambar: null });
      return;
    }
    const template = (EDUCATIONAL_IMAGES as any)[key];
    if (template) {
      setFormData({
        ...formData,
        gambar: {
          url: template.dataUri,
          caption: `Gambar. ${template.title}`,
          tipe: template.tipe
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="bg-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">
              Edit Butir Soal Nomor {formData.nomorSoal}
            </h3>
            <p className="text-xs text-indigo-200">
              Sesuaikan teks pertanyaan, opsi jawaban, stimulus, kunci, atau gambar
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-xs text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1">Bentuk Soal</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
                className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
              >
                <option value="pilihan_ganda">Pilihan Ganda</option>
                <option value="pilihan_ganda_kompleks">Pilihan Ganda Kompleks</option>
                <option value="isian_singkat">Isian Singkat</option>
                <option value="uraian">Uraian</option>
                <option value="menjodohkan">Menjodohkan</option>
                <option value="benar_salah">Benar–Salah</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Level Kognitif</label>
              <select
                value={formData.tingkatKesulitan}
                onChange={(e) => setFormData({ ...formData, tingkatKesulitan: e.target.value as CognitiveLevel })}
                className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-bold"
              >
                <option value="LOTS">LOTS (C1-C2 Mengingat/Memahami)</option>
                <option value="MOTS">MOTS (C3 Mengaplikasikan)</option>
                <option value="HOTS">HOTS (C4-C6 Menganalisis/Mengevaluasi)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Pengalaman Belajar</label>
              <select
                value={formData.pengalamanBelajar}
                onChange={(e) => setFormData({ ...formData, pengalamanBelajar: e.target.value as LearningExperience })}
                className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
              >
                <option value="Memahami">Memahami (Pemahaman Dasar)</option>
                <option value="Mengaplikasi">Mengaplikasi (Konteks Nyata)</option>
                <option value="Merefleksi">Merefleksi (Kritis & Nilai)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Lingkup Materi</label>
            <input
              type="text"
              value={formData.materi}
              onChange={(e) => setFormData({ ...formData, materi: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Indikator Soal (Untuk Kisi-Kisi)</label>
            <input
              type="text"
              value={formData.indikatorSoal}
              onChange={(e) => setFormData({ ...formData, indikatorSoal: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Stimulus / Teks Narasi Kasus (Opsional)</label>
            <textarea
              rows={2}
              value={formData.stimulus || ''}
              onChange={(e) => setFormData({ ...formData, stimulus: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-lg italic text-slate-700"
              placeholder="Ketik teks kasus, kutipan data, atau latar belakang soal..."
            />
          </div>

          {/* Pengaturan Gambar */}
          <div className="border border-slate-200 bg-slate-50 p-3 rounded-lg space-y-2">
            <label className="font-bold flex items-center gap-1.5 text-slate-800">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              Sertakan Gambar Edukatif / Diagram:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                onChange={(e) => handleImageSelect(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg bg-white text-xs"
              >
                <option value="">-- Pilih Ilustrasi Grafis --</option>
                <option value="none">Tanpa Gambar</option>
                <option value="petaWallaceWeber">Peta Wallace & Weber (Fauna)</option>
                <option value="kurvaPermintaanPenawaran">Kurva Keseimbangan Pasar</option>
                <option value="pelakuEkonomiCircularFlow">Circular Flow 4 Pelaku Ekonomi</option>
                <option value="piramidaPenduduk">Piramida Penduduk & Bonus Demografi</option>
                <option value="candiPeninggalanSejarah">Candi Borobudur (Sejarah Mataram Kuno)</option>
                <option value="pelestarianSDAHutan">Infografik Konservasi Hutan & Kearifan Lokal</option>
              </select>

              {formData.gambar && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gambar: null })}
                  className="text-rose-600 text-[11px] font-semibold hover:underline"
                >
                  Hapus Gambar
                </button>
              )}
            </div>

            {formData.gambar && (
              <div className="mt-2 text-center bg-white p-2.5 border border-slate-300 rounded-lg">
                <img
                  src={formData.gambar.url}
                  alt={formData.gambar.caption}
                  className="max-h-48 w-auto max-w-full mx-auto border bg-white p-1 rounded"
                  style={{ minHeight: '120px', display: 'block' }}
                />
                <input
                  type="text"
                  value={formData.gambar.caption}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gambar: { ...formData.gambar!, caption: e.target.value }
                    })
                  }
                  className="w-full max-w-md mt-2 px-2.5 py-1 border border-slate-300 text-center text-xs font-semibold rounded-lg"
                  placeholder="Keterangan Gambar..."
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-1">Pertanyaan Butir Soal</label>
            <textarea
              rows={3}
              value={formData.pertanyaan}
              onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-lg font-medium"
            />
          </div>

          {/* Opsi Pilihan Ganda (Menurun A, B, C, D) */}
          {formData.type === 'pilihan_ganda' && (
            <div className="space-y-2 border-t pt-2">
              <label className="font-semibold block text-slate-800">
                Pilihan Jawaban (Menurun A, B, C, D):
              </label>
              {['A', 'B', 'C', 'D'].map((letter, idx) => (
                <div key={letter} className="flex items-center gap-2">
                  <span className="font-bold min-w-[20px] text-center">{letter}.</span>
                  <input
                    type="text"
                    value={formData.opsi?.[idx] || ''}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded-lg"
                    placeholder={`Teks pilihan ${letter}...`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-2">
            <div>
              <label className="font-semibold block mb-1">Kunci Jawaban</label>
              <input
                type="text"
                value={formData.kunciJawaban}
                onChange={(e) => setFormData({ ...formData, kunciJawaban: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg font-bold text-emerald-800 bg-emerald-50/30"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Bobot Skor Butir</label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.bobotSkor}
                onChange={(e) => setFormData({ ...formData, bobotSkor: Number(e.target.value) || 1 })}
                className="w-full px-3 py-1.5 border rounded-lg font-bold text-center"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Pedoman Pembahasan & Rubrik Penskoran</label>
            <textarea
              rows={2}
              value={formData.pembahasan}
              onChange={(e) => setFormData({ ...formData, pembahasan: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-lg text-slate-700"
            />
          </div>

          {/* Footer Modal Actions */}
          <div className="border-t pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
