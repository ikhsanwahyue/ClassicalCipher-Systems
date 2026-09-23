/**
 * Menu 3: Rijndael / AES (Advanced Encryption Standard - Kunci Simetris Modern)
 * Menggunakan Web Crypto API untuk AES-256-GCM terotentikasi dan deterministik/random IV.
 * Dilengkapi generator visualisasi State Matrix 4x4 dan simulasi 4 transformasi putaran:
 * 1. SubBytes (Substitusi S-Box)
 * 2. ShiftRows (Permutasi Siklik Baris)
 * 3. MixColumns (Difusi Kolom Galois Field)
 * 4. AddRoundKey (XOR Kunci Putaran)
 */

export interface StateMatrixCell {
  row: number;
  col: number;
  byteVal: number;
  hex: string;
  char: string;
}

export interface RoundTransformationSimulation {
  initialState: string[][];
  afterSubBytes: string[][];
  afterShiftRows: string[][];
  afterMixColumns: string[][];
  afterAddRoundKey: string[][];
  roundKeyPreview: string[][];
}

export interface RijndaelEncryptionResult {
  ciphertextBase64: string;
  ciphertextHex: string;
  ivHex: string;
  authTagHex: string;
  rawCiphertextOnlyHex: string;
  keyDerivation: string;
  keyBytesHex: string;
  mode: string;
  roundsCount: number;
  stateMatrix: StateMatrixCell[][];
  simulation: RoundTransformationSimulation;
}

// AES S-Box Standar FIPS 197
const SBOX: number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

// Galois Field Multiplication GF(2^8)
function gmul(a: number, b: number): number {
  let p = 0;
  for (let counter = 0; counter < 8; counter++) {
    if ((b & 1) !== 0) {
      p ^= a;
    }
    const hi_bit_set = (a & 0x80) !== 0;
    a = (a << 1) & 0xff;
    if (hi_bit_set) {
      a ^= 0x1b; // Polinomial x^8 + x^4 + x^3 + x + 1
    }
    b >>= 1;
  }
  return p;
}

// Konversi Uint8Array ke string Hexadecimal
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

// Konversi string Hexadecimal ke Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Mensimulasikan 4 transformasi putaran Rijndael pada blok 16-byte
 */
export function simulateRijndaelRound(block16: number[], key16: number[]): RoundTransformationSimulation {
  // Susun matriks State 4x4 (kolom per kolom sesuai standar AES)
  const state: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  const roundKey: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      const idx = c * 4 + r;
      state[r][c] = idx < block16.length ? block16[idx] : 0x20;
      roundKey[r][c] = idx < key16.length ? key16[idx] : 0x00;
    }
  }

  const toHexMatrix = (m: number[][]) =>
    m.map((row) => row.map((b) => b.toString(16).padStart(2, '0').toUpperCase()));

  const initialState = toHexMatrix(state);

  // 1. SubBytes: Setiap byte diganti sesuai tabel S-Box
  const subBytesState: number[][] = state.map((row) => row.map((b) => SBOX[b]));

  // 2. ShiftRows: Baris 0 geser 0, Baris 1 geser 1, Baris 2 geser 2, Baris 3 geser 3 (ke kiri)
  const shiftRowsState: number[][] = [
    [subBytesState[0][0], subBytesState[0][1], subBytesState[0][2], subBytesState[0][3]],
    [subBytesState[1][1], subBytesState[1][2], subBytesState[1][3], subBytesState[1][0]],
    [subBytesState[2][2], subBytesState[2][3], subBytesState[2][0], subBytesState[2][1]],
    [subBytesState[3][3], subBytesState[3][0], subBytesState[3][1], subBytesState[3][2]],
  ];

  // 3. MixColumns: Perkalian matriks Galois Field pada setiap kolom
  const mixColumnsState: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let c = 0; c < 4; c++) {
    const s0 = shiftRowsState[0][c];
    const s1 = shiftRowsState[1][c];
    const s2 = shiftRowsState[2][c];
    const s3 = shiftRowsState[3][c];

    mixColumnsState[0][c] = gmul(2, s0) ^ gmul(3, s1) ^ s2 ^ s3;
    mixColumnsState[1][c] = s0 ^ gmul(2, s1) ^ gmul(3, s2) ^ s3;
    mixColumnsState[2][c] = s0 ^ s1 ^ gmul(2, s2) ^ gmul(3, s3);
    mixColumnsState[3][c] = gmul(3, s0) ^ s1 ^ s2 ^ gmul(2, s3);
  }

  // 4. AddRoundKey: XOR State dengan Round Key
  const addRoundKeyState: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      addRoundKeyState[r][c] = mixColumnsState[r][c] ^ roundKey[r][c];
    }
  }

  return {
    initialState,
    afterSubBytes: toHexMatrix(subBytesState),
    afterShiftRows: toHexMatrix(shiftRowsState),
    afterMixColumns: toHexMatrix(mixColumnsState),
    afterAddRoundKey: toHexMatrix(addRoundKeyState),
    roundKeyPreview: toHexMatrix(roundKey),
  };
}

/**
 * Enkripsi Teks menggunakan Rijndael / AES-256-GCM
 */
export async function encryptRijndael(
  plainText: string,
  passphraseKey: string
): Promise<RijndaelEncryptionResult> {
  const enc = new TextEncoder();
  const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passphraseKey || 'DEFAULT_KEY_AES'));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKeyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Inisialisasi IV 96-bit (12 bytes)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintextBytes = enc.encode(plainText);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    plaintextBytes
  );

  const cipherBytes = new Uint8Array(ciphertextBuffer);

  // Pada Web Crypto AES-GCM, 16 byte terakhir adalah Authentication Tag
  const authTagBytes = cipherBytes.slice(cipherBytes.length - 16);
  const rawCiphertextOnly = cipherBytes.slice(0, cipherBytes.length - 16);

  // Format penggabungan kemasan: [12 bytes IV] + [Ciphertext + Auth Tag]
  const combined = new Uint8Array(iv.length + cipherBytes.length);
  combined.set(iv);
  combined.set(cipherBytes, iv.length);

  const ciphertextBase64 = btoa(String.fromCharCode(...combined));
  const ciphertextHex = bytesToHex(cipherBytes);
  const ivHex = bytesToHex(iv);
  const authTagHex = bytesToHex(authTagBytes);
  const rawCiphertextOnlyHex = bytesToHex(rawCiphertextOnly);
  const keyBytesHex = bytesToHex(new Uint8Array(rawKeyData));

  // Buat State Matrix 4x4 untuk blok 16-byte pertama
  const first16Bytes = Array.from(plaintextBytes.slice(0, 16));
  while (first16Bytes.length < 16) {
    first16Bytes.push(0x20); // Pad with spaces if shorter
  }

  const key16Bytes = Array.from(new Uint8Array(rawKeyData).slice(0, 16));

  const stateMatrix: StateMatrixCell[][] = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => {
      const b = first16Bytes[c * 4 + r];
      return {
        row: r,
        col: c,
        byteVal: b,
        hex: b.toString(16).padStart(2, '0').toUpperCase(),
        char: b >= 32 && b <= 126 ? String.fromCharCode(b) : '·',
      };
    })
  );

  const simulation = simulateRijndaelRound(first16Bytes, key16Bytes);

  return {
    ciphertextBase64,
    ciphertextHex,
    ivHex,
    authTagHex,
    rawCiphertextOnlyHex,
    keyDerivation: 'SHA-256 Digest → 256-bit Key (32 Byte / 8 Words)',
    keyBytesHex,
    mode: 'AES-256-GCM (Authenticated Galois/Counter Mode)',
    roundsCount: 14,
    stateMatrix,
    simulation,
  };
}

/**
 * Dekripsi Teks menggunakan Rijndael / AES-256-GCM
 */
export async function decryptRijndael(
  base64OrHexPayload: string,
  passphraseKey: string
): Promise<string> {
  let combined: Uint8Array;
  const cleanInput = base64OrHexPayload.trim();

  try {
    if (cleanInput.includes(' ') || /^[0-9a-fA-F]{24,}$/.test(cleanInput)) {
      combined = hexToBytes(cleanInput);
    } else {
      const binaryString = atob(cleanInput);
      combined = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        combined[i] = binaryString.charCodeAt(i);
      }
    }
  } catch (e) {
    throw new Error('Format ciphertext tidak valid. Gunakan Base64 atau Hex yang benar.');
  }

  if (combined.length < 13) {
    throw new Error('Panjang ciphertext terlalu pendek untuk AES-GCM (minimal 12 bytes IV + ciphertext).');
  }

  const iv = combined.slice(0, 12);
  const cipherBytes = combined.slice(12);

  const enc = new TextEncoder();
  const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passphraseKey || 'DEFAULT_KEY_AES'));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKeyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      cipherBytes
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Gagal mendekripsi: Kunci sandi salah atau integritas data/tag autentikasi rusak.');
  }
}
