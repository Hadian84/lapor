/**
 * SISWA SMART MONITORING - DEMO DATA & INITIAL SEED
 * Data contoh awal sekolah (20 siswa, 6 kelas, 5 guru, kehadiran, pelanggaran, prestasi, pengaturan)
 */

export const INITIAL_DEMO_DATA = {
  school_settings: {
    schoolName: "SMP Negeri 1 Segah",
    npsn: "20109988",
    address: "Jl. Pendidikan, Kec. Segah, Kab. Berau",
    principalName: "Hadi Permana, S.Pd, M.Pd",
    principalNip: "198407202009041004",
    academicYear: "2026/2027",
    semester: "Ganjil",
    schoolStartTime: "07:00",
    schoolEndTime: "14:30",
    toleranceMinutes: 10,
    // Bobot penilaian kedisiplinan (total 100%)
    weightAttendance: 60,
    weightPunctuality: 20,
    weightViolations: 20,
    // Ambang batas poin pelanggaran
    thresholds: [
      { min: 0, max: 10, label: "SANGAT BAIK", class: "status-sangat-baik", color: "#16a34a" },
      { min: 11, max: 25, label: "BAIK", class: "status-baik", color: "#0284c7" },
      { min: 26, max: 50, label: "PERLU PEMBINAAN", class: "status-pembinaan", color: "#d97706" },
      { min: 51, max: 75, label: "PERLU PERHATIAN KHUSUS", class: "status-perhatian-khusus", color: "#ea580c" },
      { min: 76, max: 9999, label: "PEMBINAAN INTENSIF", class: "status-intensif", color: "#dc2626" }
    ]
  },

  academic_years: [
    { id: "ay-1", name: "2025/2026", active: false },
    { id: "ay-2", name: "2026/2027", active: true },
    { id: "ay-3", name: "2027/2028", active: false }
  ],

  classes: [
    { id: "cls-7a", name: "Kelas 7A", grade: "7", homeroomTeacherId: "tch-1", homeroomTeacherName: "Budi Santoso, S.Pd", academicYear: "2026/2027", studentCount: 4 },
    { id: "cls-7b", name: "Kelas 7B", grade: "7", homeroomTeacherId: "tch-2", homeroomTeacherName: "Sri Wahyuni, M.Pd", academicYear: "2026/2027", studentCount: 3 },
    { id: "cls-8a", name: "Kelas 8A", grade: "8", homeroomTeacherId: "tch-3", homeroomTeacherName: "Ahmad Fauzi, S.Pd", academicYear: "2026/2027", studentCount: 4 },
    { id: "cls-8b", name: "Kelas 8B", grade: "8", homeroomTeacherId: "tch-4", homeroomTeacherName: "Nurul Hidayah, S.Si", academicYear: "2026/2027", studentCount: 3 },
    { id: "cls-9a", name: "Kelas 9A", grade: "9", homeroomTeacherId: "tch-5", homeroomTeacherName: "Drs. Hendra Gunawan", academicYear: "2026/2027", studentCount: 3 },
    { id: "cls-9b", name: "Kelas 9B", grade: "9", homeroomTeacherId: "tch-1", homeroomTeacherName: "Budi Santoso, S.Pd", academicYear: "2026/2027", studentCount: 3 }
  ],

  teachers: [
    { id: "tch-1", nip: "198002142005011003", name: "Budi Santoso, S.Pd", email: "budi.santoso@sekolah.sch.id", subject: "Matematika", phone: "081234567801", role: "wali_kelas", assignedClass: "Kelas 7A" },
    { id: "tch-2", nip: "198406182008012004", name: "Sri Wahyuni, M.Pd", email: "sri.wahyuni@sekolah.sch.id", subject: "Bahasa Indonesia", phone: "081234567802", role: "wali_kelas", assignedClass: "Kelas 7B" },
    { id: "tch-3", nip: "198601202010011005", name: "Ahmad Fauzi, S.Pd", email: "ahmad.fauzi@sekolah.sch.id", subject: "Ilmu Pengetahuan Alam (IPA)", phone: "081234567803", role: "wali_kelas", assignedClass: "Kelas 8A" },
    { id: "tch-4", nip: "199004112014022002", name: "Nurul Hidayah, S.Si", email: "nurul.hidayah@sekolah.sch.id", subject: "Bahasa Inggris", phone: "081234567804", role: "guru", assignedClass: "" },
    { id: "tch-5", nip: "197509151999031002", name: "Drs. Hendra Gunawan", email: "hendra.gunawan@sekolah.sch.id", subject: "Bimbingan Konseling (BK)", phone: "081234567805", role: "wali_kelas", assignedClass: "Kelas 9A" }
  ],

  // 20 Siswa Realistis
  students: [
    { id: "std-01", nis: "26001", nisn: "0091234501", name: "Aditya Pratama", nickname: "Adit", gender: "L", birthPlace: "Jakarta", birthDate: "2013-04-12", address: "Jl. Melati No. 12", classId: "cls-7a", className: "Kelas 7A", phone: "081298765401", parentName: "Bambang Pratama", parentPhone: "081211110001", photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", status: "active" },
    { id: "std-02", nis: "26002", nisn: "0091234502", name: "Anisa Rahmawati", nickname: "Anisa", gender: "P", birthPlace: "Bandung", birthDate: "2013-06-25", address: "Jl. Anggrek No. 5", classId: "cls-7a", className: "Kelas 7A", phone: "081298765402", parentName: "Asep Rahmawan", parentPhone: "081211110002", photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", status: "active" },
    { id: "std-03", nis: "26003", nisn: "0091234503", name: "Bagas Wicaksono", nickname: "Bagas", gender: "L", birthPlace: "Semarang", birthDate: "2013-01-18", address: "Jl. Kenanga No. 8", classId: "cls-7a", className: "Kelas 7A", phone: "081298765403", parentName: "Tri Wicaksono", parentPhone: "081211110003", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", status: "active" },
    { id: "std-04", nis: "26004", nisn: "0091234504", name: "Cantika Putri Dewi", nickname: "Cantika", gender: "P", birthPlace: "Surabaya", birthDate: "2013-09-04", address: "Jl. Mawar Indah No. 20", classId: "cls-7a", className: "Kelas 7A", phone: "081298765404", parentName: "Hadi Purnomo", parentPhone: "081211110004", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", status: "active" },
    { id: "std-05", nis: "26005", nisn: "0091234505", name: "Dimas Arya Kusuma", nickname: "Dimas", gender: "L", birthPlace: "Yogyakarta", birthDate: "2013-03-30", address: "Jl. Flamboyan No. 3", classId: "cls-7b", className: "Kelas 7B", phone: "081298765405", parentName: "Joko Kusuma", parentPhone: "081211110005", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", status: "active" },
    { id: "std-06", nis: "26006", nisn: "0091234506", name: "Eka Safitri", nickname: "Eka", gender: "P", birthPlace: "Solo", birthDate: "2013-08-14", address: "Jl. Cempaka No. 17", classId: "cls-7b", className: "Kelas 7B", phone: "081298765406", parentName: "Slamet Riyadi", parentPhone: "081211110006", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", status: "active" },
    { id: "std-07", nis: "26007", nisn: "0091234507", name: "Fajar Nugraha", nickname: "Fajar", gender: "L", birthPlace: "Malang", birthDate: "2013-11-09", address: "Jl. Dahlia No. 4", classId: "cls-7b", className: "Kelas 7B", phone: "081298765407", parentName: "Agus Nugraha", parentPhone: "081211110007", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", status: "active" },
    { id: "std-08", nis: "25001", nisn: "0081234508", name: "Gilang Ramadhan", nickname: "Gilang", gender: "L", birthPlace: "Bogor", birthDate: "2012-05-19", address: "Jl. Teratai No. 11", classId: "cls-8a", className: "Kelas 8A", phone: "081298765408", parentName: "Rudi Ramadhan", parentPhone: "081211110008", photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", status: "active" },
    { id: "std-09", nis: "25002", nisn: "0081234509", name: "Hana Nabila", nickname: "Hana", gender: "P", birthPlace: "Medan", birthDate: "2012-02-11", address: "Jl. Sakura No. 9", classId: "cls-8a", className: "Kelas 8A", phone: "081298765409", parentName: "Irfan Hakim", parentPhone: "081211110009", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", status: "active" },
    { id: "std-10", nis: "25003", nisn: "0081234510", name: "Irfan Maulana", nickname: "Irfan", gender: "L", birthPlace: "Palembang", birthDate: "2012-07-28", address: "Jl. Bougenville No. 15", classId: "cls-8a", className: "Kelas 8A", phone: "081298765410", parentName: "Syamsul Bahri", parentPhone: "081211110010", photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", status: "active" },
    { id: "std-11", nis: "25004", nisn: "0081234511", name: "Jessica Maharani", nickname: "Jessica", gender: "P", birthPlace: "Denpasar", birthDate: "2012-10-03", address: "Jl. Kamboja No. 6", classId: "cls-8a", className: "Kelas 8A", phone: "081298765411", parentName: "I Made Suartha", parentPhone: "081211110011", photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", status: "active" },
    { id: "std-12", nis: "25005", nisn: "0081234512", name: "Kevin Sanjaya", nickname: "Kevin", gender: "L", birthPlace: "Banyuwangi", birthDate: "2012-12-15", address: "Jl. Gladiol No. 14", classId: "cls-8b", className: "Kelas 8B", phone: "081298765412", parentName: "Sugiarto", parentPhone: "081211110012", photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150", status: "active" },
    { id: "std-13", nis: "25006", nisn: "0081234513", name: "Larasati Putri", nickname: "Laras", gender: "P", birthPlace: "Semarang", birthDate: "2012-03-22", address: "Jl. Melur No. 2", classId: "cls-8b", className: "Kelas 8B", phone: "081298765413", parentName: "Danang Wibowo", parentPhone: "081211110013", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", status: "active" },
    { id: "std-14", nis: "25007", nisn: "0081234514", name: "Muhammad Rizky", nickname: "Rizky", gender: "L", birthPlace: "Makassar", birthDate: "2012-08-01", address: "Jl. Asoka No. 21", classId: "cls-8b", className: "Kelas 8B", phone: "081298765414", parentName: "Rasyid Ridho", parentPhone: "081211110014", photoUrl: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=150", status: "active" },
    { id: "std-15", nis: "24001", nisn: "0071234515", name: "Nabila Syakieb", nickname: "Nabila", gender: "P", birthPlace: "Jakarta", birthDate: "2011-06-16", address: "Jl. Tulip No. 7", classId: "cls-9a", className: "Kelas 9A", phone: "081298765415", parentName: "Syakieb Ali", parentPhone: "081211110015", photoUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150", status: "active" },
    { id: "std-16", nis: "24002", nisn: "0071234516", name: "Oki Setiawan", nickname: "Oki", gender: "L", birthPlace: "Bandung", birthDate: "2011-09-29", address: "Jl. Seroja No. 13", classId: "cls-9a", className: "Kelas 9A", phone: "081298765416", parentName: "Dedi Setiawan", parentPhone: "081211110016", photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150", status: "active" },
    { id: "std-17", nis: "24003", nisn: "0071234517", name: "Putri Ayu Lestari", nickname: "Putri", gender: "P", birthPlace: "Yogyakarta", birthDate: "2011-01-08", address: "Jl. Wijaya Kusuma No. 19", classId: "cls-9a", className: "Kelas 9A", phone: "081298765417", parentName: "Surya Lestari", parentPhone: "081211110017", photoUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150", status: "active" },
    { id: "std-18", nis: "24004", nisn: "0071234518", name: "Rian Hidayat", nickname: "Rian", gender: "L", birthPlace: "Padang", birthDate: "2011-10-17", address: "Jl. Alamanda No. 25", classId: "cls-9b", className: "Kelas 9B", phone: "081298765418", parentName: "Yulius", parentPhone: "081211110018", photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", status: "active" },
    { id: "std-19", nis: "24005", nisn: "0071234519", name: "Siti Nurhaliza", nickname: "Siti", gender: "P", birthPlace: "Pekanbaru", birthDate: "2011-04-05", address: "Jl. Kenari No. 10", classId: "cls-9b", className: "Kelas 9B", phone: "081298765419", parentName: "Tarudin", parentPhone: "081211110019", photoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150", status: "active" },
    { id: "std-20", nis: "24006", nisn: "0071234520", name: "Taufik Hidayat", nickname: "Taufik", gender: "L", birthPlace: "Bandung", birthDate: "2011-12-02", address: "Jl. Garuda No. 33", classId: "cls-9b", className: "Kelas 9B", phone: "081298765420", parentName: "Aris Hidayat", parentPhone: "081211110020", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", status: "active" }
  ],

  // Kategori Pelanggaran
  violation_categories: [
    {
      id: "cat-ringan",
      name: "RINGAN",
      description: "Pelanggaran tata tertib umum dan kelengkapan",
      items: [
        { id: "v-r1", name: "Terlambat datang ke sekolah (< 15 menit)", points: 2 },
        { id: "v-r2", name: "Terlambat datang ke sekolah (> 15 menit)", points: 5 },
        { id: "v-r3", name: "Tidak memakai atribut seragam lengkap (dasi/topi/sabuk/kaos kaki)", points: 3 },
        { id: "v-r4", name: "Tidak membawa buku/perlengkapan belajar", points: 2 },
        { id: "v-r5", name: "Rambut tidak rapi / melebihi ketentuan sekolah", points: 5 },
        { id: "v-r6", name: "Makan di dalam kelas saat jam pembelajaran", points: 3 },
        { id: "v-r7", name: "Membuang sampah sembarangan di area sekolah", points: 4 }
      ]
    },
    {
      id: "cat-sedang",
      name: "SEDANG",
      description: "Pelanggaran kedisiplinan dan kepatuhan belajar",
      items: [
        { id: "v-s1", name: "Keluar kelas / meninggalkan pelajaran tanpa izin", points: 8 },
        { id: "v-s2", name: "Membolos (tidak masuk sekolah tanpa keterangan / cabut)", points: 15 },
        { id: "v-s3", name: "Mengganggu ketertiban kegiatan belajar mengajar", points: 8 },
        { id: "v-s4", name: "Bermain game / menggunakan HP tanpa izin saat pelajaran", points: 10 },
        { id: "v-s5", name: "Merokok / membawa vape di lingkungan sekolah", points: 25 },
        { id: "v-s6", name: "Berperilaku tidak sopan kepada guru / tenaga pendidik", points: 20 },
        { id: "v-s7", name: "Mencoret-coret fasilitas sekolah (vandalisme ringan)", points: 12 }
      ]
    },
    {
      id: "cat-berat",
      name: "BERAT",
      description: "Pelanggaran norma sosial, hukum, dan kekerasan",
      items: [
        { id: "v-b1", name: "Terlibat perkelahian / tawuran di dalam atau luar sekolah", points: 35 },
        { id: "v-b2", name: "Melakukan perundungan (bullying) fisik maupun verbal/daring", points: 30 },
        { id: "v-b3", name: "Membawa senjata tajam atau benda berbahaya", points: 50 },
        { id: "v-b4", name: "Mengambil barang orang lain (mencuri)", points: 40 },
        { id: "v-b5", name: "Merusak fasilitas sekolah secara sengaja", points: 30 },
        { id: "v-b6", name: "Membawa atau mengedarkan minuman keras / narkoba", points: 75 }
      ]
    }
  ],

  // Kategori Prestasi
  achievement_categories: [
    { id: "ach-cat-1", name: "Akademik", description: "Olimpiade, Sains, Matematika, Debat, Cerdas Cermat" },
    { id: "ach-cat-2", name: "Olahraga", description: "Futsal, Basket, Renang, Atletik, Bulutangkis, Bela Diri" },
    { id: "ach-cat-3", name: "Seni & Budaya", description: "Musik, Tari, Teater, Lukis, Paduan Suara, Desain Grafis" },
    { id: "ach-cat-4", name: "Keagamaan", description: "MTQ, Tahfidz, Kaligrafi, Lomba Keagamaan" },
    { id: "ach-cat-5", name: "Literasi & Bahasa", description: "Menulis Cerpen, Puisi, Pidato Bahasa Inggris/Indonesia" },
    { id: "ach-cat-6", name: "Teknologi & Robotik", description: "Koding, Robotika, Inovasi Teknologi, Web Design" },
    { id: "ach-cat-7", name: "Organisasi & Kepemimpinan", description: "Pramuka, PMR, Paskibra, OSIS" },
    { id: "ach-cat-8", name: "Lingkungan Hidup", description: "Adiwiyata, Duta Lingkungan, Green School" }
  ],

  // Data Contoh Pelanggaran
  violations: [
    {
      id: "vlt-01",
      studentId: "std-03", // Bagas Wicaksono
      studentName: "Bagas Wicaksono",
      studentNis: "26003",
      classId: "cls-7a",
      className: "Kelas 7A",
      categoryId: "cat-ringan",
      categoryName: "RINGAN",
      violationName: "Terlambat datang ke sekolah (> 15 menit)",
      points: 5,
      date: "2026-09-01",
      time: "07:25",
      chronology: "Siswa datang pukul 07:25, terlambat 25 menit karena ban sepeda bocor.",
      action: "Nasihat dan pembinaan ketepatan waktu",
      teacherId: "tch-1",
      teacherName: "Budi Santoso, S.Pd",
      evidenceUrl: "",
      status: "Selesai"
    },
    {
      id: "vlt-02",
      studentId: "std-03", // Bagas Wicaksono
      studentName: "Bagas Wicaksono",
      studentNis: "26003",
      classId: "cls-7a",
      className: "Kelas 7A",
      categoryId: "cat-ringan",
      categoryName: "RINGAN",
      violationName: "Tidak memakai atribut seragam lengkap (dasi/topi/sabuk/kaos kaki)",
      points: 3,
      date: "2026-09-03",
      time: "07:10",
      chronology: "Siswa tidak memakai ikat pinggang dan kaos kaki berwarna putih saat upacara.",
      action: "Teguran dan dicatat kartu kendali",
      teacherId: "tch-1",
      teacherName: "Budi Santoso, S.Pd",
      evidenceUrl: "",
      status: "Selesai"
    },
    {
      id: "vlt-03",
      studentId: "std-08", // Gilang Ramadhan
      studentName: "Gilang Ramadhan",
      studentNis: "25001",
      classId: "cls-8a",
      className: "Kelas 8A",
      categoryId: "cat-sedang",
      categoryName: "SEDANG",
      violationName: "Bermain game / menggunakan HP tanpa izin saat pelajaran",
      points: 10,
      date: "2026-09-02",
      time: "10:15",
      chronology: "Menggunakan telepon genggam untuk bermain game online saat pelajaran IPA sedang berlangsung.",
      action: "HP diamankan oleh guru piket dan dikembalikan saat pulang",
      teacherId: "tch-3",
      teacherName: "Ahmad Fauzi, S.Pd",
      evidenceUrl: "",
      status: "Selesai"
    },
    {
      id: "vlt-04",
      studentId: "std-14", // Muhammad Rizky
      studentName: "Muhammad Rizky",
      studentNis: "25007",
      classId: "cls-8b",
      className: "Kelas 8B",
      categoryId: "cat-sedang",
      categoryName: "SEDANG",
      violationName: "Membolos (tidak masuk sekolah tanpa keterangan / cabut)",
      points: 15,
      date: "2026-09-04",
      time: "09:30",
      chronology: "Keluar dari area sekolah saat istirahat pertama dan tidak kembali hingga jam kepulangan.",
      action: "Pemanggilan orang tua dan surat pernyataan",
      teacherId: "tch-5",
      teacherName: "Drs. Hendra Gunawan",
      evidenceUrl: "",
      status: "Tindak Lanjut BK"
    },
    {
      id: "vlt-05",
      studentId: "std-18", // Rian Hidayat
      studentName: "Rian Hidayat",
      studentNis: "24004",
      classId: "cls-9b",
      className: "Kelas 9B",
      categoryId: "cat-berat",
      categoryName: "BERAT",
      violationName: "Terlibat perkelahian / tawuran di dalam atau luar sekolah",
      points: 35,
      date: "2026-09-04",
      time: "14:15",
      chronology: "Terlibat perselisihan fisik di lapangan belakang sekolah setelah jam istirahat.",
      action: "Rujukan ke BK, Surat Peringatan 1, Konseling intensif",
      teacherId: "tch-5",
      teacherName: "Drs. Hendra Gunawan",
      evidenceUrl: "",
      status: "Proses Pembinaan"
    }
  ],

  // Data Contoh Prestasi
  achievements: [
    {
      id: "ach-01",
      studentId: "std-01", // Aditya Pratama
      studentName: "Aditya Pratama",
      studentNis: "26001",
      classId: "cls-7a",
      className: "Kelas 7A",
      title: "Juara 1 Olimpiade Matematika SMP Tingkat Kota",
      field: "Akademik",
      level: "Kabupaten/Kota",
      rank: "Juara 1",
      organizer: "Dinas Pendidikan Kota Cendekia",
      score: "98.5",
      date: "2026-08-20",
      description: "Meraih medali emas kategori aljabar dan geometri SMP.",
      certificateUrl: "",
      photoUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150",
      mentorTeacherId: "tch-1",
      mentorTeacherName: "Budi Santoso, S.Pd"
    },
    {
      id: "ach-02",
      studentId: "std-02", // Anisa Rahmawati
      studentName: "Anisa Rahmawati",
      studentNis: "26002",
      classId: "cls-7a",
      className: "Kelas 7A",
      title: "Juara 2 Lomba Pidato Bahasa Inggris (Storytelling)",
      field: "Literasi & Bahasa",
      level: "Provinsi",
      rank: "Juara 2",
      organizer: "Balai Bahasa Provinsi",
      score: "92.0",
      date: "2026-08-28",
      description: "Menampilkan cerita rakyat Nusantara dalam bahasa Inggris.",
      certificateUrl: "",
      photoUrl: "",
      mentorTeacherId: "tch-4",
      mentorTeacherName: "Nurul Hidayah, S.Si"
    },
    {
      id: "ach-03",
      studentId: "std-11", // Jessica Maharani
      studentName: "Jessica Maharani",
      studentNis: "25004",
      classId: "cls-8a",
      className: "Kelas 8A",
      title: "Juara 1 Lomba Cipta & Baca Puisi Kemerdekaan",
      field: "Seni & Budaya",
      level: "Kecamatan",
      rank: "Juara 1",
      organizer: "Kecamatan Cendekia Jaya",
      score: "95.0",
      date: "2026-08-16",
      description: "Membawakan puisi orisinil bertema Generasi Emas Bangsa.",
      certificateUrl: "",
      photoUrl: "",
      mentorTeacherId: "tch-2",
      mentorTeacherName: "Sri Wahyuni, M.Pd"
    },
    {
      id: "ach-04",
      studentId: "std-12", // Kevin Sanjaya
      studentName: "Kevin Sanjaya",
      studentNis: "25005",
      classId: "cls-8b",
      className: "Kelas 8B",
      title: "Medali Emas Kejuaraan Bulutangkis Pelajar O2SN",
      field: "Olahraga",
      level: "Kabupaten/Kota",
      rank: "Juara 1",
      organizer: "BAPOPSI Kabupaten",
      score: "21-18, 21-16",
      date: "2026-08-25",
      description: "Juara 1 nomor Tunggal Putra SMP se-Kabupaten.",
      certificateUrl: "",
      photoUrl: "",
      mentorTeacherId: "tch-3",
      mentorTeacherName: "Ahmad Fauzi, S.Pd"
    },
    {
      id: "ach-05",
      studentId: "std-15", // Nabila Syakieb
      studentName: "Nabila Syakieb",
      studentNis: "24001",
      classId: "cls-9a",
      className: "Kelas 9A",
      title: "Juara 1 Kompetisi Robotik & Koding Nasional",
      field: "Teknologi & Robotik",
      level: "Nasional",
      rank: "Juara 1",
      organizer: "Kementerian Pendidikan dan Sains",
      score: "99.0",
      date: "2026-08-10",
      description: "Membuat purwarupa Smart School Waste Sorting System berbasis AI.",
      certificateUrl: "",
      photoUrl: "",
      mentorTeacherId: "tch-3",
      mentorTeacherName: "Ahmad Fauzi, S.Pd"
    }
  ],

  // Data Contoh Keterlambatan
  lateness: [
    {
      id: "lt-01",
      studentId: "std-03",
      studentName: "Bagas Wicaksono",
      studentNis: "26003",
      classId: "cls-7a",
      className: "Kelas 7A",
      date: "2026-09-01",
      arrivalTime: "07:25",
      expectedTime: "07:00",
      minutesLate: 25,
      reason: "Ban sepeda kempes di jalan",
      teacherId: "tch-1",
      teacherName: "Budi Santoso, S.Pd"
    },
    {
      id: "lt-02",
      studentId: "std-05",
      studentName: "Dimas Arya Kusuma",
      studentNis: "26005",
      classId: "cls-7b",
      className: "Kelas 7B",
      date: "2026-09-02",
      arrivalTime: "07:18",
      expectedTime: "07:00",
      minutesLate: 18,
      reason: "Macet di perlintasan kereta",
      teacherId: "tch-2",
      teacherName: "Sri Wahyuni, M.Pd"
    },
    {
      id: "lt-03",
      studentId: "std-14",
      studentName: "Muhammad Rizky",
      studentNis: "25007",
      classId: "cls-8b",
      className: "Kelas 8B",
      date: "2026-09-03",
      arrivalTime: "07:30",
      expectedTime: "07:00",
      minutesLate: 30,
      reason: "Bangun kesiangan",
      teacherId: "tch-4",
      teacherName: "Nurul Hidayah, S.Si"
    }
  ],

  // Data Contoh Presensi Terakhir (multi-tanggal)
  attendance: [
    { id: "att-01", studentId: "std-01", classId: "cls-7a", date: "2026-09-04", status: "HADIR", subject: "Matematika", teacherName: "Budi Santoso, S.Pd", note: "" },
    { id: "att-02", studentId: "std-02", classId: "cls-7a", date: "2026-09-04", status: "HADIR", subject: "Matematika", teacherName: "Budi Santoso, S.Pd", note: "" },
    { id: "att-03", studentId: "std-03", classId: "cls-7a", date: "2026-09-04", status: "HADIR", subject: "Matematika", teacherName: "Budi Santoso, S.Pd", note: "" },
    { id: "att-04", studentId: "std-04", classId: "cls-7a", date: "2026-09-04", status: "SAKIT", subject: "Matematika", teacherName: "Budi Santoso, S.Pd", note: "Surat dokter terlampir" },
    { id: "att-05", studentId: "std-05", classId: "cls-7b", date: "2026-09-04", status: "HADIR", subject: "IPA", teacherName: "Ahmad Fauzi, S.Pd", note: "" },
    { id: "att-06", studentId: "std-06", classId: "cls-7b", date: "2026-09-04", status: "HADIR", subject: "IPA", teacherName: "Ahmad Fauzi, S.Pd", note: "" },
    { id: "att-07", studentId: "std-07", classId: "cls-7b", date: "2026-09-04", status: "IZIN", subject: "IPA", teacherName: "Ahmad Fauzi, S.Pd", note: "Acara keluarga penting" },
    { id: "att-08", studentId: "std-08", classId: "cls-8a", date: "2026-09-04", status: "HADIR", subject: "B. Indonesia", teacherName: "Sri Wahyuni, M.Pd", note: "" },
    { id: "att-09", studentId: "std-09", classId: "cls-8a", date: "2026-09-04", status: "HADIR", subject: "B. Indonesia", teacherName: "Sri Wahyuni, M.Pd", note: "" },
    { id: "att-10", studentId: "std-10", classId: "cls-8a", date: "2026-09-04", status: "HADIR", subject: "B. Indonesia", teacherName: "Sri Wahyuni, M.Pd", note: "" },
    { id: "att-11", studentId: "std-11", classId: "cls-8a", date: "2026-09-04", status: "HADIR", subject: "B. Indonesia", teacherName: "Sri Wahyuni, M.Pd", note: "" },
    { id: "att-12", studentId: "std-14", classId: "cls-8b", date: "2026-09-04", status: "ALPA", subject: "B. Inggris", teacherName: "Nurul Hidayah, S.Si", note: "Tidak ada keterangan" }
  ],

  // Log Aktivitas Sistem
  activity_logs: [
    { id: "log-1", userId: "usr-admin", userName: "Administrator Sistem", role: "admin", action: "LOGIN", target: "Sistem", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "log-2", userId: "usr-guru-1", userName: "Budi Santoso, S.Pd", role: "guru", action: "PRESENSI", target: "Kelas 7A", timestamp: new Date(Date.now() - 3000000).toISOString() },
    { id: "log-3", userId: "usr-guru-1", userName: "Budi Santoso, S.Pd", role: "guru", action: "CATAT_PELANGGARAN", target: "Bagas Wicaksono (Kelas 7A)", timestamp: new Date(Date.now() - 2400000).toISOString() },
    { id: "log-4", userId: "usr-admin", userName: "Administrator Sistem", role: "admin", action: "CATAT_PRESTASI", target: "Aditya Pratama (Juara 1 Olimpiade)", timestamp: new Date(Date.now() - 1800000).toISOString() }
  ],

  // Koleksi Akun Pengguna & Kredensial Login
  users: [
    {
      id: "usr-admin",
      username: "admin@sekolah.sch.id",
      email: "admin@sekolah.sch.id",
      name: "Administrator Utama",
      role: "admin",
      password: "admin123",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      passwordUpdatedAt: "2026-08-01",
      targetId: null
    },
    {
      id: "usr-tch-1",
      username: "budi.santoso@sekolah.sch.id",
      email: "budi.santoso@sekolah.sch.id",
      name: "Budi Santoso, S.Pd",
      nip: "198002142005011003",
      role: "wali_kelas",
      password: "wali123",
      status: "active",
      teacherId: "tch-1",
      assignedClass: "Kelas 7A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      passwordUpdatedAt: "2026-08-10"
    },
    {
      id: "usr-tch-2",
      username: "sri.wahyuni@sekolah.sch.id",
      email: "sri.wahyuni@sekolah.sch.id",
      name: "Sri Wahyuni, M.Pd",
      nip: "198406182008012004",
      role: "wali_kelas",
      password: "wali123",
      status: "active",
      teacherId: "tch-2",
      assignedClass: "Kelas 7B",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      passwordUpdatedAt: "2026-08-10"
    },
    {
      id: "usr-tch-3",
      username: "ahmad.fauzi@sekolah.sch.id",
      email: "ahmad.fauzi@sekolah.sch.id",
      name: "Ahmad Fauzi, S.Pd",
      nip: "198601202010011005",
      role: "wali_kelas",
      password: "wali123",
      status: "active",
      teacherId: "tch-3",
      assignedClass: "Kelas 8A",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
      passwordUpdatedAt: "2026-08-10"
    },
    {
      id: "usr-tch-4",
      username: "guru@sekolah.sch.id",
      email: "guru@sekolah.sch.id",
      name: "Nurul Hidayah, S.Si",
      nip: "199004112014022002",
      role: "guru",
      password: "guru123",
      status: "active",
      teacherId: "tch-4",
      assignedClass: "",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
      passwordUpdatedAt: "2026-08-10"
    },
    {
      id: "usr-tch-5",
      username: "hendra.gunawan@sekolah.sch.id",
      email: "hendra.gunawan@sekolah.sch.id",
      name: "Drs. Hendra Gunawan",
      nip: "197509151999031002",
      role: "wali_kelas",
      password: "wali123",
      status: "active",
      teacherId: "tch-5",
      assignedClass: "Kelas 9A",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      passwordUpdatedAt: "2026-08-10"
    },
    {
      id: "usr-std-01",
      username: "26001",
      email: "siswa@sekolah.sch.id",
      name: "Aditya Pratama",
      nis: "26001",
      nisn: "0091234501",
      role: "siswa",
      password: "siswa123",
      status: "active",
      studentId: "std-01",
      className: "Kelas 7A",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
      passwordUpdatedAt: "2026-08-15"
    },
    {
      id: "usr-std-02",
      username: "26002",
      email: "anisa@siswa.sekolah.sch.id",
      name: "Anisa Rahmawati",
      nis: "26002",
      nisn: "0091234502",
      role: "siswa",
      password: "siswa123",
      status: "active",
      studentId: "std-02",
      className: "Kelas 7A",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
      passwordUpdatedAt: "2026-08-15"
    },
    {
      id: "usr-std-03",
      username: "26003",
      email: "bagas@siswa.sekolah.sch.id",
      name: "Bagas Wicaksono",
      nis: "26003",
      nisn: "0091234503",
      role: "siswa",
      password: "siswa123",
      status: "active",
      studentId: "std-03",
      className: "Kelas 7A",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      passwordUpdatedAt: "2026-08-15"
    },
    {
      id: "usr-std-08",
      username: "25001",
      email: "gilang@siswa.sekolah.sch.id",
      name: "Gilang Ramadhan",
      nis: "25001",
      nisn: "0081234508",
      role: "siswa",
      password: "siswa123",
      status: "active",
      studentId: "std-08",
      className: "Kelas 8A",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100",
      passwordUpdatedAt: "2026-08-15"
    },
    {
      id: "usr-std-15",
      username: "24001",
      email: "nabila@siswa.sekolah.sch.id",
      name: "Nabila Syakieb",
      nis: "24001",
      nisn: "0071234515",
      role: "siswa",
      password: "siswa123",
      status: "active",
      studentId: "std-15",
      className: "Kelas 9A",
      avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100",
      passwordUpdatedAt: "2026-08-15"
    }
  ],

  // Akun Demo Pengguna untuk Uji Coba Cepat
  demo_users: [
    {
      id: "usr-admin",
      email: "admin@sekolah.sch.id",
      name: "Administrator Utama",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      targetId: null
    },
    {
      id: "usr-guru-1",
      email: "guru@sekolah.sch.id",
      name: "Nurul Hidayah, S.Si",
      role: "guru",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
      targetId: "tch-4"
    },
    {
      id: "usr-wali-1",
      email: "walikelas@sekolah.sch.id",
      name: "Budi Santoso, S.Pd",
      role: "wali_kelas",
      assignedClassId: "cls-7a",
      assignedClassName: "Kelas 7A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      targetId: "tch-1"
    },
    {
      id: "usr-siswa-1",
      email: "siswa@sekolah.sch.id",
      name: "Aditya Pratama",
      role: "siswa",
      studentId: "std-01",
      nis: "26001",
      classId: "cls-7a",
      className: "Kelas 7A",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
      targetId: "std-01"
    }
  ]
};
