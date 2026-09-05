\# PROMPT PEMBUATAN WEBSITE



\## SISTEM MONITORING PELANGGARAN, PRESTASI DAN KEHADIRAN (KEDISIPLINAN) SISWA



Buat sebuah aplikasi web sekolah modern, responsif, ringan, aman, dan mudah digunakan dengan nama:



\*\*"SISWA SMART MONITORING"\*\*



Subjudul:



\*\*"Sistem Monitoring Pelanggaran, Prestasi dan Kehadiran Siswa"\*\*



Aplikasi ditujukan untuk sekolah jenjang SMP dan digunakan oleh:



1\. Administrator

2\. Guru

3\. Wali Kelas

4\. Siswa



Teknologi utama:



\* HTML5

\* CSS3

\* JavaScript ES6+

\* Firebase Authentication

\* Firebase Cloud Firestore

\* Firebase Storage

\* Firebase Hosting

\* Gunakan Chart.js untuk grafik jika diperlukan

\* Gunakan Font Awesome atau Lucide Icons

\* Tidak menggunakan backend PHP/MySQL

\* Seluruh data utama disimpan di Firebase



==================================================



\# 1. TUJUAN SISTEM



==================================================



Buat sistem yang memungkinkan sekolah melakukan:



\* Pendataan siswa

\* Monitoring kehadiran

\* Pencatatan keterlambatan

\* Pencatatan pelanggaran

\* Pemberian poin pelanggaran

\* Pencatatan prestasi siswa

\* Monitoring kedisiplinan

\* Rekap data per siswa

\* Rekap data per kelas

\* Dashboard guru

\* Dashboard siswa

\* Pencarian siswa

\* Filter berdasarkan kelas

\* Filter berdasarkan tanggal

\* Grafik statistik

\* Cetak laporan

\* Export data

\* Riwayat aktivitas siswa



Konsep utama:



\*\*SATU SISWA = SATU PROFIL MONITORING\*\*



Dalam halaman profil siswa tampilkan:



\* Identitas siswa

\* Kelas

\* Foto

\* Kehadiran

\* Keterlambatan

\* Pelanggaran

\* Total poin pelanggaran

\* Prestasi

\* Riwayat aktivitas

\* Status kedisiplinan



==================================================



\# 2. ROLE DAN HAK AKSES



==================================================



Buat sistem Role Based Access Control.



\## ADMIN



Admin memiliki akses penuh:



\* Dashboard

\* Data siswa

\* Data guru

\* Data kelas

\* Kehadiran

\* Pelanggaran

\* Prestasi

\* Kategori pelanggaran

\* Kategori prestasi

\* Pengaturan poin

\* Laporan

\* Pengaturan sistem



Admin dapat:



\* Tambah

\* Edit

\* Hapus

\* Lihat

\* Export

\* Cetak



\## GURU



Guru dapat:



\* Melihat siswa

\* Mencatat kehadiran

\* Mencatat keterlambatan

\* Mencatat pelanggaran

\* Mencatat prestasi

\* Melihat perkembangan siswa

\* Melihat rekap kelas yang menjadi tanggung jawabnya



Guru tidak boleh:



\* Menghapus admin

\* Mengubah konfigurasi Firebase

\* Mengakses data sensitif yang bukan kewenangannya



\## WALI KELAS



Wali kelas memiliki semua fungsi guru, ditambah:



\* Dashboard khusus kelas

\* Rekap kedisiplinan kelas

\* Rekap kehadiran kelas

\* Rekap pelanggaran kelas

\* Rekap prestasi kelas

\* Profil perkembangan setiap siswa

\* Cetak laporan kelas



\## SISWA



Siswa hanya dapat:



\* Melihat profil sendiri

\* Melihat kehadiran sendiri

\* Melihat keterlambatan sendiri

\* Melihat pelanggaran sendiri

\* Melihat poin pelanggaran sendiri

\* Melihat prestasi sendiri

\* Melihat perkembangan kedisiplinan sendiri



Siswa TIDAK boleh melihat:



\* Data siswa lain

\* Data pribadi siswa lain

\* Pelanggaran siswa lain

\* Rekap individu siswa lain



==================================================



\# 3. HALAMAN LOGIN



==================================================



Buat halaman login modern.



Komponen:



\* Logo sekolah

\* Nama sekolah

\* Username/email

\* Password

\* Tombol Login

\* Lupa password

\* Informasi sistem



Gunakan:



Firebase Authentication



Metode:



\* Email + Password



Setelah login:



Jika role = admin:



→ dashboard-admin.html



Jika role = guru:



→ dashboard-guru.html



Jika role = wali\_kelas:



→ dashboard-wali-kelas.html



Jika role = siswa:



→ dashboard-siswa.html



Jangan menyimpan password secara manual di Firestore.



==================================================



\# 4. DASHBOARD ADMIN



==================================================



Dashboard admin menampilkan kartu statistik:



\* Total Siswa

\* Total Guru

\* Total Kelas

\* Kehadiran Hari Ini

\* Terlambat Hari Ini

\* Sakit

\* Izin

\* Alpa

\* Total Pelanggaran

\* Total Prestasi



Gunakan grafik:



1\. Grafik kehadiran bulanan

2\. Grafik pelanggaran bulanan

3\. Grafik prestasi bulanan

4\. Grafik status kehadiran

5\. Grafik siswa berdasarkan tingkat kedisiplinan



Tambahkan:



\* aktivitas terbaru

\* pelanggaran terbaru

\* prestasi terbaru

\* siswa dengan tingkat pelanggaran tertinggi

\* siswa dengan prestasi terbaru



==================================================



\# 5. DATA SISWA



==================================================



Buat CRUD Data Siswa.



Field:



\* NIS

\* NISN

\* Nama Lengkap

\* Nama Panggilan

\* Jenis Kelamin

\* Tempat Lahir

\* Tanggal Lahir

\* Alamat

\* Kelas

\* Nomor HP

\* Nama Orang Tua/Wali

\* Nomor HP Orang Tua/Wali

\* Foto

\* Status Aktif



Fitur:



\* Tambah siswa

\* Edit siswa

\* Hapus siswa

\* Cari siswa

\* Filter kelas

\* Filter jenis kelamin

\* Import Excel

\* Export Excel

\* Cetak data



==================================================



\# 6. DATA KELAS



==================================================



Buat menu kelas.



Contoh:



Kelas 7A

Kelas 7B

Kelas 7C

Kelas 8A

Kelas 8B

Kelas 8C

Kelas 9A

Kelas 9B

Kelas 9C



Field:



\* ID Kelas

\* Nama Kelas

\* Tingkat

\* Wali Kelas

\* Tahun Pelajaran

\* Jumlah Siswa



Ketika kelas dipilih:



Tampilkan:



\* daftar siswa

\* kehadiran

\* pelanggaran

\* prestasi

\* statistik kedisiplinan



==================================================



\# 7. MODUL KEHADIRAN



==================================================



Buat sistem absensi siswa.



Status:



\* HADIR

\* SAKIT

\* IZIN

\* ALPA

\* TERLAMBAT

\* DINAS/KEGIATAN SEKOLAH



Guru dapat memilih:



Tanggal

Kelas

Jam Pelajaran



Kemudian tampilkan daftar siswa.



Format:



| No | NIS | Nama | Status | Keterangan |

| -- | --- | ---- | ------ | ---------- |



Guru dapat melakukan:



\* Tandai semua hadir

\* Ubah status per siswa

\* Simpan absensi

\* Edit absensi

\* Cari siswa

\* Filter status



==================================================



\# 8. ABSENSI BERBASIS JAM



==================================================



Jika memungkinkan, buat absensi berdasarkan:



\* Hari

\* Jam

\* Mata pelajaran

\* Guru

\* Kelas



Contoh:



Senin

08.00–08.40

IPA

Kelas 8A

Guru: ...



Sistem menyimpan:



\* tanggal

\* waktu

\* siswa

\* guru

\* kelas

\* mata pelajaran

\* status

\* keterangan



==================================================



\# 9. MODUL KETERLAMBATAN



==================================================



Buat menu khusus keterlambatan.



Field:



\* Siswa

\* Kelas

\* Tanggal

\* Jam datang

\* Jumlah menit terlambat

\* Alasan

\* Guru pencatat



Sistem otomatis menghitung:



Jam datang - jam masuk sekolah



Tampilkan:



\* jumlah keterlambatan

\* rata-rata keterlambatan

\* siswa paling sering terlambat

\* grafik keterlambatan



==================================================



\# 10. MODUL PELANGGARAN



==================================================



Buat sistem pencatatan pelanggaran.



Field:



\* ID Pelanggaran

\* Siswa

\* Kelas

\* Tanggal

\* Waktu

\* Jenis Pelanggaran

\* Kategori

\* Poin

\* Kronologi

\* Tindakan

\* Guru Pencatat

\* Bukti Foto/Dokumen

\* Status



Kategori contoh:



RINGAN



\* Terlambat

\* Tidak memakai atribut lengkap

\* Tidak membawa perlengkapan



SEDANG



\* Keluar kelas tanpa izin

\* Mengganggu pembelajaran

\* Membolos



BERAT



\* Perkelahian

\* Bullying

\* Vandalisme

\* Pelanggaran berat lainnya



Kategori harus dapat diubah oleh admin.



==================================================



\# 11. SISTEM POIN PELANGGARAN



==================================================



Setiap jenis pelanggaran mempunyai poin.



Contoh:



Terlambat = 2 poin



Tidak memakai atribut = 3 poin



Membolos = 10 poin



Perkelahian = 25 poin



Sistem otomatis menghitung:



TOTAL POIN SISWA



Gunakan rumus:



Total Poin =

jumlah seluruh poin pelanggaran siswa



==================================================



\# 12. STATUS KEDISIPLINAN



==================================================



Buat kategori otomatis.



Contoh:



0–10 poin

= SANGAT BAIK



11–25 poin

= BAIK



26–50 poin

= PERLU PEMBINAAN



51–75 poin

= PERLU PERHATIAN KHUSUS



> 75 poin

> = PEMBINAAN INTENSIF



Nilai batas harus dapat diubah admin.



Tampilkan status dengan indikator visual.



==================================================



\# 13. TINDAK LANJUT PELANGGARAN



==================================================



Setiap pelanggaran dapat memiliki tindakan:



\* Teguran

\* Nasihat

\* Pembinaan

\* Pemanggilan siswa

\* Pemanggilan orang tua

\* Surat pernyataan

\* Konseling

\* Tugas pembinaan

\* Rujukan ke BK

\* Tindakan lainnya



Tambahkan:



Tanggal tindak lanjut

Petugas

Catatan



==================================================



\# 14. MODUL PRESTASI



==================================================



Buat menu Prestasi Siswa.



Field:



\* Siswa

\* Kelas

\* Tanggal

\* Nama Prestasi

\* Bidang

\* Tingkat

\* Juara

\* Penyelenggara

\* Nilai/Skor jika ada

\* Deskripsi

\* Bukti sertifikat

\* Foto

\* Guru Pembina



Bidang:



\* Akademik

\* Olahraga

\* Seni

\* Keagamaan

\* Literasi

\* Numerasi

\* Sains

\* Teknologi

\* Koding

\* Organisasi

\* Lingkungan

\* Lainnya



Tingkat:



\* Sekolah

\* Kecamatan

\* Kabupaten

\* Provinsi

\* Nasional

\* Internasional



==================================================



\# 15. PROFIL MONITORING SISWA



==================================================



Buat halaman:



/profil-siswa.html?id=...



Tampilkan dashboard individual:



\---



FOTO SISWA



Nama:

NIS:

NISN:

Kelas:



\---



KEHADIRAN



Hadir: 95%

Sakit: 2

Izin: 1

Alpa: 0

Terlambat: 3



\---



PELANGGARAN



Total pelanggaran: 4

Total poin: 12

Status: BAIK



\---



PRESTASI



Jumlah prestasi: 3



\---



GRAFIK PERKEMBANGAN



Grafik kehadiran

Grafik pelanggaran

Grafik prestasi



\---



RIWAYAT AKTIVITAS



Tanggal | Aktivitas | Keterangan



==================================================



\# 16. DASHBOARD SISWA



==================================================



Buat dashboard yang sederhana dan ramah siswa.



Tampilkan:



"Selamat datang, \[Nama Siswa]"



Kartu:



\* Kehadiran

\* Terlambat

\* Pelanggaran

\* Poin

\* Prestasi



Tambahkan:



\### Kedisiplinan Saya



Progress bar.



\### Kehadiran Saya



Grafik bulanan.



\### Pelanggaran Saya



Daftar riwayat.



\### Prestasi Saya



Daftar prestasi.



Tambahkan pesan motivasi seperti:



"Pertahankan kedisiplinanmu!"



"Terus tingkatkan prestasimu!"



==================================================



\# 17. DASHBOARD GURU



==================================================



Dashboard guru menampilkan:



\* Kelas yang diampu

\* Jumlah siswa

\* Kehadiran hari ini

\* Siswa terlambat

\* Pelanggaran terbaru

\* Prestasi terbaru



Guru dapat:



\* Mengisi absensi

\* Mencatat pelanggaran

\* Mencatat prestasi

\* Melihat profil siswa

\* Melihat rekap kelas



==================================================



\# 18. DASHBOARD WALI KELAS



==================================================



Buat dashboard khusus wali kelas.



Tampilkan:



Jumlah siswa



Kehadiran kelas



Jumlah terlambat



Jumlah pelanggaran



Jumlah prestasi



Siswa paling disiplin



Siswa dengan pelanggaran tertinggi



Siswa dengan prestasi terbanyak



Grafik:



\* Kehadiran

\* Pelanggaran

\* Prestasi



==================================================



\# 19. SISTEM PENCARIAN



==================================================



Buat global search.



Guru dapat mencari:



\* Nama siswa

\* NIS

\* NISN

\* Kelas



Hasil pencarian menampilkan:



Foto

Nama

Kelas

Status kedisiplinan



Klik → profil siswa.



==================================================



\# 20. FILTER DATA



==================================================



Semua laporan harus memiliki filter:



\* Tahun Pelajaran

\* Semester

\* Tingkat

\* Kelas

\* Tanggal

\* Bulan

\* Status

\* Jenis pelanggaran

\* Jenis prestasi



==================================================



\# 21. LAPORAN



==================================================



Buat menu laporan.



Laporan:



1\. Rekap Kehadiran

2\. Rekap Keterlambatan

3\. Rekap Pelanggaran

4\. Rekap Poin

5\. Rekap Prestasi

6\. Rekap Kedisiplinan

7\. Profil Individu Siswa

8\. Rekap Per Kelas

9\. Rekap Sekolah



Laporan dapat:



\* Dilihat di browser

\* Dicetak

\* Disimpan sebagai PDF

\* Export Excel/CSV



==================================================



\# 22. FIREBASE FIRESTORE



==================================================



Gunakan Cloud Firestore.



Buat struktur collection:



users

students

teachers

classes

attendance

lateness

violations

violation\_categories

achievements

achievement\_categories

follow\_ups

school\_settings

academic\_years

notifications

activity\_logs



Contoh:



students/{studentId}



{

nis: "",

nisn: "",

name: "",

gender: "",

classId: "",

photoUrl: "",

parentName: "",

parentPhone: "",

status: "active",

createdAt: timestamp

}



attendance/{attendanceId}



{

studentId: "",

classId: "",

teacherId: "",

date: "",

subject: "",

status: "HADIR",

note: "",

createdAt: timestamp

}



violations/{violationId}



{

studentId: "",

classId: "",

categoryId: "",

violationName: "",

points: 0,

date: "",

chronology: "",

action: "",

teacherId: "",

evidenceUrl: "",

createdAt: timestamp

}



achievements/{achievementId}



{

studentId: "",

classId: "",

title: "",

field: "",

level: "",

rank: "",

organizer: "",

date: "",

certificateUrl: "",

photoUrl: "",

teacherId: "",

createdAt: timestamp

}



==================================================



\# 23. FIREBASE STORAGE



==================================================



Gunakan Firebase Storage untuk:



\* Foto siswa

\* Foto pelanggaran

\* Bukti prestasi

\* Sertifikat

\* Dokumen pembinaan



Jangan menyimpan file binary langsung di Firestore.



Simpan URL hasil upload di Firestore.



==================================================



\# 24. KEAMANAN FIREBASE



==================================================



WAJIB membuat Firestore Security Rules.



Prinsip:



Admin:

full access.



Guru:

hanya dapat membuat dan mengubah data sesuai kewenangan.



Wali kelas:

dapat melihat data siswa di kelasnya.



Siswa:

hanya dapat membaca data dirinya sendiri.



Jangan menggunakan:



allow read, write: if true;



Jangan memasukkan Firebase API key sebagai rahasia karena konfigurasi Firebase Web memang dapat berada di sisi client, tetapi keamanan harus dilakukan melalui Authentication dan Security Rules.



Validasi role harus dilakukan melalui data user/authentication yang aman.



==================================================



\# 25. NOTIFIKASI



==================================================



Buat sistem notifikasi internal.



Contoh:



"Anda tercatat terlambat hari ini."



"Anda mendapatkan catatan pelanggaran."



"Selamat! Anda mendapatkan prestasi baru."



Guru mendapat notifikasi:



"Siswa Andi tercatat melakukan pelanggaran."



Admin mendapat:



"Data pelanggaran baru ditambahkan."



Gunakan collection:



notifications



==================================================



\# 26. RIWAYAT AKTIVITAS



==================================================



Buat activity log.



Catat:



\* Login

\* Tambah siswa

\* Edit siswa

\* Absensi

\* Pelanggaran

\* Prestasi

\* Perubahan data



Field:



userId

userName

role

action

target

timestamp



Admin dapat melihat log.



==================================================



\# 27. DESAIN UI



==================================================



Gunakan desain:



Modern

Clean

Professional

Responsive

Mobile friendly



Layout:



Sidebar kiri



Header atas



Main content



Gunakan kartu statistik.



Gunakan icon.



Gunakan modal form.



Gunakan toast notification.



Gunakan tabel responsive.



Gunakan pagination.



Gunakan loading indicator.



Gunakan empty state.



Gunakan confirmation dialog sebelum menghapus.



==================================================



\# 28. WARNA



==================================================



Gunakan tema profesional sekolah.



Dominan:



Biru

Putih

Abu-abu



Gunakan warna status:



Hijau = baik/hadir



Kuning = perhatian



Merah = pelanggaran



Biru = informasi



==================================================



\# 29. RESPONSIVE



==================================================



Website wajib berjalan baik pada:



Desktop

Laptop

Tablet

Smartphone



Pada smartphone:



Sidebar berubah menjadi menu drawer.



Tabel berubah menjadi card/list jika diperlukan.



==================================================



\# 30. STRUKTUR FILE



==================================================



Gunakan struktur:



/siswa-smart-monitoring



index.html



login.html



dashboard-admin.html

dashboard-guru.html

dashboard-wali-kelas.html

dashboard-siswa.html



siswa.html

profil-siswa.html

guru.html

kelas.html



kehadiran.html

keterlambatan.html



pelanggaran.html

kategori-pelanggaran.html



prestasi.html

kategori-prestasi.html



laporan.html



pengaturan.html



/css

style.css

dashboard.css

responsive.css



/js

firebase-config.js

auth.js

auth-guard.js

dashboard.js

students.js

teachers.js

classes.js

attendance.js

lateness.js

violations.js

achievements.js

reports.js

notifications.js

utils.js



/assets

/images

/icons



/firebase

firestore.rules

storage.rules



==================================================



\# 31. KOMPONEN JAVASCRIPT



==================================================



Gunakan ES Modules.



Contoh:



firebase-config.js



Berisi konfigurasi Firebase.



auth.js



Berisi:



login()

logout()

getCurrentUser()

getUserRole()



students.js



Berisi:



addStudent()

updateStudent()

deleteStudent()

getStudents()

getStudentById()



attendance.js



Berisi:



saveAttendance()

getAttendance()

updateAttendance()

calculateAttendance()



violations.js



Berisi:



addViolation()

getViolations()

calculateViolationPoints()

getDisciplineStatus()



achievements.js



Berisi:



addAchievement()

getAchievements()



==================================================



\# 32. PERHITUNGAN KEHADIRAN



==================================================



Sistem otomatis menghitung persentase kehadiran.



Rumus:



Persentase Kehadiran =

Jumlah Hadir / Total Pertemuan × 100%



Tampilkan:



Hadir

Sakit

Izin

Alpa

Terlambat



==================================================



\# 33. PERHITUNGAN KEDISIPLINAN



==================================================



Buat skor kedisiplinan.



Contoh:



Kehadiran = 60%

Ketepatan waktu = 20%

Pelanggaran = 20%



Namun bobot harus dapat diubah melalui pengaturan.



Tampilkan:



SKOR KEDISIPLINAN



0–59 = Perlu Pembinaan



60–74 = Cukup



75–89 = Baik



90–100 = Sangat Baik



Jangan menganggap skor sebagai nilai akademik.



Gunakan sebagai indikator monitoring internal sekolah.



==================================================



\# 34. GRAFIK



==================================================



Gunakan Chart.js.



Buat grafik:



\* Kehadiran per bulan

\* Pelanggaran per bulan

\* Prestasi per bulan

\* Kehadiran per kelas

\* Pelanggaran per kelas

\* Distribusi status kehadiran



Grafik harus mengambil data langsung dari Firestore.



==================================================



\# 35. EXPORT DATA



==================================================



Sediakan:



Export CSV

Export Excel

Print

PDF



Data yang dapat diekspor:



\* Siswa

\* Kehadiran

\* Pelanggaran

\* Prestasi

\* Rekap kelas



==================================================



\# 36. IMPORT DATA SISWA



==================================================



Sediakan import Excel/CSV.



Template:



NIS

NISN

Nama

Jenis Kelamin

Kelas

Nama Orang Tua

Nomor HP



Sistem harus:



\* membaca file

\* memvalidasi kolom

\* mendeteksi data kosong

\* mendeteksi NIS duplikat

\* menampilkan preview

\* meminta konfirmasi sebelum menyimpan



==================================================



\# 37. VALIDASI FORM



==================================================



Semua form harus mempunyai validasi.



Contoh:



Nama wajib diisi.



Kelas wajib dipilih.



Tanggal wajib diisi.



Jenis pelanggaran wajib dipilih.



Poin harus berupa angka.



Jangan menyimpan data jika validasi gagal.



==================================================



\# 38. UX



==================================================



Setiap aksi harus memberikan feedback.



Contoh:



✓ Data berhasil disimpan.



✓ Absensi berhasil diperbarui.



✓ Pelanggaran berhasil dicatat.



✓ Prestasi berhasil ditambahkan.



Jika gagal:



⚠ Terjadi kesalahan. Silakan coba lagi.



Gunakan toast notification.



==================================================



\# 39. EMPTY STATE



==================================================



Jika belum ada data:



"Belum ada data pelanggaran."



"Belum ada data prestasi."



"Belum ada data kehadiran."



Tambahkan tombol:



"+ Tambah Data"



==================================================



\# 40. DATA DEMO



==================================================



Sediakan mode demo dengan data contoh.



Contoh:



20 siswa

3 kelas

5 guru

beberapa data absensi

beberapa pelanggaran

beberapa prestasi



Data demo harus diberi label:



"DATA DEMO"



dan mudah dihapus.



==================================================



\# 41. DASHBOARD UTAMA



==================================================



Dashboard harus memberikan gambaran cepat kondisi sekolah.



Contoh:



┌─────────────────────────────────────┐

│ TOTAL SISWA       540               │

├─────────────────────────────────────┤

│ KEHADIRAN         94,5%             │

├─────────────────────────────────────┤

│ PELANGGARAN       37                │

├─────────────────────────────────────┤

│ PRESTASI          82                │

└─────────────────────────────────────┘



Kemudian:



Grafik Kehadiran



Grafik Pelanggaran



Grafik Prestasi



Siswa perlu perhatian



Siswa berprestasi



==================================================



\# 42. PRIVASI SISWA



==================================================



Data pelanggaran merupakan data internal sekolah.



Jangan menampilkan data pelanggaran siswa secara publik.



Siswa hanya dapat melihat data miliknya sendiri.



Guru hanya dapat melihat sesuai kewenangan.



Admin memiliki akses sesuai tugas administrasi.



Hindari menampilkan informasi pribadi siswa secara berlebihan.



==================================================



\# 43. PENGATURAN SEKOLAH



==================================================



Buat halaman:



Pengaturan Sekolah



Field:



Nama Sekolah

NPSN

Alamat

Logo

Kepala Sekolah

Tahun Pelajaran

Semester

Jam Masuk

Jam Pulang



Pengaturan poin:



Kategori pelanggaran

Poin

Status



Pengaturan kedisiplinan:



Bobot kehadiran

Bobot ketepatan waktu

Bobot pelanggaran



==================================================



\# 44. TAHUN PELAJARAN



==================================================



Sistem harus mendukung:



2026/2027

2027/2028

2028/2029

dan seterusnya.



Semua data akademik harus memiliki:



academicYearId



dan jika diperlukan:



semester



sehingga data tahun pelajaran tidak tercampur.



==================================================



\# 45. AUDIT DAN KONSISTENSI DATA



==================================================



Pastikan:



\* ID dokumen konsisten

\* studentId selalu mengarah ke siswa yang valid

\* classId selalu mengarah ke kelas yang valid

\* teacherId mengarah ke user/guru yang valid

\* createdAt menggunakan server timestamp Firebase

\* updatedAt menggunakan server timestamp Firebase



Gunakan transaksi/batch Firestore jika diperlukan untuk menjaga konsistensi data.



==================================================



\# 46. PENGEMBANGAN SELANJUTNYA



==================================================



Siapkan struktur agar di masa depan dapat ditambahkan:



\* Modul BK

\* Konseling siswa

\* Catatan wali kelas

\* Catatan perkembangan siswa

\* Jurnal guru

\* Presensi guru

\* Surat panggilan orang tua

\* E-rapor

\* Integrasi QR Code

\* Kartu pelajar digital

\* Notifikasi WhatsApp

\* Progressive Web App (PWA)

\* Push Notification

\* Sistem penghargaan siswa

\* Gamifikasi kedisiplinan

\* Dashboard orang tua



==================================================



\# 47. OUTPUT YANG SAYA INGINKAN



==================================================



Jangan hanya memberikan contoh kode.



Bangun aplikasi yang benar-benar dapat dijalankan.



Berikan:



1\. Struktur folder lengkap.

2\. Semua file HTML.

3\. Semua file CSS.

4\. Semua file JavaScript.

5\. Firebase configuration template.

6\. Firestore Security Rules.

7\. Firebase Storage Rules.

8\. Struktur database Firestore.

9\. Data demo.

10\. Petunjuk instalasi.

11\. Petunjuk konfigurasi Firebase.

12\. Petunjuk membuat user admin.

13\. Petunjuk deploy Firebase Hosting.

14\. Dokumentasi penggunaan.



==================================================



\# 48. ATURAN PEMROGRAMAN



==================================================



Gunakan kode yang:



\* Modular

\* Bersih

\* Mudah dibaca

\* Mudah dikembangkan

\* Tidak mengulang kode yang sama

\* Memiliki komentar seperlunya

\* Tidak menggunakan library berlebihan

\* Tidak menggunakan framework berat kecuali benar-benar diperlukan



Prioritaskan:



HTML + CSS + Vanilla JavaScript + Firebase.



==================================================



\# 49. PRIORITAS IMPLEMENTASI



==================================================



Jika aplikasi terlalu besar untuk dibuat sekaligus, kerjakan secara bertahap dengan urutan:



FASE 1

Authentication + Role



FASE 2

Data Siswa + Kelas



FASE 3

Kehadiran



FASE 4

Pelanggaran + Poin



FASE 5

Prestasi



FASE 6

Dashboard



FASE 7

Laporan + Export



FASE 8

Security Rules



FASE 9

Responsive UI



FASE 10

Testing dan Deployment



Setiap fase harus tetap dapat dijalankan.



==================================================



\# 50. HASIL AKHIR



==================================================



Hasil akhir harus berupa aplikasi:



\*\*SISWA SMART MONITORING\*\*



dengan konsep:



DATA SISWA

↓

KEHADIRAN

↓

KEDISIPLINAN

↓

PELANGGARAN

↓

PEMBINAAN

↓

PRESTASI

↓

MONITORING PERKEMBANGAN

↓

LAPORAN



Aplikasi harus terasa seperti sistem sekolah yang nyata, bukan sekadar template dashboard.



Prioritaskan kemudahan penggunaan oleh guru yang tidak semuanya memiliki kemampuan IT tinggi.



Pastikan tombol, menu, form, tabel, pencarian, filter, dashboard, dan laporan dapat digunakan dengan jelas.



Buat desain profesional, modern, responsif, dan cocok digunakan sebagai sistem digital sekolah.



