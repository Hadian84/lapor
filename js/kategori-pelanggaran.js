/**
 * SISWA SMART MONITORING - VIOLATION CATEGORIES & RULES
 * Manajemen aturan pelanggaran sekolah, pembagian kategori, dan skor bobot poin.
 */

import { DB } from './firebase-config.js';
import { showToast, openModal, closeModal, confirmAction } from './utils.js';

let categories = [];

export async function initViolationCategoriesPage() {
  await loadCategories();
  initAddRuleForm();
}

export async function loadCategories() {
  categories = await DB.getCollection('violation_categories');
  renderCategoriesGrid();
}

function renderCategoriesGrid() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <span class="badge ${cat.name === 'BERAT' ? 'badge-danger' : cat.name === 'SEDANG' ? 'badge-warning' : 'badge-primary'}">${cat.name}</span>
            <span style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">&bull; ${cat.description}</span>
          </h3>
        </div>
        <button class="btn btn-primary btn-sm btn-add-rule" data-cat-id="${cat.id}">
          <i class="fa-solid fa-plus"></i> Tambah Aturan
        </button>
      </div>
      <div class="card-body" style="padding: 0;">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 50px;" class="text-center">No</th>
                <th>Jenis Pelanggaran</th>
                <th style="width: 140px;" class="text-center">Poin Sanksi</th>
                <th style="width: 120px;" class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${cat.items && cat.items.length ? cat.items.map((item, idx) => `
                <tr>
                  <td class="text-center fw-bold">${idx + 1}</td>
                  <td><strong>${item.name}</strong></td>
                  <td class="text-center"><span class="badge badge-danger">+${item.points} Poin</span></td>
                  <td class="text-center">
                    <button class="btn btn-outline-danger btn-sm delete-rule-btn" data-cat-id="${cat.id}" data-rule-id="${item.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('') : `
                <tr><td colspan="4" class="text-center text-muted" style="padding: 1.5rem;">Belum ada butir aturan pada kategori ini.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `).join('');

  attachRuleActionListeners();
}

function attachRuleActionListeners() {
  document.querySelectorAll('.btn-add-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('rule-form').reset();
      document.getElementById('rule-cat-id').value = btn.dataset.catId;
      openModal('rule-modal');
    });
  });

  document.querySelectorAll('.delete-rule-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const catId = btn.dataset.catId;
      const ruleId = btn.dataset.ruleId;

      const ok = await confirmAction({
        title: "Hapus Aturan Pelanggaran",
        message: "Hapus butir aturan pelanggaran ini dari katalog?",
        confirmText: "Hapus",
        confirmClass: "btn-danger"
      });

      if (ok) {
        const cat = categories.find(c => c.id === catId);
        if (cat) {
          cat.items = cat.items.filter(i => i.id !== ruleId);
          await DB.updateDoc('violation_categories', catId, { items: cat.items });
          showToast("Aturan berhasil dihapus", "success");
          await loadCategories();
        }
      }
    });
  });
}

function initAddRuleForm() {
  const form = document.getElementById('rule-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const catId = document.getElementById('rule-cat-id').value;
    const name = document.getElementById('rule-name').value.trim();
    const points = Number(document.getElementById('rule-points').value) || 0;

    if (!name || points <= 0) {
      showToast("Nama pelanggaran dan poin wajib diisi (poin > 0)", "warning");
      return;
    }

    const cat = categories.find(c => c.id === catId);
    if (cat) {
      if (!cat.items) cat.items = [];
      cat.items.push({
        id: `v-custom-${Date.now()}`,
        name,
        points
      });
      await DB.updateDoc('violation_categories', catId, { items: cat.items });
      showToast("Aturan pelanggaran berhasil ditambahkan", "success");
      closeModal('rule-modal');
      await loadCategories();
    }
  });
}
