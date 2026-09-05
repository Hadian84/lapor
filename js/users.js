/**
 * SISWA SMART MONITORING - USERS & CREDENTIALS MODULE
 * Manajemen akun login dan pengaturan password untuk Siswa, Guru, Wali Kelas, dan Admin.
 */

import { DB } from './firebase-config.js';
import { Auth } from './auth.js';
import { showToast, openModal, closeModal, confirmAction, exportTableToExcel, exportToCSV } from './utils.js';

let allUsers = [];
let filteredUsers = [];
let allStudents = [];
let allTeachers = [];

export async function initUsersPage() {
  allStudents = await DB.getCollection('students');
  allTeachers = await DB.getCollection('teachers');
  await loadUsers();
  initFilters();
  initModalsAndForms();
}

export async function loadUsers() {
  let storedUsers = await DB.getCollection('users');

  // Jika collection users masih kosong, sinkronkan dari teachers dan students
  if (!storedUsers || !storedUsers.length) {
    storedUsers = [];
    // Admin default
    storedUsers.push({
      id: "usr-admin",
      username: "admin@sekolah.sch.id",
      email: "admin@sekolah.sch.id",
      name: "Administrator Utama",
      role: "admin",
      password: "admin123",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      passwordUpdatedAt: new Date().toISOString()
    });

    // Guru
    allTeachers.forEach(t => {
      storedUsers.push({
        id: `usr-t-${t.id}`,
        username: t.email,
        email: t.email,
        name: t.name,
        nip: t.nip || '',
        role: t.role || 'guru',
        assignedClass: t.assignedClass || '',
        password: t.role === 'wali_kelas' ? 'wali123' : 'guru123',
        status: 'active',
        teacherId: t.id,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
        passwordUpdatedAt: new Date().toISOString()
      });
    });

    // Siswa
    allStudents.forEach(s => {
      storedUsers.push({
        id: `usr-s-${s.id}`,
        username: s.nis,
        email: `${s.nis}@siswa.sekolah.sch.id`,
        name: s.name,
        nis: s.nis,
        className: s.className,
        role: 'siswa',
        password: 'siswa123',
        status: s.status || 'active',
        studentId: s.id,
        avatar: s.photoUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
        passwordUpdatedAt: new Date().toISOString()
      });
    });

    await DB.setDoc('users', storedUsers);
  }

  allUsers = storedUsers;
  applyFilters();
}

function applyFilters() {
  const query = document.getElementById('search-user')?.value.toLowerCase().trim() || '';
  const roleFilter = document.getElementById('filter-user-role')?.value || '';
  const statusFilter = document.getElementById('filter-user-status')?.value || '';

  filteredUsers = allUsers.filter(u => {
    const matchQuery = !query ||
      u.name.toLowerCase().includes(query) ||
      (u.username && u.username.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.nis && u.nis.includes(query)) ||
      (u.nip && u.nip.includes(query));

    const matchRole = !roleFilter || (
      roleFilter === 'guru_all' ? (u.role === 'guru' || u.role === 'wali_kelas') : u.role === roleFilter
    );

    const matchStatus = !statusFilter || u.status === statusFilter;

    return matchQuery && matchRole && matchStatus;
  });

  renderStats();
  renderUsersTable();
}

function renderStats() {
  const elTotal = document.getElementById('stat-total-users');
  const elTeachers = document.getElementById('stat-teacher-users');
  const elStudents = document.getElementById('stat-student-users');
  const elAdmins = document.getElementById('stat-admin-users');

  if (elTotal) elTotal.textContent = allUsers.length;
  if (elTeachers) elTeachers.textContent = allUsers.filter(u => u.role === 'guru' || u.role === 'wali_kelas').length;
  if (elStudents) elStudents.textContent = allUsers.filter(u => u.role === 'siswa').length;
  if (elAdmins) elAdmins.textContent = allUsers.filter(u => u.role === 'admin').length;
}

function renderUsersTable() {
  const tbody = document.getElementById('users-tbody');
  const countBadge = document.getElementById('users-count-badge');
  if (!tbody) return;

  if (countBadge) countBadge.textContent = `${filteredUsers.length} Akun`;

  if (!filteredUsers.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
          <div class="empty-state">
            <i class="fa-solid fa-users-slash empty-state-icon"></i>
            <div class="empty-state-title">Tidak Ada Akun Ditemukan</div>
            <p class="empty-state-desc">Ubah kata kunci pencarian atau filter peran.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredUsers.map((u, idx) => {
    const roleBadges = {
      admin: '<span class="badge badge-danger"><i class="fa-solid fa-user-shield"></i> Administrator</span>',
      guru: '<span class="badge badge-primary"><i class="fa-solid fa-chalkboard-user"></i> Guru Pengajar</span>',
      wali_kelas: '<span class="badge badge-success"><i class="fa-solid fa-users-rectangle"></i> Wali Kelas</span>',
      siswa: '<span class="badge badge-info"><i class="fa-solid fa-user-graduate"></i> Siswa</span>'
    };

    const subtitleInfo = u.role === 'siswa' 
      ? `Kelas: ${u.className || '-'} &bull; NIS: ${u.nis || u.username}`
      : u.nip ? `NIP: ${u.nip}` : (u.assignedClass ? `Wali: ${u.assignedClass}` : 'Staf Sekolah');

    return `
      <tr>
        <td class="text-center fw-bold">${idx + 1}</td>
        <td>
          <div class="d-flex align-center gap-1">
            <img src="${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" style="width:36px;height:36px;border-radius:var(--radius-full);object-fit:cover;">
            <div>
              <strong>${u.name}</strong>
              <div class="text-muted text-xs">${subtitleInfo}</div>
            </div>
          </div>
        </td>
        <td>
          <strong>${u.username || u.email}</strong>
          <div class="text-muted text-xs">${u.email || '-'}</div>
        </td>
        <td>${roleBadges[u.role] || u.role}</td>
        <td>
          <div class="d-flex align-center gap-1">
            <span class="text-muted" style="font-family: monospace; letter-spacing: 2px;">••••••••</span>
            <button class="btn btn-sm btn-outline-primary show-pass-btn" data-pass="${u.password || 'default'}" title="Lihat Password Singkat" style="padding: 2px 6px; font-size: 0.7rem;">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
          <div class="text-muted text-xs">Diperbarui: ${u.passwordUpdatedAt ? u.passwordUpdatedAt.split('T')[0] : 'Bawaan'}</div>
        </td>
        <td>
          <span class="badge ${u.status === 'active' ? 'badge-success' : 'badge-secondary'}">
            ${u.status === 'active' ? 'Aktif' : 'Non-Aktif'}
          </span>
        </td>
        <td>
          <div class="d-flex align-center gap-1">
            <button class="btn btn-warning btn-sm btn-change-pass" data-id="${u.id}" data-name="${u.name}" title="Ubah Password">
              <i class="fa-solid fa-key"></i> Ubah Password
            </button>
            <button class="btn btn-secondary btn-sm btn-edit-user" data-id="${u.id}" title="Edit Akun">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm btn-delete-user" data-id="${u.id}" data-name="${u.name}" title="Hapus Akun">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachRowListeners();
}

function attachRowListeners() {
  // Tombol Lihat Password Cepat
  document.querySelectorAll('.show-pass-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pass = btn.dataset.pass;
      alert(`Password untuk akun ini: ${pass}`);
    });
  });

  // Tombol Ubah Password
  document.querySelectorAll('.btn-change-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const user = allUsers.find(u => u.id === btn.dataset.id);
      if (!user) return;
      openChangePasswordModal(user);
    });
  });

  // Tombol Edit Akun
  document.querySelectorAll('.btn-edit-user').forEach(btn => {
    btn.addEventListener('click', () => {
      const user = allUsers.find(u => u.id === btn.dataset.id);
      if (!user) return;
      openEditUserModal(user);
    });
  });

  // Tombol Hapus Akun
  document.querySelectorAll('.btn-delete-user').forEach(btn => {
    btn.addEventListener('click', async () => {
      const userId = btn.dataset.id;
      const userName = btn.dataset.name;

      if (userId === 'usr-admin') {
        showToast("Akun Administrator Utama tidak boleh dihapus", "warning");
        return;
      }

      const ok = await confirmAction({
        title: "Hapus Akun Pengguna",
        message: `Apakah Anda yakin ingin menghapus akun login "${userName}"? Pengguna tidak akan dapat login lagi.`,
        confirmText: "Hapus Akun",
        confirmClass: "btn-danger"
      });

      if (ok) {
        allUsers = allUsers.filter(u => u.id !== userId);
        await DB.setDoc('users', allUsers);
        showToast(`Akun ${userName} berhasil dihapus`, "success");
        applyFilters();
      }
    });
  });
}

function initFilters() {
  document.getElementById('search-user')?.addEventListener('input', applyFilters);
  document.getElementById('filter-user-role')?.addEventListener('change', applyFilters);
  document.getElementById('filter-user-status')?.addEventListener('change', applyFilters);

  // Export Excel
  document.getElementById('btn-export-users-excel')?.addEventListener('click', () => {
    exportTableToExcel('users-table', `data_akun_pengguna_${Date.now()}`);
  });

  // Export CSV
  document.getElementById('btn-export-users-csv')?.addEventListener('click', () => {
    const data = filteredUsers.map(u => ({
      Nama: u.name,
      Username: u.username,
      Email: u.email,
      Peran: u.role,
      Status: u.status,
      Password_Saat_Ini: u.password,
      Terakhir_Diperbarui: u.passwordUpdatedAt || ''
    }));
    exportToCSV(`data_akun_${Date.now()}`, data);
  });
}

function openChangePasswordModal(user) {
  document.getElementById('pass-user-id').value = user.id;
  document.getElementById('pass-user-name').textContent = `${user.name} (${user.role.toUpperCase()})`;
  document.getElementById('pass-user-login').textContent = user.username || user.email;
  document.getElementById('new-password-input').value = '';
  document.getElementById('confirm-password-input').value = '';
  openModal('change-password-modal');
}

function openEditUserModal(user) {
  document.getElementById('edit-user-id').value = user.id;
  document.getElementById('edit-user-name').value = user.name;
  document.getElementById('edit-user-username').value = user.username || '';
  document.getElementById('edit-user-email').value = user.email || '';
  document.getElementById('edit-user-role').value = user.role;
  document.getElementById('edit-user-status').value = user.status || 'active';
  document.getElementById('user-modal-title').textContent = 'Edit Akun Pengguna';
  openModal('user-modal');
}

function initModalsAndForms() {
  // 1. Form Ubah Password
  const passForm = document.getElementById('change-password-form');
  passForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('pass-user-id').value;
    const newPass = document.getElementById('new-password-input').value;
    const confirmPass = document.getElementById('confirm-password-input').value;

    if (!newPass || newPass.length < 4) {
      showToast("Password minimal 4 karakter", "warning");
      return;
    }

    if (newPass !== confirmPass) {
      showToast("Konfirmasi password tidak cocok", "danger");
      return;
    }

    const index = allUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      allUsers[index].password = newPass;
      allUsers[index].passwordUpdatedAt = new Date().toISOString();
      await DB.setDoc('users', allUsers);

      // Catat activity log
      try {
        await DB.addDoc('activity_logs', {
          userId: 'usr-admin',
          userName: 'Administrator',
          role: 'admin',
          action: "RESET_PASSWORD",
          target: `Akun ${allUsers[index].name} (${allUsers[index].role})`,
          timestamp: new Date().toISOString()
        });
      } catch (err) {}

      showToast(`Password untuk ${allUsers[index].name} berhasil diperbarui!`, "success");
      closeModal('change-password-modal');
      applyFilters();
    }
  });

  // Tombol Generate Random Password
  document.getElementById('btn-generate-password')?.addEventListener('click', () => {
    const words = ['Smart', 'Cendekia', 'Disiplin', 'Hebat', 'Jawara', 'Sukses'];
    const randWord = words[Math.floor(Math.random() * words.length)];
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `${randWord}#${randNum}`;

    document.getElementById('new-password-input').value = generated;
    document.getElementById('confirm-password-input').value = generated;
    showToast(`Password acak dibuat: ${generated}`, "info");
  });

  // Tombol Reset ke Default Sesuai Role
  document.getElementById('btn-reset-default-pass')?.addEventListener('click', () => {
    const userId = document.getElementById('pass-user-id').value;
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    let defaultPass = "123456";
    if (user.role === 'admin') defaultPass = "admin123";
    else if (user.role === 'guru') defaultPass = "guru123";
    else if (user.role === 'wali_kelas') defaultPass = "wali123";
    else if (user.role === 'siswa') defaultPass = user.nis ? user.nis : "siswa123";

    document.getElementById('new-password-input').value = defaultPass;
    document.getElementById('confirm-password-input').value = defaultPass;
    showToast(`Diatur ke password default: ${defaultPass}`, "info");
  });

  // 2. Form Tambah / Edit Akun
  const userForm = document.getElementById('user-form');
  document.getElementById('btn-add-account')?.addEventListener('click', () => {
    userForm?.reset();
    document.getElementById('edit-user-id').value = '';
    document.getElementById('user-modal-title').textContent = 'Tambah Akun Pengguna Baru';
    document.getElementById('account-pass-group').style.display = 'block';
    openModal('user-modal');
  });

  userForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-user-id').value;
    const name = document.getElementById('edit-user-name').value.trim();
    const username = document.getElementById('edit-user-username').value.trim();
    const email = document.getElementById('edit-user-email').value.trim();
    const role = document.getElementById('edit-user-role').value;
    const status = document.getElementById('edit-user-status').value;

    if (!name || !username) {
      showToast("Nama dan Username/NIS/Email wajib diisi", "warning");
      return;
    }

    if (id) {
      // Edit Akun
      const index = allUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        allUsers[index] = {
          ...allUsers[index],
          name,
          username,
          email,
          role,
          status
        };
        await DB.setDoc('users', allUsers);
        showToast("Data akun berhasil diperbarui", "success");
      }
    } else {
      // Tambah Akun Baru
      const newPassword = document.getElementById('edit-user-initial-pass').value || (role === 'siswa' ? 'siswa123' : 'guru123');
      
      // Cek duplikasi username
      const dup = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (dup) {
        showToast(`Username / Identitas "${username}" sudah digunakan oleh akun lain`, "danger");
        return;
      }

      const newUser = {
        id: `usr-custom-${Date.now()}`,
        name,
        username,
        email: email || `${username}@sekolah.sch.id`,
        role,
        password: newPassword,
        status,
        passwordUpdatedAt: new Date().toISOString(),
        avatar: role === 'siswa' 
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
      };

      allUsers.push(newUser);
      await DB.setDoc('users', allUsers);
      showToast("Akun baru berhasil ditambahkan", "success");
    }

    closeModal('user-modal');
    applyFilters();
  });
}
