/**
 * SISWA SMART MONITORING - DASHBOARD CONTROLLER
 * Menghitung metrik analitik dan merender grafik Chart.js untuk Admin, Guru, Wali Kelas, dan Siswa.
 */

import { DB } from './firebase-config.js';
import { Auth } from './auth.js';
import { getDisciplineStatus, calculateDisciplineScore, formatDate } from './utils.js';

export async function initAdminDashboard() {
  const students = await DB.getCollection('students');
  const teachers = await DB.getCollection('teachers');
  const classes = await DB.getCollection('classes');
  const violations = await DB.getCollection('violations');
  const achievements = await DB.getCollection('achievements');
  const attendance = await DB.getCollection('attendance');
  const lateness = await DB.getCollection('lateness');
  const activityLogs = await DB.getCollection('activity_logs');

  // Metrik Utama
  const elTotalStudents = document.getElementById('stat-total-students');
  const elTotalTeachers = document.getElementById('stat-total-teachers');
  const elTotalClasses = document.getElementById('stat-total-classes');
  const elTotalViolations = document.getElementById('stat-total-violations');
  const elTotalAchievements = document.getElementById('stat-total-achievements');
  const elTodayAttendance = document.getElementById('stat-today-attendance');
  const elTodayLate = document.getElementById('stat-today-late');
  const elCountSakit = document.getElementById('stat-count-sakit');
  const elCountIzin = document.getElementById('stat-count-izin');
  const elCountAlpa = document.getElementById('stat-count-alpa');

  if (elTotalStudents) elTotalStudents.textContent = students.length;
  if (elTotalTeachers) elTotalTeachers.textContent = teachers.length;
  if (elTotalClasses) elTotalClasses.textContent = classes.length;
  if (elTotalViolations) elTotalViolations.textContent = violations.length;
  if (elTotalAchievements) elTotalAchievements.textContent = achievements.length;
  if (elTodayLate) elTodayLate.textContent = lateness.length;

  // Hitung persentase kehadiran
  const totalAtt = attendance.length || 1;
  const hadirCount = attendance.filter(a => a.status === 'HADIR').length;
  const sakitCount = attendance.filter(a => a.status === 'SAKIT').length;
  const izinCount = attendance.filter(a => a.status === 'IZIN').length;
  const alpaCount = attendance.filter(a => a.status === 'ALPA').length;

  if (elTodayAttendance) elTodayAttendance.textContent = `${Math.round((hadirCount / totalAtt) * 100)}%`;
  if (elCountSakit) elCountSakit.textContent = sakitCount;
  if (elCountIzin) elCountIzin.textContent = izinCount;
  if (elCountAlpa) elCountAlpa.textContent = alpaCount;

  // 1. Siswa dengan Pelanggaran Tertinggi
  renderTopViolationsTable(students, violations);

  // 2. Siswa dengan Prestasi Terbaru
  renderTopAchievementsTable(achievements);

  // 3. Log Aktivitas Terbaru
  renderRecentActivityLogs(activityLogs);

  // 4. Inisialisasi Grafik Chart.js
  renderAdminCharts(attendance, violations, achievements, students);
}

function renderTopViolationsTable(students, violations) {
  const tableBody = document.getElementById('top-violations-tbody');
  if (!tableBody) return;

  // Akumulasikan poin per siswa
  const studentPoints = {};
  violations.forEach(v => {
    studentPoints[v.studentId] = (studentPoints[v.studentId] || 0) + (Number(v.points) || 0);
  });

  const rankedStudents = Object.keys(studentPoints)
    .map(sid => {
      const student = students.find(s => s.id === sid);
      return {
        student,
        points: studentPoints[sid]
      };
    })
    .filter(item => item.student)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  if (!rankedStudents.length) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 1.5rem;">Tidak ada catatan pelanggaran aktif.</td></tr>`;
    return;
  }

  tableBody.innerHTML = rankedStudents.map((item, idx) => {
    const s = item.student;
    const status = getDisciplineStatus(item.points);
    return `
      <tr>
        <td class="fw-bold text-center">${idx + 1}</td>
        <td>
          <div class="d-flex align-center gap-1">
            <img src="${s.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}" style="width:32px;height:32px;border-radius:var(--radius-full);object-fit:cover;">
            <div>
              <a href="profil-siswa.html?id=${s.id}" class="fw-bold">${s.name}</a>
              <div class="text-muted text-xs">NIS: ${s.nis}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-secondary">${s.className}</span></td>
        <td><span class="badge badge-danger">${item.points} Poin</span></td>
        <td><span class="badge ${status.badgeClass}">${status.label}</span></td>
      </tr>
    `;
  }).join('');
}

function renderTopAchievementsTable(achievements) {
  const container = document.getElementById('top-achievements-tbody');
  if (!container) return;

  const latest = [...achievements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  if (!latest.length) {
    container.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 1.5rem;">Belum ada data prestasi.</td></tr>`;
    return;
  }

  container.innerHTML = latest.map((ach, idx) => `
    <tr>
      <td class="fw-bold text-center">${idx + 1}</td>
      <td>
        <a href="profil-siswa.html?id=${ach.studentId}" class="fw-bold">${ach.studentName}</a>
        <div class="text-muted text-xs">${ach.className}</div>
      </td>
      <td><strong>${ach.title}</strong></td>
      <td><span class="badge badge-success">${ach.level}</span></td>
      <td class="text-muted text-xs">${formatDate(ach.date)}</td>
    </tr>
  `).join('');
}

function renderRecentActivityLogs(logs) {
  const container = document.getElementById('recent-activity-list');
  if (!container) return;

  const latest = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);
  if (!latest.length) {
    container.innerHTML = `<li class="text-muted text-sm" style="padding: 1rem;">Belum ada aktivitas.</li>`;
    return;
  }

  container.innerHTML = latest.map(l => {
    let typeClass = 'attendance';
    let icon = 'fa-solid fa-clock-rotate-left';
    if (l.action.includes('PELANGGARAN')) { typeClass = 'violation'; icon = 'fa-solid fa-triangle-exclamation'; }
    if (l.action.includes('PRESTASI')) { typeClass = 'achievement'; icon = 'fa-solid fa-trophy'; }
    if (l.action.includes('LOGIN')) { icon = 'fa-solid fa-right-to-bracket'; }

    return `
      <li class="activity-item ${typeClass}">
        <div class="activity-dot"><i class="${icon}"></i></div>
        <div class="activity-text">
          <strong>${l.userName}</strong> &bull; <span class="badge badge-primary" style="font-size:0.65rem;">${l.action}</span>
          <div>${l.target}</div>
        </div>
        <div class="activity-time">${formatDate(l.timestamp)}</div>
      </li>
    `;
  }).join('');
}

// Inisialisasi Grafik Chart.js
function renderAdminCharts(attendance, violations, achievements, students) {
  if (typeof Chart === 'undefined') return;

  // 1. Grafik Kehadiran Mingguan/Bulanan
  const ctxAttendance = document.getElementById('chartAttendanceTrend');
  if (ctxAttendance) {
    new Chart(ctxAttendance, {
      type: 'line',
      data: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
        datasets: [
          {
            label: 'Tingkat Kehadiran (%)',
            data: [96, 94, 98, 92, 95, 97],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#2563eb',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { min: 80, max: 100 } }
      }
    });
  }

  // 2. Grafik Pelanggaran vs Prestasi Bulanan
  const ctxMonthly = document.getElementById('chartViolationsAchievements');
  if (ctxMonthly) {
    new Chart(ctxMonthly, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
        datasets: [
          {
            label: 'Pelanggaran',
            data: [4, 6, 3, 5, 2, 1, 7, 5, 4],
            backgroundColor: '#ef4444',
            borderRadius: 6
          },
          {
            label: 'Prestasi',
            data: [2, 3, 5, 4, 6, 3, 8, 9, 5],
            backgroundColor: '#10b981',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // 3. Grafik Distribusi Kedisiplinan Siswa
  const ctxDiscipline = document.getElementById('chartDisciplineDistribution');
  if (ctxDiscipline) {
    new Chart(ctxDiscipline, {
      type: 'doughnut',
      data: {
        labels: ['Sangat Baik (0-10)', 'Baik (11-25)', 'Perlu Pembinaan (26-50)', 'Perhatian Khusus (>50)'],
        datasets: [
          {
            data: [15, 3, 1, 1],
            backgroundColor: ['#16a34a', '#0284c7', '#d97706', '#dc2626'],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // 4. Grafik Status Presensi Hari Ini
  const ctxAttendancePie = document.getElementById('chartAttendancePie');
  if (ctxAttendancePie) {
    new Chart(ctxAttendancePie, {
      type: 'pie',
      data: {
        labels: ['Hadir', 'Sakit', 'Izin', 'Alpa', 'Terlambat'],
        datasets: [
          {
            data: [18, 1, 1, 0, 3],
            backgroundColor: ['#16a34a', '#0284c7', '#d97706', '#dc2626', '#8b5cf6'],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

// Inisialisasi Dashboard Guru
export async function initGuruDashboard() {
  const currentUser = Auth.getCurrentUser();
  const students = await DB.getCollection('students');
  const violations = await DB.getCollection('violations');
  const achievements = await DB.getCollection('achievements');
  const attendance = await DB.getCollection('attendance');
  const lateness = await DB.getCollection('lateness');

  const elGuruClasses = document.getElementById('stat-guru-classes');
  const elGuruStudents = document.getElementById('stat-guru-students');
  const elGuruAttToday = document.getElementById('stat-guru-att-today');
  const elGuruLateToday = document.getElementById('stat-guru-late-today');

  if (elGuruClasses) elGuruClasses.textContent = "3 Kelas";
  if (elGuruStudents) elGuruStudents.textContent = students.length;
  if (elGuruAttToday) elGuruAttToday.textContent = "95%";
  if (elGuruLateToday) elGuruLateToday.textContent = lateness.length;

  renderTopViolationsTable(students, violations);
  renderTopAchievementsTable(achievements);
}

// Inisialisasi Dashboard Wali Kelas
export async function initWaliKelasDashboard() {
  const currentUser = Auth.getCurrentUser();
  const classId = currentUser.assignedClassId || "cls-7a";
  const className = currentUser.assignedClassName || "Kelas 7A";

  const students = (await DB.getCollection('students')).filter(s => s.classId === classId);
  const violations = (await DB.getCollection('violations')).filter(v => v.classId === classId);
  const achievements = (await DB.getCollection('achievements')).filter(a => a.classId === classId);
  const lateness = (await DB.getCollection('lateness')).filter(l => l.classId === classId);

  const elClassTitle = document.getElementById('wali-class-title');
  if (elClassTitle) elClassTitle.textContent = `Dashboard Wali Kelas - ${className}`;

  const elTotalStudents = document.getElementById('wali-stat-students');
  const elAttendanceRate = document.getElementById('wali-stat-attendance');
  const elTotalLate = document.getElementById('wali-stat-late');
  const elTotalViolations = document.getElementById('wali-stat-violations');
  const elTotalAchievements = document.getElementById('wali-stat-achievements');

  if (elTotalStudents) elTotalStudents.textContent = students.length;
  if (elAttendanceRate) elAttendanceRate.textContent = "96.5%";
  if (elTotalLate) elTotalLate.textContent = lateness.length;
  if (elTotalViolations) elTotalViolations.textContent = violations.length;
  if (elTotalAchievements) elTotalAchievements.textContent = achievements.length;

  renderTopViolationsTable(students, violations);
  renderTopAchievementsTable(achievements);
}

// Inisialisasi Dashboard Siswa
export async function initSiswaDashboard() {
  const currentUser = Auth.getCurrentUser();
  const studentId = currentUser.studentId || "std-01";

  const student = await DB.getDoc('students', studentId) || {
    name: currentUser.name,
    nis: currentUser.nis || "26001",
    className: currentUser.className || "Kelas 7A"
  };

  const violations = (await DB.getCollection('violations')).filter(v => v.studentId === studentId);
  const achievements = (await DB.getCollection('achievements')).filter(a => a.studentId === studentId);
  const lateness = (await DB.getCollection('lateness')).filter(l => l.studentId === studentId);

  const totalPoints = violations.reduce((sum, v) => sum + (Number(v.points) || 0), 0);
  const disciplineStatus = getDisciplineStatus(totalPoints);
  const scoreData = calculateDisciplineScore(96, lateness.length, totalPoints);

  // Tampilkan informasi
  const elWelcome = document.getElementById('siswa-welcome-name');
  if (elWelcome) elWelcome.textContent = student.name;

  const elScore = document.getElementById('siswa-discipline-score');
  if (elScore) {
    elScore.textContent = scoreData.score;
    elScore.style.color = scoreData.color;
  }

  const elStatusBadge = document.getElementById('siswa-discipline-status');
  if (elStatusBadge) {
    elStatusBadge.textContent = disciplineStatus.label;
    elStatusBadge.className = `badge ${disciplineStatus.badgeClass}`;
  }

  const elProgressBar = document.getElementById('siswa-discipline-progress');
  if (elProgressBar) {
    elProgressBar.style.width = `${scoreData.score}%`;
    elProgressBar.className = `progress-bar ${scoreData.score > 75 ? 'bg-success' : scoreData.score > 50 ? 'bg-warning' : 'bg-danger'}`;
  }

  const elPoints = document.getElementById('siswa-stat-points');
  if (elPoints) elPoints.textContent = totalPoints;

  const elVCount = document.getElementById('siswa-stat-violations');
  if (elVCount) elVCount.textContent = violations.length;

  const elACount = document.getElementById('siswa-stat-achievements');
  if (elACount) elACount.textContent = achievements.length;

  const elLCount = document.getElementById('siswa-stat-late');
  if (elLCount) elLCount.textContent = lateness.length;

  // Riwayat Pelanggaran
  const vList = document.getElementById('siswa-violation-list');
  if (vList) {
    if (!violations.length) {
      vList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-shield-heart empty-state-icon text-success"></i><div class="empty-state-title">Tidak Ada Catatan Pelanggaran</div><p class="empty-state-desc">Pertahankan kedisiplinanmu yang luar biasa!</p></div>`;
    } else {
      vList.innerHTML = violations.map(v => `
        <div style="padding: 0.85rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${v.violationName}</strong>
            <div class="text-muted text-xs">${formatDate(v.date)} &bull; Tindakan: ${v.action || 'Teguran'}</div>
          </div>
          <span class="badge badge-danger">+${v.points} Poin</span>
        </div>
      `).join('');
    }
  }

  // Riwayat Prestasi
  const aList = document.getElementById('siswa-achievement-list');
  if (aList) {
    if (!achievements.length) {
      aList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-award empty-state-icon"></i><div class="empty-state-title">Belum Ada Catatan Prestasi</div><p class="empty-state-desc">Terus belajar, berusaha, dan raih prestasi membanggakan!</p></div>`;
    } else {
      aList.innerHTML = achievements.map(a => `
        <div style="padding: 0.85rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${a.title}</strong>
            <div class="text-muted text-xs">${a.rank} &bull; Tingkat ${a.level} &bull; ${formatDate(a.date)}</div>
          </div>
          <span class="badge badge-success"><i class="fa-solid fa-trophy"></i> Berprestasi</span>
        </div>
      `).join('');
    }
  }
}
