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
  railMatrix?: string[][];
  ivHex?: string;
  authTagHex?: string;
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
  stages.push({
    stage: 1,
    name: 'Vigenère Cipher',
    category: 'Substitusi Klasik',
    input: plainText,
    output: s1.result,
    keyUsed: `Kata Kunci: "${s1.cleanKey}"`,
    description: `Menggeser alfabet plaintext secara polialfabetik berdasarkan kunci "${s1.cleanKey}".`,
    metadata: {
      formula: s1.formula,
      extraInfo: `${s1.steps.length} Karakter diproses modular 26.`,
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
    description: `Menyusun karakter secara zig-zag pada ${railsCount} rel dan membaca baris per baris.`,
    metadata: {
      formula: s2.formula,
      railMatrix: s2.matrix,
      extraInfo: `${s2.railSequences.length} Rel horizontal dibaca baris demi baris.`,
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
    keyUsed: `Passphrase: "${keys.rijndaelKey}" (Derived via SHA-256)`,
    description: `Mengenkripsi ciphertext transposisi dengan AES-256-GCM terotentikasi & 96-bit IV.`,
    metadata: {
      ivHex: s3.ivHex,
      authTagHex: s3.authTagHex,
      extraInfo: `14 Putaran Rijndael SPN (SubBytes, ShiftRows, MixColumns, AddRoundKey).`,
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
    keyUsed: 'Kunci Publik RSA-OAEP 2048-bit (PEM)',
    description: `Mengamankan payload AES menggunakan Kunci Publik asimetris berstandar RSA-OAEP 2048-bit.`,
    metadata: {
      rsaChunksCount: s4.chunksCount,
      formula: 'C_i = (M_i)^e mod n (e = 65537)',
      extraInfo: `${s4.chunksCount} Blok RSA dipad dengan OAEP SHA-256.`,
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
    keyUsed: 'Kunci Privat RSA-OAEP 2048-bit (PEM)',
    description: `Mendekripsi lapisan asimetris RSA untuk memperoleh ciphertext AES terotentikasi.`,
    metadata: {
      rsaChunksCount: s1.chunksCount,
      formula: 'M_i = (C_i)^d mod n',
      extraInfo: `Berhasil memulihkan ${s1.chunksCount} blok RSA ke payload AES.`,
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
    keyUsed: `Passphrase: "${keys.rijndaelKey}"`,
    description: `Mendekripsi AES-256-GCM dan memverifikasi integritas autentikasi untuk memulihkan teks transposisi.`,
    metadata: {
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
    description: `Merekonstruksi posisi matriks zig-zag ${railsCount} rel untuk memulihkan urutan asli Vigenère.`,
    metadata: {
      formula: s3.formula,
      railMatrix: s3.matrix,
      extraInfo: `Rekonstruksi zig-zag diagonal ${railsCount} rel berhasil.`,
    },
  });

  // Stage 4: Vigenère Decrypt (Substitusi Klasik)
  const s4 = decryptVigenere(s3.result, keys.vigenereKey || 'KUNCI');
  stages.push({
    stage: 4,
    name: 'Vigenère Decrypt',
    category: 'Substitusi Klasik',
    input: s3.result,
    output: s4.result,
    keyUsed: `Kata Kunci: "${s4.cleanKey}"`,
    description: `Membalikkan pergeseran substitusi Vigenère untuk meregenerasi plaintext asli 100%.`,
    metadata: {
      formula: s4.formula,
      extraInfo: 'Pergeseran modular dibalikkan (-K mod 26) ke teks asli.',
    },
  });

  return {
    recoveredPlaintext: s4.result,
    stages,
  };
}
