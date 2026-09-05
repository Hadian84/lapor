/**
 * SISWA SMART MONITORING - VIOLATIONS MODULE
 * Pencatatan pelanggaran siswa, auto-pengisian poin, tindak lanjut, status pembinaan, filter & export.
 */

import { DB } from './firebase-config.js';
import { Auth } from './auth.js';
import { showToast, openModal, closeModal, confirmAction, formatDate, getTodayDateStr, exportTableToExcel, exportToCSV } from './utils.js';

let allViolations = [];
let allStudents = [];
let violationCategories = [];

export async function initViolationsPage() {
  allStudents = await DB.getCollection('students');
  violationCategories = await DB.getCollection('violation_categories');
  await loadViolations();
  initViolationForm();
  initFilters();
}

export async function loadViolations() {
  allViolations = await DB.getCollection('violations');
  renderViolationsTable();
}

function renderViolationsTable() {
  const tbody = document.getElementById('violations-tbody');
  if (!tbody) return;

  const searchVal = document.getElementById('search-violation')?.value.toLowerCase().trim() || '';
  const catFilter = document.getElementById('filter-category')?.value || '';
  const classFilter = document.getElementById('filter-class')?.value || '';

  const filtered = allViolations.filter(v => {
    const matchSearch = !searchVal || 
      v.studentName.toLowerCase().includes(searchVal) || 
      v.violationName.toLowerCase().includes(searchVal) ||
      (v.studentNis && v.studentNis.includes(searchVal));
    const matchCat = !catFilter || v.categoryId === catFilter;
    const matchClass = !classFilter || v.classId === classFilter;
    return matchSearch && matchCat && matchClass;
  });

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted" style="padding: 2.5rem;">
          <i class="fa-solid fa-triangle-exclamation empty-state-icon text-muted"></i>
          <div class="empty-state-title">Tidak Ada Catatan Pelanggaran</div>
          <p class="empty-state-desc">Belum ada pelanggaran yang sesuai dengan filter pencarian.</p>
        </td>
      </tr>
    `;
    return;
  }

  // Sort descending
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = filtered.map((v, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>
        ${formatDate(v.date)}
        <div class="text-muted text-xs">${v.time || '-'} WIB</div>
      </td>
      <td>
        <a href="profil-siswa.html?id=${v.studentId}" class="fw-bold text-dark">${v.studentName}</a>
        <div class="text-muted text-xs">NIS: ${v.studentNis || '-'} &bull; ${v.className}</div>
      </td>
      <td>
        <strong>${v.violationName}</strong>
        <div class="text-muted text-xs" style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${v.chronology || ''}">${v.chronology || '-'}</div>
      </td>
      <td>
        <span class="badge ${v.categoryName === 'BERAT' ? 'badge-danger' : v.categoryName === 'SEDANG' ? 'badge-warning' : 'badge-primary'}">${v.categoryName || 'RINGAN'}</span>
      </td>
      <td><span class="badge badge-danger">+${v.points} Poin</span></td>
      <td>
        <div><strong>${v.action || 'Teguran'}</strong></div>
        <span class="badge badge-secondary text-xs">${v.status || 'Selesai'}</span>
      </td>
      <td>
        <div class="d-flex align-center gap-1">
          <a href="profil-siswa.html?id=${v.studentId}" class="btn btn-outline-primary btn-sm" title="Lihat Profil Siswa"><i class="fa-solid fa-id-card"></i></a>
          <button class="btn btn-outline-danger btn-sm delete-vlt-btn" data-id="${v.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.delete-vlt-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ok = await confirmAction({
        title: "Hapus Catatan Pelanggaran",
        message: "Hapus rekaman pelanggaran ini secara permanen?",
        confirmText: "Hapus",
        confirmClass: "btn-danger"
      });
      if (ok) {
        await DB.deleteDoc('violations', btn.dataset.id);
        showToast("Catatan pelanggaran berhasil dihapus", "success");
        await loadViolations();
      }
    });
  });
}

function initFilters() {
  document.getElementById('search-violation')?.addEventListener('input', renderViolationsTable);
  document.getElementById('filter-category')?.addEventListener('change', renderViolationsTable);
  document.getElementById('filter-class')?.addEventListener('change', renderViolationsTable);

  document.getElementById('btn-export-excel')?.addEventListener('click', () => {
    exportTableToExcel('violations-table', `pelanggaran_${getTodayDateStr()}`);
  });

  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const data = allViolations.map(v => ({
      Tanggal: v.date,
      Waktu: v.time || '',
      NIS: v.studentNis,
      Siswa: v.studentName,
      Kelas: v.className,
      Pelanggaran: v.violationName,
      Kategori: v.categoryName,
      Poin: v.points,
      Tindakan: v.action,
      Status: v.status,
      Guru_Pencatat: v.teacherName
    }));
    exportToCSV(`pelanggaran_${getTodayDateStr()}`, data);
  });
}

function initViolationForm() {
  const form = document.getElementById('violation-form');
  const studentSelect = document.getElementById('vlt-student');
  const catSelect = document.getElementById('vlt-category');
  const ruleSelect = document.getElementById('vlt-rule');
  const pointsInput = document.getElementById('vlt-points');

  // Isi dropdown siswa
  if (studentSelect && allStudents.length) {
    studentSelect.innerHTML = `<option value="">-- Pilih Siswa --</option>` +
      allStudents.map(s => `<option value="${s.id}" data-class="${s.className}" data-nis="${s.nis}">${s.name} (${s.className})</option>`).join('');
  }

  // Isi dropdown kategori
  if (catSelect && violationCategories.length) {
    catSelect.innerHTML = `<option value="">-- Pilih Kategori --</option>` +
      violationCategories.map(c => `<option value="${c.id}">${c.name} - ${c.description}</option>`).join('');
  }

  // Saat kategori berubah, update dropdown aturan pelanggaran
  catSelect?.addEventListener('change', () => {
    const cat = violationCategories.find(c => c.id === catSelect.value);
    if (cat && cat.items && cat.items.length) {
      ruleSelect.innerHTML = `<option value="">-- Pilih Jenis Pelanggaran --</option>` +
        cat.items.map(item => `<option value="${item.id}" data-name="${item.name}" data-points="${item.points}">${item.name} (${item.points} Poin)</option>`).join('');
    } else {
      ruleSelect.innerHTML = `<option value="">-- Tidak ada jenis pelanggaran --</option>`;
    }
    pointsInput.value = 0;
  });

  // Saat aturan dipilih, isi otomatis input poin
  ruleSelect?.addEventListener('change', () => {
    const opt = ruleSelect.options[ruleSelect.selectedIndex];
    if (opt && opt.dataset.points) {
      pointsInput.value = opt.dataset.points;
    }
  });

  // Tombol Tambah
  document.getElementById('btn-add-violation')?.addEventListener('click', () => {
    form?.reset();
    document.getElementById('vlt-date').value = getTodayDateStr();
    const now = new Date();
    document.getElementById('vlt-time').value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    openModal('violation-modal');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!studentSelect.value || !catSelect.value || !ruleSelect.value) {
      showToast("Mohon lengkapi Siswa, Kategori, dan Jenis Pelanggaran", "warning");
      return;
    }

    const sOpt = studentSelect.options[studentSelect.selectedIndex];
    const rOpt = ruleSelect.options[ruleSelect.selectedIndex];
    const cOpt = catSelect.options[catSelect.selectedIndex];
    const currentUser = Auth.getCurrentUser();

    const newViolation = {
      studentId: studentSelect.value,
      studentName: sOpt.text.split('(')[0].trim(),
      studentNis: sOpt.dataset.nis,
      className: sOpt.dataset.class,
      categoryId: catSelect.value,
      categoryName: cOpt.text.split('-')[0].trim(),
      violationName: rOpt.dataset.name,
      points: Number(pointsInput.value) || 0,
      date: document.getElementById('vlt-date').value,
      time: document.getElementById('vlt-time').value,
      chronology: document.getElementById('vlt-chronology').value.trim(),
      action: document.getElementById('vlt-action').value,
      status: document.getElementById('vlt-status').value,
      teacherId: currentUser?.id || 'tch-1',
      teacherName: currentUser?.name || 'Guru Piket'
    };

    await DB.addDoc('violations', newViolation);
    showToast("Catatan pelanggaran berhasil disimpan", "success");
    closeModal('violation-modal');
    await loadViolations();
  });
}
