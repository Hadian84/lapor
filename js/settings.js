/**
 * SISWA SMART MONITORING - SETTINGS MODULE
 * Pengaturan Profil Sekolah, Tahun Pelajaran, Jam Masuk/Pulang,
 * Bobot Skor Kedisiplinan, Ambang Batas Poin, dan Pengaturan Firebase / Reset Demo.
 */

import { DB, resetToDemoData } from './firebase-config.js';
import { showToast, confirmAction } from './utils.js';

export async function initSettingsPage() {
  await loadSettings();
  initSettingsForm();
  initDemoDataControls();
  initFirebaseConfigForm();
}

async function loadSettings() {
  const settings = await DB.getSettings();

  document.getElementById('set-school-name').value = settings.schoolName || '';
  document.getElementById('set-npsn').value = settings.npsn || '';
  document.getElementById('set-address').value = settings.address || '';
  document.getElementById('set-principal-name').value = settings.principalName || '';
  document.getElementById('set-principal-nip').value = settings.principalNip || '';
  document.getElementById('set-academic-year').value = settings.academicYear || '2026/2027';
  document.getElementById('set-semester').value = settings.semester || 'Ganjil';
  document.getElementById('set-start-time').value = settings.schoolStartTime || '07:00';
  document.getElementById('set-end-time').value = settings.schoolEndTime || '14:30';

  // Bobot
  document.getElementById('set-weight-att').value = settings.weightAttendance || 60;
  document.getElementById('set-weight-punc').value = settings.weightPunctuality || 20;
  document.getElementById('set-weight-viol').value = settings.weightViolations || 20;
}

function initSettingsForm() {
  const form = document.getElementById('settings-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const wAtt = Number(document.getElementById('set-weight-att').value) || 0;
    const wPunc = Number(document.getElementById('set-weight-punc').value) || 0;
    const wViol = Number(document.getElementById('set-weight-viol').value) || 0;

    if (wAtt + wPunc + wViol !== 100) {
      showToast(`Total bobot harus tepat 100% (saat ini: ${wAtt + wPunc + wViol}%)`, "warning");
      return;
    }

    const updatedSettings = {
      schoolName: document.getElementById('set-school-name').value.trim(),
      npsn: document.getElementById('set-npsn').value.trim(),
      address: document.getElementById('set-address').value.trim(),
      principalName: document.getElementById('set-principal-name').value.trim(),
      principalNip: document.getElementById('set-principal-nip').value.trim(),
      academicYear: document.getElementById('set-academic-year').value,
      semester: document.getElementById('set-semester').value,
      schoolStartTime: document.getElementById('set-start-time').value,
      schoolEndTime: document.getElementById('set-end-time').value,
      weightAttendance: wAtt,
      weightPunctuality: wPunc,
      weightViolations: wViol
    };

    await DB.setDoc('school_settings', updatedSettings);
    showToast("Pengaturan sekolah berhasil disimpan!", "success");
  });
}

function initDemoDataControls() {
  document.getElementById('btn-reset-demo')?.addEventListener('click', async () => {
    const ok = await confirmAction({
      title: "Reset ke Data Demo Awal",
      message: "Apakah Anda yakin ingin mengatur ulang seluruh database ke data demo bawaan (20 siswa, 6 kelas, 5 guru, presensi, pelanggaran, prestasi)? Semua perubahan data akan diganti.",
      confirmText: "Reset Sekarang",
      confirmClass: "btn-danger"
    });

    if (ok) {
      resetToDemoData();
      showToast("Data demo berhasil dipulihkan secara penuh", "success");
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}

function initFirebaseConfigForm() {
  const customConfig = localStorage.getItem('CUSTOM_FIREBASE_CONFIG');
  if (customConfig) {
    document.getElementById('firebase-config-json').value = customConfig;
  }

  document.getElementById('btn-save-firebase-config')?.addEventListener('click', () => {
    const raw = document.getElementById('firebase-config-json').value.trim();
    if (!raw) {
      localStorage.removeItem('CUSTOM_FIREBASE_CONFIG');
      showToast("Konfigurasi custom Firebase dihapus. Menggunakan default.", "info");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.apiKey || !parsed.projectId) {
        throw new Error("Objek JSON harus memiliki minimal 'apiKey' dan 'projectId'");
      }
      localStorage.setItem('CUSTOM_FIREBASE_CONFIG', JSON.stringify(parsed, null, 2));
      showToast("Konfigurasi Firebase berhasil disimpan!", "success");
    } catch (err) {
      showToast("Format JSON konfigurasi tidak valid: " + err.message, "danger");
    }
  });
}
