/**
 * Super Encryption Pipeline
 * Chaining 4 cipher layers:
 * Layer 1: Caesar Cipher (Substitution)
 * Layer 2: Vigenere Cipher (Polyalphabetic)
 * Layer 3: Bitwise XOR Stream (Modern Bit-level)
 * Layer 4: AES-GCM Block Cipher (Modern Standard)
 */

import { caesarCipher } from './classical';
import { vigenereCipher } from './classical';
import { xorCipher, xorDecryptHex, aesEncrypt, aesDecrypt } from './modern';

export interface SuperKeys {
  caesarShift: number;
  vigenereKey: string;
  xorKey: string;
  aesKey: string;
}

export interface PipelineStage {
  stage: number;
  name: string;
  type: string;
  input: string;
  output: string;
  keyUsed: string;
  description: string;
}

export interface SuperEncryptionResult {
  finalCiphertext: string;
  stages: PipelineStage[];
}

export async function superEncrypt(
  plainText: string,
  keys: SuperKeys
): Promise<SuperEncryptionResult> {
  const stages: PipelineStage[] = [];

  // Stage 1: Caesar
  const s1 = caesarCipher(plainText, keys.caesarShift, 'encrypt');
  stages.push({
    stage: 1,
    name: 'Caesar Cipher',
    type: 'Classical Substitution',
    input: plainText,
    output: s1.result,
    keyUsed: `Shift = ${keys.caesarShift}`,
    description: `Shifted each alphabet character by ${keys.caesarShift} positions.`,
  });

  // Stage 2: Vigenere
  const s2 = vigenereCipher(s1.result, keys.vigenereKey, 'encrypt');
  stages.push({
    stage: 2,
    name: 'Vigenere Cipher',
    type: 'Polyalphabetic Substitution',
    input: s1.result,
    output: s2.result,
    keyUsed: `Key = "${keys.vigenereKey}"`,
    description: `Applied polyalphabetic shift using repeating keyword "${keys.vigenereKey}".`,
  });

  // Stage 3: Bitwise XOR
  const s3 = xorCipher(s2.result, keys.xorKey);
  stages.push({
    stage: 3,
    name: 'Bitwise XOR Stream',
    type: 'Modern Bitwise',
    input: s2.result,
    output: s3.result, // Hex formatted
    keyUsed: `XOR Key = "${keys.xorKey}"`,
    description: `Transformed characters into bytes and performed bitwise XOR with key stream.`,
  });

  // Stage 4: AES-GCM
  const s4 = await aesEncrypt(s3.result, keys.aesKey);
  stages.push({
    stage: 4,
    name: 'AES-256 GCM',
    type: 'Modern Block Cipher',
    input: s3.result,
    output: s4,
    keyUsed: `AES Key = "${keys.aesKey}"`,
    description: `Encrypted the hex stream using authenticated AES-GCM with 96-bit IV.`,
  });

  return {
    finalCiphertext: s4,
    stages,
  };
}

export async function superDecrypt(
  cipherText: string,
  keys: SuperKeys
): Promise<SuperEncryptionResult> {
  const stages: PipelineStage[] = [];

  // Stage 1: AES-GCM Decrypt
  const s1 = await aesDecrypt(cipherText, keys.aesKey);
  stages.push({
    stage: 1,
    name: 'AES-256 GCM Decrypt',
    type: 'Modern Block Cipher',
    input: cipherText,
    output: s1,
    keyUsed: `AES Key = "${keys.aesKey}"`,
    description: `Decrypted AES payload and verified GCM authentication tag.`,
  });

  // Stage 2: XOR Decrypt
  const s2 = xorDecryptHex(s1, keys.xorKey);
  stages.push({
    stage: 2,
    name: 'Bitwise XOR Reverse',
    type: 'Modern Bitwise',
    input: s1,
    output: s2,
    keyUsed: `XOR Key = "${keys.xorKey}"`,
    description: `Reversed bitwise XOR operation using keystream.`,
  });

  // Stage 3: Vigenere Decrypt
  const s3 = vigenereCipher(s2, keys.vigenereKey, 'decrypt');
  stages.push({
    stage: 3,
    name: 'Vigenere Decrypt',
    type: 'Polyalphabetic Substitution',
    input: s2,
    output: s3.result,
    keyUsed: `Key = "${keys.vigenereKey}"`,
    description: `Reversed Vigenere polyalphabetic shift.`,
  });

  // Stage 4: Caesar Decrypt
  const s4 = caesarCipher(s3.result, keys.caesarShift, 'decrypt');
  stages.push({
    stage: 4,
    name: 'Caesar Decrypt',
    type: 'Classical Substitution',
    input: s3.result,
    output: s4.result,
    keyUsed: `Shift = ${keys.caesarShift}`,
    description: `Reversed Caesar shift by -${keys.caesarShift} to recover original plaintext.`,
  });

  return {
    finalCiphertext: s4.result,
    stages,
  };
}
