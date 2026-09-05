/**
 * SISWA SMART MONITORING - CLASSES MODULE
 * Manajemen Rombongan Belajar / Kelas, Wali Kelas, Roster Siswa & Statistik Kelas.
 */

import { DB } from './firebase-config.js';
import { showToast, openModal, closeModal, confirmAction } from './utils.js';

let classes = [];
let allStudents = [];

export async function initClassesPage() {
  allStudents = await DB.getCollection('students');
  await loadClasses();
  initClassForm();
}

export async function loadClasses() {
  classes = await DB.getCollection('classes');
  renderClassesCards();
}

function renderClassesCards() {
  const container = document.getElementById('classes-container');
  if (!container) return;

  if (!classes.length) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-school empty-state-icon"></i><div class="empty-state-title">Belum Ada Kelas</div></div>`;
    return;
  }

  container.innerHTML = classes.map(c => {
    const classStudents = allStudents.filter(s => s.classId === c.id);
    const count = classStudents.length;

    return `
      <div class="card" style="margin-bottom: 1.25rem;">
        <div class="card-header">
          <div>
            <h3 class="card-title">${c.name}</h3>
            <span class="text-muted text-xs">Tingkat ${c.grade} &bull; T.P. ${c.academicYear || '2026/2027'}</span>
          </div>
          <div class="d-flex align-center gap-1">
            <button class="btn btn-outline-primary btn-sm view-class-btn" data-id="${c.id}" data-name="${c.name}"><i class="fa-solid fa-users"></i> Lihat Roster (${count})</button>
            <button class="btn btn-secondary btn-sm edit-cls-btn" data-id="${c.id}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn btn-outline-danger btn-sm delete-cls-btn" data-id="${c.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex align-center justify-between">
            <div>
              <div class="text-muted text-xs">Wali Kelas:</div>
              <strong>${c.homeroomTeacherName || 'Belum Ditentukan'}</strong>
            </div>
            <div class="text-end">
              <div class="text-muted text-xs">Jumlah Siswa:</div>
              <span class="badge badge-primary" style="font-size: 0.9rem;">${count} Siswa</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  attachClassActionListeners();
}

function attachClassActionListeners() {
  document.querySelectorAll('.view-class-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const classId = btn.dataset.id;
      const className = btn.dataset.name;
      openClassRosterModal(classId, className);
    });
  });

  document.querySelectorAll('.edit-cls-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cls = classes.find(c => c.id === btn.dataset.id);
      if (cls) {
        document.getElementById('cls-id').value = cls.id;
        document.getElementById('cls-name').value = cls.name;
        document.getElementById('cls-grade').value = cls.grade;
        document.getElementById('cls-homeroom').value = cls.homeroomTeacherName || '';
        document.getElementById('class-modal-title').textContent = 'Edit Data Kelas';
        openModal('class-modal');
      }
    });
  });

  document.querySelectorAll('.delete-cls-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ok = await confirmAction({
        title: "Hapus Kelas",
        message: "Hapus kelas ini dari sistem?",
        confirmText: "Hapus",
        confirmClass: "btn-danger"
      });
      if (ok) {
        await DB.deleteDoc('classes', btn.dataset.id);
        showToast("Kelas berhasil dihapus", "success");
        await loadClasses();
      }
    });
  });
}

function openClassRosterModal(classId, className) {
  const students = allStudents.filter(s => s.classId === classId);
  const modalTitle = document.getElementById('roster-modal-title');
  const tbody = document.getElementById('roster-modal-tbody');

  if (modalTitle) modalTitle.textContent = `Daftar Siswa - ${className}`;
  if (tbody) {
    if (!students.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 1.5rem;">Tidak ada siswa di kelas ini.</td></tr>`;
    } else {
      tbody.innerHTML = students.map((s, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td><strong>${s.nis}</strong></td>
          <td><a href="profil-siswa.html?id=${s.id}" class="fw-bold">${s.name}</a></td>
          <td>${s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
          <td><a href="profil-siswa.html?id=${s.id}" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-id-card"></i> Profil</a></td>
        </tr>
      `).join('');
    }
  }

  openModal('class-roster-modal');
}

function initClassForm() {
  const form = document.getElementById('class-form');
  document.getElementById('btn-add-class')?.addEventListener('click', () => {
    form?.reset();
    document.getElementById('cls-id').value = '';
    document.getElementById('class-modal-title').textContent = 'Tambah Kelas Baru';
    openModal('class-modal');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cls-id').value;
    const classData = {
      name: document.getElementById('cls-name').value.trim(),
      grade: document.getElementById('cls-grade').value,
      homeroomTeacherName: document.getElementById('cls-homeroom').value.trim(),
      academicYear: '2026/2027'
    };

    if (!classData.name) {
      showToast("Nama kelas wajib diisi", "warning");
      return;
    }

    if (id) {
      await DB.updateDoc('classes', id, classData);
      showToast("Data kelas diperbarui", "success");
    } else {
      await DB.addDoc('classes', classData);
      showToast("Kelas baru berhasil ditambahkan", "success");
    }

    closeModal('class-modal');
    await loadClasses();
  });
}
