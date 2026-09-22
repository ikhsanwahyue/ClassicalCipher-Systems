/**
 * File Cryptography Utilities
 * Supports encrypting any binary/text file with AES-256-GCM and header metadata.
 */

const FILE_MAGIC_HEADER = 'CRYPTO_VAULT_v1';

export interface EncryptedFilePackage {
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  encryptedBlob: Blob;
}

export interface DecryptedFilePackage {
  fileName: string;
  mimeType: string;
  fileSize: number;
  decryptedBlob: Blob;
}

export async function encryptFile(
  file: File,
  passwordKey: string
): Promise<EncryptedFilePackage> {
  const fileArrayBuffer = await file.arrayBuffer();
  const enc = new TextEncoder();

  // Generate AES-256 key from password via SHA-256
  const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passwordKey));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKeyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    fileArrayBuffer
  );

  // Metadata JSON
  const metadata = {
    magic: FILE_MAGIC_HEADER,
    originalName: file.name,
    mimeType: file.type || 'application/octet-stream',
    timestamp: Date.now(),
    size: file.size,
  };
  const metadataBytes = enc.encode(JSON.stringify(metadata));
  const metadataLengthBytes = new Uint32Array([metadataBytes.length]);

  // Combine: [4 bytes header length] + [Header JSON Bytes] + [12 bytes IV] + [Ciphertext Buffer]
  const combinedBuffer = new Uint8Array(
    4 + metadataBytes.length + iv.length + ciphertextBuffer.byteLength
  );

  let offset = 0;
  combinedBuffer.set(new Uint8Array(metadataLengthBytes.buffer), offset);
  offset += 4;

  combinedBuffer.set(metadataBytes, offset);
  offset += metadataBytes.length;

  combinedBuffer.set(iv, offset);
  offset += iv.length;

  combinedBuffer.set(new Uint8Array(ciphertextBuffer), offset);

  const encryptedBlob = new Blob([combinedBuffer], {
    type: 'application/octet-stream',
  });

  return {
    fileName: `${file.name}.enc`,
    originalName: file.name,
    mimeType: file.type,
    fileSize: encryptedBlob.size,
    encryptedBlob,
  };
}

export async function decryptFile(
  file: File | Blob,
  passwordKey: string
): Promise<DecryptedFilePackage> {
  const fileArrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileArrayBuffer);

  if (fileBytes.length < 16) {
    throw new Error('Berkas terlalu kecil atau bukan berkas terenkripsi yang valid.');
  }

  // 1. Read metadata length
  const metadataLength = new Uint32Array(fileBytes.slice(0, 4).buffer)[0];
  let offset = 4;

  if (offset + metadataLength > fileBytes.length) {
    throw new Error('Header berkas rusak atau format tidak dikenali.');
  }

  // 2. Read metadata JSON
  const metadataBytes = fileBytes.slice(offset, offset + metadataLength);
  offset += metadataLength;

  const metadataStr = new TextDecoder().decode(metadataBytes);
  let metadata: {
    magic: string;
    originalName: string;
    mimeType: string;
  };

  try {
    metadata = JSON.parse(metadataStr);
    if (metadata.magic !== FILE_MAGIC_HEADER) {
      throw new Error('Header pengenal kripto tidak cocok.');
    }
  } catch (err: unknown) {
    throw new Error('Gagal membaca informasi berkas terenkripsi.');
  }

  // 3. Read 12-byte IV
  const iv = fileBytes.slice(offset, offset + 12);
  offset += 12;

  // 4. Read Ciphertext
  const cipherBytes = fileBytes.slice(offset);

  // Decrypt
  const enc = new TextEncoder();
  const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passwordKey));
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

    const decryptedBlob = new Blob([decryptedBuffer], {
      type: metadata.mimeType || 'application/octet-stream',
    });

    return {
      fileName: metadata.originalName || 'decrypted_file',
      mimeType: metadata.mimeType || 'application/octet-stream',
      fileSize: decryptedBlob.size,
      decryptedBlob,
    };
  } catch (err) {
    throw new Error('Kata sandi salah atau data berkas telah diubah/rusak.');
  }
}
