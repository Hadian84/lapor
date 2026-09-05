/**
 * SISWA SMART MONITORING - STUDENTS MODULE
 * Manajemen CRUD Data Siswa, Pencarian, Filter Kelas/Gender, Import & Export Excel.
 */

import { DB } from './firebase-config.js';
import { showToast, openModal, closeModal, confirmAction, exportToCSV, exportTableToExcel, formatDate } from './utils.js';

let allStudents = [];
let filteredStudents = [];
let currentPage = 1;
const itemsPerPage = 10;

export async function initStudentsPage() {
  await loadStudents();
  initStudentFilters();
  initStudentForm();
  initImportExport();
}

export async function loadStudents() {
  allStudents = await DB.getCollection('students');
  applyFilters();
}

function applyFilters() {
  const query = document.getElementById('search-student')?.value.toLowerCase().trim() || '';
  const classFilter = document.getElementById('filter-class')?.value || '';
  const genderFilter = document.getElementById('filter-gender')?.value || '';

  filteredStudents = allStudents.filter(s => {
    const matchQuery = !query || 
      s.name.toLowerCase().includes(query) || 
      s.nis.toLowerCase().includes(query) || 
      (s.nisn && s.nisn.includes(query));
    
    const matchClass = !classFilter || s.classId === classFilter;
    const matchGender = !genderFilter || s.gender === genderFilter;

    return matchQuery && matchClass && matchGender;
  });

  currentPage = 1;
  renderStudentsTable();
}

function renderStudentsTable() {
  const tbody = document.getElementById('students-tbody');
  const countEl = document.getElementById('student-count');
  if (!tbody) return;

  if (countEl) countEl.textContent = `${filteredStudents.length} Siswa`;

  if (!filteredStudents.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="padding: 2.5rem 1rem;">
          <div class="empty-state">
            <i class="fa-solid fa-user-slash empty-state-icon"></i>
            <div class="empty-state-title">Tidak Ditemukan Siswa</div>
            <p class="empty-state-desc">Coba ubah kata kunci pencarian atau filter kelas.</p>
          </div>
        </td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredStudents.slice(startIdx, startIdx + itemsPerPage);

  tbody.innerHTML = pageItems.map((s, idx) => `
    <tr>
      <td class="text-center fw-bold">${startIdx + idx + 1}</td>
      <td>
        <div class="d-flex align-center gap-1">
          <img src="${s.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}" style="width:36px;height:36px;border-radius:var(--radius-full);object-fit:cover;">
          <div>
            <a href="profil-siswa.html?id=${s.id}" class="fw-bold text-dark">${s.name}</a>
            <div class="text-muted text-xs">Panggilan: ${s.nickname || '-'}</div>
          </div>
        </div>
      </td>
      <td><strong>${s.nis}</strong><div class="text-muted text-xs">${s.nisn || '-'}</div></td>
      <td><span class="badge ${s.gender === 'L' ? 'badge-primary' : 'badge-danger'}">${s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span></td>
      <td><span class="badge badge-secondary">${s.className || '-'}</span></td>
      <td>${s.parentName || '-'}<div class="text-muted text-xs"><i class="fa-solid fa-phone"></i> ${s.parentPhone || '-'}</div></td>
      <td><span class="badge ${s.status === 'active' ? 'badge-success' : 'badge-secondary'}">${s.status === 'active' ? 'Aktif' : 'Non-Aktif'}</span></td>
      <td>
        <div class="d-flex align-center gap-1">
          <a href="profil-siswa.html?id=${s.id}" class="btn btn-outline-primary btn-sm" title="Lihat Profil"><i class="fa-solid fa-id-card"></i></a>
          <button class="btn btn-secondary btn-sm edit-student-btn" data-id="${s.id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn btn-outline-danger btn-sm delete-student-btn" data-id="${s.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination(filteredStudents.length);
  attachRowActionListeners();
}

function renderPagination(totalItems) {
  const container = document.getElementById('students-pagination');
  if (!container) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <button class="page-link" onclick="changeStudentPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <button class="page-link" onclick="changeStudentPage(${i})">${i}</button>
      </li>
    `;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <button class="page-link" onclick="changeStudentPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>
    </li>
  `;

  container.innerHTML = html;
}

window.changeStudentPage = (page) => {
  currentPage = page;
  renderStudentsTable();
};

function attachRowActionListeners() {
  document.querySelectorAll('.edit-student-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const student = allStudents.find(s => s.id === btn.dataset.id);
      if (student) openEditStudentModal(student);
    });
  });

  document.querySelectorAll('.delete-student-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const student = allStudents.find(s => s.id === btn.dataset.id);
      if (!student) return;

      const confirmed = await confirmAction({
        title: "Hapus Data Siswa",
        message: `Apakah Anda yakin ingin menghapus data siswa "${student.name}" (NIS: ${student.nis})? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Hapus Siswa",
        confirmClass: "btn-danger"
      });

      if (confirmed) {
        await DB.deleteDoc('students', student.id);
        showToast(`Data siswa ${student.name} berhasil dihapus`, "success");
        await loadStudents();
      }
    });
  });
}

function initStudentFilters() {
  document.getElementById('search-student')?.addEventListener('input', applyFilters);
  document.getElementById('filter-class')?.addEventListener('change', applyFilters);
  document.getElementById('filter-gender')?.addEventListener('change', applyFilters);
}

function initStudentForm() {
  const form = document.getElementById('student-form');
  const addBtn = document.getElementById('btn-add-student');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('student-id').value = '';
      document.getElementById('student-modal-title').textContent = 'Tambah Siswa Baru';
      openModal('student-modal');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('student-id').value;
      const classSelect = document.getElementById('student-class');
      const selectedClassText = classSelect.options[classSelect.selectedIndex]?.text || '';

      const studentData = {
        nis: document.getElementById('student-nis').value.trim(),
        nisn: document.getElementById('student-nisn').value.trim(),
        name: document.getElementById('student-name').value.trim(),
        nickname: document.getElementById('student-nickname').value.trim(),
        gender: document.getElementById('student-gender').value,
        birthPlace: document.getElementById('student-birthplace').value.trim(),
        birthDate: document.getElementById('student-birthdate').value,
        address: document.getElementById('student-address').value.trim(),
        classId: classSelect.value,
        className: selectedClassText,
        phone: document.getElementById('student-phone').value.trim(),
        parentName: document.getElementById('student-parent-name').value.trim(),
        parentPhone: document.getElementById('student-parent-phone').value.trim(),
        photoUrl: document.getElementById('student-photo-url').value.trim() || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
        status: document.getElementById('student-status').value
      };

      if (!studentData.nis || !studentData.name || !studentData.classId) {
        showToast("Mohon lengkapi NIS, Nama Siswa, dan Kelas", "warning");
        return;
      }

      if (id) {
        await DB.updateDoc('students', id, studentData);
        showToast("Data siswa berhasil diperbarui", "success");
      } else {
        // Cek duplikasi NIS
        const duplicate = allStudents.find(s => s.nis === studentData.nis);
        if (duplicate) {
          showToast(`NIS ${studentData.nis} sudah terdaftar atas nama ${duplicate.name}`, "danger");
          return;
        }
        await DB.addDoc('students', studentData);
        showToast("Siswa baru berhasil ditambahkan", "success");
      }

      closeModal('student-modal');
      await loadStudents();
    });
  }
}

function openEditStudentModal(student) {
  document.getElementById('student-id').value = student.id;
  document.getElementById('student-nis').value = student.nis || '';
  document.getElementById('student-nisn').value = student.nisn || '';
  document.getElementById('student-name').value = student.name || '';
  document.getElementById('student-nickname').value = student.nickname || '';
  document.getElementById('student-gender').value = student.gender || 'L';
  document.getElementById('student-birthplace').value = student.birthPlace || '';
  document.getElementById('student-birthdate').value = student.birthDate || '';
  document.getElementById('student-address').value = student.address || '';
  document.getElementById('student-class').value = student.classId || '';
  document.getElementById('student-phone').value = student.phone || '';
  document.getElementById('student-parent-name').value = student.parentName || '';
  document.getElementById('student-parent-phone').value = student.parentPhone || '';
  document.getElementById('student-photo-url').value = student.photoUrl || '';
  document.getElementById('student-status').value = student.status || 'active';

  document.getElementById('student-modal-title').textContent = 'Edit Data Siswa';
  openModal('student-modal');
}

function initImportExport() {
  // Export CSV
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const dataToExport = filteredStudents.map(s => ({
      NIS: s.nis,
      NISN: s.nisn || '',
      Nama: s.name,
      Jenis_Kelamin: s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      Kelas: s.className,
      Orang_Tua: s.parentName || '',
      HP_Orang_Tua: s.parentPhone || '',
      Status: s.status
    }));
    exportToCSV(`data_siswa_${Date.now()}`, dataToExport);
  });

  // Export Excel
  document.getElementById('btn-export-excel')?.addEventListener('click', () => {
    exportTableToExcel('students-table', `data_siswa_${Date.now()}`);
  });

  // Print
  document.getElementById('btn-print-students')?.addEventListener('click', () => {
    window.print();
  });

  // Import Excel / CSV
  const importInput = document.getElementById('import-file-input');
  document.getElementById('btn-import-students')?.addEventListener('click', () => {
    importInput?.click();
  });

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
        }

        if (!importedRows.length) {
          showToast("File tidak memiliki data siswa", "warning");
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
  });
}

function showImportPreviewModal(rows) {
  let modal = document.getElementById('import-preview-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'import-preview-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <h3 class="modal-title">Konfirmasi Import Data Siswa</h3>
          <button class="modal-close" onclick="closeModal('import-preview-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <p class="text-muted text-sm">Ditemukan <strong>${rows.length}</strong> data siswa dari file. Periksa ringkasan di bawah sebelum disimpan ke database:</p>
          <div class="table-responsive" style="max-height: 320px; overflow-y: auto;">
            <table class="table table-striped" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th>No</th>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>L/P</th>
                  <th>Kelas</th>
                </tr>
              </thead>
              <tbody id="import-preview-tbody"></tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" onclick="closeModal('import-preview-modal')">Batal</button>
          <button class="btn btn-primary btn-sm" id="btn-confirm-import">Simpan ke Database</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const tbody = document.getElementById('import-preview-tbody');
  tbody.innerHTML = rows.slice(0, 15).map((r, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${r.NIS || r.nis || '-'}</td>
      <td><strong>${r.Nama || r.nama || r.name || '-'}</strong></td>
      <td>${r.Jenis_Kelamin || r.gender || '-'}</td>
      <td>${r.Kelas || r.className || '-'}</td>
    </tr>
  `).join('');

  document.getElementById('btn-confirm-import').onclick = async () => {
    let importedCount = 0;
    for (const r of rows) {
      const nis = r.NIS || r.nis;
      const name = r.Nama || r.nama || r.name;
      if (!nis || !name) continue;

      await DB.addDoc('students', {
        nis: String(nis),
        nisn: String(r.NISN || r.nisn || ''),
        name: String(name),
        nickname: '',
        gender: (r.Jenis_Kelamin || r.gender || 'L').charAt(0).toUpperCase(),
        classId: 'cls-7a',
        className: r.Kelas || r.className || 'Kelas 7A',
        parentName: r.Orang_Tua || r.parentName || '',
        parentPhone: r.HP_Orang_Tua || r.parentPhone || '',
        status: 'active',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'
      });
      importedCount++;
    }

    closeModal('import-preview-modal');
    showToast(`Berhasil mengimpor ${importedCount} data siswa`, "success");
    await loadStudents();
  };

  openModal('import-preview-modal');
}
