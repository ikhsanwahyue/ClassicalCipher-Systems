/**
 * Menu 1: Vigenère Cipher (Substitusi Polialfabetik Klasik)
 * Mendukung enkripsi, dekripsi, normalisasi kunci, serta tracing langkah-demi-langkah.
 */

export interface VigenereTraceStep {
  index: number;
  plainChar: string;
  plainVal: number;
  keyChar: string;
  keyVal: number;
  operation: string;
  cipherVal: number;
  cipherChar: string;
}

export interface VigenereResult {
  result: string;
  cleanText: string;
  cleanKey: string;
  steps: VigenereTraceStep[];
  formula: string;
}

/**
 * Enkripsi Vigenère Cipher: C_i = (P_i + K_i) mod 26
 */
export function encryptVigenere(text: string, key: string): VigenereResult {
  const cleanKey = (key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  const steps: VigenereTraceStep[] = [];
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // Huruf Besar A-Z (ASCII 65-90)
      const p = code - 65;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.charCodeAt(0) - 65;
      const c = (p + k) % 26;
      const outChar = String.fromCharCode(c + 65);
      result += outChar;

      steps.push({
        index: i + 1,
        plainChar: char,
        plainVal: p,
        keyChar: kChar,
        keyVal: k,
        operation: `(${p} + ${k}) mod 26 = ${c}`,
        cipherVal: c,
        cipherChar: outChar,
      });
      keyIndex++;
    } else if (code >= 97 && code <= 122) {
      // Huruf Kecil a-z (ASCII 97-122)
      const p = code - 97;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.charCodeAt(0) - 65;
      const c = (p + k) % 26;
      const outChar = String.fromCharCode(c + 97);
      result += outChar;

      steps.push({
        index: i + 1,
        plainChar: char,
        plainVal: p,
        keyChar: kChar,
        keyVal: k,
        operation: `(${p} + ${k}) mod 26 = ${c}`,
        cipherVal: c,
        cipherChar: outChar,
      });
      keyIndex++;
    } else {
      // Karakter non-alfabet (angka, spasi, simbol dipertahankan)
      result += char;
      steps.push({
        index: i + 1,
        plainChar: char,
        plainVal: -1,
        keyChar: '-',
        keyVal: -1,
        operation: 'Passthrough (Non-Alfabet)',
        cipherVal: -1,
        cipherChar: char,
      });
    }
  }

  return {
    result,
    cleanText: text,
    cleanKey,
    steps,
    formula: `C_i = (P_i + K_(i mod |K|)) mod 26 [Kunci: "${cleanKey}"]`,
  };
}

/**
 * Dekripsi Vigenère Cipher: P_i = (C_i - K_i + 26) mod 26
 */
export function decryptVigenere(cipherText: string, key: string): VigenereResult {
  const cleanKey = (key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  const steps: VigenereTraceStep[] = [];
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < cipherText.length; i++) {
    const char = cipherText[i];
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      const c = code - 65;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.charCodeAt(0) - 65;
      const p = ((c - k) % 26 + 26) % 26;
      const outChar = String.fromCharCode(p + 65);
      result += outChar;

      steps.push({
        index: i + 1,
        plainChar: char,
        plainVal: c,
        keyChar: kChar,
        keyVal: k,
        operation: `(${c} - ${k} + 26) mod 26 = ${p}`,
        cipherVal: p,
        cipherChar: outChar,
      });
      keyIndex++;
    } else if (code >= 97 && code <= 122) {
      const c = code - 97;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.charCodeAt(0) - 65;
      const p = ((c - k) % 26 + 26) % 26;
      const outChar = String.fromCharCode(p + 97);
      result += outChar;

      steps.push({
        index: i + 1,
        plainChar: char,
        plainVal: c,
        keyChar: kChar,
        keyVal: k,
        operation: `(${c} - ${k} + 26) mod 26 = ${p}`,
        cipherVal: p,
        cipherChar: outChar,
      });
      keyIndex++;
    } else {
      result += char;
      steps.push({
        index: i + 1,
        plainChar: char,
        plainVal: -1,
        keyChar: '-',
        keyVal: -1,
        operation: 'Passthrough (Non-Alfabet)',
        cipherVal: -1,
        cipherChar: char,
      });
    }
  }

  return {
    result,
    cleanText: cipherText,
    cleanKey,
    steps,
    formula: `P_i = (C_i - K_(i mod |K|) + 26) mod 26 [Kunci: "${cleanKey}"]`,
  };
}
