import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side initialization of Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route: Generate Soal IPS SMP Kurikulum Merdeka
app.post('/api/generate-questions', async (req, res) => {
  try {
    const {
      kelas = '7',
      temaJudul = 'Tema 01: Keberadaan Diri dan Lingkungan Sekitar',
      topikMateri = '',
      tujuanPembelajaran = '',
      bentukSoalList = ['pilihan_ganda'],
      tingkatKesulitanList = ['LOTS', 'MOTS', 'HOTS'],
      pengalamanBelajarList = ['Memahami', 'Mengaplikasi', 'Merefleksi'],
      totalSoalPerBentuk = {},
      soalBergambarEnabled = true,
      jumlahSoalBergambar = 2
    } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        message: 'GEMINI_API_KEY tidak dikonfigurasi di server. Menggunakan generator kurikulum cerdas bawaan.',
        useFallback: true
      });
    }

    const promptText = `
Anda adalah seorang Ahli Kurikulum Merdeka Kemendikbudristek dan Guru Penggerak Mata Pelajaran IPS SMP tingkat nasional.
Buatlah paket butir soal Asesmen Sumatif/Formatif IPS SMP Kurikulum Merdeka yang HETEROGEN, MENDALAM, TIDAK MONOTON, dan BERKUALITAS TINGGI.

Spesifikasi Pembuatan Soal:
1. Jenjang: SMP Kelas ${kelas}
2. Tema Kurikulum: ${temaJudul}
3. Topik / Materi Spesifik: ${topikMateri || 'Materi inti Kurikulum Merdeka IPS Kelas ' + kelas}
4. Tujuan Pembelajaran (TP): ${tujuanPembelajaran || 'Menganalisis fenomena keruangan, interaksi sosial, aktivitas ekonomi, dan sejarah lokal/nasional.'}
5. Bentuk Soal yang diminta: ${bentukSoalList.join(', ')}
6. Jumlah Soal yang diminta per bentuk: ${JSON.stringify(totalSoalPerBentuk)}
7. Tingkat Kesulitan: ${tingkatKesulitanList.join(', ')} (Pastikan terdistribusi secara seimbang)
8. Pengalaman Belajar Kurikulum Merdeka: ${pengalamanBelajarList.join(', ')} (Memahami konsep, Mengaplikasi dalam konteks nyata, Merefleksi kritis)
9. Soal Bergambar: ${soalBergambarEnabled ? `Berikan ${jumlahSoalBergambar} butir soal yang memiliki deskripsi/stimulus visual diagram, peta, atau infografik.` : 'Tidak perlu gambar.'}

Aturan Penulisan Butir Soal (PENTING):
- Butir soal HARUS HETEROGEN, mengangkat konteks riil Indonesia (misal: perdagangan tradisional di Banyumas/Jawa Tengah, kearifan lokal kentongan/batik, letak astronomis dan iklim, kelangkaan cabai/minyak, transformasi dompet digital QRIS, fenomena bonus demografi, peninggalan peradaban Mataram Kuno/Sriwijaya).
- Untuk bentuk "pilihan_ganda": Sediakan tepat 4 pilihan (A, B, C, D) yang mengecoh dan bermutu tinggi.
- Untuk bentuk "pilihan_ganda_kompleks": Sediakan 4 opsi di mana jawaban benar lebih dari satu, atau berikan pernyataan komparatif.
- Untuk bentuk "menjodohkan": Buat minimal 3-4 pasang premis dan respon.
- Untuk bentuk "benar_salah": Buat 3 pernyataan dengan kunci Benar/Salah beserta alasannya.
- Untuk bentuk "isian_singkat": Pertanyaan terarah dengan kunci konsep/istilah yang pasti.
- Untuk bentuk "uraian": Buat pertanyaan analitis dengan rincian rubrik penskoran terurai (kriteria dan skor parsial).
- Hitung bobot skor sehingga jika dijumlahkan secara wajar dapat dikonversi ke skala 100.

Hasilkan respons HANYA berupa array JSON yang valid tanpa markdown code block.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nomorSoal: { type: Type.INTEGER },
              type: {
                type: Type.STRING,
                description: 'Salah satu: pilihan_ganda, pilihan_ganda_kompleks, isian_singkat, uraian, menjodohkan, benar_salah'
              },
              tingkatKesulitan: {
                type: Type.STRING,
                description: 'LOTS, MOTS, atau HOTS'
              },
              pengalamanBelajar: {
                type: Type.STRING,
                description: 'Memahami, Mengaplikasi, atau Merefleksi'
              },
              capaianPembelajaran: { type: Type.STRING },
              tujuanPembelajaran: { type: Type.STRING },
              materi: { type: Type.STRING },
              indikatorSoal: { type: Type.STRING },
              stimulus: { type: Type.STRING },
              pertanyaan: { type: Type.STRING },
              opsi: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              kunciJawaban: { type: Type.STRING },
              bobotSkor: { type: Type.INTEGER },
              pembahasan: { type: Type.STRING },
              bukuSumber: { type: Type.STRING },
              hasVisualImage: { type: Type.BOOLEAN },
              imageTopic: { type: Type.STRING }
            },
            required: [
              'nomorSoal',
              'type',
              'tingkatKesulitan',
              'pengalamanBelajar',
              'materi',
              'indikatorSoal',
              'pertanyaan',
              'kunciJawaban',
              'bobotSkor',
              'pembahasan'
            ]
          }
        }
      }
    });

    const responseText = response.text || '[]';
    const parsedQuestions = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      questions: parsedQuestions
    });
  } catch (err: any) {
    console.error('Server Gemini Error:', err);
    return res.status(200).json({
      success: false,
      message: err.message || 'Gagal memanggil model Gemini',
      useFallback: true
    });
  }
});

// Setup Vite Dev Server / Static Production Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production if dist exists
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Si-IPS Merdeka running at http://localhost:${PORT}`);
  });
}

startServer();
