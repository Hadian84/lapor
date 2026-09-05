/**
 * SISWA SMART MONITORING - LATENESS MODULE
 * Pencatatan keterlambatan siswa, auto-hitung selisih jam masuk sekolah, statistik & export.
 */

import { DB } from './firebase-config.js';
import { Auth } from './auth.js';
import { showToast, openModal, closeModal, confirmAction, formatDate, getTodayDateStr, exportTableToExcel } from './utils.js';

let allLateness = [];
let allStudents = [];

export async function initLatenessPage() {
  allStudents = await DB.getCollection('students');
  await loadLateness();
  initLatenessForm();
  initFilters();
}

export async function loadLateness() {
  allLateness = await DB.getCollection('lateness');
  renderLatenessTable();
  renderLatenessStats();
}

function renderLatenessTable() {
  const tbody = document.getElementById('lateness-tbody');
  if (!tbody) return;

  const dateFilter = document.getElementById('filter-late-date')?.value;
  const classFilter = document.getElementById('filter-late-class')?.value;

  let filtered = allLateness.filter(l => {
    const matchDate = !dateFilter || l.date === dateFilter;
    const matchClass = !classFilter || l.classId === classFilter;
    return matchDate && matchClass;
  });

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted" style="padding: 2.5rem;">
          <i class="fa-solid fa-clock empty-state-icon"></i>
          <div class="empty-state-title">Tidak Ada Catatan Keterlambatan</div>
          <p class="empty-state-desc">Belum ada siswa yang tercatat terlambat untuk filter ini.</p>
        </td>
      </tr>
    `;
    return;
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = filtered.map((l, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>${formatDate(l.date)}</td>
      <td>
        <a href="profil-siswa.html?id=${l.studentId}" class="fw-bold text-dark">${l.studentName}</a>
        <div class="text-muted text-xs">NIS: ${l.studentNis || '-'}</div>
      </td>
      <td><span class="badge badge-secondary">${l.className}</span></td>
      <td><span class="badge badge-warning">${l.arrivalTime} WIB</span></td>
      <td><span class="badge badge-danger">+${l.minutesLate} Menit</span></td>
      <td>${l.reason || '-'}<div class="text-muted text-xs">Guru: ${l.teacherName || '-'}</div></td>
      <td>
        <button class="btn btn-outline-danger btn-sm delete-late-btn" data-id="${l.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.delete-late-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const ok = await confirmAction({
        title: "Hapus Catatan Keterlambatan",
        message: "Hapus rekaman keterlambatan ini?",
        confirmText: "Hapus",
        confirmClass: "btn-danger"
      });
      if (ok) {
        await DB.deleteDoc('lateness', id);
        showToast("Catatan keterlambatan berhasil dihapus", "success");
        await loadLateness();
      }
    });
  });
}

function renderLatenessStats() {
  const elTotal = document.getElementById('stat-late-total');
  const elAvg = document.getElementById('stat-late-avg');
  const elTop = document.getElementById('stat-late-top');

  if (!allLateness.length) {
    if (elTotal) elTotal.textContent = '0';
    if (elAvg) elAvg.textContent = '0 Menit';
    if (elTop) elTop.textContent = '-';
    return;
  }

  if (elTotal) elTotal.textContent = allLateness.length;

  // Hitung rata-rata menit terlambat
  const totalMinutes = allLateness.reduce((acc, l) => acc + (Number(l.minutesLate) || 0), 0);
  const avg = Math.round(totalMinutes / allLateness.length);
  if (elAvg) elAvg.textContent = `${avg} Menit`;

  // Siswa paling sering terlambat
  const freq = {};
  allLateness.forEach(l => {
    freq[l.studentName] = (freq[l.studentName] || 0) + 1;
  });
  let topStudent = '-';
  let maxCount = 0;
  Object.keys(freq).forEach(name => {
    if (freq[name] > maxCount) {
      maxCount = freq[name];
      topStudent = `${name} (${maxCount}x)`;
    }
  });
  if (elTop) elTop.textContent = topStudent;
}

function initFilters() {
  document.getElementById('filter-late-date')?.addEventListener('change', renderLatenessTable);
  document.getElementById('filter-late-class')?.addEventListener('change', renderLatenessTable);
  document.getElementById('btn-export-lateness')?.addEventListener('click', () => {
    exportTableToExcel('lateness-table', `keterlambatan_${getTodayDateStr()}`);
  });
}

function initLatenessForm() {
  const form = document.getElementById('lateness-form');
  const studentSelect = document.getElementById('late-student-select');
  const arrivalInput = document.getElementById('late-arrival-time');
  const minutesInput = document.getElementById('late-minutes');

  // Isi dropdown siswa
  if (studentSelect && allStudents.length) {
    studentSelect.innerHTML = `<option value="">-- Pilih Siswa --</option>` +
      allStudents.map(s => `<option value="${s.id}" data-class="${s.className}" data-nis="${s.nis}">${s.name} (${s.className} - ${s.nis})</option>`).join('');
  }

  // Hitung otomatis menit terlambat saat jam kedatangan diubah
  if (arrivalInput && minutesInput) {
    arrivalInput.addEventListener('change', async () => {
      const settings = await DB.getSettings();
      const schoolStart = settings.schoolStartTime || "07:00";
      const [startH, startM] = schoolStart.split(':').map(Number);
      const [arrH, arrM] = arrivalInput.value.split(':').map(Number);

      if (!isNaN(arrH) && !isNaN(arrM)) {
        const diffMinutes = (arrH * 60 + arrM) - (startH * 60 + startM);
        minutesInput.value = Math.max(0, diffMinutes);
      }
    });
  }

  document.getElementById('btn-add-lateness')?.addEventListener('click', () => {
    form?.reset();
    if (arrivalInput) {
      const now = new Date();
      arrivalInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      arrivalInput.dispatchEvent(new Event('change'));
    }
    document.getElementById('late-date').value = getTodayDateStr();
    openModal('lateness-modal');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedOption = studentSelect.options[studentSelect.selectedIndex];
    if (!studentSelect.value) {
      showToast("Pilih siswa terlebih dahulu", "warning");
      return;
    }

    const currentUser = Auth.getCurrentUser();
    const newLateness = {
      studentId: studentSelect.value,
      studentName: selectedOption.text.split('(')[0].trim(),
      studentNis: selectedOption.dataset.nis,
      className: selectedOption.dataset.class,
      date: document.getElementById('late-date').value,
      arrivalTime: arrivalInput.value,
      minutesLate: Number(minutesInput.value) || 0,
      reason: document.getElementById('late-reason').value.trim() || 'Tidak ada alasan khusus',
      teacherId: currentUser?.id || 'tch-1',
      teacherName: currentUser?.name || 'Guru Piket'
    };

    await DB.addDoc('lateness', newLateness);
    showToast("Catatan keterlambatan berhasil disimpan", "success");
    closeModal('lateness-modal');
    await loadLateness();
  });
}
