/**
 * Menu 2: Rail Fence Cipher (Transposisi Zig-Zag Klasik)
 * Mendukung enkripsi, dekripsi, generator visualisasi matriks rel, dan tracing transposisi.
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
}

/**
 * Enkripsi Rail Fence Cipher
 * Karakter disusun secara zig-zag pada k rel, lalu dibaca baris demi baris.
 */
export function encryptRailFence(text: string, rails: number): RailFenceResult {
  const k = Math.max(2, Math.floor(rails || 2));
  const len = text.length;

  if (len === 0 || k <= 1 || k >= len) {
    return {
      result: text,
      rails: k,
      matrix: [Array.from(text)],
      railSequences: [{ railIndex: 0, chars: text }],
      formula: `Transposisi Rail Fence (k = ${k})`,
    };
  }

  // Inisialisasi matriks rel dengan spasi kosong
  const matrix: string[][] = Array.from({ length: k }, () => Array(len).fill(''));

  let row = 0;
  let goingDown = true;

  // Tempatkan karakter secara zig-zag
  for (let col = 0; col < len; col++) {
    matrix[row][col] = text[col];

    if (row === 0) {
      goingDown = true;
    } else if (row === k - 1) {
      goingDown = false;
    }

    row += goingDown ? 1 : -1;
  }

  // Baca baris demi baris untuk menghasilkan ciphertext
  let result = '';
  const railSequences: { railIndex: number; chars: string }[] = [];

  for (let r = 0; r < k; r++) {
    let railChars = '';
    for (let c = 0; c < len; c++) {
      if (matrix[r][c] !== '') {
        result += matrix[r][c];
        railChars += matrix[r][c];
      }
    }
    railSequences.push({ railIndex: r + 1, chars: railChars });
  }

  return {
    result,
    rails: k,
    matrix,
    railSequences,
    formula: `Transposisi Zig-Zag ${k} Rel (Dibaca Baris demi Baris 1 s/d ${k})`,
  };
}

/**
 * Dekripsi Rail Fence Cipher
 * Merekonstruksi matriks zig-zag berdasarkan panjang teks dan rel, mengisi karakter per baris,
 * kemudian membaca kembali secara zig-zag diagonal untuk mendapatkan plaintext asli.
 */
export function decryptRailFence(cipherText: string, rails: number): RailFenceResult {
  const k = Math.max(2, Math.floor(rails || 2));
  const len = cipherText.length;

  if (len === 0 || k <= 1 || k >= len) {
    return {
      result: cipherText,
      rails: k,
      matrix: [Array.from(cipherText)],
      railSequences: [{ railIndex: 0, chars: cipherText }],
      formula: `Pemulihan Transposisi Rail Fence (k = ${k})`,
    };
  }

  // 1. Buat pola zig-zag dan tandai posisi karakter dengan '*'
  const matrix: string[][] = Array.from({ length: k }, () => Array(len).fill(''));
  let row = 0;
  let goingDown = true;

  for (let col = 0; col < len; col++) {
    matrix[row][col] = '*';

    if (row === 0) {
      goingDown = true;
    } else if (row === k - 1) {
      goingDown = false;
    }

    row += goingDown ? 1 : -1;
  }

  // 2. Isi posisi bertanda '*' dengan karakter dari ciphertext baris per baris
  let cipherIndex = 0;
  const railSequences: { railIndex: number; chars: string }[] = [];

  for (let r = 0; r < k; r++) {
    let railChars = '';
    for (let c = 0; c < len; c++) {
      if (matrix[r][c] === '*' && cipherIndex < len) {
        matrix[r][c] = cipherText[cipherIndex++];
        railChars += matrix[r][c];
      }
    }
    railSequences.push({ railIndex: r + 1, chars: railChars });
  }

  // 3. Baca kembali matriks secara zig-zag untuk menyusun plaintext asli
  let result = '';
  row = 0;
  goingDown = true;

  for (let col = 0; col < len; col++) {
    if (matrix[row][col] !== '') {
      result += matrix[row][col];
    }

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
  };
}
