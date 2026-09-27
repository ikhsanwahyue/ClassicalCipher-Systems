/**
 * Menu 5: Super Enkripsi (Multi-Layered Cryptosystem)
 * Alur Pipeline Berurutan Estafet 4 Lapisan:
 * Layer 1: Vigenère Cipher (Substitusi Polialfabetik Klasik)
 * Layer 2: Rail Fence Cipher (Transposisi Zig-Zag Klasik)
 * Layer 3: Rijndael / AES-256 (Kunci Simetri Modern)
 * Layer 4: Kunci Publik / RSA-OAEP 2048-bit (Kunci Nirsimetri Modern)
 */

import { encryptVigenere, decryptVigenere } from './vigenere';
import { encryptRailFence, decryptRailFence } from './rail-fence';
import { encryptRijndael, decryptRijndael } from './rijndael';
import { encryptRsa, decryptRsa } from './rsa';

export interface SuperKeys {
  vigenereKey: string;
  railFenceRails: number;
  rijndaelKey: string;
  rsaPublicKeyPem: string;
  rsaPrivateKeyPem?: string;
}

export interface DetailedStageMetadata {
  formula?: string;
  keystream?: string;
  sampleSteps?: string[];
  railMatrix?: string[][];
  railSequences?: { railIndex: number; chars: string }[];
  ivHex?: string;
  authTagHex?: string;
  keyDerivation?: string;
  rsaChunksCount?: number;
  extraInfo?: string;
}

export interface PipelineStageInfo {
  stage: number;
  name: string;
  category: 'Substitusi Klasik' | 'Transposisi Klasik' | 'Simetri Modern' | 'Nirsimetri Modern';
  input: string;
  output: string;
  keyUsed: string;
  description: string;
  metadata?: DetailedStageMetadata;
}

export interface SuperEncryptionResult {
  finalCiphertext: string;
  stages: PipelineStageInfo[];
}

export interface SuperDecryptionResult {
  recoveredPlaintext: string;
  stages: PipelineStageInfo[];
}

/**
 * Enkripsi Estafet 4-Lapisan Super Cryptosystem
 */
export async function superEncryptPipeline(
  plainText: string,
  keys: SuperKeys
): Promise<SuperEncryptionResult> {
  const stages: PipelineStageInfo[] = [];

  // Stage 1: Vigenère Cipher (Substitusi Klasik)
  const s1 = encryptVigenere(plainText, keys.vigenereKey || 'KUNCI');
  const sampleVigenere = s1.steps.slice(0, 5).map(s => `${s.plainChar} (${s.plainVal}) + ${s.keyChar} (${s.keyVal}) mod 26 = ${s.cipherChar} (${s.cipherVal})`);
  stages.push({
    stage: 1,
    name: 'Vigenère Cipher',
    category: 'Substitusi Klasik',
    input: plainText,
    output: s1.result,
    keyUsed: `Kata Kunci: "${s1.cleanKey}"`,
    description: `Substitusi polialfabetik dengan menjumlahkan indeks ASCII huruf terhadap kata kunci berulang secara modular 26: C_i = (P_i + K_i) mod 26.`,
    metadata: {
      formula: s1.formula,
      keystream: s1.steps.map(s => s.keyChar).slice(0, 30).join('') + (s1.steps.length > 30 ? '...' : ''),
      sampleSteps: sampleVigenere,
      extraInfo: `${s1.steps.length} Karakter diproses substitusi dinamis.`,
    },
  });

  // Stage 2: Rail Fence Cipher (Transposisi Klasik)
  const railsCount = Math.max(2, keys.railFenceRails || 3);
  const s2 = encryptRailFence(s1.result, railsCount);
  stages.push({
    stage: 2,
    name: 'Rail Fence Cipher',
    category: 'Transposisi Klasik',
    input: s1.result,
    output: s2.result,
    keyUsed: `Kedalaman Rel (k): ${railsCount}`,
    description: `Transposisi geometris dengan menyusun karakter ke dalam pola gelombang zig-zag melintasi ${railsCount} rel, lalu membaca string hasil baris per baris.`,
    metadata: {
      formula: s2.formula,
      railMatrix: s2.matrix,
      railSequences: s2.railSequences,
      extraInfo: `${s2.railSequences.length} Rel horizontal dibaca baris demi baris (${s1.result.length} karakter).`,
    },
  });

  // Stage 3: Rijndael / AES-256 (Simetri Modern)
  const s3 = await encryptRijndael(s2.result, keys.rijndaelKey || 'AES_SECRET_KEY');
  stages.push({
    stage: 3,
    name: 'Rijndael / AES-256',
    category: 'Simetri Modern',
    input: s2.result,
    output: s3.ciphertextBase64,
    keyUsed: `Passphrase: "${keys.rijndaelKey}" (SHA-256 Digest 256-bit)`,
    description: `Transformasi SPN modern 14 putaran (SubBytes, ShiftRows, MixColumns, AddRoundKey) dengan mode Galois/Counter Mode (GCM) dan IV 96-bit acak.`,
    metadata: {
      ivHex: s3.ivHex,
      authTagHex: s3.authTagHex,
      keyDerivation: s3.keyDerivation,
      formula: 'Ciphertext = AES-256-GCM(IV, Plaintext, K_256) ∥ AuthTag_128',
      extraInfo: `14 Putaran Rijndael SPN (Confusion & Diffusion Standar NIST).`,
    },
  });

  // Stage 4: Kunci Publik / RSA-OAEP (Nirsimetri Modern)
  if (!keys.rsaPublicKeyPem || !keys.rsaPublicKeyPem.includes('PUBLIC KEY')) {
    throw new Error('Kunci Publik RSA (PEM) diperlukan untuk menyelesaikan tahap ke-4.');
  }

  const s4 = await encryptRsa(s3.ciphertextBase64, keys.rsaPublicKeyPem);
  stages.push({
    stage: 4,
    name: 'Kunci Publik RSA-OAEP',
    category: 'Nirsimetri Modern',
    input: s3.ciphertextBase64,
    output: s4.ciphertextBase64,
    keyUsed: 'Kunci Publik RSA 2048-bit (e = 65537, n = 2048-bit Modulus)',
    description: `Membagi ciphertext AES menjadi ${s4.chunksCount} blok chunk, membungkusnya dengan OAEP Padding (SHA-256 + MGF1), lalu melakukan enkripsi eksponensial modular: C_i = (M_padded)^e mod n.`,
    metadata: {
      rsaChunksCount: s4.chunksCount,
      formula: 'C_i = (OAEP_Pad(M_i))^65537 mod n',
      extraInfo: `${s4.chunksCount} Blok RSA 2048-bit diproses dengan OAEP Padding SHA-256.`,
    },
  });

  return {
    finalCiphertext: s4.ciphertextBase64,
    stages,
  };
}

/**
 * Dekripsi Estafet Terbalik Super Cryptosystem
 */
export async function superDecryptPipeline(
  superCiphertext: string,
  keys: SuperKeys
): Promise<SuperDecryptionResult> {
  const stages: PipelineStageInfo[] = [];

  // Stage 1: RSA Decrypt (Nirsimetri Modern)
  if (!keys.rsaPrivateKeyPem || !keys.rsaPrivateKeyPem.includes('PRIVATE KEY')) {
    throw new Error('Kunci Privat RSA (PEM) diperlukan untuk mendekripsi tahap ke-1.');
  }

  const s1 = await decryptRsa(superCiphertext, keys.rsaPrivateKeyPem);
  stages.push({
    stage: 1,
    name: 'RSA-OAEP Decrypt',
    category: 'Nirsimetri Modern',
    input: superCiphertext,
    output: s1.plaintext,
    keyUsed: 'Kunci Privat RSA 2048-bit (d = Eksponen Privat, n = Modulus)',
    description: `Mendekripsi ${s1.chunksCount} blok RSA asimetris menggunakan eksponen privat d (M_padded = C^d mod n), lalu memverifikasi & melepas OAEP unpadding untuk memulihkan payload AES.`,
    metadata: {
      rsaChunksCount: s1.chunksCount,
      formula: 'M_i = (C_i)^d mod n -> Unpad OAEP',
      extraInfo: `Berhasil memulihkan ${s1.chunksCount} blok RSA menjadi string ciphertext AES.`,
    },
  });

  // Stage 2: Rijndael / AES-256 Decrypt (Simetri Modern)
  const s2 = await decryptRijndael(s1.plaintext, keys.rijndaelKey || 'AES_SECRET_KEY');
  stages.push({
    stage: 2,
    name: 'Rijndael / AES-256 Decrypt',
    category: 'Simetri Modern',
    input: s1.plaintext,
    output: s2,
    keyUsed: `Passphrase: "${keys.rijndaelKey}" (Kunci SHA-256)`,
    description: `Mengekstrak IV 12-byte dan Authentication Tag 16-byte, memverifikasi integritas GHASH, lalu melakukan inversi 14 putaran AES-CTR untuk memulihkan teks transposisi.`,
    metadata: {
      formula: 'Plaintext = AES-256-CTR(IV, Ciphertext, K_256) [Validasi GHASH Tag]',
      extraInfo: 'Tag GMAC 128-bit terverifikasi valid, kunci simetris cocok.',
    },
  });

  // Stage 3: Rail Fence Decrypt (Transposisi Klasik)
  const railsCount = Math.max(2, keys.railFenceRails || 3);
  const s3 = decryptRailFence(s2, railsCount);
  stages.push({
    stage: 3,
    name: 'Rail Fence Decrypt',
    category: 'Transposisi Klasik',
    input: s2,
    output: s3.result,
    keyUsed: `Kedalaman Rel (k): ${railsCount}`,
    description: `Menghitung frekuensi slot pada tiap rel matriks zig-zag ${railsCount} rel, menempatkan kembali karakter baris per baris, dan membaca jalur zig-zag untuk memulihkan susunan Vigenère.`,
    metadata: {
      formula: s3.formula,
      railMatrix: s3.matrix,
      railSequences: s3.railSequences,
      extraInfo: `Rekonstruksi zig-zag diagonal ${railsCount} rel berhasil.`,
    },
  });

  // Stage 4: Vigenère Decrypt (Substitusi Klasik)
  const s4 = decryptVigenere(s3.result, keys.vigenereKey || 'KUNCI');
  const sampleVigenereDec = s4.steps.slice(0, 5).map(s => `${s.plainChar} (${s.plainVal}) - ${s.keyChar} (${s.keyVal}) mod 26 = ${s.cipherChar} (${s.cipherVal})`);
  stages.push({
    stage: 4,
    name: 'Vigenère Decrypt',
    category: 'Substitusi Klasik',
    input: s3.result,
    output: s4.result,
    keyUsed: `Kata Kunci: "${s4.cleanKey}"`,
    description: `Membalikkan substitusi pergeseran polialfabetik dengan mengurangkan nilai kunci: P_i = (C_i - K_i + 26) mod 26 untuk merekonstruksi plaintext asli seutuhnya.`,
    metadata: {
      formula: s4.formula,
      keystream: s4.steps.map(s => s.keyChar).slice(0, 30).join('') + (s4.steps.length > 30 ? '...' : ''),
      sampleSteps: sampleVigenereDec,
      extraInfo: 'Pergeseran modular dibalikkan (-K mod 26) ke teks asli.',
    },
  });

  return {
    recoveredPlaintext: s4.result,
    stages,
  };
}
