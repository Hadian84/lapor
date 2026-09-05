/**
 * SISWA SMART MONITORING - ATTENDANCE MODULE
 * Presensi harian & per mata pelajaran, rekap persentase, batch tandai hadir.
 */

import { DB } from './firebase-config.js';
import { Auth } from './auth.js';
import { showToast, getTodayDateStr, formatDate, exportToCSV, exportTableToExcel } from './utils.js';

let currentClassStudents = [];

export async function initAttendancePage() {
  initAttendanceFilters();
  setDefaultDate();
  await loadClassRoster();
}

function setDefaultDate() {
  const dateInput = document.getElementById('att-date');
  if (dateInput) dateInput.value = getTodayDateStr();
}

function initAttendanceFilters() {
  document.getElementById('att-class')?.addEventListener('change', loadClassRoster);
  document.getElementById('att-date')?.addEventListener('change', loadClassRoster);

  // Tombol Tandai Semua Hadir
  document.getElementById('btn-mark-all-present')?.addEventListener('click', () => {
    document.querySelectorAll('.att-status-radio[value="HADIR"]').forEach(r => r.checked = true);
    updateAttendanceSummaryStats();
    showToast("Semua siswa ditandai HADIR", "info");
  });

  // Tombol Simpan Presensi
  document.getElementById('btn-save-attendance')?.addEventListener('click', saveAttendanceBatch);

  // Export
  document.getElementById('btn-export-attendance')?.addEventListener('click', () => {
    exportTableToExcel('attendance-table', `presensi_${document.getElementById('att-class')?.value || 'kelas'}_${getTodayDateStr()}`);
  });
}

export async function loadClassRoster() {
  const classId = document.getElementById('att-class')?.value || 'cls-7a';
  const date = document.getElementById('att-date')?.value || getTodayDateStr();

  const allStudents = await DB.getCollection('students');
  currentClassStudents = allStudents.filter(s => s.classId === classId);

  // Cek apakah presensi tanggal & kelas ini sudah pernah dicatat
  const allAtt = await DB.getCollection('attendance');
  const existingAtt = allAtt.filter(a => a.classId === classId && a.date === date);
  const attMap = {};
  existingAtt.forEach(a => {
    attMap[a.studentId] = a;
  });

  renderAttendanceRoster(currentClassStudents, attMap);
  updateAttendanceSummaryStats();
}

function renderAttendanceRoster(students, attMap) {
  const tbody = document.getElementById('attendance-tbody');
  if (!tbody) return;

  if (!students.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 2rem;">
          Tidak ada siswa terdaftar di kelas yang dipilih.
        </td>
      </tr>
    `;
    return;
  }

  const statuses = [
    { value: 'HADIR', label: 'Hadir', color: 'success' },
    { value: 'SAKIT', label: 'Sakit', color: 'info' },
    { value: 'IZIN', label: 'Izin', color: 'warning' },
    { value: 'ALPA', label: 'Alpa', color: 'danger' },
    { value: 'TERLAMBAT', label: 'Terlambat', color: 'secondary' },
    { value: 'DINAS', label: 'Kegiatan Sekolah', color: 'primary' }
  ];

  tbody.innerHTML = students.map((s, idx) => {
    const saved = attMap[s.id];
    const currentStatus = saved ? saved.status : 'HADIR';
    const currentNote = saved ? saved.note : '';

    return `
      <tr data-student-id="${s.id}">
        <td class="text-center fw-bold">${idx + 1}</td>
        <td><strong>${s.nis}</strong></td>
        <td>
          <div class="d-flex align-center gap-1">
            <img src="${s.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}" style="width:30px;height:30px;border-radius:var(--radius-full);object-fit:cover;">
            <a href="profil-siswa.html?id=${s.id}" class="fw-bold">${s.name}</a>
          </div>
        </td>
        <td colspan="3">
          <div class="d-flex align-center gap-2 flex-wrap">
            ${statuses.map(st => `
              <label class="form-check" style="margin: 0; font-size: 0.85rem;">
                <input type="radio" name="status-${s.id}" class="att-status-radio" value="${st.value}" ${currentStatus === st.value ? 'checked' : ''} onchange="window.updateAttStats()">
                <span class="badge badge-${st.color}" style="cursor: pointer;">${st.label}</span>
              </label>
            `).join('')}
          </div>
        </td>
        <td>
          <input type="text" class="form-control form-control-sm att-note-input" value="${currentNote}" placeholder="Catatan opsional...">
        </td>
      </tr>
    `;
  }).join('');
}

window.updateAttStats = () => {
  updateAttendanceSummaryStats();
};

function updateAttendanceSummaryStats() {
  const radios = document.querySelectorAll('.att-status-radio:checked');
  let hadir = 0, sakit = 0, izin = 0, alpa = 0, terlambat = 0, dinas = 0;

  radios.forEach(r => {
    switch (r.value) {
      case 'HADIR': hadir++; break;
      case 'SAKIT': sakit++; break;
      case 'IZIN': izin++; break;
      case 'ALPA': alpa++; break;
      case 'TERLAMBAT': terlambat++; break;
      case 'DINAS': dinas++; break;
    }
  });

  const total = currentClassStudents.length || 1;
  const pct = Math.round(((hadir + dinas) / total) * 100);

  const elPct = document.getElementById('summary-att-percentage');
  const elHadir = document.getElementById('summary-count-hadir');
  const elSakit = document.getElementById('summary-count-sakit');
  const elIzin = document.getElementById('summary-count-izin');
  const elAlpa = document.getElementById('summary-count-alpa');

  if (elPct) elPct.textContent = `${pct}%`;
  if (elHadir) elHadir.textContent = hadir;
  if (elSakit) elSakit.textContent = sakit;
  if (elIzin) elIzin.textContent = izin;
  if (elAlpa) elAlpa.textContent = alpa;
}

async function saveAttendanceBatch() {
  const classSelect = document.getElementById('att-class');
  const classId = classSelect.value;
  const className = classSelect.options[classSelect.selectedIndex]?.text;
  const date = document.getElementById('att-date').value;
  const subject = document.getElementById('att-subject')?.value || 'Presensi Harian';
  const currentUser = Auth.getCurrentUser();

  const rows = document.querySelectorAll('#attendance-tbody tr[data-student-id]');
  if (!rows.length) {
    showToast("Tidak ada data siswa untuk disimpan", "warning");
    return;
  }

  const existing = await DB.getCollection('attendance');
  // Hapus catatan presensi lama pada tanggal & kelas yang sama agar tidak duplikat
  const filtered = existing.filter(a => !(a.classId === classId && a.date === date && a.subject === subject));

  rows.forEach(row => {
    const studentId = row.dataset.studentId;
    const checkedRadio = row.querySelector('.att-status-radio:checked');
    const note = row.querySelector('.att-note-input')?.value.trim() || '';
    const status = checkedRadio ? checkedRadio.value : 'HADIR';

    filtered.push({
      id: `att-${classId}-${studentId}-${date}`,
      studentId,
      classId,
      className,
      date,
      subject,
      status,
      note,
      teacherId: currentUser?.id || 'tch-1',
      teacherName: currentUser?.name || 'Guru Piket',
      createdAt: new Date().toISOString()
    });
  });

  await DB.setDoc('attendance', filtered);
  showToast("Presensi berhasil disimpan ke database!", "success");
}
