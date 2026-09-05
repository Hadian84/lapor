/**
 * SISWA SMART MONITORING - FIREBASE CONFIG & STORAGE ENGINE
 * Sistem Monitoring Pelanggaran, Prestasi dan Kehadiran
 * 
 * Mendukung mode Live Firebase dan mode Demo/Offline Storage secara mulus.
 */

import { INITIAL_DEMO_DATA } from './demo-data.js';

// ==========================================
// 1. TEMPLATE KONFIGURASI FIREBASE
// ==========================================
// Ganti nilai di bawah ini dengan konfigurasi dari Firebase Console Anda:
// Project Settings > General > Your apps > Web app (</>)
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "siswa-smart-monitoring.firebaseapp.com",
  projectId: "siswa-smart-monitoring",
  storageBucket: "siswa-smart-monitoring.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Cek apakah konfigurasi Firebase sudah diisi dengan API Key asli
export function isFirebaseConfigured() {
  const customConfig = localStorage.getItem('CUSTOM_FIREBASE_CONFIG');
  if (customConfig) {
    try {
      const parsed = JSON.parse(customConfig);
      if (parsed.apiKey && !parsed.apiKey.includes('YOUR_FIREBASE_API_KEY') && parsed.projectId) {
        return true;
      }
    } catch (e) {
      console.warn("Invalid stored Firebase config", e);
    }
  }
  return firebaseConfig.apiKey && 
         !firebaseConfig.apiKey.includes('YOUR_FIREBASE_API_KEY') && 
         firebaseConfig.projectId !== 'siswa-smart-monitoring';
}

export function getActiveFirebaseConfig() {
  const custom = localStorage.getItem('CUSTOM_FIREBASE_CONFIG');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch (e) {}
  }
  return firebaseConfig;
}

// Inisialisasi Database Lokal / Mock Fallback
const STORAGE_PREFIX = "SISWA_SMART_MONITORING_";

export function initStorage() {
  const initialized = localStorage.getItem(STORAGE_PREFIX + "INITIALIZED");
  if (!initialized) {
    resetToDemoData();
  } else {
    // Migrasi otomatis nama sekolah jika masih menggunakan nama lama
    try {
      const settingsRaw = localStorage.getItem(STORAGE_PREFIX + "school_settings");
      if (settingsRaw) {
        const settings = JSON.parse(settingsRaw);
        let changed = false;
        if (settings.schoolName === "SMP Negeri 1 Smart Cendekia" || settings.schoolName === "SMP N 1 Smart Cendekia") {
          settings.schoolName = "SMP Negeri 1 Segah";
          changed = true;
        }
        if (settings.address && settings.address.includes("Kota Cendekia")) {
          settings.address = "Jl. Pendidikan, Kec. Segah, Kab. Berau";
          changed = true;
        }
        if (settings.principalName === "Dra. Hj. Siti Rahmawati, M.Pd") {
          settings.principalName = "Hadi Permana, S.Pd, M.Pd";
          changed = true;
        }
        if (settings.principalNip === "196805121993032001") {
          settings.principalNip = "198407202009041004";
          changed = true;
        }
        if (changed) {
          localStorage.setItem(STORAGE_PREFIX + "school_settings", JSON.stringify(settings));
        }
      }
    } catch (e) {
      console.warn("Migration warning:", e);
    }
  }
}

export function resetToDemoData() {
  Object.keys(INITIAL_DEMO_DATA).forEach(key => {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(INITIAL_DEMO_DATA[key]));
  });
  localStorage.setItem(STORAGE_PREFIX + "INITIALIZED", "true");
  console.log("✓ Data Demo berhasil dimuat!");
}

// Data Access Layer (DAL)
export const DB = {
  // Ambil semua dokumen dalam collection
  async getCollection(collectionName) {
    initStorage();
    const data = localStorage.getItem(STORAGE_PREFIX + collectionName);
    return data ? JSON.parse(data) : [];
  },

  // Ambil single dokumen berdasarkan ID
  async getDoc(collectionName, id) {
    const list = await this.getCollection(collectionName);
    return list.find(item => item.id === id) || null;
  },

  // Tambah dokumen baru (generate ID jika belum ada)
  async addDoc(collectionName, data) {
    const list = await this.getCollection(collectionName);
    const newDoc = {
      id: data.id || `${collectionName.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    list.unshift(newDoc);
    localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(list));
    return newDoc;
  },

  // Update dokumen yang ada
  async updateDoc(collectionName, id, updates) {
    const list = await this.getCollection(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  // Hapus dokumen berdasarkan ID
  async deleteDoc(collectionName, id) {
    const list = await this.getCollection(collectionName);
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(filtered));
    return true;
  },

  // Simpan seluruh dokumen (misal settings)
  async setDoc(collectionName, data) {
    localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(data));
    return data;
  },

  // Ambil objek setting tunggal
  async getSettings() {
    initStorage();
    const data = localStorage.getItem(STORAGE_PREFIX + "school_settings");
    return data ? JSON.parse(data) : INITIAL_DEMO_DATA.school_settings;
  }
};

// Inisialisasi otomatis pada load
initStorage();
