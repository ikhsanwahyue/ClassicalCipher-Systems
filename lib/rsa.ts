/**
 * Menu 4: Kunci Publik / RSA (Asymmetric Cryptography / Nirsimetris Modern)
 * Menggunakan Web Crypto API untuk RSA-OAEP 2048-bit dengan SHA-256.
 * Dilengkapi fitur Export/Import format standar PEM, pembagian blok otomatis (chunking),
 * dan pelacakan detail matematis (Modulus 2048-bit, Exponent e=65537, OAEP Padding).
 */

export interface RsaKeyPairPem {
  publicKeyPem: string;
  privateKeyPem: string;
}

export interface RsaChunkTrace {
  chunkIndex: number;
  plainByteLength: number;
  plainSnippet: string;
  oaepPaddingApplied: string;
  operation: string;
  cipherBase64: string;
  cipherLengthBytes: number;
  mathTrace?: {
    cInteger: string;
    mInteger: string;
    nInteger: string;
    eInteger: string;
  };
}

export interface RsaEncryptionResult {
  ciphertextBase64: string;
  chunksCount: number;
  chunkTraces: RsaChunkTrace[];
  mathParameters: {
    algorithm: string;
    keySize: string;
    publicExponent: string;
    hashFunction: string;
    paddingScheme: string;
    maxChunkCapacity: string;
  };
}

// Konversi ArrayBuffer ke Base64 PEM string
function arrayBufferToPem(buffer: ArrayBuffer, type: 'PUBLIC KEY' | 'PRIVATE KEY'): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const formattedBase64 = base64.match(/.{1,64}/g)?.join('\n') || base64;
  return `-----BEGIN ${type}-----\n${formattedBase64}\n-----END ${type}-----`;
}

// Ekstrak ArrayBuffer dari format PEM string
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleanPem = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, '')
    .replace(/-----END [A-Z ]+-----/g, '')
    .replace(/[\r\n\s]/g, '');
  const binaryString = atob(cleanPem);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Membuat pasangan kunci baru RSA-OAEP 2048-bit
 */
export async function generateRsaKeyPair(): Promise<RsaKeyPairPem> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const spkiBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const pkcs8Buffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKeyPem: arrayBufferToPem(spkiBuffer, 'PUBLIC KEY'),
    privateKeyPem: arrayBufferToPem(pkcs8Buffer, 'PRIVATE KEY'),
  };
}

/**
 * Import Kunci Publik dari format string PEM
 */
export async function importPublicKey(pem: string): Promise<CryptoKey> {
  const buffer = pemToArrayBuffer(pem);
  return await crypto.subtle.importKey(
    'spki',
    buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

/**
 * Import Kunci Privat dari format string PEM
 */
export async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const buffer = pemToArrayBuffer(pem);
  return await crypto.subtle.importKey(
    'pkcs8',
    buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt']
  );
}

/**
 * Enkripsi Teks dengan Kunci Publik RSA-OAEP
 * Mendukung teks dengan panjang sembarang melalui pembagian blok (chunking).
 */
export async function encryptRsa(
  plainText: string,
  publicKeyPem: string
): Promise<RsaEncryptionResult> {
  const publicKey = await importPublicKey(publicKeyPem);
  const enc = new TextEncoder();
  const textBytes = enc.encode(plainText);

  // Ukuran maksimum plaintext untuk RSA-OAEP 2048-bit dengan SHA-256 adalah 256 - 2*32 - 2 = 190 byte
  const CHUNK_SIZE = 180;
  const encryptedChunks: string[] = [];
  const chunkTraces: RsaChunkTrace[] = [];

  // Ambil modulus (n) untuk mathematical trace
  const jwkPublic = await crypto.subtle.exportKey('jwk', publicKey);
  let nInteger = '';
  let eInteger = '65537';
  if (jwkPublic.n) {
    const b64 = jwkPublic.n.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    let hex = '';
    for(let i=0; i<bin.length; i++) hex += bin.charCodeAt(i).toString(16).padStart(2, '0');
    nInteger = BigInt('0x' + hex).toString();
  }

  let chunkIdx = 1;
  for (let i = 0; i < textBytes.length; i += CHUNK_SIZE) {
    const chunk = textBytes.slice(i, i + CHUNK_SIZE);
    const chunkSnippet = new TextDecoder().decode(chunk);
    
    // M as integer (Raw M, before OAEP padding)
    let mHex = '';
    for(let j=0; j<chunk.length; j++) mHex += chunk[j].toString(16).padStart(2, '0');
    const mInteger = BigInt('0x' + (mHex || '00')).toString();

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      chunk
    );

    const chunkBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
    encryptedChunks.push(chunkBase64);

    // C as integer
    const cBytes = new Uint8Array(encryptedBuffer);
    let cHex = '';
    for(let j=0; j<cBytes.length; j++) cHex += cBytes[j].toString(16).padStart(2, '0');
    const cInteger = BigInt('0x' + cHex).toString();

    chunkTraces.push({
      chunkIndex: chunkIdx++,
      plainByteLength: chunk.length,
      plainSnippet: chunkSnippet.length > 30 ? chunkSnippet.substring(0, 30) + '...' : chunkSnippet,
      oaepPaddingApplied: 'MGF1 Masking + SHA-256 Seed (256-byte Padded Block)',
      operation: 'C_i = (M_i_padded)^e mod n, dengan e = 65537',
      cipherBase64: chunkBase64,
      cipherLengthBytes: 256, // 2048 bit modulus = 256 bytes per encrypted block
      mathTrace: {
        cInteger,
        mInteger,
        nInteger,
        eInteger
      }
    });
  }

  // Format payload JSON terbungkus Base64
  const payload = JSON.stringify({
    scheme: 'RSA-OAEP-2048',
    chunks: encryptedChunks,
    count: encryptedChunks.length,
  });

  const ciphertextBase64 = btoa(payload);

  return {
    ciphertextBase64,
    chunksCount: encryptedChunks.length,
    chunkTraces,
    mathParameters: {
      algorithm: 'RSA-OAEP (Optimal Asymmetric Encryption Padding)',
      keySize: '2048-bit (256-Byte Modulus n)',
      publicExponent: 'e = 65537 (0x10001)',
      hashFunction: 'SHA-256 (256-bit Digest)',
      paddingScheme: 'RSAES-OAEP with MGF1 (Bellare-Rogaway)',
      maxChunkCapacity: '190 Byte per Blok RSA',
    },
  };
}

/**
 * Dekripsi Ciphertext dengan Kunci Privat RSA-OAEP
 */
export async function decryptRsa(
  ciphertextBase64: string,
  privateKeyPem: string
): Promise<{ plaintext: string; chunksCount: number; traces: { chunkIndex: number; status: string }[] }> {
  const privateKey = await importPrivateKey(privateKeyPem);

  let rawPayload: string;
  try {
    rawPayload = atob(ciphertextBase64.trim());
  } catch (e) {
    throw new Error('Ciphertext RSA tidak valid (bukan Base64 terenkripsi yang valid).');
  }

  let data: { scheme: string; chunks: string[] };
  try {
    data = JSON.parse(rawPayload);
  } catch (e) {
    data = { scheme: 'RSA-OAEP-2048', chunks: [ciphertextBase64.trim()] };
  }

  const decryptedChunks: Uint8Array[] = [];
  const traces: { chunkIndex: number; status: string }[] = [];
  let totalLength = 0;

  for (let idx = 0; idx < data.chunks.length; idx++) {
    const chunkBase64 = data.chunks[idx];
    const binary = atob(chunkBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    try {
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privateKey,
        bytes
      );
      const decBytes = new Uint8Array(decryptedBuffer);
      decryptedChunks.push(decBytes);
      totalLength += decBytes.length;

      traces.push({
        chunkIndex: idx + 1,
        status: `M_${idx + 1} = (C_${idx + 1})^d mod n -> Unmasked OAEP -> ${decBytes.length} Bytes`,
      });
    } catch (err) {
      throw new Error(`Gagal mendekripsi blok #${idx + 1}: Kunci privat tidak cocok.`);
    }
  }

  // Gabungkan seluruh chunk
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of decryptedChunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return {
    plaintext: new TextDecoder().decode(combined),
    chunksCount: data.chunks.length,
    traces,
  };
}
