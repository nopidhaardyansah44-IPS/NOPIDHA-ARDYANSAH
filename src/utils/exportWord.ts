import { QuestionItem, SchoolProfile, ActiveTab } from '../types';
import { convertSvgToPngDataUri } from './imageGenerators';

/**
 * Ekspor Dokumen Resmi ke Format Microsoft Word (.doc / HTML-compatible Word)
 * Menghasilkan dokumen A4 rapi dengan margin standar, kop dinas bergaris ganda,
 * opsi jawaban A, B, C, D vertikal menurun, dan gambar berformat PNG base64 yang 100% tampil di Word.
 */
export async function exportToWordDocument(
  tab: ActiveTab,
  rawQuestions: QuestionItem[],
  school: SchoolProfile
) {
  // Pastikan seluruh gambar berformat PNG Base64 agar 100% tampil di MS Word
  const questions: QuestionItem[] = await Promise.all(
    rawQuestions.map(async (q) => {
      if (q.gambar && q.gambar.url) {
        const pngUrl = await convertSvgToPngDataUri(q.gambar.url, 640, 320);
        return {
          ...q,
          gambar: {
            ...q.gambar,
            url: pngUrl
          }
        };
      }
      return q;
    })
  );

  const getDocTitle = () => {
    switch (tab) {
      case 'kisi_kisi':
        return `KISI-KISI PENULISAN SOAL IPS SMP`;
      case 'kartu_soal':
        return `KARTU SOAL ASESMEN SUMATIF IPS SMP`;
      case 'kunci_jawaban':
        return `KUNCI JAWABAN & PEDOMAN PENSKORAN IPS SMP`;
      case 'norma_penilaian':
        return `NORMA PENILAIAN & TABEL PENSKORAN SKOR 100`;
      default:
        return `NASKAH SOAL ASESMEN SUMATIF IPS SMP`;
    }
  };

  const docTitle = getDocTitle();

  let bodyContent = '';

  // Kop Sekolah Resmi
  const kopHtml = `
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 12px; font-family: 'Times New Roman', serif;">
      <tr>
        <td style="width: 15%; text-align: center; vertical-align: middle; border: none;">
          ${
            school.logoUrl
              ? `<img src="${school.logoUrl}" style="max-height: 75px; max-width: 75px; object-fit: contain;" alt="Logo" />`
              : `<div style="font-size: 24pt; color: #1e3a8a;">🏛️</div>`
          }
        </td>
        <td style="width: 85%; text-align: center; vertical-align: middle; border: none; line-height: 1.2;">
          <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KABUPATEN BANYUMAS</div>
          <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">DINAS PENDIDIKAN</div>
          <div style="font-size: 15pt; font-weight: bold; text-transform: uppercase; color: #1e293b; margin: 2px 0;">${school.namaSekolah}</div>
          <div style="font-size: 9pt; font-style: italic;">${school.alamatSekolah}</div>
          <div style="font-size: 9pt;">Tahun Pelajaran ${school.tahunPelajaran} | Semester ${school.semester}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="border: none; padding-top: 6px;">
          <div style="border-top: 3px double #000; height: 2px;"></div>
        </td>
      </tr>
    </table>
  `;

  if (tab === 'naskah') {
    bodyContent = `
      ${kopHtml}
      
      <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 14px;">
        <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; text-decoration: underline;">${school.jenisPenilaian}</div>
        <div style="font-size: 11pt; font-weight: bold;">MATA PELAJARAN: ILMU PENGETAHUAN SOSIAL (IPS)</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 14px; font-size: 10pt; font-family: 'Times New Roman', serif;">
        <tr>
          <td style="width: 18%; border: none;"><strong>Satuan Pendidikan</strong></td>
          <td style="width: 2%; border: none;">:</td>
          <td style="width: 40%; border: none;">${school.namaSekolah}</td>
          <td style="width: 15%; border: none;"><strong>Hari, Tanggal</strong></td>
          <td style="width: 2%; border: none;">:</td>
          <td style="width: 23%; border: none;">............................</td>
        </tr>
        <tr>
          <td style="border: none;"><strong>Mata Pelajaran</strong></td>
          <td style="border: none;">:</td>
          <td style="border: none;">IPS (Kurikulum Merdeka)</td>
          <td style="border: none;"><strong>Alokasi Waktu</strong></td>
          <td style="border: none;">:</td>
          <td style="border: none;">${school.alokasiWaktu}</td>
        </tr>
        <tr>
          <td style="border: none;"><strong>Kelas / Semester</strong></td>
          <td style="border: none;">:</td>
          <td style="border: none;">VII / VIII / IX (${school.semester})</td>
          <td style="border: none;"><strong>Pengembang</strong></td>
          <td style="border: none;">:</td>
          <td style="border: none;">${school.namaGuru}</td>
        </tr>
      </table>

      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; margin-bottom: 16px; font-size: 9.5pt; font-family: 'Times New Roman', serif;">
        <strong>PETUNJUK UMUM:</strong>
        <ol style="margin: 4px 0 0 18px; padding: 0;">
          <li>Berdoalah sebelum mengerjakan naskah soal.</li>
          <li>Tulislah nama dan nomor peserta Anda pada lembar jawaban yang telah disediakan.</li>
          <li>Periksa dan bacalah setiap butir soal dengan teliti sebelum Anda menjawabnya.</li>
          <li>Jawablah pertanyaan secara jujur, mandiri, dan teliti sesuai petunjuk pada masing-masing bagian.</li>
          <li>Periksa kembali seluruh lembar jawaban sebelum diserahkan kepada pengawas ujian.</li>
        </ol>
      </div>

      <div style="font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4;">
        ${questions
          .map((q) => {
            let optionsHtml = '';
            if (q.opsi && q.opsi.length > 0) {
              const labels = ['A', 'B', 'C', 'D', 'E'];
              optionsHtml = `
                <div style="margin: 6px 0 10px 18px;">
                  ${q.opsi
                    .map(
                      (op, idx) => `
                    <div style="margin-bottom: 4px; display: block;">
                      <strong>${labels[idx]}.</strong> ${op}
                    </div>
                  `
                    )
                    .join('')}
                </div>
              `;
            }

            let menjodohkanHtml = '';
            if (q.menjodohkanPairs && q.menjodohkanPairs.length > 0) {
              menjodohkanHtml = `
                <table style="width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10pt;" border="1" cellpadding="5" cellspacing="0">
                  <tr style="background-color: #f1f5f9;">
                    <th style="width: 50%; text-align: left; padding: 6px;">Pernyataan / Kasus (Kolom A)</th>
                    <th style="width: 50%; text-align: left; padding: 6px;">Pasangan / Jawaban (Kolom B)</th>
                  </tr>
                  ${q.menjodohkanPairs
                    .map(
                      (p) => `
                    <tr>
                      <td style="padding: 6px;">${p.premis}</td>
                      <td style="padding: 6px;">${p.respon}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </table>
              `;
            }

            let benarSalahHtml = '';
            if (q.pernyataanBenarSalah && q.pernyataanBenarSalah.length > 0) {
              benarSalahHtml = `
                <table style="width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10pt;" border="1" cellpadding="5" cellspacing="0">
                  <tr style="background-color: #f1f5f9;">
                    <th style="width: 70%; text-align: left; padding: 6px;">Pernyataan Fakta / Analisis</th>
                    <th style="width: 15%; text-align: center; padding: 6px;">Benar</th>
                    <th style="width: 15%; text-align: center; padding: 6px;">Salah</th>
                  </tr>
                  ${q.pernyataanBenarSalah
                    .map(
                      (item) => `
                    <tr>
                      <td style="padding: 6px;">${item.pernyataan}</td>
                      <td style="text-align: center; padding: 6px;">[ &nbsp; ]</td>
                      <td style="text-align: center; padding: 6px;">[ &nbsp; ]</td>
                    </tr>
                  `
                    )
                    .join('')}
                </table>
              `;
            }

            return `
              <div style="margin-bottom: 16px; page-break-inside: avoid;">
                <table style="width: 100%; border: none; border-collapse: collapse;">
                  <tr>
                    <td style="width: 25px; vertical-align: top; border: none; font-weight: bold;">${q.nomorSoal}.</td>
                    <td style="vertical-align: top; border: none;">
                      ${q.stimulus ? `<div style="margin-bottom: 6px; text-align: justify; color: #334155; font-style: normal;">${q.stimulus}</div>` : ''}
                      
                      ${
                        q.gambar
                          ? `
                        <div style="text-align: center; margin: 12px 0;">
                          <img src="${q.gambar.url}" width="500" style="width: 500px; max-width: 100%; height: auto; border: 1px solid #94a3b8; padding: 3px;" alt="${q.gambar.caption}" />
                          <div style="font-size: 9.5pt; font-style: italic; color: #334155; margin-top: 4px; font-weight: bold;">${q.gambar.caption}</div>
                        </div>
                      `
                          : ''
                      }

                      <div style="font-weight: 500; text-align: justify;">${q.pertanyaan}</div>
                      ${optionsHtml}
                      ${menjodohkanHtml}
                      ${benarSalahHtml}
                    </td>
                  </tr>
                </table>
              </div>
            `;
          })
          .join('')}
      </div>

      <!-- Kolom Tanda Tangan Resmi -->
      <table style="width: 100%; margin-top: 30px; border: none; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 11pt; page-break-inside: avoid;">
        <tr>
          <td style="width: 50%; text-align: center; border: none;">
            Mengetahui,<br/>
            Kepala ${school.namaSekolah}
            <br/><br/><br/><br/>
            <strong><u>${school.namaKepalaSekolah}</u></strong><br/>
            NIP. ${school.nipKepalaSekolah}
          </td>
          <td style="width: 50%; text-align: center; border: none;">
            Banyumas, ............................. 2026<br/>
            Guru Mata Pelajaran IPS
            <br/><br/><br/><br/>
            <strong><u>${school.namaGuru}</u></strong><br/>
            NIP. ${school.nipGuru}
          </td>
        </tr>
      </table>
    `;
  } else if (tab === 'kisi_kisi') {
    bodyContent = `
      ${kopHtml}
      <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 16px;">
        <div style="font-size: 13pt; font-weight: bold; text-decoration: underline;">KISI-KISI PENULISAN SOAL ASESMEN SUMATIF</div>
        <div style="font-size: 11pt; font-weight: bold;">MATA PELAJARAN IPS SMP KURIKULUM MERDEKA</div>
      </div>

      <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 10pt;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center;">
            <th style="width: 4%;">No</th>
            <th style="width: 22%;">Capaian Pembelajaran (CP)</th>
            <th style="width: 18%;">Tujuan Pembelajaran / Materi</th>
            <th style="width: 28%;">Indikator Soal</th>
            <th style="width: 8%;">Level Kognitif</th>
            <th style="width: 10%;">Bentuk Soal</th>
            <th style="width: 5%;">No. Soal</th>
            <th style="width: 5%;">Skor</th>
          </tr>
        </thead>
        <tbody>
          ${questions
            .map(
              (q, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td style="text-align: justify;">${q.capaianPembelajaran}</td>
              <td><strong>${q.materi}</strong><br/><span style="font-size: 9pt; color: #475569;">${q.tujuanPembelajaran}</span></td>
              <td style="text-align: justify;">${q.indikatorSoal}</td>
              <td style="text-align: center;"><strong>${q.tingkatKesulitan}</strong><br/><span style="font-size: 8.5pt;">(${q.pengalamanBelajar})</span></td>
              <td style="text-align: center; text-transform: capitalize;">${q.type.replace('_', ' ')}</td>
              <td style="text-align: center; font-weight: bold;">${q.nomorSoal}</td>
              <td style="text-align: center;">${q.bobotSkor}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <table style="width: 100%; margin-top: 30px; border: none; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 11pt; page-break-inside: avoid;">
        <tr>
          <td style="width: 50%; text-align: center; border: none;">
            Mengetahui,<br/>
            Kepala ${school.namaSekolah}
            <br/><br/><br/><br/>
            <strong><u>${school.namaKepalaSekolah}</u></strong><br/>
            NIP. ${school.nipKepalaSekolah}
          </td>
          <td style="width: 50%; text-align: center; border: none;">
            Banyumas, ............................. 2026<br/>
            Guru Penyusun Kisi-Kisi
            <br/><br/><br/><br/>
            <strong><u>${school.namaGuru}</u></strong><br/>
            NIP. ${school.nipGuru}
          </td>
        </tr>
      </table>
    `;
  } else if (tab === 'kartu_soal') {
    bodyContent = `
      ${kopHtml}
      <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 16px;">
        <div style="font-size: 13pt; font-weight: bold; text-decoration: underline;">KARTU SOAL ASESMEN SUMATIF</div>
        <div style="font-size: 11pt; font-weight: bold;">STANDAR PENILAIAN KURIKULUM MERDEKA</div>
      </div>

      ${questions
        .map(
          (q) => `
        <div style="margin-bottom: 24px; page-break-inside: avoid; font-family: 'Times New Roman', serif;">
          <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 10pt;">
            <tr style="background-color: #f8fafc;">
              <td style="width: 25%;"><strong>Satuan Pendidikan</strong></td>
              <td style="width: 25%;">${school.namaSekolah}</td>
              <td style="width: 25%;"><strong>Bentuk Soal</strong></td>
              <td style="width: 25%; text-transform: capitalize;">${q.type.replace('_', ' ')}</td>
            </tr>
            <tr>
              <td><strong>Mata Pelajaran</strong></td>
              <td>Ilmu Pengetahuan Sosial (IPS)</td>
              <td><strong>Nomor Soal</strong></td>
              <td><strong>${q.nomorSoal}</strong> (Bobot: ${q.bobotSkor})</td>
            </tr>
            <tr>
              <td><strong>Kelas / Semester</strong></td>
              <td>SMP (${school.semester})</td>
              <td><strong>Level Kognitif</strong></td>
              <td><strong>${q.tingkatKesulitan}</strong> (${q.pengalamanBelajar})</td>
            </tr>
            <tr>
              <td><strong>Capaian Pembelajaran</strong></td>
              <td colspan="3">${q.capaianPembelajaran}</td>
            </tr>
            <tr>
              <td><strong>Tujuan Pembelajaran</strong></td>
              <td colspan="3">${q.tujuanPembelajaran}</td>
            </tr>
            <tr>
              <td><strong>Materi Pokok</strong></td>
              <td colspan="3">${q.materi}</td>
            </tr>
            <tr>
              <td><strong>Indikator Soal</strong></td>
              <td colspan="3">${q.indikatorSoal}</td>
            </tr>
            <tr>
              <td><strong>Buku Acuan / Sumber</strong></td>
              <td colspan="3">${q.bukuSumber}</td>
            </tr>
            <tr>
              <td colspan="4" style="background-color: #ffffff; padding: 12px;">
                <strong>BUTIR SOAL:</strong>
                ${q.stimulus ? `<div style="margin: 6px 0; font-style: italic;">${q.stimulus}</div>` : ''}
                ${q.gambar ? `<div style="text-align: center; margin: 6px 0;"><img src="${q.gambar.url}" style="max-height: 180px; max-width: 400px;" /><div style="font-size: 8.5pt;">${q.gambar.caption}</div></div>` : ''}
                <div style="margin: 6px 0; font-weight: bold;">${q.pertanyaan}</div>
                ${
                  q.opsi && q.opsi.length > 0
                    ? `
                  <div style="margin-left: 15px;">
                    ${q.opsi.map((op, idx) => `<div><strong>${['A', 'B', 'C', 'D'][idx]}.</strong> ${op}</div>`).join('')}
                  </div>
                `
                    : ''
                }
              </td>
            </tr>
            <tr style="background-color: #f0fdf4;">
              <td style="font-weight: bold; color: #166534;">KUNCI JAWABAN</td>
              <td colspan="3" style="font-weight: bold; color: #166534;">${q.kunciJawaban}</td>
            </tr>
            <tr>
              <td><strong>Pedoman Pembahasan</strong></td>
              <td colspan="3" style="font-size: 9.5pt;">${q.pembahasan}</td>
            </tr>
          </table>
        </div>
      `
        )
        .join('')}
    `;
  } else if (tab === 'kunci_jawaban') {
    bodyContent = `
      ${kopHtml}
      <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 16px;">
        <div style="font-size: 13pt; font-weight: bold; text-decoration: underline;">KUNCI JAWABAN & PEDOMAN PENSKORAN</div>
        <div style="font-size: 11pt; font-weight: bold;">MATA PELAJARAN IPS SMP KURIKULUM MERDEKA</div>
      </div>

      <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 10pt;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center;">
            <th style="width: 6%;">No Soal</th>
            <th style="width: 14%;">Bentuk Soal</th>
            <th style="width: 25%;">Kunci Jawaban</th>
            <th style="width: 45%;">Pedoman Pembahasan & Rubrik Penskoran</th>
            <th style="width: 10%;">Skor Maksimal</th>
          </tr>
        </thead>
        <tbody>
          ${questions
            .map(
              (q) => `
            <tr>
              <td style="text-align: center; font-weight: bold;">${q.nomorSoal}</td>
              <td style="text-align: center; text-transform: capitalize;">${q.type.replace('_', ' ')}</td>
              <td style="font-weight: bold; color: #1e3a8a;">${q.kunciJawaban}</td>
              <td style="text-align: justify;">
                <div>${q.pembahasan}</div>
                ${
                  q.rubrikUraian && q.rubrikUraian.length > 0
                    ? `
                  <div style="margin-top: 6px; font-size: 9pt; background: #f8fafc; padding: 4px; border: 1px dashed #cbd5e1;">
                    <strong>Rubrik Penskoran:</strong>
                    <ul style="margin: 2px 0 0 14px; padding: 0;">
                      ${q.rubrikUraian.map((r) => `<li>${r.kriteria} (Skor: ${r.skor})</li>`).join('')}
                    </ul>
                  </div>
                `
                    : ''
                }
              </td>
              <td style="text-align: center; font-weight: bold;">${q.bobotSkor}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } else if (tab === 'norma_penilaian') {
    const totalSkor = questions.reduce((acc, q) => acc + q.bobotSkor, 0);
    bodyContent = `
      ${kopHtml}
      <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 16px;">
        <div style="font-size: 13pt; font-weight: bold; text-decoration: underline;">NORMA PENILAIAN DAN TABEL PENSKORAN SKOR 100</div>
        <div style="font-size: 11pt; font-weight: bold;">ASESMEN SUMATIF IPS SMP KURIKULUM MERDEKA</div>
      </div>

      <div style="font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 6px;">1. Rumus Penentuan Nilai Akhir (Skor Skala 100):</div>
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; margin-bottom: 15px; font-family: monospace; font-size: 11pt; text-align: center;">
          <strong>Nilai Akhir (NA) = (Jumlah Skor Perolehan Peserta Didik / Total Skor Maksimal ${totalSkor}) x 100</strong>
        </div>

        <div style="font-weight: bold; margin-bottom: 6px;">2. Distribusi Bobot Bentuk Soal:</div>
        <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 20px;">
          <tr style="background-color: #f1f5f9; text-align: center;">
            <th>No</th>
            <th>Bentuk Soal</th>
            <th>Jumlah Butir</th>
            <th>Bobot per Butir</th>
            <th>Subtotal Skor</th>
            <th>Persentase Kontribusi</th>
          </tr>
          ${[
            ...new Set(questions.map((q) => q.type))
          ].map((type, idx) => {
            const items = questions.filter((q) => q.type === type);
            const count = items.length;
            const subtotal = items.reduce((acc, curr) => acc + curr.bobotSkor, 0);
            const pct = ((subtotal / (totalSkor || 1)) * 100).toFixed(1);
            return `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-transform: capitalize;">${type.replace('_', ' ')}</td>
                <td style="text-align: center;">${count} butir</td>
                <td style="text-align: center;">${(subtotal / (count || 1)).toFixed(1)}</td>
                <td style="text-align: center; font-weight: bold;">${subtotal}</td>
                <td style="text-align: center;">${pct}%</td>
              </tr>
            `;
          }).join('')}
          <tr style="background-color: #f0fdf4; font-weight: bold; text-align: center;">
            <td colspan="4">TOTAL SKOR MAKSIMAL</td>
            <td>${totalSkor}</td>
            <td>100%</td>
          </tr>
        </table>

        <div style="font-weight: bold; margin-bottom: 6px;">3. Tabel Konversi Nilai & Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</div>
        <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 10pt;">
          <tr style="background-color: #f1f5f9; text-align: center;">
            <th>Rentang Skor Akhir</th>
            <th>Kategori Predikat</th>
            <th>Tindak Lanjut & Intervensi Pedagogis</th>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: bold;">86 – 100</td>
            <td style="text-align: center; color: #166534; font-weight: bold;">Sangat Baik (A)</td>
            <td>Telah mencapai seluruh tujuan pembelajaran dengan amat baik; berhak memperoleh program pengayaan literasi dan riset mandiri IPS.</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: bold;">71 – 85</td>
            <td style="text-align: center; color: #1d4ed8; font-weight: bold;">Baik (B)</td>
            <td>Mencapai ketuntasan tujuan pembelajaran; siap melanjutkan materi ke tingkat berikutnya dengan latihan aplikatif tambahan.</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: bold;">56 – 70</td>
            <td style="text-align: center; color: #d97706; font-weight: bold;">Cukup (C)</td>
            <td>Mencapai batas minimal ketuntasan; perlu penguatan pada butir-butir soal bertingkat penalaran HOTS.</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: bold;">&lt; 56</td>
            <td style="text-align: center; color: #dc2626; font-weight: bold;">Perlu Bimbingan (D)</td>
            <td>Belum mencapai ketuntasan kompetensi; wajib mengikuti bimbingan remedial terarah bersama guru mata pelajaran.</td>
          </tr>
        </table>
      </div>
    `;
  }

  // Bungkus dalam template HTML Word resmi berstandar A4
  const htmlTemplate = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${docTitle}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 21.0cm 29.7cm;
            margin: 2.5cm 2.0cm 2.5cm 2.5cm;
            mso-header-margin: 1.0cm;
            mso-footer-margin: 1.0cm;
            mso-paper-source: 0;
          }
          div.Section1 {
            page: Section1;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.35;
            color: #000000;
          }
          table {
            border-collapse: collapse;
          }
          img {
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${bodyContent}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlTemplate], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const fileName = `${docTitle.replace(/\s+/g, '_')}_${school.namaSekolah.replace(/\s+/g, '_')}.doc`;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
