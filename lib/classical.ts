/**
 * Classical Cipher Implementations: Caesar & Vigenere
 * Includes step-by-step tracing data generation for visualization.
 */

export interface TraceStep {
  index: number;
  inputChar: string;
  inputVal: number | string;
  keyVal: number | string;
  operation: string;
  resultVal: number | string;
  outputChar: string;
}

export interface CipherResult {
  result: string;
  steps: TraceStep[];
  formula: string;
}

// ----------------------------------------------------
// 1. Caesar Cipher
// ----------------------------------------------------
export function caesarCipher(
  text: string,
  shift: number,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): CipherResult {
  const steps: TraceStep[] = [];
  const normalizedShift = ((shift % 26) + 26) % 26;
  const effectiveShift = mode === 'encrypt' ? normalizedShift : (26 - normalizedShift) % 26;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // Uppercase A-Z (ASCII 65-90)
      const p = code - 65;
      const c = (p + effectiveShift) % 26;
      const outChar = String.fromCharCode(c + 65);
      result += outChar;

      steps.push({
        index: i + 1,
        inputChar: char,
        inputVal: p,
        keyVal: shift,
        operation: mode === 'encrypt' ? `(${p} + ${normalizedShift}) mod 26 = ${c}` : `(${p} - ${normalizedShift} + 26) mod 26 = ${c}`,
        resultVal: c,
        outputChar: outChar,
      });
    } else if (code >= 97 && code <= 122) {
      // Lowercase a-z (ASCII 97-122)
      const p = code - 97;
      const c = (p + effectiveShift) % 26;
      const outChar = String.fromCharCode(c + 97);
      result += outChar;

      steps.push({
        index: i + 1,
        inputChar: char,
        inputVal: p,
        keyVal: shift,
        operation: mode === 'encrypt' ? `(${p} + ${normalizedShift}) mod 26 = ${c}` : `(${p} - ${normalizedShift} + 26) mod 26 = ${c}`,
        resultVal: c,
        outputChar: outChar,
      });
    } else {
      // Non-alphabetic character (keep as-is)
      result += char;
      steps.push({
        index: i + 1,
        inputChar: char,
        inputVal: code,
        keyVal: '-',
        operation: 'Passthrough (Non-alphabet)',
        resultVal: code,
        outputChar: char,
      });
    }
  }

  const formula =
    mode === 'encrypt'
      ? `C = (P + K) mod 26, where K = ${normalizedShift}`
      : `P = (C - K + 26) mod 26, where K = ${normalizedShift}`;

  return { result, steps, formula };
}

// ----------------------------------------------------
// 2. Vigenere Cipher
// ----------------------------------------------------
export function vigenereCipher(
  text: string,
  key: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): CipherResult {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  const steps: TraceStep[] = [];
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // Uppercase A-Z
      const p = code - 65;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.charCodeAt(0) - 65;
      const c = mode === 'encrypt' ? (p + k) % 26 : ((p - k) + 26) % 26;
      const outChar = String.fromCharCode(c + 65);
      result += outChar;

      steps.push({
        index: i + 1,
        inputChar: char,
        inputVal: p,
        keyVal: `${kChar} (${k})`,
        operation: mode === 'encrypt' ? `(${p} + ${k}) mod 26 = ${c}` : `(${p} - ${k} + 26) mod 26 = ${c}`,
        resultVal: c,
        outputChar: outChar,
      });
      keyIndex++;
    } else if (code >= 97 && code <= 122) {
      // Lowercase a-z
      const p = code - 97;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.charCodeAt(0) - 65;
      const c = mode === 'encrypt' ? (p + k) % 26 : ((p - k) + 26) % 26;
      const outChar = String.fromCharCode(c + 97);
      result += outChar;

      steps.push({
        index: i + 1,
        inputChar: char,
        inputVal: p,
        keyVal: `${kChar} (${k})`,
        operation: mode === 'encrypt' ? `(${p} + ${k}) mod 26 = ${c}` : `(${p} - ${k} + 26) mod 26 = ${c}`,
        resultVal: c,
        outputChar: outChar,
      });
      keyIndex++;
    } else {
      result += char;
      steps.push({
        index: i + 1,
        inputChar: char,
        inputVal: code,
        keyVal: '-',
        operation: 'Passthrough (Non-alphabet)',
        resultVal: code,
        outputChar: char,
      });
    }
  }

  const formula =
    mode === 'encrypt'
      ? `C_i = (P_i + K_i) mod 26 [Key: "${cleanKey}"]`
      : `P_i = (C_i - K_i + 26) mod 26 [Key: "${cleanKey}"]`;

  return { result, steps, formula };
}
