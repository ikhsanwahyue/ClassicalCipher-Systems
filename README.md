# Classical & Modern Text Cryptography Suite

Aplikasi web interaktif berbasis **Next.js 16 (React 19)** dan **TypeScript** yang difokuskan secara eksklusif untuk **pengolahan kriptografi teks murni (*text-only*)** dengan 5 menu utama sesuai standar instruksi akademik.

---

## 🏛️ 5 Menu Utama Kriptografi Teks

1. **Menu 1: Vigenère Cipher (Substitusi Polialfabetik Klasik)**
   - Algoritma: $C_i = (P_i + K_i) \pmod{26}$
   - Fitur: Enkripsi, Dekripsi, Generator Kunci Acak, dan Visualisasi Tabel Tracing Karakter-demi-Karakter.

2. **Menu 2: Rail Fence Cipher (Transposisi Zig-Zag Klasik)**
   - Algoritma: Transposisi pola gelombang (*zig-zag*) pada $k$ rel horizontal.
   - Fitur: Slider kedalaman rel ($k \ge 2$), Visualisasi Matriks Zig-Zag Rel, dan Pemulihan Urutan Teks Asli.

3. **Menu 3: Rijndael / AES-256 (Kunci Simetri Modern)**
   - Algoritma: *Block Cipher* AES-256-GCM terotentikasi berbasis Web Crypto API dengan kunci derivasi SHA-256 & 96-bit IV.
   - Fitur: Output Base64 & Hex, Autentikasi Tag, dan Ringkasan 4 Transformasi Putaran (*SubBytes, ShiftRows, MixColumns, AddRoundKey*).

4. **Menu 4: Kunci Publik / RSA (Kunci Nirsimetri Modern)**
   - Algoritma: RSA-OAEP 2048-bit dengan *hashing* SHA-256.
   - Fitur: Pembuatan Pasangan Kunci Instan (*Public & Private Key* standar PEM), Enkripsi Asimetris Teks (Chunking Aman), dan Dekripsi dengan Kunci Privat.

5. **Menu 5: Super Enkripsi (Multi-Layered Cryptosystem)**
   - Pipeline Estafet Berurutan 4 Lapisan:
     $$\text{Plaintext} \xrightarrow{\text{1. Vigenère}} \xrightarrow{\text{2. Rail Fence}} \xrightarrow{\text{3. Rijndael/AES}} \xrightarrow{\text{4. RSA Public Key}} \text{Super Ciphertext}$$
   - Dekripsi Estafet Terbalik:
     $$\text{Super Ciphertext} \xrightarrow{\text{1. RSA Decrypt}} \xrightarrow{\text{2. AES Decrypt}} \xrightarrow{\text{3. Rail Fence Decrypt}} \xrightarrow{\text{4. Vigenère Decrypt}} \text{Plaintext}$$
   - Fitur: Generator Kunci Terpadu, Laporan Kartu Interaktif per Tahapan, dan Pemulihan Plaintext 100% Akurat.

---

## 🚀 Menjalankan Proyek

```bash
# Instalasi Dependensi
npm install

# Menjalankan Dev Server
npm run dev

# Membangun Paket Produksi
npm run build
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.
