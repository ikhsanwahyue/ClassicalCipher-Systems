/**
 * Crypto Hash Utilities for Authentication
 * Uses Web Crypto API (SHA-256)
 */

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Default demo account hash for password "admin123"
export const DEFAULT_USER = {
  username: 'admin',
  // SHA-256 of 'admin123'
  passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  role: 'Security Analyst'
};

export async function verifyPassword(password: string, expectedHash: string): Promise<boolean> {
  const computedHash = await sha256(password);
  return computedHash.toLowerCase() === expectedHash.toLowerCase();
}
