/**
 * SISWA SMART MONITORING - ACHIEVEMENTS MODULE
 * Pencatatan dan dokumentasi prestasi siswa di berbagai bidang dan tingkat kejuaraan.
 */

import { DB } from './firebase-config.js';
import { Auth } from './auth.js';
import { showToast, openModal, closeModal, confirmAction, formatDate, getTodayDateStr, exportTableToExcel, exportToCSV } from './utils.js';

let allAchievements = [];
let allStudents = [];
let achievementCategories = [];

export async function initAchievementsPage() {
  allStudents = await DB.getCollection('students');
  achievementCategories = await DB.getCollection('achievement_categories');
  await loadAchievements();
  initAchievementForm();
  initFilters();
}

export async function loadAchievements() {
  allAchievements = await DB.getCollection('achievements');
  renderAchievementsTable();
}

function renderAchievementsTable() {
  const tbody = document.getElementById('achievements-tbody');
  if (!tbody) return;

  const searchVal = document.getElementById('search-achievement')?.value.toLowerCase().trim() || '';
  const fieldFilter = document.getElementById('filter-field')?.value || '';
  const levelFilter = document.getElementById('filter-level')?.value || '';

  const filtered = allAchievements.filter(a => {
    const matchSearch = !searchVal || 
      a.studentName.toLowerCase().includes(searchVal) || 
      a.title.toLowerCase().includes(searchVal) ||
      (a.organizer && a.organizer.toLowerCase().includes(searchVal));
    const matchField = !fieldFilter || a.field === fieldFilter;
    const matchLevel = !levelFilter || a.level === levelFilter;
    return matchSearch && matchField && matchLevel;
  });

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted" style="padding: 2.5rem;">
          <i class="fa-solid fa-trophy empty-state-icon text-muted"></i>
          <div class="empty-state-title">Tidak Ada Catatan Prestasi</div>
          <p class="empty-state-desc">Belum ada prestasi siswa yang sesuai dengan filter.</p>
        </td>
      </tr>
    `;
    return;
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = filtered.map((a, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>${formatDate(a.date)}</td>
      <td>
        <a href="profil-siswa.html?id=${a.studentId}" class="fw-bold text-dark">${a.studentName}</a>
        <div class="text-muted text-xs">NIS: ${a.studentNis || '-'} &bull; ${a.className}</div>
      </td>
      <td>
        <strong>${a.title}</strong>
        <div class="text-muted text-xs">${a.organizer || '-'}</div>
      </td>
      <td><span class="badge badge-primary">${a.field}</span></td>
      <td><span class="badge badge-success">${a.rank} (${a.level})</span></td>
      <td>
        <div class="text-muted text-xs">Pembina: ${a.mentorTeacherName || '-'}</div>
      </td>
      <td>
        <div class="d-flex align-center gap-1">
          <a href="profil-siswa.html?id=${a.studentId}" class="btn btn-outline-primary btn-sm" title="Lihat Profil Siswa"><i class="fa-solid fa-id-card"></i></a>
          <button class="btn btn-outline-danger btn-sm delete-ach-btn" data-id="${a.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.delete-ach-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ok = await confirmAction({
        title: "Hapus Catatan Prestasi",
        message: "Hapus data prestasi ini secara permanen?",
        confirmText: "Hapus",
        confirmClass: "btn-danger"
      });
      if (ok) {
        await DB.deleteDoc('achievements', btn.dataset.id);
        showToast("Prestasi berhasil dihapus", "success");
        await loadAchievements();
      }
    });
  });
}

function initFilters() {
  document.getElementById('search-achievement')?.addEventListener('input', renderAchievementsTable);
  document.getElementById('filter-field')?.addEventListener('change', renderAchievementsTable);
  document.getElementById('filter-level')?.addEventListener('change', renderAchievementsTable);

  document.getElementById('btn-export-excel')?.addEventListener('click', () => {
    exportTableToExcel('achievements-table', `prestasi_${getTodayDateStr()}`);
  });

  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const data = allAchievements.map(a => ({
      Tanggal: a.date,
      Siswa: a.studentName,
      NIS: a.studentNis,
      Kelas: a.className,
      Judul_Prestasi: a.title,
      Bidang: a.field,
      Tingkat: a.level,
      Peringkat: a.rank,
      Penyelenggara: a.organizer,
      Guru_Pembina: a.mentorTeacherName
    }));
    exportToCSV(`prestasi_${getTodayDateStr()}`, data);
  });
}

function initAchievementForm() {
  const form = document.getElementById('achievement-form');
  const studentSelect = document.getElementById('ach-student');

  if (studentSelect && allStudents.length) {
    studentSelect.innerHTML = `<option value="">-- Pilih Siswa --</option>` +
      allStudents.map(s => `<option value="${s.id}" data-class="${s.className}" data-nis="${s.nis}">${s.name} (${s.className})</option>`).join('');
  }

  document.getElementById('btn-add-achievement')?.addEventListener('click', () => {
    form?.reset();
    document.getElementById('ach-date').value = getTodayDateStr();
    openModal('achievement-modal');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!studentSelect.value || !document.getElementById('ach-title').value.trim()) {
      showToast("Lengkapi nama siswa dan nama prestasi", "warning");
      return;
    }

    const sOpt = studentSelect.options[studentSelect.selectedIndex];
    const newAchievement = {
      studentId: studentSelect.value,
      studentName: sOpt.text.split('(')[0].trim(),
      studentNis: sOpt.dataset.nis,
      className: sOpt.dataset.class,
      title: document.getElementById('ach-title').value.trim(),
      field: document.getElementById('ach-field').value,
      level: document.getElementById('ach-level').value,
      rank: document.getElementById('ach-rank').value,
      organizer: document.getElementById('ach-organizer').value.trim(),
      score: document.getElementById('ach-score').value.trim(),
      date: document.getElementById('ach-date').value,
      description: document.getElementById('ach-desc').value.trim(),
      mentorTeacherName: document.getElementById('ach-mentor').value.trim() || 'Pembina Prestasi'
    };

    await DB.addDoc('achievements', newAchievement);
    showToast("Prestasi siswa berhasil dicatat!", "success");
    closeModal('achievement-modal');
    await loadAchievements();
  });
}
