import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Konversi matematis standar W3C untuk OKLCH / CSS Color 4 ke format sRGB rgb() / rgba()
 * Menjamin 100% kompatibilitas dengan html2canvas v1.4.x yang hanya mendukung rgb/rgba/hsl.
 */
export function oklchToRgb(colorStr: string): string {
  if (!colorStr) return colorStr;
  if (typeof colorStr !== 'string') return String(colorStr);
  if (!colorStr.includes('oklch') && !colorStr.includes('color(')) {
    return colorStr;
  }

  // 1. Tangani oklch(L C H [/ A])
  // Mendukung: desimal, bilangan bulat, persentase, notasi eksponensial, derajat (deg/rad/grad/turn), negatif, kata 'none'
  const numberOrNone = `(?:[-+]?(?:\\d*\\.?\\d+(?:[eE][-+]?\\d+)?%?)|none)`;
  const hueOrNone = `(?:[-+]?(?:\\d*\\.?\\d+(?:[eE][-+]?\\d+)?(?:deg|rad|turn|grad)?)|none)`;
  const oklchPattern = new RegExp(
    `oklch\\(\\s*(${numberOrNone})\\s+(${numberOrNone})\\s+(${hueOrNone})(?:\\s*\\/\\s*(${numberOrNone}))?\\s*\\)`,
    'gi'
  );

  let result = colorStr.replace(oklchPattern, (_match, lStr, cStr, hStr, aStr) => {
    let L = 0;
    if (lStr && lStr !== 'none') {
      L = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
    }
    let C = 0;
    if (cStr && cStr !== 'none') {
      C = parseFloat(cStr);
    }
    let H = 0;
    if (hStr && hStr !== 'none') {
      if (hStr.endsWith('rad')) {
        H = (parseFloat(hStr) * 180) / Math.PI;
      } else if (hStr.endsWith('turn')) {
        H = parseFloat(hStr) * 360;
      } else {
        H = parseFloat(hStr); // degrees
      }
    }
    let A = 1;
    if (aStr && aStr !== 'none') {
      A = aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr);
    }

    if (isNaN(L)) L = 0;
    if (isNaN(C)) C = 0;
    if (isNaN(H)) H = 0;
    if (isNaN(A)) A = 1;

    // OKLCH -> OKLab
    const hRad = (H * Math.PI) / 180;
    const labA = C * Math.cos(hRad);
    const labB = C * Math.sin(hRad);

    // OKLab -> LMS nonlinear
    const l_ = L + 0.3963377774 * labA + 0.2158037573 * labB;
    const m_ = L - 0.1055613458 * labA - 0.0638541728 * labB;
    const s_ = L - 0.0894841775 * labA - 1.291485548 * labB;

    // LMS nonlinear -> LMS linear
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    // LMS linear -> linear sRGB
    const rLinear = +4.0767434721 * l - 3.3077115913 * m + 0.2309699292 * s;
    const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    // Linear sRGB -> standard sRGB (gamma correction)
    const toSrgb = (x: number) => {
      const clamped = Math.max(0, Math.min(1, x));
      const val = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
      return Math.round(Math.max(0, Math.min(255, val * 255)));
    };

    const r = toSrgb(rLinear);
    const g = toSrgb(gLinear);
    const b = toSrgb(bLinear);

    if (A < 0.999) {
      return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, A)).toFixed(2)})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  });

  // 2. Tangani color(srgb r g b [/ a])
  const colorPattern = /color\(\s*srgb\s+([\d.]+%?|none)\s+([\d.]+%?|none)\s+([\d.]+%?|none)(?:\s*\/\s*([\d.]+%?|none))?\s*\)/gi;
  result = result.replace(colorPattern, (_m, rStr, gStr, bStr, aStr) => {
    const parseC = (s: string) => {
      if (!s || s === 'none') return 0;
      const v = s.endsWith('%') ? parseFloat(s) / 100 : parseFloat(s);
      return Math.round(Math.max(0, Math.min(255, v * 255)));
    };
    const r = parseC(rStr);
    const g = parseC(gStr);
    const b = parseC(bStr);
    let A = 1;
    if (aStr && aStr !== 'none') {
      A = aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr);
    }
    if (A < 0.999) {
      return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, A)).toFixed(2)})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  });

  // 3. Fallback jika masih ada sisa fungsi warna CSS modern yang tak didukung html2canvas
  if (result.includes('oklch') || result.includes('color(') || result.includes('lab(') || result.includes('lch(')) {
    result = result
      .replace(/oklch\([^)]+\)/gi, 'rgb(30, 41, 59)')
      .replace(/color\([^)]+\)/gi, 'rgb(30, 41, 59)')
      .replace(/lab\([^)]+\)/gi, 'rgb(30, 41, 59)')
      .replace(/lch\([^)]+\)/gi, 'rgb(30, 41, 59)');
  }

  return result;
}

/**
 * Konversi warna tunggal atau string warna CSS menggunakan context canvas peramban.
 * Ini menghasilkan warna sRGB #rrggbb atau rgba() resmi yang dipakai mesin browser.
 */
export function parseAnyColorToRgb(color: string): string {
  if (!color || typeof color !== 'string') return color;
  if (!color.includes('oklch') && !color.includes('color(') && !color.includes('lab') && !color.includes('lch')) {
    return color;
  }

  // Jika string merupakan warna tunggal (bukan seluruh baris CSS), coba render via canvas 2D
  if (typeof document !== 'undefined' && !color.includes('{') && !color.includes(';') && !color.includes('\n')) {
    try {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillStyle = color;
        const res = ctx.fillStyle;
        if (res && (res.startsWith('#') || res.startsWith('rgb'))) {
          return res;
        }
      }
    } catch {
      // fallback ke parser matematis
    }
  }

  return oklchToRgb(color);
}

/**
 * Membuat Proxy pelindung untuk CSSStyleDeclaration.
 * Mencegah TypeError: Illegal invocation dengan cara mengeksekusi getter langsung pada target `t`.
 */
function createSanitizedStyleProxy(target: CSSStyleDeclaration): CSSStyleDeclaration {
  if (!target) return target;

  return new Proxy(target, {
    get(t, prop) {
      if (typeof prop === 'symbol') {
        try {
          return (t as any)[prop];
        } catch {
          return undefined;
        }
      }

      // Intersep getPropertyValue
      if (prop === 'getPropertyValue') {
        return (propName: string) => {
          try {
            const raw = t.getPropertyValue(propName);
            if (!raw) return raw;
            if (typeof propName === 'string' && propName.toLowerCase().includes('shadow')) {
              return 'none';
            }
            if (raw.includes('oklch') || raw.includes('color(') || raw.includes('lab') || raw.includes('lch')) {
              return parseAnyColorToRgb(raw);
            }
            return raw;
          } catch {
            return '';
          }
        };
      }

      if (prop === 'getPropertyPriority') {
        return (propName: string) => {
          try {
            return t.getPropertyPriority(propName);
          } catch {
            return '';
          }
        };
      }

      if (prop === 'item') {
        return (index: number) => {
          try {
            return t.item(index);
          } catch {
            return '';
          }
        };
      }

      // KRUSIAL: Panggil Reflect.get dengan target `t` sebagai receiver (bukan proxy receiver!)
      // Ini 100% mencegah "TypeError: Illegal invocation" pada getter WebIDL native
      let val: any;
      try {
        val = Reflect.get(t, prop, t);
      } catch {
        try {
          val = (t as any)[prop];
        } catch {
          val = undefined;
        }
      }

      if (typeof val === 'function') {
        return val.bind(t);
      }

      if (typeof val === 'string') {
        const propStr = String(prop).toLowerCase();
        if (propStr.includes('shadow')) {
          return 'none';
        }
        if (val.includes('oklch') || val.includes('color(') || val.includes('lab') || val.includes('lch')) {
          return parseAnyColorToRgb(val);
        }
      }

      return val;
    }
  });
}

/**
 * Menyimpan dokumen secara otomatis langsung sebagai file PDF ke folder Unduhan (Downloads)
 * dengan resolusi tinggi (scale 2), menangani kompatibilitas warna modern (OKLCH) Tailwind v4,
 * dan memastikan seluruh teks, tabel, serta gambar terunduh sempurna.
 */
export async function exportToPdfDocument(
  elementId: string,
  filename: string,
  onProgress?: (progressText: string) => void
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemen dengan ID "${elementId}" tidak ditemukan.`);
    if (onProgress) onProgress('Elemen dokumen tidak ditemukan.');
    return false;
  }

  // Simpan getComputedStyle asli global sebelum html2canvas membaca root dokumen
  const originalGlobalGetComputedStyle = window.getComputedStyle;
  const prevBodyBg = document.body.style.backgroundColor;
  const prevDocBg = document.documentElement.style.backgroundColor;

  try {
    if (onProgress) onProgress('Menyiapkan tata letak halaman A4...');

    // 1. Intersep getComputedStyle global window SEBELUM html2canvas membaca ownerDocument
    window.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
      const computed = originalGlobalGetComputedStyle.call(window, elt, pseudoElt);
      return createSanitizedStyleProxy(computed);
    };

    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';

    // 2. Pastikan seluruh gambar <img> telah ter-load dan siap di-render
    const imgElements = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      imgElements.map((img) => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const timeout = setTimeout(resolve, 800);
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
      })
    );

    // Styling sementara untuk rendering canvas jernih
    const originalShadow = element.style.boxShadow;
    const originalBorder = element.style.border;
    element.style.boxShadow = 'none';
    element.style.border = 'none';

    if (onProgress) onProgress('Merender teks, tabel, dan gambar ke format cetak...');

    const canvas = await html2canvas(element, {
      scale: 2, // 2x scale untuk ketajaman standar cetak resolusi tinggi
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: Math.max(1024, element.scrollWidth || 1024),
      windowHeight: Math.max(1400, element.scrollHeight || 1400),
      ignoreElements: (el) => el.classList?.contains('no-print'),
      onclone: (clonedDoc: Document) => {
        // Atur background root pada iframe kloningan
        clonedDoc.documentElement.style.backgroundColor = '#ffffff';
        clonedDoc.body.style.backgroundColor = '#ffffff';

        const win = clonedDoc.defaultView || window;
        const originalIframeGetComputedStyle = win.getComputedStyle;
        win.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
          const computed = originalIframeGetComputedStyle.call(win, elt, pseudoElt);
          return createSanitizedStyleProxy(computed);
        };

        // Konversi semua style sheet / style tags yang mengandung OKLCH di dokumen klon
        clonedDoc.querySelectorAll('style').forEach((st) => {
          if (st.textContent && (st.textContent.includes('oklch') || st.textContent.includes('color('))) {
            st.textContent = parseAnyColorToRgb(st.textContent);
          }
        });

        // Pastikan target dokumen kloningan memiliki ukuran standar lembar cetak A4
        const clonedTarget = clonedDoc.getElementById(elementId);
        if (clonedTarget) {
          clonedTarget.style.width = '794px';
          clonedTarget.style.maxWidth = '794px';
          clonedTarget.style.margin = '0 auto';
          clonedTarget.style.boxShadow = 'none';
          clonedTarget.style.border = 'none';
          clonedTarget.style.backgroundColor = '#ffffff';
          clonedTarget.style.padding = '20mm 15mm 20mm 20mm';
        }

        // Pastikan seluruh gambar di kloningan terlihat jelas & gambar SVG di-rasterize jika siap
        const origImages = Array.from(element.querySelectorAll('img'));
        const clonedImages = Array.from(clonedDoc.querySelectorAll('img'));
        clonedImages.forEach((img, idx) => {
          const orig = origImages[idx];
          img.style.display = 'block';
          img.style.visibility = 'visible';
          img.style.opacity = '1';

          if (orig) {
            const rect = orig.getBoundingClientRect();
            if (rect.width > 0) {
              img.style.width = `${rect.width}px`;
              img.style.height = `${rect.height}px`;
            }

            // Jika gambar menggunakan SVG data-URI dan elemen asli sudah ter-load di layar,
            // rasterisasikan ke PNG beresolusi tinggi agar terbebas dari artefak render kanvas
            if (orig.complete && orig.naturalWidth > 0 && img.src && img.src.startsWith('data:image/svg+xml')) {
              try {
                const rasterCanvas = clonedDoc.createElement('canvas');
                const rw = orig.naturalWidth || 700;
                const rh = orig.naturalHeight || 320;
                rasterCanvas.width = rw * 2;
                rasterCanvas.height = rh * 2;
                const rCtx = rasterCanvas.getContext('2d');
                if (rCtx) {
                  rCtx.fillStyle = '#ffffff';
                  rCtx.fillRect(0, 0, rasterCanvas.width, rasterCanvas.height);
                  rCtx.drawImage(orig, 0, 0, rasterCanvas.width, rasterCanvas.height);
                  const pngUrl = rasterCanvas.toDataURL('image/png', 0.95);
                  if (pngUrl && pngUrl.length > 500) {
                    img.src = pngUrl;
                  }
                }
              } catch (e) {
                console.warn('SVG PNG rasterization fallback warning:', e);
              }
            }
          }
        });

        // Suntikkan aturan CSS khusus pembersih bayangan dan penataan cetak A4
        const styleEl = clonedDoc.createElement('style');
        styleEl.textContent = `
          *, *::before, *::after {
            box-shadow: none !important;
            text-shadow: none !important;
          }
          .printable-document {
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          img {
            max-width: 100% !important;
            display: block !important;
          }
        `;
        clonedDoc.head.appendChild(styleEl);

        // Bersihkan inline style pada target dokumen kloningan
        const target = clonedDoc.getElementById(elementId);
        if (target) {
          const allElements = [target, ...Array.from(target.querySelectorAll('*'))];
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style) {
              if (htmlEl.style.boxShadow) htmlEl.style.boxShadow = 'none';
              if (htmlEl.style.textShadow) htmlEl.style.textShadow = 'none';

              for (let i = 0; i < htmlEl.style.length; i++) {
                const propName = htmlEl.style[i];
                const val = htmlEl.style.getPropertyValue(propName);
                if (val && (val.includes('oklch') || val.includes('color(') || val.includes('lab') || val.includes('lch'))) {
                  htmlEl.style.setProperty(propName, parseAnyColorToRgb(val), 'important');
                }
              }
            }
          });
        }
      }
    });

    // Kembalikan style semula
    element.style.boxShadow = originalShadow;
    element.style.border = originalBorder;

    if (onProgress) onProgress('Menyusun halaman dokumen PDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = 210; // A4 mm
    const pageHeight = 297; // A4 mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Halaman pertama
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Tambah halaman berikutnya jika konten melebihi 1 halaman A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    if (onProgress) onProgress('Mengunduh file PDF ke folder Downloads...');

    const cleanName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    // Download file otomatis ke perangkat pengguna
    try {
      pdf.save(cleanName);
    } catch (saveErr) {
      console.warn('Metode pdf.save menghadapi kendala, menggunakan fallback Blob anchor:', saveErr);
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = cleanName;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      setTimeout(() => {
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    }

    if (onProgress) onProgress('Berhasil! File PDF telah terunduh.');
    return true;
  } catch (error) {
    console.error('Gagal mengekspor PDF otomatis:', error);
    if (onProgress) onProgress('Mengalihkan ke dialog cetak dokumen (Printer / PDF)...');
    triggerDirectPrint(elementId);
    return false;
  } finally {
    // Kembalikan getComputedStyle global dan background root ke semula
    window.getComputedStyle = originalGlobalGetComputedStyle;
    document.body.style.backgroundColor = prevBodyBg;
    document.documentElement.style.backgroundColor = prevDocBg;
  }
}

/**
 * Mencetak dokumen langsung via sistem dialog cetak browser (Printer fisik atau Simpan PDF browser)
 */
export function triggerDirectPrint(elementId: string = 'printable-document-content') {
  try {
    window.focus();
    window.print();
  } catch (err) {
    console.warn('Panggilan window.print() langsung gagal, mencoba mekanisme iframe cetak:', err);
    try {
      const element = document.getElementById(elementId);
      if (element) {
        const printIframe = document.createElement('iframe');
        printIframe.style.position = 'fixed';
        printIframe.style.right = '0';
        printIframe.style.bottom = '0';
        printIframe.style.width = '0';
        printIframe.style.height = '0';
        printIframe.style.border = '0';
        document.body.appendChild(printIframe);

        const doc = printIframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${document.title || 'Dokumen Asesmen IPS SMP'}</title>
                <style>
                  @page { size: A4 portrait; margin: 15mm; }
                  body { font-family: 'Times New Roman', serif; color: #000; background: #fff; margin: 0; padding: 0; font-size: 11pt; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #000; padding: 4px; }
                  img { max-width: 100%; height: auto; }
                  .no-print { display: none !important; }
                </style>
              </head>
              <body>
                ${element.innerHTML}
              </body>
            </html>
          `);
          doc.close();
          setTimeout(() => {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();
            setTimeout(() => {
              document.body.removeChild(printIframe);
            }, 1000);
          }, 400);
        }
      }
    } catch (fallbackErr) {
      console.error('Cetak dokumen gagal total:', fallbackErr);
    }
  }
}
