/**
 * Menu 2: Rail Fence Cipher (Transposisi Zig-Zag Klasik)
 * Mendukung enkripsi, dekripsi, generator visualisasi matriks rel aman, dan tracing transposisi.
 */

export interface RailFenceMatrixCell {
  char: string;
  isPlaced: boolean;
}

export interface RailFenceResult {
  result: string;
  rails: number;
  matrix: string[][];
  railSequences: { railIndex: number; chars: string }[];
  formula: string;
  totalChars?: number;
  isMatrixTruncated?: boolean;
  maxVisualCols?: number;
}

// Batas aman kedalaman rel absolut untuk menjaga kestabilan memori dan rendering visualizer
export const MAX_SAFE_RAILS = 25;
export const MAX_VISUAL_COLS = 60;

/**
 * Menghitung kedalaman rel valid berdasarkan panjang teks:
 * - Minimal 2 rel.
 * - Maksimal (panjang teks - 1) agar terbentuk pola gelombang zig-zag (tidak degenerate / 1 arah saja).
 * - Tidak boleh melebihi MAX_SAFE_RAILS (25) agar tidak terjadi crash memori/rendering.
 */
export function getSafeRailsBound(textLength: number): { min: number; max: number } {
  if (textLength <= 2) {
    return { min: 2, max: 2 };
  }
  const maxRails = Math.min(Math.max(2, textLength - 1), MAX_SAFE_RAILS);
  return { min: 2, max: maxRails };
}

/**
 * Enkripsi Rail Fence Cipher
 * Karakter disusun secara zig-zag pada k rel, lalu dibaca baris demi baris.
 */
export function encryptRailFence(text: string, rails: number): RailFenceResult {
  const len = text.length;

  if (len === 0) {
    return {
      result: '',
      rails: 2,
      matrix: [],
      railSequences: [],
      formula: 'Teks kosong',
      totalChars: 0,
      isMatrixTruncated: false,
    };
  }

  // Tentukan batas aman rel
  const { max: maxAllowedRails } = getSafeRailsBound(len);
  const k = Math.min(Math.max(2, Math.floor(rails || 2)), maxAllowedRails);

  if (len === 1) {
    return {
      result: text,
      rails: k,
      matrix: [[text[0]], ['']],
      railSequences: [
        { railIndex: 1, chars: text },
        { railIndex: 2, chars: '' },
      ],
      formula: `Transposisi Rail Fence 1 Karakter (k = ${k})`,
      totalChars: 1,
      isMatrixTruncated: false,
    };
  }

  // 1. Eksekusi transposisi memori-efisien O(len) menggunakan array string per rel
  const railBuffers: string[] = Array.from({ length: k }, () => '');
  let row = 0;
  let goingDown = true;

  for (let col = 0; col < len; col++) {
    railBuffers[row] += text[col];

    if (row === 0) {
      goingDown = true;
    } else if (row === k - 1) {
      goingDown = false;
    }

    row += goingDown ? 1 : -1;
  }

  const result = railBuffers.join('');
  const railSequences = railBuffers.map((chars, idx) => ({
    railIndex: idx + 1,
    chars,
  }));

  // 2. Buat matriks visualisasi (dibatasi hingga MAX_VISUAL_COLS agar DOM tidak crash jika teks ribuan karakter)
  const visualCols = Math.min(len, MAX_VISUAL_COLS);
  const matrix: string[][] = Array.from({ length: k }, () => Array(visualCols).fill(''));

  row = 0;
  goingDown = true;
  for (let col = 0; col < visualCols; col++) {
    matrix[row][col] = text[col];

    if (row === 0) {
      goingDown = true;
    } else if (row === k - 1) {
      goingDown = false;
    }

    row += goingDown ? 1 : -1;
  }

  return {
    result,
    rails: k,
    matrix,
    railSequences,
    formula: `Transposisi Zig-Zag ${k} Rel (Dibaca Baris demi Baris 1 s/d ${k})`,
    totalChars: len,
    isMatrixTruncated: len > visualCols,
    maxVisualCols: visualCols,
  };
}

/**
 * Dekripsi Rail Fence Cipher
 * Merekonstruksi matriks zig-zag berdasarkan panjang teks dan rel, mengisi karakter per baris,
 * kemudian membaca kembali secara zig-zag diagonal untuk mendapatkan plaintext asli.
 */
export function decryptRailFence(cipherText: string, rails: number): RailFenceResult {
  const len = cipherText.length;

  if (len === 0) {
    return {
      result: '',
      rails: 2,
      matrix: [],
      railSequences: [],
      formula: 'Ciphertext kosong',
      totalChars: 0,
      isMatrixTruncated: false,
    };
  }

  // Tentukan batas aman rel
  const { max: maxAllowedRails } = getSafeRailsBound(len);
  const k = Math.min(Math.max(2, Math.floor(rails || 2)), maxAllowedRails);

  if (len === 1) {
    return {
      result: cipherText,
      rails: k,
      matrix: [[cipherText[0]], ['']],
      railSequences: [
        { railIndex: 1, chars: cipherText },
        { railIndex: 2, chars: '' },
      ],
      formula: `Pemulihan Rail Fence 1 Karakter (k = ${k})`,
      totalChars: 1,
      isMatrixTruncated: false,
    };
  }

  // 1. Hitung jumlah karakter di setiap rel melalui simulasi jalur zig-zag O(len)
  const railCounts: number[] = Array(k).fill(0);
  let row = 0;
  let goingDown = true;

  for (let col = 0; col < len; col++) {
    railCounts[row]++;

    if (row === 0) {
      goingDown = true;
    } else if (row === k - 1) {
      goingDown = false;
    }

    row += goingDown ? 1 : -1;
  }

  // 2. Potong ciphertext menjadi urutan karakter masing-masing rel
  const railCharsList: string[] = [];
  let cursor = 0;
  for (let r = 0; r < k; r++) {
    railCharsList.push(cipherText.slice(cursor, cursor + railCounts[r]));
    cursor += railCounts[r];
  }

  const railSequences = railCharsList.map((chars, idx) => ({
    railIndex: idx + 1,
    chars,
  }));

  // 3. Baca kembali secara zig-zag untuk merekonstruksi plaintext asli
  const railPointers: number[] = Array(k).fill(0);
  let result = '';
  row = 0;
  goingDown = true;

  for (let col = 0; col < len; col++) {
    const char = railCharsList[row][railPointers[row]++] || '';
    result += char;

    if (row === 0) {
      goingDown = true;
    } else if (row === k - 1) {
      goingDown = false;
    }

    row += goingDown ? 1 : -1;
  }

  // 4. Buat matriks visualisasi aman (dibatasi MAX_VISUAL_COLS)
  const visualCols = Math.min(len, MAX_VISUAL_COLS);
  const matrix: string[][] = Array.from({ length: k }, () => Array(visualCols).fill(''));

  row = 0;
  goingDown = true;
  for (let col = 0; col < visualCols; col++) {
    matrix[row][col] = result[col] || '';

    if (row === 0) {
      goingDown = true;
    } else if (row === k - 1) {
      goingDown = false;
    }

    row += goingDown ? 1 : -1;
  }

  return {
    result,
    rails: k,
    matrix,
    railSequences,
    formula: `Pemulihan Transposisi Zig-Zag ${k} Rel (Membaca Diagonal Zig-Zag)`,
    totalChars: len,
    isMatrixTruncated: len > visualCols,
    maxVisualCols: visualCols,
  };
}
