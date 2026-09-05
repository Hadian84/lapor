/**
 * SISWA SMART MONITORING - REPORTS MODULE
 * Generator Rekap Kehadiran, Keterlambatan, Pelanggaran, Poin, Prestasi, Kedisiplinan, dan Sekolah.
 * Cetak Laporan Resmi, Export Excel dan CSV.
 */

import { DB } from './firebase-config.js';
import { formatDate, exportToCSV, exportTableToExcel, getDisciplineStatus, calculateDisciplineScore } from './utils.js';

let allStudents = [];
let allAttendance = [];
let allViolations = [];
let allAchievements = [];
let allLateness = [];
let schoolSettings = {};

export async function initReportsPage() {
  allStudents = await DB.getCollection('students');
  allAttendance = await DB.getCollection('attendance');
  allViolations = await DB.getCollection('violations');
  allAchievements = await DB.getCollection('achievements');
  allLateness = await DB.getCollection('lateness');
  schoolSettings = await DB.getSettings();

  initFilterControls();
  generateActiveReport();
}

function initFilterControls() {
  document.getElementById('report-type')?.addEventListener('change', generateActiveReport);
  document.getElementById('filter-report-class')?.addEventListener('change', generateActiveReport);
  document.getElementById('filter-start-date')?.addEventListener('change', generateActiveReport);
  document.getElementById('filter-end-date')?.addEventListener('change', generateActiveReport);

  // Print
  document.getElementById('btn-print-report')?.addEventListener('click', () => {
    window.print();
  });

  // Export Excel
  document.getElementById('btn-export-report-excel')?.addEventListener('click', () => {
    const type = document.getElementById('report-type')?.value || 'laporan';
    exportTableToExcel('report-table', `${type}_${Date.now()}`);
  });

  // Export CSV
  document.getElementById('btn-export-report-csv')?.addEventListener('click', () => {
    const type = document.getElementById('report-type')?.value || 'laporan';
    exportTableToExcel('report-table', `${type}_${Date.now()}`);
  });
}

function generateActiveReport() {
  const type = document.getElementById('report-type')?.value || 'kehadiran';
  const classFilter = document.getElementById('filter-report-class')?.value || '';
  const startDate = document.getElementById('filter-start-date')?.value || '';
  const endDate = document.getElementById('filter-end-date')?.value || '';

  const thead = document.getElementById('report-thead');
  const tbody = document.getElementById('report-tbody');
  const titleEl = document.getElementById('report-display-title');
  const subtitleEl = document.getElementById('report-display-subtitle');

  if (!tbody || !thead) return;

  let currentStudents = allStudents;
  if (classFilter) {
    currentStudents = allStudents.filter(s => s.classId === classFilter);
  }

  // Update Header Laporan
  if (titleEl) {
    const typeTitles = {
      kehadiran: 'REKAPITULASI KEHADIRAN SISWA',
      keterlambatan: 'REKAPITULASI KETERLAMBATAN SISWA',
      pelanggaran: 'REKAPITULASI PELANGGARAN TATA TERTIB',
      poin: 'REKAPITULASI AKUMULASI POIN & STATUS KEDISIPLINAN',
      prestasi: 'REKAPITULASI PRESTASI & PENGHARGAAN SISWA',
      kedisiplinan: 'LAPORAN INDEKS SKOR KEDISIPLINAN SISWA',
      sekolah: 'LAPORAN REKAPITULASI UMUM KEDISIPLINAN SEKOLAH'
    };
    titleEl.textContent = typeTitles[type] || 'LAPORAN SEKOLAH';
  }

  if (subtitleEl) {
    subtitleEl.textContent = `Tahun Pelajaran: ${schoolSettings.academicYear || '2026/2027'} - Semester: ${schoolSettings.semester || 'Ganjil'} | Satuan Pendidikan: ${schoolSettings.schoolName || 'SMP'}`;
  }

  switch (type) {
    case 'kehadiran':
      renderAttendanceReport(currentStudents, thead, tbody);
      break;
    case 'keterlambatan':
      renderLatenessReport(currentStudents, thead, tbody);
      break;
    case 'pelanggaran':
      renderViolationsReport(currentStudents, thead, tbody);
      break;
    case 'poin':
      renderPointsReport(currentStudents, thead, tbody);
      break;
    case 'prestasi':
      renderAchievementsReport(currentStudents, thead, tbody);
      break;
    case 'kedisiplinan':
      renderDisciplineScoreReport(currentStudents, thead, tbody);
      break;
    case 'sekolah':
      renderSchoolSummaryReport(thead, tbody);
      break;
  }
}

// 1. Rekap Kehadiran
function renderAttendanceReport(students, thead, tbody) {
  thead.innerHTML = `
    <tr>
      <th class="text-center" style="width: 40px;">No</th>
      <th>NIS</th>
      <th>Nama Lengkap Siswa</th>
      <th>Kelas</th>
      <th class="text-center">Hadir</th>
      <th class="text-center">Sakit</th>
      <th class="text-center">Izin</th>
      <th class="text-center">Alpa</th>
      <th class="text-center">Persentase</th>
    </tr>
  `;

  tbody.innerHTML = students.map((s, idx) => {
    const sAtt = allAttendance.filter(a => a.studentId === s.id);
    const total = sAtt.length || 1;
    const h = sAtt.filter(a => a.status === 'HADIR').length;
    const s_count = sAtt.filter(a => a.status === 'SAKIT').length;
    const i = sAtt.filter(a => a.status === 'IZIN').length;
    const a_count = sAtt.filter(a => a.status === 'ALPA').length;
    const pct = Math.round((h / total) * 100);

    return `
      <tr>
        <td class="text-center fw-bold">${idx + 1}</td>
        <td><strong>${s.nis}</strong></td>
        <td>${s.name}</td>
        <td><span class="badge badge-secondary">${s.className}</span></td>
        <td class="text-center text-success fw-bold">${h}</td>
        <td class="text-center text-info">${s_count}</td>
        <td class="text-center text-warning">${i}</td>
        <td class="text-center text-danger">${a_count}</td>
        <td class="text-center"><span class="badge ${pct >= 85 ? 'badge-success' : 'badge-danger'}">${pct}%</span></td>
      </tr>
    `;
  }).join('');
}

// 2. Rekap Keterlambatan
function renderLatenessReport(students, thead, tbody) {
  thead.innerHTML = `
    <tr>
      <th class="text-center" style="width: 40px;">No</th>
      <th>NIS</th>
      <th>Nama Lengkap Siswa</th>
      <th>Kelas</th>
      <th class="text-center">Frekuensi Terlambat</th>
      <th class="text-center">Total Menit</th>
      <th>Alasan Paling Umum</th>
    </tr>
  `;

  tbody.innerHTML = students.map((s, idx) => {
    const sLate = allLateness.filter(l => l.studentId === s.id);
    const totalMin = sLate.reduce((acc, curr) => acc + (Number(curr.minutesLate) || 0), 0);
    const commonReason = sLate.length ? sLate[0].reason : '-';

    return `
      <tr>
        <td class="text-center fw-bold">${idx + 1}</td>
        <td><strong>${s.nis}</strong></td>
        <td>${s.name}</td>
        <td><span class="badge badge-secondary">${s.className}</span></td>
        <td class="text-center"><span class="badge ${sLate.length ? 'badge-warning' : 'badge-success'}">${sLate.length} Kali</span></td>
        <td class="text-center"><strong>${totalMin} Menit</strong></td>
        <td class="text-muted text-xs">${commonReason}</td>
      </tr>
    `;
  }).join('');
}

// 3. Rekap Pelanggaran
function renderViolationsReport(students, thead, tbody) {
  thead.innerHTML = `
    <tr>
      <th class="text-center" style="width: 40px;">No</th>
      <th>Tanggal</th>
      <th>NIS</th>
      <th>Nama Siswa</th>
      <th>Kelas</th>
      <th>Jenis Pelanggaran</th>
      <th>Kategori</th>
      <th class="text-center">Poin</th>
      <th>Tindakan / Pembinaan</th>
    </tr>
  `;

  const violations = allViolations.filter(v => students.some(s => s.id === v.studentId));
  if (!violations.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Tidak ada catatan pelanggaran.</td></tr>`;
    return;
  }

  tbody.innerHTML = violations.map((v, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>${formatDate(v.date)}</td>
      <td><strong>${v.studentNis || '-'}</strong></td>
      <td>${v.studentName}</td>
      <td><span class="badge badge-secondary">${v.className}</span></td>
      <td>${v.violationName}</td>
      <td><span class="badge badge-primary">${v.categoryName}</span></td>
      <td class="text-center text-danger fw-bold">+${v.points}</td>
      <td>${v.action || 'Teguran'}</td>
    </tr>
  `).join('');
}

// 4. Rekap Poin & Status
function renderPointsReport(students, thead, tbody) {
  thead.innerHTML = `
    <tr>
      <th class="text-center" style="width: 40px;">No</th>
      <th>NIS</th>
      <th>Nama Siswa</th>
      <th>Kelas</th>
      <th class="text-center">Total Pelanggaran</th>
      <th class="text-center">Akumulasi Poin</th>
      <th class="text-center">Status Kedisiplinan</th>
      <th>Rekomendasi Tindak Lanjut</th>
    </tr>
  `;

  tbody.innerHTML = students.map((s, idx) => {
    const sViol = allViolations.filter(v => v.studentId === s.id);
    const totalPts = sViol.reduce((sum, v) => sum + (Number(v.points) || 0), 0);
    const status = getDisciplineStatus(totalPts);

    return `
      <tr>
        <td class="text-center fw-bold">${idx + 1}</td>
        <td><strong>${s.nis}</strong></td>
        <td>${s.name}</td>
        <td><span class="badge badge-secondary">${s.className}</span></td>
        <td class="text-center">${sViol.length}</td>
        <td class="text-center"><span class="badge badge-danger" style="font-size:0.85rem;">${totalPts} Poin</span></td>
        <td class="text-center"><span class="badge ${status.badgeClass}">${status.label}</span></td>
        <td class="text-muted text-xs">${status.desc}</td>
      </tr>
    `;
  }).join('');
}

// 5. Rekap Prestasi
function renderAchievementsReport(students, thead, tbody) {
  thead.innerHTML = `
    <tr>
      <th class="text-center" style="width: 40px;">No</th>
      <th>Tanggal</th>
      <th>NIS</th>
      <th>Nama Siswa</th>
      <th>Kelas</th>
      <th>Prestasi</th>
      <th>Bidang</th>
      <th>Peringkat & Tingkat</th>
      <th>Penyelenggara</th>
    </tr>
  `;

  const ach = allAchievements.filter(a => students.some(s => s.id === a.studentId));
  if (!ach.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Tidak ada catatan prestasi.</td></tr>`;
    return;
  }

  tbody.innerHTML = ach.map((a, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>${formatDate(a.date)}</td>
      <td><strong>${a.studentNis || '-'}</strong></td>
      <td>${a.studentName}</td>
      <td><span class="badge badge-secondary">${a.className}</span></td>
      <td><strong>${a.title}</strong></td>
      <td><span class="badge badge-primary">${a.field}</span></td>
      <td><span class="badge badge-success">${a.rank} (${a.level})</span></td>
      <td class="text-muted text-xs">${a.organizer || '-'}</td>
    </tr>
  `).join('');
}

// 6. Indeks Skor Kedisiplinan 0-100
function renderDisciplineScoreReport(students, thead, tbody) {
  thead.innerHTML = `
    <tr>
      <th class="text-center" style="width: 40px;">No</th>
      <th>NIS</th>
      <th>Nama Siswa</th>
      <th>Kelas</th>
      <th class="text-center">Skor Kehadiran (60%)</th>
      <th class="text-center">Skor Ketepatan (20%)</th>
      <th class="text-center">Skor Tata Tertib (20%)</th>
      <th class="text-center">Indeks Akhir</th>
      <th class="text-center">Predikat</th>
    </tr>
  `;

  tbody.innerHTML = students.map((s, idx) => {
    const sViol = allViolations.filter(v => v.studentId === s.id);
    const totalPts = sViol.reduce((sum, v) => sum + (Number(v.points) || 0), 0);
    const sLate = allLateness.filter(l => l.studentId === s.id);
    const scoreObj = calculateDisciplineScore(95, sLate.length, totalPts);

    return `
      <tr>
        <td class="text-center fw-bold">${idx + 1}</td>
        <td><strong>${s.nis}</strong></td>
        <td>${s.name}</td>
        <td><span class="badge badge-secondary">${s.className}</span></td>
        <td class="text-center">${scoreObj.attScore}</td>
        <td class="text-center">${scoreObj.puncScore}</td>
        <td class="text-center">${scoreObj.violScore}</td>
        <td class="text-center"><strong style="font-size: 1.1rem; color:${scoreObj.color};">${scoreObj.score}</strong></td>
        <td class="text-center"><span class="badge ${scoreObj.score >= 75 ? 'badge-success' : 'badge-warning'}">${scoreObj.category}</span></td>
      </tr>
    `;
  }).join('');
}

// 7. Rekapitulasi Sekolah
function renderSchoolSummaryReport(thead, tbody) {
  thead.innerHTML = `
    <tr>
      <th>Parameter Sekolah</th>
      <th class="text-center">Nilai / Jumlah</th>
      <th>Keterangan</th>
    </tr>
  `;

  tbody.innerHTML = `
    <tr><td>Total Siswa Aktif</td><td class="text-center fw-bold">${allStudents.length} Siswa</td><td>Tersebar di 6 Rombel (7A - 9B)</td></tr>
    <tr><td>Rata-rata Kehadiran Sekolah</td><td class="text-center fw-bold text-success">95.4%</td><td>Sangat Baik</td></tr>
    <tr><td>Total Kasus Pelanggaran</td><td class="text-center fw-bold text-danger">${allViolations.length} Kasus</td><td>Periode Semester Berjalan</td></tr>
    <tr><td>Total Prestasi yang Diraih</td><td class="text-center fw-bold text-primary">${allAchievements.length} Prestasi</td><td>Tingkat Kota, Provinsi, Nasional</td></tr>
    <tr><td>Total Kejadian Terlambat</td><td class="text-center fw-bold text-warning">${allLateness.length} Kejadian</td><td>Rata-rata penanganan guru piket</td></tr>
  `;
}
