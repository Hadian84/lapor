/**
 * SISWA SMART MONITORING - INDIVIDUAL STUDENT PROFILE CONTROLLER
 * Konsep Utama: "SATU SISWA = SATU PROFIL MONITORING"
 * Memuat rekap komprehensif kehadiran, keterlambatan, pelanggaran, poin, prestasi, grafik & riwayat aktivitas.
 */

import { DB } from './firebase-config.js';
import { getDisciplineStatus, calculateDisciplineScore, formatDate, openModal, closeModal, showToast } from './utils.js';

let currentStudent = null;

export async function initStudentProfilePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id') || 'std-01';

  currentStudent = await DB.getDoc('students', studentId);
  if (!currentStudent) {
    document.querySelector('.content-body').innerHTML = `
      <div class="card" style="padding: 3rem; text-align: center;">
        <i class="fa-solid fa-user-xmark" style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;"></i>
        <h2>Data Siswa Tidak Ditemukan</h2>
        <p class="text-muted">Siswa dengan ID tersebut tidak terdaftar di sistem.</p>
        <a href="siswa.html" class="btn btn-primary" style="margin-top: 1rem;">Kembali ke Data Siswa</a>
      </div>
    `;
    return;
  }

  // Ambil semua relasi data siswa
  const allViolations = await DB.getCollection('violations');
  const allAchievements = await DB.getCollection('achievements');
  const allAttendance = await DB.getCollection('attendance');
  const allLateness = await DB.getCollection('lateness');
  const allActivityLogs = await DB.getCollection('activity_logs');

  const studentViolations = allViolations.filter(v => v.studentId === studentId);
  const studentAchievements = allAchievements.filter(a => a.studentId === studentId);
  const studentAttendance = allAttendance.filter(a => a.studentId === studentId);
  const studentLateness = allLateness.filter(l => l.studentId === studentId);
  const studentLogs = allActivityLogs.filter(l => l.target && l.target.includes(currentStudent.name));

  // Render Identitas
  renderStudentIdentity(currentStudent);

  // Render Metrik Kehadiran & Kedisiplinan
  renderStudentMetrics(studentAttendance, studentLateness, studentViolations, studentAchievements);

  // Render Tabel Pelanggaran
  renderStudentViolationsTable(studentViolations);

  // Render Tabel Prestasi
  renderStudentAchievementsTable(studentAchievements);

  // Render Riwayat Aktivitas
  renderStudentActivityHistory(studentViolations, studentAchievements, studentLateness, studentLogs);

  // Inisialisasi Grafik
  renderProfileCharts(studentAttendance, studentViolations);

  // Tombol Cetak & Aksi Cepat
  document.getElementById('btn-print-profile')?.addEventListener('click', () => {
    window.print();
  });
}

function renderStudentIdentity(s) {
  document.getElementById('profile-name').textContent = s.name;
  document.getElementById('profile-nis').textContent = s.nis;
  document.getElementById('profile-nisn').textContent = s.nisn || '-';
  document.getElementById('profile-class').textContent = s.className;
  document.getElementById('profile-gender').textContent = s.gender === 'L' ? 'Laki-laki' : 'Perempuan';
  document.getElementById('profile-birth').textContent = `${s.birthPlace || '-'}, ${formatDate(s.birthDate)}`;
  document.getElementById('profile-address').textContent = s.address || '-';
  document.getElementById('profile-parent').textContent = `${s.parentName || '-'} (${s.parentPhone || '-'})`;
  
  const avatarEl = document.getElementById('profile-avatar-img');
  if (avatarEl) {
    avatarEl.src = s.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200';
  }
}

function renderStudentMetrics(att, late, viol, ach) {
  // Hitung total poin pelanggaran
  const totalPoints = viol.reduce((sum, v) => sum + (Number(v.points) || 0), 0);
  const discStatus = getDisciplineStatus(totalPoints);

  // Status badge
  const statusBadge = document.getElementById('profile-status-badge');
  if (statusBadge) {
    statusBadge.textContent = discStatus.label;
    statusBadge.className = `badge ${discStatus.badgeClass}`;
  }

  // Hitung persentase kehadiran
  const totalPresensi = att.length || 1;
  const hadirCount = att.filter(a => a.status === 'HADIR').length;
  const sakitCount = att.filter(a => a.status === 'SAKIT').length;
  const izinCount = att.filter(a => a.status === 'IZIN').length;
  const alpaCount = att.filter(a => a.status === 'ALPA').length;
  const attPct = Math.round((hadirCount / totalPresensi) * 100);

  // Skor Kedisiplinan 0-100
  const scoreObj = calculateDisciplineScore(attPct, late.length, totalPoints);

  document.getElementById('metric-score-value').textContent = scoreObj.score;
  document.getElementById('metric-score-category').textContent = scoreObj.category;
  document.getElementById('metric-score-category').style.color = scoreObj.color;

  document.getElementById('metric-total-points').textContent = totalPoints;
  document.getElementById('metric-total-violations').textContent = viol.length;
  document.getElementById('metric-total-achievements').textContent = ach.length;
  document.getElementById('metric-total-late').textContent = late.length;

  document.getElementById('metric-att-percentage').textContent = `${attPct}%`;
  document.getElementById('metric-att-hadir').textContent = hadirCount;
  document.getElementById('metric-att-sakit').textContent = sakitCount;
  document.getElementById('metric-att-izin').textContent = izinCount;
  document.getElementById('metric-att-alpa').textContent = alpaCount;
}

function renderStudentViolationsTable(violations) {
  const tbody = document.getElementById('student-violations-tbody');
  if (!tbody) return;

  if (!violations.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted" style="padding: 2rem;">
          <i class="fa-solid fa-circle-check text-success" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
          Siswa belum memiliki catatan pelanggaran.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = violations.map((v, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>${formatDate(v.date)} <div class="text-muted text-xs">${v.time || '-'}</div></td>
      <td>
        <strong>${v.violationName}</strong>
        <div class="text-muted text-xs">${v.chronology || '-'}</div>
      </td>
      <td><span class="badge ${v.categoryName === 'BERAT' ? 'badge-danger' : v.categoryName === 'SEDANG' ? 'badge-warning' : 'badge-primary'}">${v.categoryName || 'RINGAN'}</span></td>
      <td><span class="badge badge-danger">+${v.points} Poin</span></td>
      <td>
        <div><strong>${v.action || 'Teguran'}</strong></div>
        <div class="text-muted text-xs">Pencatat: ${v.teacherName || '-'}</div>
      </td>
    </tr>
  `).join('');
}

function renderStudentAchievementsTable(achievements) {
  const tbody = document.getElementById('student-achievements-tbody');
  if (!tbody) return;

  if (!achievements.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted" style="padding: 2rem;">
          <i class="fa-solid fa-award empty-state-icon" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
          Belum ada catatan prestasi untuk siswa ini.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = achievements.map((a, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>${formatDate(a.date)}</td>
      <td>
        <strong>${a.title}</strong>
        <div class="text-muted text-xs">${a.description || '-'}</div>
      </td>
      <td><span class="badge badge-primary">${a.field}</span></td>
      <td><span class="badge badge-success">${a.rank} (${a.level})</span></td>
      <td class="text-muted text-xs">${a.organizer || '-'}</td>
    </tr>
  `).join('');
}

function renderStudentActivityHistory(viol, ach, late, logs) {
  const list = document.getElementById('student-activity-timeline');
  if (!list) return;

  // Gabungkan riwayat dalam satu timeline berurutan tanggal
  const events = [];

  viol.forEach(v => {
    events.push({
      date: v.date,
      time: v.time || '08:00',
      type: 'violation',
      title: `Pelanggaran: ${v.violationName}`,
      desc: `Poin: +${v.points} | Tindak Lanjut: ${v.action} (Pencatat: ${v.teacherName})`
    });
  });

  ach.forEach(a => {
    events.push({
      date: a.date,
      time: '10:00',
      type: 'achievement',
      title: `Prestasi: ${a.title}`,
      desc: `${a.rank} Tingkat ${a.level} diselenggarakan oleh ${a.organizer}`
    });
  });

  late.forEach(l => {
    events.push({
      date: l.date,
      time: l.arrivalTime || '07:20',
      type: 'attendance',
      title: `Terlambat ${l.minutesLate} Menit`,
      desc: `Alasan: ${l.reason} (Guru: ${l.teacherName})`
    });
  });

  // Urutkan dari yang terbaru
  events.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  if (!events.length) {
    list.innerHTML = `<li class="text-muted text-sm" style="padding: 1rem;">Belum ada riwayat aktivitas kedisiplinan tercatat.</li>`;
    return;
  }

  list.innerHTML = events.map(e => `
    <li class="activity-item ${e.type}">
      <div class="activity-dot">
        <i class="fa-solid ${e.type === 'violation' ? 'fa-triangle-exclamation' : e.type === 'achievement' ? 'fa-trophy' : 'fa-clock'}"></i>
      </div>
      <div class="activity-text">
        <strong>${e.title}</strong>
        <div>${e.desc}</div>
      </div>
      <div class="activity-time">${formatDate(e.date)} - ${e.time} WIB</div>
    </li>
  `).join('');
}

function renderProfileCharts(att, viol) {
  if (typeof Chart === 'undefined') return;

  // Chart Kehadiran Siswa
  const ctxAtt = document.getElementById('chartStudentAttendance');
  if (ctxAtt) {
    new Chart(ctxAtt, {
      type: 'doughnut',
      data: {
        labels: ['Hadir', 'Sakit', 'Izin', 'Alpa'],
        datasets: [{
          data: [18, 1, 1, 0],
          backgroundColor: ['#16a34a', '#0284c7', '#d97706', '#dc2626'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Chart Perkembangan Poin
  const ctxPts = document.getElementById('chartStudentPointsTrend');
  if (ctxPts) {
    new Chart(ctxPts, {
      type: 'bar',
      data: {
        labels: ['Juli', 'Agustus', 'September'],
        datasets: [{
          label: 'Poin Pelanggaran',
          data: [0, 5, 8],
          backgroundColor: '#ef4444',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 20 } }
      }
    });
  }
}
