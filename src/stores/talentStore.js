// src/stores/talentStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockTalents } from '@/data/mockData';

export const useTalentStore = defineStore('talents', () => {
  // ── State ──────────────────────────────────────
  const talents = ref([]);
  const isLoading = ref(false);
  const selectedTalent = ref(null);

  // ── Getters ────────────────────────────────────
  const totalTalents = computed(() => talents.value.length);

  const availableTalents = computed(() =>
    talents.value.filter((t) => t.disponibilite === 'disponible'),
  );

  const talentsByCategory = computed(() => {
    return talents.value.reduce((acc, talent) => {
      acc[talent.categorie] = (acc[talent.categorie] || 0) + 1;
      return acc;
    }, {});
  });

  const talentsByCity = computed(() => {
    return talents.value.reduce((acc, talent) => {
      acc[talent.ville] = (acc[talent.ville] || 0) + 1;
      return acc;
    }, {});
  });

  // ── Actions ────────────────────────────────────
  async function fetchTalents() {
    isLoading.value = true;
    // Simule un appel API avec délai réaliste
    await new Promise((resolve) => setTimeout(resolve, 800));
    talents.value = mockTalents;
    isLoading.value = false;
  }

  function getTalentById(id) {
    return talents.value.find((t) => t.id === id) || null;
  }

  function addTalent(talent) {
    const newTalent = {
      ...talent,
      id: crypto.randomUUID(),
      dateInscription: new Date().toISOString(),
      vues: 0,
      note: 0,
    };
    talents.value.unshift(newTalent);
    return newTalent;
  }

  return {
    talents,
    isLoading,
    selectedTalent,
    totalTalents,
    availableTalents,
    talentsByCategory,
    talentsByCity,
    fetchTalents,
    getTalentById,
    addTalent,
  };
});
