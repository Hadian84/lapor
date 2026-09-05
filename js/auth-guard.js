/**
 * SISWA SMART MONITORING - AUTH GUARD & APP SHELL CONTROLLER
 * Melindungi halaman internal, merender profil user di header & sidebar,
 * drawer navigasi mobile, pencarian global siswa, dan dropdown notifikasi.
 */

import { Auth } from './auth.js';
import { DB } from './firebase-config.js';
import { getDisciplineStatus } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Cek Sesi Pengguna
  const currentUser = Auth.getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // 2. Cek Role Access
  const allowedRolesAttr = document.body.dataset.allowedRoles;
  if (allowedRolesAttr) {
    const allowedRoles = allowedRolesAttr.split(',').map(r => r.trim());
    if (!allowedRoles.includes(currentUser.role)) {
      alert(`Akses ditolak. Halaman ini memerlukan hak akses: ${allowedRoles.join(', ')}`);
      window.location.href = Auth.getRedirectUrl(currentUser.role);
      return;
    }
  }

  // 3. Render Informasi User di Shell
  renderUserInfo(currentUser);

  // 4. Inisialisasi Interaksi UI Shell
  initSidebarToggle();
  initLogoutButtons();
  initGlobalSearch();
  initNotificationBell(currentUser);
  renderActiveNavMenu();
  renderAcademicYearBadge();
});

function renderUserInfo(user) {
  // Update header & sidebar avatars
  const avatarEls = document.querySelectorAll('.current-user-avatar');
  avatarEls.forEach(el => {
    if (user.avatar) {
      el.innerHTML = `<img src="${user.avatar}" alt="${user.name}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
    } else {
      el.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    }
  });

  // Update names & roles
  const nameEls = document.querySelectorAll('.current-user-name');
  nameEls.forEach(el => {
    el.textContent = user.name || 'Pengguna';
  });

  const roleEls = document.querySelectorAll('.current-user-role');
  roleEls.forEach(el => {
    const roleLabels = {
      admin: 'Administrator',
      guru: 'Guru Pengajar',
      wali_kelas: `Wali Kelas ${user.assignedClassName ? '(' + user.assignedClassName + ')' : ''}`,
      siswa: `Siswa (${user.className || 'SMP'})`
    };
    el.textContent = roleLabels[user.role] || user.role;
  });

  // Tampilkan atau sembunyikan menu khusus admin / guru / wali kelas
  document.querySelectorAll('[data-role-only]').forEach(el => {
    const allowed = el.dataset.roleOnly.split(',').map(r => r.trim());
    if (!allowed.includes(user.role)) {
      el.style.display = 'none';
    }
  });
}

function initSidebarToggle() {
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  const sidebar = document.querySelector('.sidebar');
  
  // Buat overlay jika belum ada
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay && sidebar) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('active');
    });
  }
}

function initLogoutButtons() {
  document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
        await Auth.logout();
      }
    });
  });
}

async function renderAcademicYearBadge() {
  const badgeEl = document.querySelector('.header-academic-year');
  if (badgeEl) {
    try {
      const settings = await DB.getSettings();
      badgeEl.innerHTML = `<i class="fa-solid fa-calendar-days"></i> <span>T.P. ${settings.academicYear || '2026/2027'} - ${settings.semester || 'Ganjil'}</span>`;
    } catch (e) {}
  }
}

function renderActiveNavMenu() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Global Student Search (Header Search Input)
async function initGlobalSearch() {
  const searchInput = document.getElementById('global-student-search');
  if (!searchInput) return;

  // Siapkan container dropdown hasil pencarian
  let resultDropdown = document.getElementById('global-search-results');
  if (!resultDropdown) {
    resultDropdown = document.createElement('div');
    resultDropdown.id = 'global-search-results';
    resultDropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      width: 360px;
      max-height: 380px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      z-index: 1060;
      display: none;
      margin-top: 6px;
    `;
    searchInput.parentElement.appendChild(resultDropdown);
  }

  let timeout = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) {
        resultDropdown.style.display = 'none';
        return;
      }

      const students = await DB.getCollection('students');
      const violations = await DB.getCollection('violations');

      const matches = students.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.nis.toLowerCase().includes(query) ||
        (s.nisn && s.nisn.includes(query)) ||
        (s.className && s.className.toLowerCase().includes(query))
      ).slice(0, 6);

      if (!matches.length) {
        resultDropdown.innerHTML = `
          <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
            Tidak ditemukan siswa dengan kata kunci "${query}"
          </div>
        `;
        resultDropdown.style.display = 'block';
        return;
      }

      resultDropdown.innerHTML = matches.map(s => {
        // Hitung total poin
        const studentViolations = violations.filter(v => v.studentId === s.id);
        const totalPoints = studentViolations.reduce((sum, v) => sum + (Number(v.points) || 0), 0);
        const status = getDisciplineStatus(totalPoints);

        return `
          <a href="profil-siswa.html?id=${s.id}" style="
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border-color);
            text-decoration: none;
            color: inherit;
            transition: background 0.15s;
          " onmouseover="this.style.background='var(--bg-subtle)'" onmouseout="this.style.background='transparent'">
            <img src="${s.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}" style="width:38px;height:38px;border-radius:var(--radius-full);object-fit:cover;">
            <div style="flex-grow: 1; min-width: 0;">
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--dark);">${s.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${s.className} &bull; NIS: ${s.nis}</div>
            </div>
            <span class="badge ${status.badgeClass}" style="font-size: 0.65rem;">${status.label}</span>
          </a>
        `;
      }).join('');

      resultDropdown.style.display = 'block';
    }, 250);
  });

  // Tutup dropdown saat klik di luar
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultDropdown.contains(e.target)) {
      resultDropdown.style.display = 'none';
    }
  });
}

// Notification Bell Controller
async function initNotificationBell(currentUser) {
  const bellBtn = document.getElementById('notif-bell-btn');
  const dropdown = document.getElementById('notif-dropdown-menu');
  if (!bellBtn || !dropdown) return;

  // Dapatkan notifikasi
  const notifs = [
    { title: "Presensi Harian", desc: "Presensi kelas 7A & 8A telah tercatat hari ini.", time: "10 menit lalu", type: "info" },
    { title: "Catatan Pelanggaran Baru", desc: "1 catatan pelanggaran baru perlu perhatian.", time: "1 jam lalu", type: "danger" },
    { title: "Prestasi Siswa", desc: "Aditya Pratama meraih Juara 1 Olimpiade Matematika.", time: "3 jam lalu", type: "success" }
  ];

  dropdown.innerHTML = `
    <div class="notif-header">
      <span>Notifikasi Sistem</span>
      <span class="badge badge-primary">${notifs.length} Baru</span>
    </div>
    <ul class="notif-list">
      ${notifs.map(n => `
        <li class="notif-item unread">
          <div class="notif-icon"><i class="fa-solid fa-${n.type === 'danger' ? 'triangle-exclamation text-danger' : n.type === 'success' ? 'trophy text-success' : 'bell text-info'}"></i></div>
          <div class="notif-content">
            <p><strong>${n.title}</strong>: ${n.desc}</p>
            <div class="notif-time">${n.time}</div>
          </div>
        </li>
      `).join('')}
    </ul>
    <div style="padding: 0.65rem; text-align: center; background: var(--bg-app); border-top: 1px solid var(--border-color);">
      <a href="#" style="font-size: 0.8rem; font-weight: 600; color: var(--primary);">Tandai Semua Dibaca</a>
    </div>
  `;

  bellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}
