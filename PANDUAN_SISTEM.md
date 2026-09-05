# PANDUAN LENGKAP PENGGUNAAN & DEPLOYMENT
## SISWA SMART MONITORING
**Sistem Monitoring Pelanggaran, Prestasi dan Kehadiran Siswa SMP**

---

### 1. Deskripsi Aplikasi
Aplikasi **Siswa Smart Monitoring** adalah sistem informasi kedisiplinan dan apresiasi prestasi sekolah berbasis web modern, responsif, ringan, dan dirancang khusus untuk jenjang SMP dengan konsep **"Satu Siswa = Satu Profil Monitoring"**.

Sistem ini mendukung 4 peran (Role Based Access Control):
1. **Administrator**: Memiliki hak akses penuh ke seluruh data master, konfigurasi poin, dan laporan.
2. **Guru**: Mencatat presensi harian & mapel, input keterlambatan, dan mendokumentasikan insiden pelanggaran serta prestasi.
3. **Wali Kelas**: Memantau perkembangan kelas binaan, statistik kedisiplinan, dan mencetak laporan khusus kelas.
4. **Siswa**: Melihat rekam jejak pribadi, kehadiran, total poin pelanggaran, serta capaian prestasi mandiri.

---

### 2. Akun Demo Bawaan untuk Uji Coba Cepat
Aplikasi dilengkapi dengan **Mode Demo Bawaan** yang langsung aktif tanpa perlu setup backend tambahan:

| Peran (Role) | Email / Username | Password | Akses Halaman |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sekolah.sch.id` | `admin123` | `dashboard-admin.html` |
| **Guru** | `guru@sekolah.sch.id` | `guru123` | `dashboard-guru.html` |
| **Wali Kelas** | `walikelas@sekolah.sch.id` | `wali123` | `dashboard-wali-kelas.html` |
| **Siswa** | `26001` (atau `siswa@sekolah.sch.id`) | `siswa123` | `dashboard-siswa.html` |

> **Tips:** Pada halaman `login.html`, tersedia tombol pintas 1-klik untuk langsung mengisi form dengan akun demo di atas.

---

### 3. Petunjuk Menjalankan di Lokal (Local Development)

Anda dapat menjalankan website ini menggunakan server lokal apa saja:

#### Opsi A: Menggunakan Python
Buka terminal / PowerShell di folder proyek (`E:\pelanggaran2`):
```bash
python -m http.server 8000
```
Buka browser dan akses: `http://localhost:8000`

#### Opsi B: Menggunakan Node.js / npx serve
```bash
npx serve .
```

#### Opsi C: Menggunakan VS Code Live Server
Buka folder `pelanggaran2` di VS Code, klik kanan pada file `index.html` dan pilih **"Open with Live Server"**.

---

### 4. Petunjuk Konfigurasi Firebase Cloud Firestore & Authentication

Jika ingin menghubungkan aplikasi ke Firebase Console milik sekolah Anda:

1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project baru (misal: `smp-smart-monitoring`).
2. Aktifkan **Authentication**:
   - Pilih menu **Build > Authentication**.
   - Di tab **Sign-in method**, aktifkan penyedia **Email/Password**.
3. Aktifkan **Cloud Firestore**:
   - Pilih menu **Build > Firestore Database > Create database**.
   - Pilih lokasi server (disarankan `asia-southeast2` / Jakarta).
   - Masukkan Security Rules dari file `firebase/firestore.rules`.
4. Aktifkan **Firebase Storage** (untuk unggah foto & bukti):
   - Pilih menu **Build > Storage > Get started**.
   - Masukkan Security Rules dari file `firebase/storage.rules`.
5. Dapatkan Konfigurasi Web App:
   - Masuk ke **Project Settings > General > Your apps**.
   - Klik ikon Web (`</>`) dan beri nama aplikasi web.
   - Salin objek `firebaseConfig`.
6. Terapkan konfigurasi:
   - Tempel konfigurasi di file `js/firebase-config.js`, atau
   - Masuk ke menu **Pengaturan Sekolah** di aplikasi dan tempel pada form **Konfigurasi Cloud Firebase**.

---

### 5. Petunjuk Deployment ke Firebase Hosting

1. Pasang Firebase CLI di komputer:
   ```bash
   npm install -g firebase-tools
   ```
2. Login ke akun Google Anda:
   ```bash
   firebase login
   ```
3. Hubungkan project (jika belum):
   ```bash
   firebase use --add
   ```
   Pilih ID project Firebase Anda.
4. Deploy aplikasi secara instan:
   ```bash
   firebase deploy
   ```
5. Website sekolah Anda akan langsung aktif secara publik dengan SSL gratis, misalnya di:
   `https://siswa-smart-monitoring.web.app`

---

### 6. Struktur Database Firestore

```
users/{userId}
students/{studentId}
teachers/{teacherId}
classes/{classId}
attendance/{attendanceId}
lateness/{latenessId}
violations/{violationId}
violation_categories/{categoryId}
achievements/{achievementId}
achievement_categories/{categoryId}
school_settings/{settingId}
academic_years/{yearId}
activity_logs/{logId}
notifications/{notificationId}
```

---

### 7. Fitur Utama & Panduan Penggunaan
- **Input Presensi Harian**: Buka menu **Presensi Kehadiran**, pilih kelas dan tanggal, gunakan tombol *"Tandai Semua Hadir"* untuk efisiensi, ubah siswa yang berhalangan (Sakit/Izin/Alpa), lalu klik *"Simpan Presensi"*.
- **Pencatatan Keterlambatan**: Buka menu **Keterlambatan**, pilih siswa dan masukkan jam tiba. Sistem otomatis menghitung jumlah menit keterlambatan dari jam masuk sekolah (07:00).
- **Pencatatan Pelanggaran & Tindak Lanjut**: Buka menu **Catatan Pelanggaran**, pilih siswa, kategori, jenis pelanggaran (poin terisi otomatis), masukkan kronologi, tindakan pembinaan, dan status.
- **Profil Siswa Komprehensif**: Ketik nama atau NIS siswa di bilah pencarian atas atau klik nama siswa dari tabel mana saja untuk membuka halaman `profil-siswa.html?id=...`. Halaman ini siap dicetak langsung (`Ctrl+P`) dengan layout rapi.
- **Import & Export Excel/CSV**: Tersedia pada menu **Data Siswa** dan **Data Guru** untuk mengunggah data secara massal melalui file Excel (.xlsx) atau CSV dengan pratinjau data sebelum disimpan, serta tombol ekspor langsung ke format **Excel (.xlsx)** dan **CSV**.
- **Export Data**: Seluruh tabel utama (Siswa, Guru, Presensi, Keterlambatan, Pelanggaran, Prestasi, dan Rekapitulasi) memiliki tombol ekspor langsung ke format **Excel (.xlsx)** dan **CSV**.
