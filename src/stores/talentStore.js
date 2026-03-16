// ============================================================
//  CamerTalents — src/stores/talentStore.js
//  Store Pinia avec persistance localStorage
//  Les talents ajoutés via l'onboarding survivent au refresh
// ============================================================
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockTalents } from '../data/mockData';

// Clé utilisée dans localStorage
const LS_KEY = 'camertalents_added_talents';

// ── Helpers localStorage ─────────────────────────────────────

// Lit les talents ajoutés par les utilisateurs depuis localStorage
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    // Si le JSON est corrompu, on repart de zéro
    localStorage.removeItem(LS_KEY);
    return [];
  }
}

// Sauvegarde uniquement les talents ajoutés par l'utilisateur
// (pas les mockTalents — ils sont déjà dans le code)
function saveToStorage(addedTalents) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(addedTalents));
  } catch {
    // localStorage peut être indisponible (navigation privée, quota dépassé)
    console.warn('CamerTalents: impossible de sauvegarder dans localStorage');
  }
}

export const useTalentStore = defineStore('talents', () => {
  // ── State ──────────────────────────────────────
  // Talents ajoutés par les utilisateurs (persistés)
  // On les charge depuis localStorage au démarrage
  const addedTalents = ref(loadFromStorage());

  // Tous les talents = mockTalents (base) + talents ajoutés
  // Les talents ajoutés apparaissent EN PREMIER (plus récents)
  const talents = computed(() => [...addedTalents.value, ...mockTalents]);

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
  // Simule un fetch API (délai réaliste)
  // Les données sont déjà dispo via computed, donc juste un délai visuel
  async function fetchTalents() {
    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 600));
    isLoading.value = false;
  }

  // Trouve un talent par son id (cherche dans les deux sources)
  function getTalentById(id) {
    return talents.value.find((t) => t.id === id) || null;
  }

  // Ajoute un nouveau talent ET le persiste dans localStorage
  function addTalent(talentData) {
    const newTalent = {
      ...talentData,
      id: crypto.randomUUID(),
      dateInscription: new Date().toISOString(),
      vues: 0,
      note: 0,
      avis: 0,
    };
    // Ajoute en tête de liste
    addedTalents.value.unshift(newTalent);

    // Sauvegarde dans localStorage — survivra au refresh
    saveToStorage(addedTalents.value);
    return newTalent;
  }

  // Supprime un talent ajouté (uniquement les talents user, pas les mock)
  function removeTalent(id) {
    addedTalents.value = addedTalents.value.filter((t) => t.id !== id);
    saveToStorage(addedTalents.value);
  }

  // Remet à zéro uniquement les talents ajoutés par l'utilisateur
  function clearAddedTalents() {
    addedTalents.value = [];
    localStorage.removeItem(LS_KEY);
  }

  return {
    // State
    talents,
    addedTalents,
    isLoading,
    selectedTalent,
    // Getters
    totalTalents,
    availableTalents,
    talentsByCategory,
    talentsByCity,
    // Actions
    fetchTalents,
    getTalentById,
    addTalent,
    removeTalent,
    clearAddedTalents,
  };
});
