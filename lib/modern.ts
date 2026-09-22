/**
 * Modern Cryptography Implementations:
 * 1. XOR Cipher (Bit-level Stream Cipher) with binary tracing
 * 2. RC4 Stream Cipher (KSA & PRGA S-Box permutation)
 * 3. AES-GCM / AES-CBC (Web Crypto API standard)
 */

export interface ModernTraceStep {
  index: number;
  inputByte: number;
  inputChar: string;
  inputBinary: string;
  keyByte: number;
  keyChar: string;
  keyBinary: string;
  operation: string;
  outputByte: number;
  outputHex: string;
  outputBinary: string;
}

export interface ModernCipherResult {
  result: string;       // Hex or Base64 representation
  rawBytes: number[];
  steps: ModernTraceStep[];
  formula: string;
}

// Helper: Convert byte to 8-bit binary string
export function byteToBinary(b: number): string {
  return (b >>> 0).toString(2).padStart(8, '0');
}

// ----------------------------------------------------
// 1. Bitwise XOR Cipher (Modern Mode 1)
// ----------------------------------------------------
export function xorCipher(text: string, key: string): ModernCipherResult {
  const enc = new TextEncoder();
  const textBytes = Array.from(enc.encode(text));
  const keyBytes = Array.from(enc.encode(key || 'K'));
  const steps: ModernTraceStep[] = [];
  const outBytes: number[] = [];

  for (let i = 0; i < textBytes.length; i++) {
    const pByte = textBytes[i];
    const kByte = keyBytes[i % keyBytes.length];
    const cByte = pByte ^ kByte;
    outBytes.push(cByte);

    steps.push({
      index: i + 1,
      inputByte: pByte,
      inputChar: String.fromCharCode(pByte),
      inputBinary: byteToBinary(pByte),
      keyByte: kByte,
      keyChar: String.fromCharCode(kByte),
      keyBinary: byteToBinary(kByte),
      operation: `${byteToBinary(pByte)} ⊕ ${byteToBinary(kByte)} = ${byteToBinary(cByte)}`,
      outputByte: cByte,
      outputHex: cByte.toString(16).padStart(2, '0').toUpperCase(),
      outputBinary: byteToBinary(cByte),
    });
  }

  // Result as Hex string
  const hexResult = outBytes.map((b) => b.toString(16).padStart(2, '0')).join(' ');

  return {
    result: hexResult,
    rawBytes: outBytes,
    steps,
    formula: `C_i = P_i ⊕ K_(i mod |K|) (Bitwise XOR Operation)`,
  };
}

export function xorDecryptHex(hexString: string, key: string): string {
  const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.substr(i, 2), 16));
  }
  const keyBytes = Array.from(new TextEncoder().encode(key || 'K'));
  const decryptedBytes = bytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  return new TextDecoder().decode(new Uint8Array(decryptedBytes));
}

// ----------------------------------------------------
// 2. RC4 (Rivest Cipher 4) Stream Cipher
// ----------------------------------------------------
export function rc4Cipher(text: string, key: string): ModernCipherResult {
  const keyBytes = Array.from(new TextEncoder().encode(key || 'RC4Key'));
  const textBytes = Array.from(new TextEncoder().encode(text));

  // KSA (Key-Scheduling Algorithm)
  const S: number[] = [];
  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + keyBytes[i % keyBytes.length]) % 256;
    const temp = S[i];
    S[i] = S[j];
    S[j] = temp;
  }

  // PRGA (Pseudo-Random Generation Algorithm)
  let i = 0;
  j = 0;
  const outBytes: number[] = [];
  const steps: ModernTraceStep[] = [];

  for (let idx = 0; idx < textBytes.length; idx++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    const temp = S[i];
    S[i] = S[j];
    S[j] = temp;

    const kByte = S[(S[i] + S[j]) % 256];
    const pByte = textBytes[idx];
    const cByte = pByte ^ kByte;
    outBytes.push(cByte);

    steps.push({
      index: idx + 1,
      inputByte: pByte,
      inputChar: String.fromCharCode(pByte),
      inputBinary: byteToBinary(pByte),
      keyByte: kByte,
      keyChar: `S[${(S[i] + S[j]) % 256}]`,
      keyBinary: byteToBinary(kByte),
      operation: `Keystream=${kByte} -> ${byteToBinary(pByte)} ⊕ ${byteToBinary(kByte)} = ${byteToBinary(cByte)}`,
      outputByte: cByte,
      outputHex: cByte.toString(16).padStart(2, '0').toUpperCase(),
      outputBinary: byteToBinary(cByte),
    });
  }

  const hexResult = outBytes.map((b) => b.toString(16).padStart(2, '0')).join(' ');

  return {
    result: hexResult,
    rawBytes: outBytes,
    steps,
    formula: `RC4 (KSA 256-byte S-Box permutation + PRGA Keystream XOR)`,
  };
}

// ----------------------------------------------------
// 3. AES-GCM (Web Crypto API)
// ----------------------------------------------------
export async function aesEncrypt(plainText: string, passwordKey: string): Promise<string> {
  const enc = new TextEncoder();
  const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passwordKey));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKeyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    enc.encode(plainText)
  );

  const cipherBytes = new Uint8Array(ciphertextBuffer);
  const combined = new Uint8Array(iv.length + cipherBytes.length);
  combined.set(iv);
  combined.set(cipherBytes, iv.length);

  // Return base64 encoded string
  return btoa(String.fromCharCode(...combined));
}

export async function aesDecrypt(base64Payload: string, passwordKey: string): Promise<string> {
  const binaryString = atob(base64Payload);
  const combined = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    combined[i] = binaryString.charCodeAt(i);
  }

  const iv = combined.slice(0, 12);
  const cipherBytes = combined.slice(12);

  const enc = new TextEncoder();
  const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passwordKey));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKeyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    cipherBytes
  );

  return new TextDecoder().decode(decryptedBuffer);
}
