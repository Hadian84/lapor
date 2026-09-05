/**
 * SISWA SMART MONITORING - TEACHERS MODULE
 * Manajemen Guru, Wali Kelas, Mata Pelajaran, Penugasan, serta Import & Export Excel/CSV.
 */

import { DB } from './firebase-config.js';
import { showToast, openModal, closeModal, confirmAction, exportTableToExcel, exportToCSV } from './utils.js';

let allTeachers = [];
let filteredTeachers = [];

export async function initTeachersPage() {
  await loadTeachers();
  initTeacherForm();
  initTeacherFilters();
  initImportExport();
}

export async function loadTeachers() {
  allTeachers = await DB.getCollection('teachers');
  applyFilters();
}

function applyFilters() {
  const query = document.getElementById('search-teacher')?.value.toLowerCase().trim() || '';
  const roleFilter = document.getElementById('filter-teacher-role')?.value || '';

  filteredTeachers = allTeachers.filter(t => {
    const matchQuery = !query ||
      t.name.toLowerCase().includes(query) ||
      (t.nip && t.nip.includes(query)) ||
      (t.subject && t.subject.toLowerCase().includes(query)) ||
      t.email.toLowerCase().includes(query);

    const matchRole = !roleFilter || t.role === roleFilter;

    return matchQuery && matchRole;
  });

  renderTeachersTable();
}

function renderTeachersTable() {
  const tbody = document.getElementById('teachers-tbody');
  const countEl = document.getElementById('teacher-count');
  if (!tbody) return;

  if (countEl) countEl.textContent = `${filteredTeachers.length} Guru`;

  if (!filteredTeachers.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
          <div class="empty-state">
            <i class="fa-solid fa-chalkboard-user empty-state-icon"></i>
            <div class="empty-state-title">Tidak Ada Data Guru</div>
            <p class="empty-state-desc">Belum ada guru yang sesuai dengan kriteria pencarian.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredTeachers.map((t, idx) => `
    <tr>
      <td class="text-center fw-bold">${idx + 1}</td>
      <td>
        <strong>${t.name}</strong>
        <div class="text-muted text-xs">NIP: ${t.nip || '-'}</div>
      </td>
      <td>${t.email}</td>
      <td><span class="badge badge-primary">${t.subject || 'Guru Mata Pelajaran'}</span></td>
      <td>
        <span class="badge ${t.role === 'wali_kelas' ? 'badge-success' : 'badge-secondary'}">
          ${t.role === 'wali_kelas' ? 'Wali Kelas ' + (t.assignedClass || '') : 'Guru Pengajar'}
        </span>
      </td>
      <td>${t.phone || '-'}</td>
      <td class="text-center">
        <div class="d-flex align-center justify-center gap-1">
          <button class="btn btn-secondary btn-sm edit-tch-btn" data-id="${t.id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn btn-outline-danger btn-sm delete-tch-btn" data-id="${t.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  attachActionListeners();
}

function attachActionListeners() {
  document.querySelectorAll('.edit-tch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const teacher = allTeachers.find(t => t.id === btn.dataset.id);
      if (teacher) openEditTeacherModal(teacher);
    });
  });

  document.querySelectorAll('.delete-tch-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const teacher = allTeachers.find(t => t.id === btn.dataset.id);
      if (!teacher) return;

      const ok = await confirmAction({
        title: "Hapus Data Guru",
        message: `Hapus data guru "${teacher.name}" dari sistem?`,
        confirmText: "Hapus",
        confirmClass: "btn-danger"
      });
      if (ok) {
        await DB.deleteDoc('teachers', teacher.id);
        showToast("Data guru berhasil dihapus", "success");
        await loadTeachers();
      }
    });
  });
}

function initTeacherFilters() {
  document.getElementById('search-teacher')?.addEventListener('input', applyFilters);
  document.getElementById('filter-teacher-role')?.addEventListener('change', applyFilters);
}

function openEditTeacherModal(t) {
  document.getElementById('teacher-id').value = t.id;
  document.getElementById('teacher-nip').value = t.nip || '';
  document.getElementById('teacher-name').value = t.name || '';
  document.getElementById('teacher-email').value = t.email || '';
  document.getElementById('teacher-subject').value = t.subject || '';
  document.getElementById('teacher-phone').value = t.phone || '';
  document.getElementById('teacher-role').value = t.role || 'guru';
  document.getElementById('teacher-class').value = t.assignedClass || '';
  document.getElementById('teacher-modal-title').textContent = 'Edit Data Guru';
  openModal('teacher-modal');
}

function initTeacherForm() {
  const form = document.getElementById('teacher-form');
  document.getElementById('btn-add-teacher')?.addEventListener('click', () => {
    form?.reset();
    document.getElementById('teacher-id').value = '';
    document.getElementById('teacher-modal-title').textContent = 'Tambah Guru Baru';
    openModal('teacher-modal');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('teacher-id').value;
    const teacherData = {
      nip: document.getElementById('teacher-nip').value.trim(),
      name: document.getElementById('teacher-name').value.trim(),
      email: document.getElementById('teacher-email').value.trim(),
      subject: document.getElementById('teacher-subject').value.trim(),
      phone: document.getElementById('teacher-phone').value.trim(),
      role: document.getElementById('teacher-role').value,
      assignedClass: document.getElementById('teacher-class').value.trim()
    };

    if (!teacherData.name || !teacherData.email) {
      showToast("Nama dan Email wajib diisi", "warning");
      return;
    }

    if (id) {
      await DB.updateDoc('teachers', id, teacherData);
      showToast("Data guru berhasil diperbarui", "success");
    } else {
      // Cek duplikasi email
      const dup = allTeachers.find(t => t.email.toLowerCase() === teacherData.email.toLowerCase());
      if (dup) {
        showToast(`Email ${teacherData.email} sudah terdaftar`, "danger");
        return;
      }
      await DB.addDoc('teachers', teacherData);
      showToast("Guru baru berhasil ditambahkan", "success");
    }

    closeModal('teacher-modal');
    await loadTeachers();
  });
}

// ==========================================
// IMPORT & EXPORT EXCEL / CSV UNTUK DATA GURU
// ==========================================
function initImportExport() {
  // Export Excel
  document.getElementById('btn-export-teachers-excel')?.addEventListener('click', () => {
    exportTableToExcel('teachers-table', `data_guru_${Date.now()}`);
  });

  // Export CSV
  document.getElementById('btn-export-teachers-csv')?.addEventListener('click', () => {
    const data = filteredTeachers.map(t => ({
      NIP: t.nip || '',
      Nama: t.name,
      Email: t.email,
      Mata_Pelajaran: t.subject || '',
      Peran: t.role === 'wali_kelas' ? 'Wali Kelas' : 'Guru Pengajar',
      Kelas_Binaan: t.assignedClass || '',
      Nomor_Telepon: t.phone || ''
    }));
    exportToCSV(`data_guru_${Date.now()}`, data);
  });

  // Tombol Import Excel
  const importInput = document.getElementById('import-teacher-input');
  document.getElementById('btn-import-teachers')?.addEventListener('click', () => {
    importInput?.click();
  });

  // Listener input file
  importInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        let importedRows = [];
        if (file.name.endsWith('.csv')) {
          const text = event.target.result;
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

          importedRows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            const obj = {};
            headers.forEach((h, i) => obj[h] = values[i] || '');
            return obj;
          });
        } else if (window.XLSX) {
          const workbook = window.XLSX.read(event.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          importedRows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
          showToast("Library Excel belum dimuat", "danger");
          return;
        }

        if (!importedRows.length) {
          showToast("File tidak memiliki data guru yang valid", "warning");
          return;
        }

        // Tampilkan modal preview import
        showImportPreviewModal(importedRows);
      } catch (err) {
        showToast("Gagal membaca file: " + err.message, "danger");
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }

    // Reset value input agar bisa memilih file yang sama lagi
    importInput.value = '';
  });
}

function showImportPreviewModal(rows) {
  let modal = document.getElementById('import-teacher-preview-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'import-teacher-preview-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <h3 class="modal-title">Konfirmasi Import Data Guru</h3>
          <button class="modal-close" onclick="closeModal('import-teacher-preview-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <p class="text-muted text-sm">
            Ditemukan <strong><span id="import-teacher-total">0</span></strong> data guru dari file Excel/CSV.
            Periksa pratinjau data di bawah sebelum disimpan ke sistem:
          </p>
          <div class="table-responsive" style="max-height: 320px; overflow-y: auto;">
            <table class="table table-striped" style="font-size: 0.82rem;">
              <thead>
                <tr>
                  <th style="width: 40px;" class="text-center">No</th>
                  <th>Nama Lengkap</th>
                  <th>NIP</th>
                  <th>Email</th>
                  <th>Mata Pelajaran</th>
                  <th>Peran</th>
                  <th>Kelas Binaan</th>
                </tr>
              </thead>
              <tbody id="import-teacher-preview-tbody"></tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" onclick="closeModal('import-teacher-preview-modal')">Batal</button>
          <button class="btn btn-primary btn-sm" id="btn-confirm-import-teacher"><i class="fa-solid fa-cloud-arrow-up"></i> Simpan ke Database</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const totalEl = document.getElementById('import-teacher-total');
  if (totalEl) totalEl.textContent = rows.length;

  const tbody = document.getElementById('import-teacher-preview-tbody');
  tbody.innerHTML = rows.slice(0, 15).map((r, idx) => {
    const name = r.Nama || r.nama || r.Name || r.name || '-';
    const nip = r.NIP || r.nip || '-';
    const email = r.Email || r.email || '-';
    const subject = r.Mata_Pelajaran || r.subject || r.Mapel || r.mapel || '-';
    const role = (r.Peran || r.role || '').toLowerCase().includes('wali') ? 'Wali Kelas' : 'Guru Pengajar';
    const assignedClass = r.Kelas_Binaan || r.assignedClass || r.Kelas || r.kelas || '-';

    return `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td><strong>${name}</strong></td>
        <td>${nip}</td>
        <td>${email}</td>
        <td><span class="badge badge-primary">${subject}</span></td>
        <td>${role}</td>
        <td>${assignedClass}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('btn-confirm-import-teacher').onclick = async () => {
    let importedCount = 0;
    for (const r of rows) {
      const name = r.Nama || r.nama || r.Name || r.name;
      const email = r.Email || r.email || (name ? `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@sekolah.sch.id` : '');
      if (!name) continue;

      const isWali = (r.Peran || r.role || '').toLowerCase().includes('wali');
      const assignedClass = r.Kelas_Binaan || r.assignedClass || r.Kelas || r.kelas || '';

      await DB.addDoc('teachers', {
        nip: String(r.NIP || r.nip || ''),
        name: String(name),
        email: String(email),
        subject: String(r.Mata_Pelajaran || r.subject || r.Mapel || r.mapel || 'Guru Mata Pelajaran'),
        role: isWali ? 'wali_kelas' : 'guru',
        assignedClass: isWali ? String(assignedClass) : '',
        phone: String(r.Nomor_Telepon || r.phone || r.HP || r.hp || '')
      });
      importedCount++;
    }

    closeModal('import-teacher-preview-modal');
    showToast(`Berhasil mengimpor ${importedCount} data guru`, "success");
    await loadTeachers();
  };

  openModal('import-teacher-preview-modal');
}
