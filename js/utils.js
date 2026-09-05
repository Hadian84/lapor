/**
 * SISWA SMART MONITORING - UTILITY FUNCTIONS
 * Toast notifications, modals, date formatters, discipline calculators, export helpers.
 */

// ==========================================
// 1. TOAST NOTIFICATIONS
// ==========================================
export function showToast(message, type = 'info', title = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    danger: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  const defaultTitle = {
    success: 'Berhasil',
    danger: 'Gagal',
    warning: 'Peringatan',
    info: 'Informasi'
  };

  toast.innerHTML = `
    <i class="${iconMap[type] || iconMap.info} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title || defaultTitle[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// 2. MODAL CONTROLS
// ==========================================
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Global modal backdrop dismiss
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ==========================================
// 3. CONFIRMATION DIALOG
// ==========================================
export function confirmAction({ title = 'Konfirmasi Tindakan', message = 'Apakah Anda yakin ingin melanjutkan?', confirmText = 'Ya, Lanjutkan', confirmClass = 'btn-danger' }) {
  return new Promise((resolve) => {
    let confirmModal = document.getElementById('global-confirm-modal');
    if (!confirmModal) {
      confirmModal = document.createElement('div');
      confirmModal.id = 'global-confirm-modal';
      confirmModal.className = 'modal-backdrop';
      confirmModal.innerHTML = `
        <div class="modal-dialog" style="max-width: 420px;">
          <div class="modal-header">
            <h3 class="modal-title" id="confirm-title">${title}</h3>
            <button class="modal-close" id="confirm-cancel-x">&times;</button>
          </div>
          <div class="modal-body">
            <p id="confirm-msg" class="text-muted" style="font-size: 0.95rem; margin:0;">${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" id="confirm-cancel-btn">Batal</button>
            <button class="btn ${confirmClass} btn-sm" id="confirm-ok-btn">${confirmText}</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);
    } else {
      document.getElementById('confirm-title').textContent = title;
      document.getElementById('confirm-msg').textContent = message;
      const okBtn = document.getElementById('confirm-ok-btn');
      okBtn.textContent = confirmText;
      okBtn.className = `btn ${confirmClass} btn-sm`;
    }

    const cleanup = () => {
      confirmModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    const handleOk = () => {
      cleanup();
      resolve(true);
      removeListeners();
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
      removeListeners();
    };

    function removeListeners() {
      document.getElementById('confirm-ok-btn')?.removeEventListener('click', handleOk);
      document.getElementById('confirm-cancel-btn')?.removeEventListener('click', handleCancel);
      document.getElementById('confirm-cancel-x')?.removeEventListener('click', handleCancel);
    }

    document.getElementById('confirm-ok-btn').onclick = handleOk;
    document.getElementById('confirm-cancel-btn').onclick = handleCancel;
    document.getElementById('confirm-cancel-x').onclick = handleCancel;

    confirmModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

// ==========================================
// 4. DATE & TIME FORMATTERS
// ==========================================
export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function getTodayDateStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==========================================
// 5. DISCIPLINE STATUS & SCORE CALCULATORS
// ==========================================
export function getDisciplineStatus(points = 0) {
  points = Number(points) || 0;
  if (points <= 10) {
    return {
      label: "SANGAT BAIK",
      badgeClass: "status-sangat-baik",
      color: "#16a34a",
      desc: "Disiplin teladan tanpa catatan pelanggaran berarti."
    };
  } else if (points <= 25) {
    return {
      label: "BAIK",
      badgeClass: "status-baik",
      color: "#0284c7",
      desc: "Kepatuhan disiplin secara umum terjaga."
    };
  } else if (points <= 50) {
    return {
      label: "PERLU PEMBINAAN",
      badgeClass: "status-pembinaan",
      color: "#d97706",
      desc: "Membutuhkan bimbingan wali kelas dan guru BK."
    };
  } else if (points <= 75) {
    return {
      label: "PERLU PERHATIAN KHUSUS",
      badgeClass: "status-perhatian-khusus",
      color: "#ea580c",
      desc: "Perlu surat peringatan dan pemanggilan orang tua."
    };
  } else {
    return {
      label: "PEMBINAAN INTENSIF",
      badgeClass: "status-intensif",
      color: "#dc2626",
      desc: "Penanganan intensif sekolah bersama pihak orang tua."
    };
  }
}

/**
 * Hitung Skor Kedisiplinan Siswa (0-100)
 * Rumus proporsional:
 * - Kehadiran: persentase kehadiran (bobot 60%)
 * - Ketepatan Waktu: 100 - (terlambat * 5) (bobot 20%)
 * - Pelanggaran: 100 - (poin * 1.5) (bobot 20%)
 */
export function calculateDisciplineScore(attendancePct = 100, lateCount = 0, violationPoints = 0, weights = { att: 60, punc: 20, viol: 20 }) {
  const attScore = Math.max(0, Math.min(100, attendancePct));
  const puncScore = Math.max(0, 100 - (lateCount * 5));
  const violScore = Math.max(0, 100 - (violationPoints * 1.5));

  const totalScore = Math.round(
    (attScore * (weights.att / 100)) +
    (puncScore * (weights.punc / 100)) +
    (violScore * (weights.viol / 100))
  );

  let category = "Sangat Baik";
  let color = "#16a34a";
  if (totalScore < 60) {
    category = "Perlu Pembinaan";
    color = "#dc2626";
  } else if (totalScore < 75) {
    category = "Cukup";
    color = "#d97706";
  } else if (totalScore < 90) {
    category = "Baik";
    color = "#0284c7";
  }

  return {
    score: totalScore,
    category,
    color,
    attScore,
    puncScore,
    violScore
  };
}

// ==========================================
// 6. EXPORT HELPERS (CSV, EXCEL, PRINT)
// ==========================================
export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) {
    showToast("Tidak ada data untuk diekspor", "warning");
    return;
  }
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date
          ? cell.toLocaleString('id-ID')
          : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`File ${filename}.csv berhasil diunduh`, "success");
}

export function exportTableToExcel(tableId, filename = "laporan") {
  const table = document.getElementById(tableId);
  if (!table) {
    showToast("Tabel data tidak ditemukan", "danger");
    return;
  }
  // Check if XLSX is available via CDN
  if (window.XLSX) {
    const wb = window.XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    window.XLSX.writeFile(wb, `${filename}.xlsx`);
    showToast(`File ${filename}.xlsx berhasil diekspor`, "success");
  } else {
    // Fallback simple HTML excel export
    const html = table.outerHTML;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.xls`);
    link.click();
    showToast(`File ${filename}.xls berhasil diekspor`, "success");
  }
}
