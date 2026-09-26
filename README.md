# 🔐 Classical Cipher Systems
### Kerangka Presentasi PPT — Cryptography Web Application

> **Dosen Pembimbing:** \[Isi Nama Dosen\]
> **Anggota Kelompok:** \[Isi Nama Anggota\]
> **Mata Kuliah:** Keamanan Informasi / Kriptografi

---

## 📋 DAFTAR SLIDE PPT

| No | Slide | Keterangan |
|----|-------|------------|
| 1 | Cover | Judul + Identitas |
| 2 | Daftar Isi | Navigasi topik |
| 3 | Latar Belakang | Motivasi & urgensi |
| 4 | Tujuan Proyek | Capaian yang ditargetkan |
| 5 | Arsitektur Sistem | Gambaran teknologi & struktur |
| 6–8 | Vigenère Cipher | Teori + Manual Enkripsi + Manual Dekripsi |
| 9–11 | Rail Fence Cipher | Teori + Manual Enkripsi + Manual Dekripsi |
| 12–16 | Rijndael / AES-256 | Teori + 4 Transformasi per Putaran |
| 17–20 | RSA-OAEP 2048-bit | Teori + Proses Kunci + Enkripsi + Dekripsi |
| 21–24 | Super Encryption | Konsep Berlapis + Pipeline Enkripsi + Dekripsi |
| 25 | Demo Aplikasi | Screenshot & link live |
| 26 | Kesimpulan | Ringkasan & saran |
| 27 | Daftar Pustaka | Referensi ilmiah |
| 28 | Tanya Jawab | Penutup |

---

## 🎯 SLIDE 1 — COVER

```
JUDUL   : Classical Cipher Systems
SUBJUDUL: Implementasi 5 Algoritma Kriptografi Berbasis Web
          (Vigenère · Rail Fence · Rijndael/AES · RSA · Super Encryption)

LOGO KAMPUS + LOGO PRODI

Mata Kuliah : Keamanan Informasi / Kriptografi
Nama Anggota: [Nama 1] · [Nama 2] · [Nama 3]
NIM         : [NIM]
Kelas       : [Kelas]
Tahun       : 2026
```

---

## 🎯 SLIDE 2 — DAFTAR ISI

```
1. Latar Belakang & Tujuan
2. Arsitektur & Teknologi
3. Vigenère Cipher          — Substitusi Polialfabetik Klasik
4. Rail Fence Cipher        — Transposisi Zig-Zag Klasik
5. Rijndael / AES-256-GCM   — Enkripsi Simetri Modern
6. RSA-OAEP 2048-bit        — Enkripsi Nirsimetri / Kunci Publik
7. Super Encryption         — Sistem Multi-Layer (4 Lapisan Estafet)
8. Demo Aplikasi
9. Kesimpulan
```

---

## 🎯 SLIDE 3 — LATAR BELAKANG

**Poin-poin utama:**
- Di era digital, pertukaran data sensitif memerlukan perlindungan kriptografis yang kuat.
- Kriptografi klasik (Vigenère, Rail Fence) menjadi fondasi pemahaman konsep substitusi dan transposisi.
- Kriptografi modern (AES, RSA) menjadi standar industri keamanan data internasional.
- Belum banyak platform edukasi interaktif yang memperlihatkan **proses manual** setiap langkah enkripsi/dekripsi secara visual.
- Proyek ini hadir sebagai **alat belajar berbasis web** yang menampilkan trace langkah-demi-langkah setiap algoritma.

---

## 🎯 SLIDE 4 — TUJUAN PROYEK

```
✅ Mengimplementasikan 5 algoritma kriptografi dalam satu platform web
✅ Menampilkan proses enkripsi & dekripsi secara MANUAL (trace per karakter)
✅ Memvisualisasikan matriks Rail Fence, State Matrix AES, dan Pipeline Super Encryption
✅ Mengintegrasikan kriptografi klasik dan modern dalam satu alur Super Encryption
✅ Menyediakan antarmuka yang interaktif, responsif, dan informatif
```

---

## 🎯 SLIDE 5 — ARSITEKTUR SISTEM

```
Teknologi Stack:
┌─────────────────────────────────────────────────┐
│  Frontend    : Next.js 15 (App Router)          │
│  Bahasa      : TypeScript + TSX                 │
│  Styling     : Tailwind CSS + shadcn/ui         │
│  Crypto API  : Web Crypto API (Browser Native)  │
│  Deployment  : Vercel / Local (npm run dev)     │
└─────────────────────────────────────────────────┘

Struktur Halaman:
  /                  → Landing / Beranda
  /vigenere          → Vigenère Cipher
  /rail-fence        → Rail Fence Cipher
  /rijndael          → Rijndael / AES-256-GCM
  /rsa               → RSA-OAEP 2048-bit
  /super-encryption  → Super Encryption (4 Layer)
```

---

---

# 🔑 BAGIAN I: VIGENÈRE CIPHER

## 🎯 SLIDE 6 — VIGENÈRE CIPHER: TEORI

**Jenis:** Substitusi Polialfabetik Klasik  
**Ditemukan oleh:** Blaise de Vigenère (1586)

**Konsep Dasar:**
- Setiap huruf plaintext digeser berdasarkan huruf kunci yang bersesuaian.
- Kunci diulang (repeated) sepanjang panjang teks.
- Menggunakan perhitungan **modulo 26** (jumlah huruf alfabet).

**Formula:**

```
ENKRIPSI : C_i = (P_i + K_i) mod 26
DEKRIPSI : P_i = (C_i - K_i + 26) mod 26

Keterangan:
  P_i = Nilai numerik huruf plaintext ke-i  (A=0, B=1, ..., Z=25)
  K_i = Nilai numerik huruf kunci ke-i
  C_i = Nilai numerik huruf ciphertext ke-i
```

---

## 🎯 SLIDE 7 — VIGENÈRE CIPHER: MANUAL ENKRIPSI

**Contoh:**
```
Plaintext : HALO
Kunci     : KEY
```

**Langkah 1 — Konversi ke Angka (A=0, Z=25):**
```
Plaintext        : H   A   L   O
Nilai P          : 7   0   11  14

Kunci (diulang)  : K   E   Y   K
Nilai K          : 10  4   24  10
```

**Langkah 2 — Hitung C = (P + K) mod 26:**
```
H → (7  + 10) mod 26 = 17 mod 26 = 17 → R
A → (0  + 4 ) mod 26 = 4  mod 26 = 4  → E
L → (11 + 24) mod 26 = 35 mod 26 = 9  → J
O → (14 + 10) mod 26 = 24 mod 26 = 24 → Y
```

**Langkah 3 — Gabungkan Hasil:**
```
Ciphertext: R E J Y  →  "REJY"
```

**Tabel Trace Lengkap:**

| # | Plain | Nilai P | Kunci | Nilai K | Operasi | Nilai C | Cipher |
|---|-------|---------|-------|---------|---------|---------|--------|
| 1 | H | 7  | K | 10 | (7+10) mod 26 = 17  | 17 | **R** |
| 2 | A | 0  | E | 4  | (0+4) mod 26 = 4    | 4  | **E** |
| 3 | L | 11 | Y | 24 | (11+24) mod 26 = 9  | 9  | **J** |
| 4 | O | 14 | K | 10 | (14+10) mod 26 = 24 | 24 | **Y** |

**Hasil: `HALO` → `REJY`**

---

## 🎯 SLIDE 8 — VIGENÈRE CIPHER: MANUAL DEKRIPSI

**Input:**
```
Ciphertext : REJY
Kunci      : KEY
```

**Langkah 1 — Konversi Ciphertext ke Angka:**
```
Cipher           : R   E   J   Y
Nilai C          : 17  4   9   24

Kunci (diulang)  : K   E   Y   K
Nilai K          : 10  4   24  10
```

**Langkah 2 — Hitung P = (C - K + 26) mod 26:**
```
R → (17 - 10 + 26) mod 26 = 33 mod 26 = 7  → H
E → (4  - 4  + 26) mod 26 = 26 mod 26 = 0  → A
J → (9  - 24 + 26) mod 26 = 11 mod 26 = 11 → L
Y → (24 - 10 + 26) mod 26 = 40 mod 26 = 14 → O
```

**Tabel Trace Dekripsi:**

| # | Cipher | Nilai C | Kunci | Nilai K | Operasi | Nilai P | Plain |
|---|--------|---------|-------|---------|---------|---------|-------|
| 1 | R | 17 | K | 10 | (17-10+26) mod 26 = 7  | 7  | **H** |
| 2 | E | 4  | E | 4  | (4-4+26) mod 26 = 0    | 0  | **A** |
| 3 | J | 9  | Y | 24 | (9-24+26) mod 26 = 11  | 11 | **L** |
| 4 | Y | 24 | K | 10 | (24-10+26) mod 26 = 14 | 14 | **O** |

**Hasil: `REJY` → `HALO` ✅**

> **Catatan Kunci:** Tambahan `+26` pada dekripsi mencegah nilai negatif dalam modulo.

---

---

# 🔑 BAGIAN II: RAIL FENCE CIPHER

## 🎯 SLIDE 9 — RAIL FENCE CIPHER: TEORI

**Jenis:** Transposisi Zig-Zag Klasik  
**Prinsip:** Urutan karakter diubah (bukan nilainya).

**Konsep Dasar:**
- Karakter plaintext disusun secara zig-zag ke bawah dan ke atas pada **k buah rel (baris)**.
- Setelah semua karakter ditempatkan, ciphertext diperoleh dengan **membaca setiap rel dari kiri ke kanan** (baris demi baris).
- Kunci hanya berupa satu angka: **jumlah rel (k)**.

**Visualisasi (k=3, teks "HALODUNIA"):**
```
Rel 1: H . . . D . . . A
Rel 2: . A . O . U . I .
Rel 3: . . L . . . N . .

Baca baris:
  Rel 1 → H D A
  Rel 2 → A O U I
  Rel 3 → L N
  → Ciphertext: HDAAOUILN
```

---

## 🎯 SLIDE 10 — RAIL FENCE: MANUAL ENKRIPSI

**Contoh:**
```
Plaintext : KRIPTOGRAFI
Jumlah Rel: k = 3
```

**Langkah 1 — Susun Zig-Zag pada Matriks:**
```
Posisi : 0  1  2  3  4  5  6  7  8  9  10
Karakter: K  R  I  P  T  O  G  R  A  F  I

Rel 1:  K  .  .  .  T  .  .  .  A  .  .
Rel 2:  .  R  .  P  .  O  .  R  .  F  .
Rel 3:  .  .  I  .  .  .  G  .  .  .  I
```

**Langkah 2 — Aturan Arah (Zig-Zag):**
```
Posisi 0  → Rel 1  ↓ (mulai turun)
Posisi 1  → Rel 2  ↓
Posisi 2  → Rel 3  ↑ (balik: sudah di rel terbawah)
Posisi 3  → Rel 2  ↑
Posisi 4  → Rel 1  ↓ (balik: sudah di rel teratas)
Posisi 5  → Rel 2  ↓
Posisi 6  → Rel 3  ↑ (balik lagi)
... dst
```

**Langkah 3 — Baca Baris Demi Baris:**
```
Rel 1 → K, T, A          →  "KTA"
Rel 2 → R, P, O, R, F    →  "RPORF"
Rel 3 → I, G, I           →  "IGI"

Gabungan → "KTARPORFIGI"
```

**Tabel Penempatan:**

| Col   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|-------|---|---|---|---|---|---|---|---|---|---|---|
| Rel 1 | **K** |   |   |   | **T** |   |   |   | **A** |   |    |
| Rel 2 |   | **R** |   | **P** |   | **O** |   | **R** |   | **F** |    |
| Rel 3 |   |   | **I** |   |   |   | **G** |   |   |   | **I** |

**Hasil: `KRIPTOGRAFI` → `KTARPORFIGI`**

---

## 🎯 SLIDE 11 — RAIL FENCE: MANUAL DEKRIPSI

**Input:**
```
Ciphertext: KTARPORFIGI
Jumlah Rel: k = 3
```

**Langkah 1 — Buat Pola Zig-Zag & Hitung Jumlah Per Rel:**

Tandai posisi dengan `*` menggunakan pola zig-zag:
```
Posisi:  0  1  2  3  4  5  6  7  8  9  10
Rel 1:   *  .  .  .  *  .  .  .  *  .  .   → 3 karakter
Rel 2:   .  *  .  *  .  *  .  *  .  *  .   → 5 karakter
Rel 3:   .  .  *  .  .  .  *  .  .  .  *   → 3 karakter
Total = 11 ✅
```

**Langkah 2 — Isi Rel dengan Karakter Ciphertext (Baris demi Baris):**
```
Ciphertext: K T A R P O R F I G I

Rel 1 (3 char) → ambil 3 pertama  → K, T, A
Rel 2 (5 char) → ambil 5 berikut  → R, P, O, R, F
Rel 3 (3 char) → ambil 3 terakhir → I, G, I
```

**Matriks Setelah Diisi:**
```
Rel 1:  K  .  .  .  T  .  .  .  A  .  .
Rel 2:  .  R  .  P  .  O  .  R  .  F  .
Rel 3:  .  .  I  .  .  .  G  .  .  .  I
```

**Langkah 3 — Baca Diagonal Zig-Zag (urutan asli):**
```
Pos 0  → Rel 1: K
Pos 1  → Rel 2: R
Pos 2  → Rel 3: I
Pos 3  → Rel 2: P
Pos 4  → Rel 1: T
Pos 5  → Rel 2: O
Pos 6  → Rel 3: G
Pos 7  → Rel 2: R
Pos 8  → Rel 1: A
Pos 9  → Rel 2: F
Pos 10 → Rel 3: I

Hasil: K-R-I-P-T-O-G-R-A-F-I
```

**Hasil: `KTARPORFIGI` → `KRIPTOGRAFI` ✅**

---

---

# 🔑 BAGIAN III: RIJNDAEL / AES-256-GCM

## 🎯 SLIDE 12 — RIJNDAEL / AES: TEORI

**Jenis:** Enkripsi Blok Simetri Modern  
**Standar:** FIPS 197 (Advanced Encryption Standard, 2001)  
**Varian yang diimplementasikan:** AES-256-GCM

**Parameter Teknis:**
```
Ukuran Kunci   : 256-bit (32 byte) — derivasi SHA-256 dari passphrase
Ukuran Blok    : 128-bit (16 byte) — State Matrix 4×4 byte
Mode Operasi   : GCM (Galois/Counter Mode) — Terautentikasi
Jumlah Putaran : 14 putaran (untuk AES-256)
IV (Nonce)     : 96-bit (12 byte) — dihasilkan acak setiap sesi
Auth Tag       : 128-bit (16 byte) — verifikasi integritas data
```

**Struktur Tiap Putaran (kecuali putaran terakhir):**
```
1. SubBytes    → Substitusi nonlinear via tabel S-Box (256 entri)
2. ShiftRows   → Geser siklik tiap baris State Matrix ke kiri
3. MixColumns  → Difusi via perkalian matriks di GF(2^8)
4. AddRoundKey → XOR dengan Round Key turunan kunci utama
```

---

## 🎯 SLIDE 13 — AES: PROSES ENKRIPSI DETAIL STEP-BY-STEP

### Input & Konversi Awal

**Contoh:**
```
Plaintext  : "HALO"
Passphrase : "rahasia"
``` 

**LANGKAH 1 — Derive AES Key (SHA-256 dari Passphrase):**
```
Input  : SHA-256("rahasia")
Output : 32 byte kunci (256-bit)
         contoh: 5E 88 48 98 DA 28 04 71 51 D0 E5 6F 8D C6 29 27
                 73 60 3D 0D 6A AB BD D6 2A 11 EF 72 1D 15 42 D8

Proses: Passphrase → UTF-8 bytes → SHA-256 hash → 32-byte raw key
```

**LANGKAH 2 — Generate IV (Nonce) 96-bit Acak:**
```
IV = crypto.getRandomValues(new Uint8Array(12))
Contoh IV: A3 F2 1C 04 9B 7E D3 55 82 0F 6A 11

IV bersifat UNIK setiap sesi enkripsi
→ Meskipun plaintext & kunci SAMA, ciphertext akan BERBEDA
```

**LANGKAH 3 — Konversi Plaintext ke Bytes:**
```
"HALO" → UTF-8 → [0x48, 0x41, 0x4C, 0x4F]

Panjang plaintext = 4 byte
```

**LANGKAH 4 — Susun State Matrix 4×4 (blok 16 byte):**
```
Plaintext 4 byte dipadding ke 16 byte (GCM mode tidak butuh manual padding,
tapi blok State internal tetap 4×4):

Byte linear: 48 41 4C 4F 20 20 20 20 20 20 20 20 20 20 20 20
             [0][1][2][3][4][5][6][7][8][9][A][B][C][D][E][F]

Pengisian State (column-major — kolom dulu, baru baris):
        Col0  Col1  Col2  Col3
Baris 0:  48    4F    20    20    ← byte 0,4,8,12
Baris 1:  41    20    20    20    ← byte 1,5,9,13
Baris 2:  4C    20    20    20    ← byte 2,6,10,14
Baris 3:  4F    20    20    20    ← byte 3,7,11,15
```

**LANGKAH 5 — AddRoundKey (Putaran Awal / Round 0):**
```
XOR State dengan 16 byte pertama dari Round Key 0:

State[0][0] = 0x48 ⊕ RK[0][0] = ?   (nilai bergantung pada key derivasi)
State[1][0] = 0x41 ⊕ RK[1][0] = ?
... dst untuk semua 16 sel

Round Key 0 = 16 byte pertama dari key schedule 256-bit
```

**LANGKAH 6 — 13 Putaran Utama (Putaran 1–13):**

Untuk setiap putaran, 4 transformasi dilakukan berurutan:

```
══════════════════════════════════════
[A] SUBBYTES — Substitusi S-Box
══════════════════════════════════════
Setiap byte di State diganti menggunakan tabel S-Box 16×16:
  Byte 0x52 → baris 5, kolom 2 → 0x00
  Byte 0x48 → baris 4, kolom 8 → 0x52
  Byte 0xB7 → baris B, kolom 7 → 0xA9

S-Box adalah permutasi bijektif (bolak-balik) yang:
  - Nonlinear → tahan differential cryptanalysis
  - Berdasarkan invers multiplikatif GF(2^8) + transformasi afin

Contoh penuh State setelah SubBytes:
  State awal [baris0]: 48  4F  20  20
  Setelah SB [baris0]: 52  84  B7  B7

══════════════════════════════════════
[B] SHIFTROWS — Geser Siklik Baris
══════════════════════════════════════
Tujuan: Memindahkan byte antar kolom untuk difusi lintas kolom

  Baris 0: [S00 S01 S02 S03]  →shift 0→  [S00 S01 S02 S03] (tetap)
  Baris 1: [S10 S11 S12 S13]  →shift 1→  [S11 S12 S13 S10]
  Baris 2: [S20 S21 S22 S23]  →shift 2→  [S22 S23 S20 S21]
  Baris 3: [S30 S31 S32 S33]  →shift 3→  [S33 S30 S31 S32]

Contoh nilai hex (dari State setelah SubBytes):
  Baris 0: [52 84 B7 B7]  →  [52 84 B7 B7]  (geser 0)
  Baris 1: [83 B7 B7 B7]  →  [B7 B7 B7 83]  (geser 1 kiri)
  Baris 2: [29 B7 B7 B7]  →  [B7 B7 29 B7]  (geser 2 kiri)
  Baris 3: [84 B7 B7 B7]  →  [B7 84 B7 B7]  (geser 3 kiri)

══════════════════════════════════════
[C] MIXCOLUMNS — Difusi Galois Field
══════════════════════════════════════
Tujuan: Setiap byte dipengaruhi SEMUA byte di kolomnya (difusi penuh)

Rumus untuk kolom c = [s0, s1, s2, s3]:
  s0' = (2·s0) ⊕ (3·s1) ⊕ s2     ⊕ s3
  s1' =    s0  ⊕ (2·s1) ⊕ (3·s2) ⊕ s3
  s2' =    s0  ⊕    s1  ⊕ (2·s2) ⊕ (3·s3)
  s3' = (3·s0) ⊕    s1  ⊕    s2  ⊕ (2·s3)

Cara hitung perkalian GF(2^8):
  2·a = (a << 1) jika MSB=0
  2·a = (a << 1) ⊕ 0x1B jika MSB=1  (reduksi polinomial)
  3·a = 2·a ⊕ a

Contoh kolom 0 = [0x52, 0xB7, 0xB7, 0xB7]:
  2·0x52 = 0xA4              (MSB=0, tidak overflow)
  3·0xB7 = 2·0xB7 ⊕ 0xB7
         = (0x6E ⊕ 0x1B) ⊕ 0xB7  (MSB=1, overflow)
         = 0x75 ⊕ 0xB7 = 0xC2

  s0' = 0xA4 ⊕ 0xC2 ⊕ 0xB7 ⊕ 0xB7 = 0xA4 ⊕ 0xC2 ⊕ 0x00
       = 0xA4 ⊕ 0xC2 = 0x66

══════════════════════════════════════
[D] ADDROUNDKEY — XOR Round Key ke-i
══════════════════════════════════════
Round Key ke-i diturunkan dari Key Schedule:
  Kunci 256-bit (32 byte) → Key Expansion
  → menghasilkan 15 Round Key × 128-bit

  state[r][c] = state[r][c] ⊕ roundKey_i[r][c]

Contoh (satu byte, putaran 1):
  State[0][0]    = 0x66
  RoundKey_1[0][0] = 0x47  (contoh nilai)
  Hasil           = 0x66 ⊕ 0x47 = 0x21
```

**LANGKAH 7 — Putaran 14 (Putaran Terakhir, TANPA MixColumns):**
```
  SubBytes     → (sama seperti putaran biasa)
  ShiftRows    → (sama seperti putaran biasa)
  — MixColumns DILEWATI —
  AddRoundKey  → XOR dengan Round Key 14

Alasan: MixColumns dihilangkan di putaran terakhir untuk
        memastikan proses dekripsi simetris (invertible)
```

**LANGKAH 8 — Mode GCM: Output & Auth Tag:**
```
AES-GCM menggunakan AES-CTR untuk enkripsi + GHASH untuk autentikasi:

  CTR Mode:
  ┌─────────────────────────────────┐
  │  Counter = IV + counter (32-bit)│
  │  Keystream = AES(Key, Counter)  │
  │  CipherBlock = Plain ⊕ Keystream│
  └─────────────────────────────────┘

  GHASH (Authentication):
  → Menghitung tag 128-bit dari ciphertext + additional data
  → Tag = GHASH(H, AAD, ciphertext), H = AES(Key, 0^128)

Output akhir:
  Base64( IV[12 byte] ∥ Ciphertext ∥ AuthTag[16 byte] )
  Total overhead = 12 + 16 = 28 byte di atas panjang plaintext
```

---

## 🎯 SLIDE 14 — AES: PROSES DEKRIPSI DETAIL STEP-BY-STEP

**Input:**
```
Ciphertext  : Base64 string (dari hasil enkripsi)
Passphrase  : "rahasia"
```

**LANGKAH 1 — Base64 Decode & Pisah Komponen:**
```
Base64 decode → array byte gabungan:

  Bytes[0..11]   = IV (Nonce 96-bit)
  Bytes[12..n-17]= Ciphertext murni
  Bytes[n-16..n] = Authentication Tag (16 byte)

Contoh:
  Total bytes  = 12 (IV) + 4 (cipher "HALO") + 16 (tag) = 32 byte
  IV           = A3 F2 1C 04 9B 7E D3 55 82 0F 6A 11
  CipherBytes  = XX XX XX XX  (4 byte terenkripsi)
  AuthTag      = YY YY ... YY (16 byte)
```

**LANGKAH 2 — Derive Key (sama persis dengan enkripsi):**
```
SHA-256("rahasia") → 32-byte AES Key

⚠️  PENTING: Kunci derivasi harus IDENTIK dengan saat enkripsi.
    Beda satu karakter passphrase → key berbeda → dekripsi GAGAL
```

**LANGKAH 3 — Verifikasi Authentication Tag (GHASH):**
```
Sebelum mendekripsi, GCM OTOMATIS memverifikasi Auth Tag:

  Tag_hitung = GHASH(H, CipherBytes)
  H = AES(Key, 0^128)   ← konstanta dari kunci

  Jika Tag_hitung == AuthTag dari ciphertext → VALID ✅
  Jika TIDAK SAMA                            → DITOLAK ❌
                                               Error langsung
                                               (tidak ada dekripsi)

🔒 Ini mencegah: tampering data, kunci salah, data rusak
```

**LANGKAH 4 — AES-CTR Dekripsi (jika tag valid):**
```
CTR Mode dekripsi SAMA dengan enkripsi:

  Counter = IV + counter (32-bit increment)
  Keystream_i = AES(Key, Counter_i)
  PlainBlock_i = CipherBlock_i ⊕ Keystream_i

Inversi Putaran AES-256 (14 → 1):
  Putaran 14 (terbalik):  InvAddRoundKey → InvShiftRows → InvSubBytes
  Putaran 13–1 (terbalik): InvAddRoundKey → InvMixColumns
                            → InvShiftRows → InvSubBytes
  Putaran 0 (terbalik):   InvAddRoundKey

Fungsi Invers:
  InvSubBytes  : lookup tabel S-Box invers (256 entri)
  InvShiftRows : geser baris ke KANAN (kebalikan enkripsi)
  InvMixColumns: perkalian matriks invers GF(2^8)
                 ┌ E  B  D  9 ┐
                 │ 9  E  B  D │
                 │ D  9  E  B │
                 └ B  D  9  E ┘
```

**LANGKAH 5 — Output Plaintext:**
```
Hasil byte setelah dekripsi → UTF-8 decode → String plaintext

  [0x48, 0x41, 0x4C, 0x4F] → "HALO" ✅

Jika kunci SALAH:
  Tag verifikasi GAGAL di Langkah 3 → Error tanpa expose data apapun
```

**Ringkasan Alur Lengkap Enkripsi-Dekripsi AES:**
```
  ENKRIPSI                          DEKRIPSI
  ─────────────────────             ─────────────────────
  Plaintext bytes                   Base64 ciphertext
       ↓                                 ↓
  SHA-256(passphrase)→Key         SHA-256(passphrase)→Key
       ↓                                 ↓
  Generate IV (acak)               Extract IV [byte 0..11]
       ↓                                 ↓
  AES-256 CTR encrypt              Verifikasi GHASH Auth Tag
  + GHASH auth tag                      ↓ (jika valid)
       ↓                           AES-256 CTR decrypt (14 putaran invers)
  Base64(IV+Cipher+Tag)                 ↓
                                   UTF-8 decode → Plaintext
```

---

## 🎯 SLIDE 15 — AES: KEY SCHEDULE & ADDROUNDKEY DETAIL

**Key Schedule — Ekspansi Kunci 256-bit:**
```
Tujuan: Dari 1 kunci 256-bit → hasilkan 15 Round Key × 128-bit

Algoritma Key Expansion (Rijndael Key Schedule):
  1. Kunci awal 32 byte dibagi menjadi 8 word W[0..7]
     (1 word = 4 byte)

  2. Untuk i = 8, 9, 10, ..., 59:
     Jika i mod 8 == 0:
       W[i] = W[i-8] ⊕ SubWord(RotWord(W[i-1])) ⊕ Rcon[i/8]
     Jika i mod 8 == 4:
       W[i] = W[i-8] ⊕ SubWord(W[i-1])
     Selain itu:
       W[i] = W[i-8] ⊕ W[i-1]

  Fungsi:
    RotWord([a,b,c,d]) = [b,c,d,a]   (rotasi kiri 1 byte)
    SubWord([a,b,c,d]) = [S(a),S(b),S(c),S(d)]  (S-Box per byte)
    Rcon[i] = [2^(i-1) mod GF(2^8), 0, 0, 0]

  3. Round Key ke-r = W[4r], W[4r+1], W[4r+2], W[4r+3]
     (4 word = 16 byte = 128-bit per Round Key)
```

**AddRoundKey — Detail Operasi XOR:**
```
Setiap putaran, state 4×4 di-XOR dengan round key 4×4:

  State (contoh Putaran 1):
        Col0  Col1  Col2  Col3
  Br0:   52    84    B7    B7
  Br1:   83    B7    B7    B7
  Br2:   29    B7    B7    B7
  Br3:   84    B7    B7    B7

  Round Key 1 (contoh):
        Col0  Col1  Col2  Col3
  Br0:   47    37    94    ED
  Br1:   02    7F    3A    1C
  Br2:   B8    4A    D3    09
  Br3:   5E    F6    12    88

  Hasil XOR:
        Col0        Col1        Col2        Col3
  Br0: 52⊕47=15   84⊕37=B3   B7⊕94=23   B7⊕ED=5A
  Br1: 83⊕02=81   B7⊕7F=C8   B7⊕3A=8D   B7⊕1C=AB
  Br2: 29⊕B8=91   B7⊕4A=FD   B7⊕D3=64   B7⊕09=BE
  Br3: 84⊕5E=DA   B7⊕F6=41   B7⊕12=A5   B7⊕88=3F
```

---

## 🎯 SLIDE 16 — AES: FORMAT OUTPUT & STRUKTUR BYTE

**Format Paket Terenkripsi (AES-256-GCM):**
```
Output = Base64( [12 byte IV] + [Ciphertext] + [16 byte Auth Tag] )

Struktur byte (contoh plaintext "HALO" = 4 byte):
  ┌─────────────────────────────────────────────────────────┐
  │ Byte  0–11  │ Byte 12–15  │ Byte 16–31                 │
  │ IV (12B)    │ Cipher (4B) │ Auth Tag (16B)             │
  │ A3F21C04... │ XX XX XX XX │ YY YY YY YY ... (16 byte)  │
  └─────────────────────────────────────────────────────────┘
  Total = 12 + 4 + 16 = 32 byte → Base64 = ~43 karakter
```

**Cara Membaca Output di Aplikasi:**
```
  ciphertextBase64    : Seluruh paket (IV+Cipher+Tag) dalam Base64
  ivHex               : 12 byte IV dalam hexadecimal
  authTagHex          : 16 byte Auth Tag dalam hexadecimal
  rawCiphertextOnlyHex: Ciphertext murni tanpa IV dan tag
  keyBytesHex         : 32 byte kunci hasil SHA-256 (untuk audit)
  roundsCount         : 14 (AES-256 selalu 14 putaran)
```

**Perbandingan Output Dua Enkripsi Teks Sama:**
```
Enkripsi 1: "HALO" + "rahasia" → IV: A3F21C...  → Cipher: AB12CD
Enkripsi 2: "HALO" + "rahasia" → IV: 9F83A7...  → Cipher: 7E5F01
                                  ↑ BERBEDA          ↑ BERBEDA

IV yang acak → ciphertext SELALU berbeda meski input sama
→ Ini adalah sifat IND-CPA (Indistinguishability under CPA)
```

---

---

# 🔑 BAGIAN IV: RSA-OAEP 2048-BIT

## 🎯 SLIDE 17 — RSA: TEORI DASAR

**Jenis:** Enkripsi Nirsimetri / Kriptografi Kunci Publik  
**Ditemukan:** Rivest, Shamir, Adleman (1977)  
**Varian:** RSA-OAEP dengan SHA-256 (standar modern)

**Konsep Dua Kunci:**
```
┌─────────────────────────────────────────────────┐
│  KUNCI PUBLIK (Public Key)                      │
│  → Boleh dibagikan ke siapa saja                │
│  → Digunakan untuk ENKRIPSI                     │
│                                                 │
│  KUNCI PRIVAT (Private Key)                     │
│  → Hanya pemilik yang boleh tahu                │
│  → Digunakan untuk DEKRIPSI                     │
└─────────────────────────────────────────────────┘
```

**Parameter Matematis:**
```
n = p × q            (n = modulus, p & q = bilangan prima besar)
φ(n) = (p-1)(q-1)   (Euler's Totient Function)
e = 65537            (public exponent — bilangan prima Fermat)
d = e⁻¹ mod φ(n)    (private exponent)

ENKRIPSI : C = M^e mod n
DEKRIPSI : M = C^d mod n
```

---

## 🎯 SLIDE 18 — RSA: PROSES PEMBANGKITAN KUNCI

**Langkah Pembangkitan Pasangan Kunci RSA-2048:**
```
LANGKAH 1: Pilih dua bilangan prima besar p dan q yang berbeda
           (Untuk RSA-2048, masing-masing ±1024-bit)

LANGKAH 2: Hitung modulus:
           n = p × q   → 2048-bit

LANGKAH 3: Hitung Euler's Totient:
           φ(n) = (p-1) × (q-1)

LANGKAH 4: Tentukan eksponen publik:
           e = 65537   (dipilih karena efisiensi & keamanan)
           Syarat: gcd(e, φ(n)) = 1

LANGKAH 5: Hitung eksponen privat via Extended Euclidean:
           d = e⁻¹ mod φ(n)

KUNCI PUBLIK  = (e, n)  → diekspor format PEM SPKI
KUNCI PRIVAT  = (d, n)  → diekspor format PEM PKCS#8
```

**Contoh Kecil Ilustrasi (p=61, q=53 — bukan RSA nyata):**
```
n = 61 × 53 = 3233
φ(n) = 60 × 52 = 3120
e = 17  (gcd(17, 3120) = 1 ✅)
d = 17⁻¹ mod 3120 = 2753

Enkripsi M=65:  C = 65^17 mod 3233 = 2790
Dekripsi C=2790: M = 2790^2753 mod 3233 = 65 ✅
```

**Format PEM dalam Aplikasi:**
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----

-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEA...
-----END PRIVATE KEY-----
```

---

## 🎯 SLIDE 19 — RSA: PROSES ENKRIPSI DETAIL STEP-BY-STEP

**Contoh:**
```
Plaintext   : "HALO" (4 byte)
Kunci Publik: Public Key PEM 2048-bit yang sudah digenerate
```

**LANGKAH 1 — Import & Parse Kunci Publik:**
```
Format PEM → Base64 decode → ArrayBuffer (SPKI format)

Parse SPKI → ekstrak:
  n = modulus (2048-bit = 256 byte)
  e = public exponent = 65537 (0x010001)

Kunci Publik hanya berisi (e, n), bukan (d) → aman dibagikan
```

**LANGKAH 2 — Encode Plaintext ke Bytes:**
```
"HALO" → UTF-8 → [0x48, 0x41, 0x4C, 0x4F]
Panjang = 4 byte  (jauh di bawah limit 180 byte → 1 chunk saja)
```

**LANGKAH 3 — Tentukan Jumlah Chunk:**
```
Chunk Size = 180 byte
Jumlah chunk = ceil(panjang / 180) = ceil(4/180) = 1 chunk

Jika panjang teks > 180 byte, misal 500 byte:
  Chunk 1: byte[0..179]   = 180 byte
  Chunk 2: byte[180..359] = 180 byte
  Chunk 3: byte[360..499] = 140 byte (sisa)
  → 3 chunk RSA, output = 3 × 256 byte = 768 byte
```

**LANGKAH 4 — OAEP Padding untuk Setiap Chunk:**
```
Struktur blok OAEP-SHA256 (256 byte total):

  ┌──────────────────────────────────────────────────────────┐
  │ 0x00 (1B) │ maskedSeed (32B) │ maskedDB (223B)          │
  └──────────────────────────────────────────────────────────┘
               ↑                  ↑
               SHA-256 seed acak  Data Block

Proses OAEP:
  [1] lHash = SHA-256("")  ← hash label kosong
      = E3B0C44298FC1C149AFBF4C8996FB924...  (32 byte)

  [2] DB (Data Block) = lHash ∥ 0x00...00 ∥ 0x01 ∥ Message
      DB = [32 byte lHash] + [padding 0x00] + [0x01] + [data]
      Total DB = 256 - 1 - 32 = 223 byte

  [3] seed = random 32 byte  (acak setiap kali enkripsi)
      → Inilah yang membuat OAEP non-deterministik

  [4] dbMask = MGF1(seed, 223)
      MGF1 = SHA-256(seed ∥ counter) diulang sampai 223 byte

  [5] maskedDB = DB ⊕ dbMask   (XOR per byte)

  [6] seedMask = MGF1(maskedDB, 32)

  [7] maskedSeed = seed ⊕ seedMask

  [8] Blok OAEP final = 0x00 ∥ maskedSeed ∥ maskedDB
      = 1 + 32 + 223 = 256 byte ✅
```

**LANGKAH 5 — Operasi Modular Exponentiation:**
```
Blok OAEP 256 byte → interpretasikan sebagai integer M (2048-bit)

C = M^e mod n
  e = 65537  = 2^16 + 1  (efisien: hanya 17 perkalian)
  n = modulus 2048-bit

Cara hitung M^65537 mod n:
  1. Hitung M^1     mod n = M
  2. Hitung M^2     mod n = M × M mod n
  3. Hitung M^4     mod n = (M^2)^2 mod n
  4. ...
  17. Hitung M^65536 mod n = (...)
  Gabung: M^65537 = M^65536 × M^1  → 1 perkalian terakhir

Hasil C = integer 2048-bit = 256 byte
```

**LANGKAH 6 — Encode & Kemas Output:**
```
C (256 byte) → encode Base64 → string ~344 karakter

Semua chunk dikemas dalam JSON:
  {
    "scheme": "RSA-OAEP-2048",
    "chunks": ["<base64 chunk 1>", "<base64 chunk 2>", ...],
    "count": N
  }

JSON → JSON.stringify → encode Base64 → CIPHERTEXT FINAL
```

**Bukti Non-Deterministik OAEP:**
```
Enkripsi 1: "HALO" + PubKey → seed_1 (acak) → Cipher: aB3x...
Enkripsi 2: "HALO" + PubKey → seed_2 (acak) → Cipher: Kp9z...
                               ↑ SELALU BERBEDA

Meskipun plaintext & kunci SAMA → ciphertext selalu BERBEDA ✅
```

---

## 🎯 SLIDE 20 — RSA: PROSES DEKRIPSI DETAIL STEP-BY-STEP

**Input:**
```
Ciphertext  : Base64 final (output dari enkripsi)
Kunci Privat: Private Key PEM 2048-bit
```

**LANGKAH 1 — Import & Parse Kunci Privat:**
```
Format PEM → Base64 decode → ArrayBuffer (PKCS#8 format)

Parse PKCS#8 → ekstrak:
  n = modulus (2048-bit)
  d = private exponent (2048-bit, RAHASIA)
  p, q, dp, dq, qInv  ← parameter CRT (Chinese Remainder Theorem)

⚠️ Private key TIDAK BOLEH dibagikan atau dikirim lewat jaringan!
```

**LANGKAH 2 — Parse Ciphertext:**
```
Base64 decode → string JSON
JSON.parse → {
  scheme: "RSA-OAEP-2048",
  chunks: ["<b64_1>", "<b64_2>", ...],
  count: N
}

Setiap chunk b64 → decode → 256 byte cipherblock
```

**LANGKAH 3 — Modular Exponentiation Dekripsi per Chunk:**
```
Untuk setiap chunk cipherblock C (256 byte = integer 2048-bit):

Metode Standar:
  M = C^d mod n

Metode CRT (lebih cepat ~4× — dipakai Web Crypto API):
  mp = C^dp mod p   (dp = d mod (p-1))
  mq = C^dq mod q   (dq = d mod (q-1))
  h  = qInv × (mp - mq) mod p
  M  = mq + h × q

Hasil M = integer 2048-bit = blok OAEP 256 byte
```

**LANGKAH 4 — OAEP Unpadding (Recover Data Asli):**
```
Blok M (256 byte):
  0x00 ∥ maskedSeed ∥ maskedDB

Langkah unpadding:
  [1] Cek byte pertama = 0x00, jika bukan → GAGAL ❌

  [2] seedMask = MGF1(maskedDB, 32)

  [3] seed = maskedSeed ⊕ seedMask

  [4] dbMask = MGF1(seed, 223)

  [5] DB = maskedDB ⊕ dbMask

  [6] Verifikasi DB:
       - 32 byte pertama = lHash = SHA-256("") → harus cocok!
       - Cari byte 0x01 setelah padding 0x00
       - Data asli = bytes setelah 0x01

  [7] Jika semua verifikasi PASS → ambil data ✅
       Jika GAGAL (lHash tidak cocok, 0x01 tidak ditemukan, dll)
       → Error: Kunci privat salah / data rusak ❌
```

**LANGKAH 5 — Gabungkan Semua Chunk:**
```
Chunk 1 data asli: [byte_0 ... byte_179]
Chunk 2 data asli: [byte_180 ... byte_359]
Chunk 3 data asli: [byte_360 ... byte_n]
    ↓
Gabung: Uint8Array.set() → array byte panjang penuh
    ↓
TextDecoder('utf-8').decode(array) → Plaintext string ✅
```

**LANGKAH 6 — Skenario Error:**
```
Skenario 1: Kunci Privat TIDAK COCOK dengan Kunci Publik
  C^d mod n → nilai integer ACAK (bukan M asli)
  OAEP Unpad: byte pertama ≠ 0x00 → Error langsung ❌

Skenario 2: Ciphertext RUSAK (1 bit berubah)
  C' = C ⊕ 1 → C'^d mod n → nilai integer berbeda
  OAEP Unpad gagal → Error ❌
  (RSA-OAEP secara inheren mendeteksi modifikasi data)

Skenario 3: Kunci Privat BENAR tapi chunk KURANG
  JSON parse error atau count tidak cocok → Error ❌
```

**Perbandingan Enkripsi vs Dekripsi RSA:**
```
  ENKRIPSI                          DEKRIPSI
  ──────────────────────            ──────────────────────
  Plaintext bytes (≤180/chunk)     Base64 ciphertext
        ↓                                 ↓
  OAEP Pad (seed acak + MGF1)       Parse JSON → array chunks
        ↓                                 ↓ (per chunk)
  M^e mod n (e=65537)              C^d mod n  (CRT)
        ↓                                 ↓
  256 byte per chunk               OAEP Unpad
        ↓                                 ↓
  JSON {chunks:[b64,...]}          Gabung semua chunk
        ↓                                 ↓
  Base64 final                     UTF-8 decode → Plaintext
```

**Keamanan RSA-2048:**
```
Keamanan bergantung pada sulitnya memfaktorkan n = p × q

Ukuran kunci  : 2048-bit
Ekuivalen sym : ~112-bit symmetric security
Rekomendasi   : NIST SP 800-57 — aman hingga tahun 2030+

Serangan terbaik (GNFS - General Number Field Sieve):
  Kompleksitas: exp( (64/9)^(1/3) × (ln n)^(1/3) × (ln ln n)^(2/3) )
  Dengan n 2048-bit: komputasi mustahil secara praktis
  dengan hardware konvensional saat ini
```

---

---

# 🔑 BAGIAN V: SUPER ENCRYPTION (4 LAYER)

## 🎯 SLIDE 21 — SUPER ENCRYPTION: KONSEP

**Definisi:**  
Super Encryption adalah sistem kriptografi **berlapis (multi-layered)** yang menggabungkan kekuatan 4 algoritma secara berurutan dalam satu pipeline enkripsi estafet.

**Filosofi Desain:**
```
"Kelemahan satu lapisan dikompensasi oleh kekuatan lapisan lain."

  Vigenère   → Obfuskasi karakter dasar (substitusi alfabetik)
  Rail Fence → Acak urutan karakter (transposisi zig-zag)
  AES-256    → Enkripsi blok kuat + Autentikasi integritas
  RSA-2048   → Pengamanan kunci secara asimetris
```

**Urutan Pipeline Enkripsi:**
```
  PLAINTEXT
      ↓ Layer 1: Vigenère Cipher      (Substitusi Klasik)
      ↓ Layer 2: Rail Fence Cipher    (Transposisi Klasik)
      ↓ Layer 3: Rijndael / AES-256   (Simetri Modern)
      ↓ Layer 4: RSA-OAEP 2048-bit    (Nirsimetri Modern)
  SUPER CIPHERTEXT
```

---

## 🎯 SLIDE 22 — SUPER ENCRYPTION: PIPELINE ENKRIPSI

**Contoh: Teks `HALO` · Kunci Vigenère `KEY` · Rail k=3 · AES passphrase `mypassword`**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 1 — VIGENÈRE CIPHER (Substitusi Klasik)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input   : "HALO"
Kunci   : "KEY"
Proses  :
  H(7) + K(10) = 17 → R
  A(0) + E(4)  = 4  → E
  L(11)+ Y(24) = 9  → J
  O(14)+ K(10) = 24 → Y
Output  : "REJY"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 2 — RAIL FENCE CIPHER (Transposisi k=3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input   : "REJY"
Matriks :
  Rel 1: R  .  .  .    → posisi 0
  Rel 2: .  E  .  Y    → posisi 1, 3
  Rel 3: .  .  J  .    → posisi 2
Baca baris: "R" + "EY" + "J"
Output  : "REYJ"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 3 — AES-256-GCM (Simetri Modern)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input   : "REYJ"
Key     : SHA-256("mypassword") → 32-byte AES key
IV      : [12 byte random baru setiap sesi]
Proses  : 14 putaran AES (SubBytes→ShiftRows→MixColumns→AddRoundKey)
Output  : Base64(IV + Ciphertext + AuthTag)
          → contoh: "dGhpcyBpcyBhIHRlc3Q..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 4 — RSA-OAEP 2048-bit (Nirsimetri Modern)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input   : AES Base64 output (1 chunk)
Kunci   : Public Key PEM 2048-bit
Proses  : C = (M_OAEP_padded)^65537 mod n
Output  : JSON chunks → Base64 final = SUPER CIPHERTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 SLIDE 23 — SUPER ENCRYPTION: PIPELINE DEKRIPSI

**Proses Dekripsi adalah KEBALIKAN PERSIS dari Enkripsi (urutan terbalik):**

```
SUPER CIPHERTEXT
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEKRIPSI LAYER 4 — RSA (Kunci Privat PEM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Formula : M_i = (C_i)^d mod n
Proses  : Unpad OAEP → recover AES Base64
Output  : AES Ciphertext Base64

      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEKRIPSI LAYER 3 — AES-256-GCM (Passphrase)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proses  : Extract IV → SHA-256(key) → AES-GCM Decrypt
          + Verifikasi 128-bit Auth Tag
Output  : Teks Rail Fence

      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEKRIPSI LAYER 2 — RAIL FENCE (k rel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proses  : Rekonstruksi matriks zig-zag → isi per baris → baca diagonal
Output  : Teks Vigenère

      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEKRIPSI LAYER 1 — VIGENÈRE (Kata kunci)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Formula : P_i = (C_i - K_i + 26) mod 26
Output  : PLAINTEXT ASLI ✅
```

---

## 🎯 SLIDE 24 — SUPER ENCRYPTION: ANALISIS KEAMANAN

**Mengapa 4 Lapisan Lebih Kuat?**

| Lapisan | Algoritma | Kekuatan | Melindungi dari |
|---------|-----------|----------|-----------------|
| L1 | Vigenère | Substitusi polialfabetik | Frequency analysis sederhana |
| L2 | Rail Fence | Transposisi urutan | Pattern recognition |
| L3 | AES-256-GCM | 256-bit symmetric + Auth Tag | Brute force + Data tampering |
| L4 | RSA-OAEP 2048 | Asymmetric 2048-bit | Key interception |

**Kunci yang Diperlukan untuk Dekripsi (SEMUA harus benar):**
```
1. Kata kunci Vigenère    (string alfabet)
2. Jumlah rel Rail Fence  (angka integer k ≥ 2)
3. Passphrase AES-256     (string bebas)
4. Kunci Privat RSA-2048  (file PEM 2048-bit)
```

> **Keamanan Super Encryption ≥ Keamanan AES-256 + RSA-2048 secara bersamaan.**  
> Membobol Super Encryption berarti membobol AES-256 DAN RSA-2048 sekaligus.

---

---

## 🎯 SLIDE 25 — DEMO APLIKASI

**Fitur Utama:**
```
✅ Antarmuka web responsif (Mobile & Desktop)
✅ Input/Output real-time untuk setiap cipher
✅ Trace per karakter (Vigenère & Rail Fence)
✅ Visualisasi State Matrix 4×4 AES per blok
✅ Generator & Import/Export Kunci RSA PEM
✅ Pipeline visual 4-tahap Super Encryption
✅ Tabel debug matematis di setiap halaman
```

**Link Repository & Akses:**
```
Repository : https://github.com/ikhsanwahyue/ClassicalCipher-Systems
Local Dev  : http://localhost:3000   (npm run dev)
```

**Peta Halaman Aplikasi:**

| URL | Fungsi |
|-----|--------|
| `/` | Beranda & navigasi utama |
| `/vigenere` | Enkripsi/Dekripsi Vigenère + Tabel Trace |
| `/rail-fence` | Rail Fence + Matriks Zig-Zag Visual |
| `/rijndael` | AES-256-GCM + State Matrix + Simulasi Putaran |
| `/rsa` | RSA-OAEP + Generate/Import Kunci PEM |
| `/super-encryption` | Pipeline 4-layer lengkap |

---

## 🎯 SLIDE 26 — KESIMPULAN

**Pencapaian Proyek:**
```
✅ Berhasil mengimplementasikan 5 algoritma kriptografi dalam 1 platform
✅ Menampilkan proses manual (trace) untuk setiap algoritma
✅ Mengintegrasikan kriptografi klasik dan modern
✅ Super Encryption menggabungkan keempatnya dalam pipeline berlapis
✅ Antarmuka interaktif berbasis web (Next.js + TypeScript)
```

**Perbandingan Singkat Seluruh Algoritma:**

| Algoritma | Jenis | Kunci | Keamanan |
|-----------|-------|-------|----------|
| Vigenère | Substitusi Klasik | Kata kunci | Rendah |
| Rail Fence | Transposisi Klasik | Angka (k) | Rendah |
| AES-256-GCM | Simetri Modern | 256-bit | Sangat Tinggi |
| RSA-OAEP 2048 | Nirsimetri Modern | Pasangan kunci | Sangat Tinggi |
| Super Encryption | Multi-layer | Semua di atas | Maksimal |

**Saran Pengembangan ke Depan:**
- Tambahkan algoritma lain: Playfair, Columnar Transposition, ChaCha20-Poly1305
- Implementasi kriptanalisis (analisis frekuensi huruf, Index of Coincidence)
- Fitur export/import hasil enkripsi ke file (.txt / .json)
- Dukungan enkripsi file biner (gambar, PDF)

---

## 🎯 SLIDE 27 — DAFTAR PUSTAKA

```
[1] Stinson, D. R. (2006). Cryptography: Theory and Practice (3rd ed.). CRC Press.

[2] Paar, C., & Pelzl, J. (2010). Understanding Cryptography.
    Springer. ISBN 978-3-642-04100-6.

[3] National Institute of Standards and Technology. (2001).
    FIPS PUB 197: Advanced Encryption Standard (AES).
    https://doi.org/10.6028/NIST.FIPS.197

[4] Rivest, R., Shamir, A., & Adleman, L. (1978).
    A Method for Obtaining Digital Signatures and Public-Key Cryptosystems.
    Communications of the ACM, 21(2), 120–126.

[5] Bellare, M., & Rogaway, P. (1994).
    Optimal Asymmetric Encryption - How to Encrypt with RSA.
    EUROCRYPT 1994. LNCS, vol. 950, pp. 92–111.

[6] Web Crypto API Specification. W3C.
    https://www.w3.org/TR/WebCryptoAPI/

[7] Next.js Documentation. Vercel.
    https://nextjs.org/docs
```

---

## 🎯 SLIDE 28 — TANYA JAWAB

```
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║      TERIMA KASIH ATAS PERHATIANNYA      ║
  ║                                          ║
  ║   Classical Cipher Systems               ║
  ║   — from Classical to Modern Crypto —    ║
  ║                                          ║
  ║   🔓 Ada pertanyaan?                    ║
  ║                                          ║
  ╚══════════════════════════════════════════╝

  Repository:
  https://github.com/ikhsanwahyue/ClassicalCipher-Systems
```

---

## 📌 CATATAN UNTUK PRESENTATOR

> **Tips presentasi:**
>
> 1. **Vigenère:** Tunjukkan tabel trace di aplikasi secara live, bandingkan dengan tabel manual di slide.
> 2. **Rail Fence:** Gambar matriks zig-zag di papan tulis sebelum menunjukkan visualisasi aplikasi.
> 3. **AES:** Fokus pada konsep "State Matrix" dan terangkan 4 transformasi satu per satu. Tidak perlu menjelaskan GF(2⁸) secara matematis mendalam.
> 4. **RSA:** Tekankan konsep "dua kunci" — publik untuk enkripsi, privat untuk dekripsi — dan kenapa aman.
> 5. **Super Encryption:** Tunjukkan pipeline di aplikasi, masukkan teks pendek, dan perlihatkan output tiap layer berubah secara live.
> 6. **Demo Live:** Jalankan `npm run dev` sebelum presentasi dan buka semua tab halaman terlebih dahulu.

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

