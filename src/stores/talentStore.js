// ============================================================
//  src/stores/talentStore.js  — VERSION BACKEND
//  Toutes les données viennent maintenant de l'API.
//  Plus de mockData, plus de localStorage pour les talents.
// ============================================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { talentsAPI } from '../services/api';

export const useTalentStore = defineStore('talents', () => {
  // ══════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════

  const talents = ref([]);
  const isLoading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const totalPages = ref(1);

  // ══════════════════════════════════════════════════════════
  //  GETTERS
  // ══════════════════════════════════════════════════════════

  const totalTalents = computed(() => total.value);

  const talentsByCategory = computed(() =>
    talents.value.reduce((acc, t) => {
      acc[t.categorie] = (acc[t.categorie] || 0) + 1;
      return acc;
    }, {}),
  );

  const talentsByCity = computed(() =>
    talents.value.reduce((acc, t) => {
      acc[t.ville] = (acc[t.ville] || 0) + 1;
      return acc;
    }, {}),
  );

  // ══════════════════════════════════════════════════════════
  //  ACTIONS
  // ══════════════════════════════════════════════════════════

  async function fetchTalents(params = {}) {
    isLoading.value = true;
    try {
      const data = await talentsAPI.getAll({ ...params, limit: 100 });
      if (data.success) {
        talents.value = data.talents;
        total.value = data.total;
        page.value = data.page;
        totalPages.value = data.totalPages;
      }
    } catch (error) {
      console.error('Erreur fetchTalents:', error.message);
    } finally {
      isLoading.value = false;
    }
  }

  // Cherche un talent par son _id MongoDB
  // D'abord dans le cache local, puis appel API si nécessaire
  async function getTalentById(id) {
    if (!id) return null;
    const local = talents.value.find((t) => t._id === id || t.id === id);
    if (local) return local;
    try {
      const data = await talentsAPI.getById(id);
      return data.success ? data.talent : null;
    } catch {
      return null;
    }
  }

  function clearTalents() {
    talents.value = [];
    total.value = 0;
  }

  return {
    talents,
    isLoading,
    total,
    page,
    totalPages,
    totalTalents,
    talentsByCategory,
    talentsByCity,
    fetchTalents,
    getTalentById,
    clearTalents,
  };
});
