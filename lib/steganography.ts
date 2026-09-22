/**
 * Image Steganography Utilities using LSB (Least Significant Bit)
 * Embeds text into ImageData (RGBA pixels) and extracts hidden messages.
 */

const HEADER_MARKER = '###CRYPTO_STAG_v1###';
const DELIMITER = '###END###';

export interface SteganoCapacity {
  totalPixels: number;
  maxCharacters: number;
  availableBytes: number;
}

export function calculateCapacity(width: number, height: number): SteganoCapacity {
  const totalPixels = width * height;
  // 3 channels (RGB) per pixel, 1 bit per channel = 3 bits per pixel
  const totalBits = totalPixels * 3;
  const availableBytes = Math.floor(totalBits / 8);
  // Subtract approximate header size
  const maxCharacters = Math.max(0, availableBytes - 50);

  return {
    totalPixels,
    maxCharacters,
    availableBytes,
  };
}

export function encodeLSB(
  imageData: ImageData,
  secretText: string
): { success: boolean; error?: string } {
  const fullPayload = `${HEADER_MARKER}${secretText}${DELIMITER}`;
  const enc = new TextEncoder();
  const payloadBytes = enc.encode(fullPayload);

  // Convert payload to bit array
  const bits: number[] = [];
  for (let i = 0; i < payloadBytes.length; i++) {
    const byte = payloadBytes[i];
    for (let b = 7; b >= 0; b--) {
      bits.push((byte >> b) & 1);
    }
  }

  const data = imageData.data;
  const availableBits = (data.length / 4) * 3; // R, G, B channels

  if (bits.length > availableBits) {
    return {
      success: false,
      error: `Pesan terlalu besar untuk gambar ini. Diperlukan ${bits.length} bit, tetapi kapasitas hanya ${availableBits} bit.`,
    };
  }

  let bitIdx = 0;
  for (let i = 0; i < data.length && bitIdx < bits.length; i += 4) {
    // Red channel
    if (bitIdx < bits.length) {
      data[i] = (data[i] & 0xfe) | bits[bitIdx++];
    }
    // Green channel
    if (bitIdx < bits.length) {
      data[i + 1] = (data[i + 1] & 0xfe) | bits[bitIdx++];
    }
    // Blue channel
    if (bitIdx < bits.length) {
      data[i + 2] = (data[i + 2] & 0xfe) | bits[bitIdx++];
    }
    // Alpha channel (data[i+3]) is left untouched for image integrity
  }

  return { success: true };
}

export function decodeLSB(imageData: ImageData): {
  success: boolean;
  message?: string;
  error?: string;
} {
  const data = imageData.data;
  const bits: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    bits.push(data[i] & 1);     // R
    bits.push(data[i + 1] & 1); // G
    bits.push(data[i + 2] & 1); // B
  }

  // Convert bits back to bytes
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i + b];
    }
    bytes.push(byte);

    // Optimization: Check for end delimiter every 32 bytes to avoid decoding entire image
    if (bytes.length % 32 === 0 || bytes.length > 500000) {
      const currentString = new TextDecoder('utf-8', { fatal: false }).decode(
        new Uint8Array(bytes)
      );
      if (currentString.includes(DELIMITER)) {
        break;
      }
    }
  }

  const decodedString = new TextDecoder('utf-8', { fatal: false }).decode(
    new Uint8Array(bytes)
  );

  if (!decodedString.startsWith(HEADER_MARKER)) {
    return {
      success: false,
      error: 'Tidak ditemukan pesan rahasia yang valid atau format steganografi tidak cocok.',
    };
  }

  const endIdx = decodedString.indexOf(DELIMITER);
  if (endIdx === -1) {
    return {
      success: false,
      error: 'Pesan terpotong atau penanda akhir tidak ditemukan.',
    };
  }

  const message = decodedString.substring(HEADER_MARKER.length, endIdx);
  return { success: true, message };
}
