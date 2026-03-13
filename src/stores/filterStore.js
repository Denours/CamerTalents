// src/stores/filterStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useTalentStore } from './talentStore';

export const useFilterStore = defineStore('filters', () => {
  // ── State ──────────────────────────────────────
  const searchQuery = ref('');
  const selectedCategory = ref('Tous');
  const selectedCity = ref('Toutes');
  const onlyAvailable = ref(false);
  const minRating = ref(0);
  const sortBy = ref('pertinence');

  // ── Getters ────────────────────────────────────
  const filteredTalents = computed(() => {
    const store = useTalentStore();
    let results = [...store.talents];

    // Filtre recherche textuelle
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      results = results.filter(
        (t) =>
          t.nom.toLowerCase().includes(q) ||
          t.metier.toLowerCase().includes(q) ||
          t.competences.some((c) => c.nom.toLowerCase().includes(q)),
      );
    }

    // Filtre catégorie
    if (selectedCategory.value !== 'Tous') {
      results = results.filter((t) => t.categorie === selectedCategory.value);
    }

    // Filtre ville
    if (selectedCity.value !== 'Toutes') {
      results = results.filter((t) => t.ville === selectedCity.value);
    }

    // Filtre disponibilité
    if (onlyAvailable.value) {
      results = results.filter((t) => t.disponibilite === 'disponible');
    }

    // Filtre note minimum
    if (minRating.value > 0) {
      results = results.filter((t) => t.note >= minRating.value);
    }

    // Tri
    if (sortBy.value === 'note') {
      results.sort((a, b) => b.note - a.note);
    } else if (sortBy.value === 'recent') {
      results.sort((a, b) => new Date(b.dateInscription) - new Date(a.dateInscription));
    } else if (sortBy.value === 'vues') {
      results.sort((a, b) => b.vues - a.vues);
    }

    return results;
  });

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (searchQuery.value) count++;
    if (selectedCategory.value !== 'Tous') count++;
    if (selectedCity.value !== 'Toutes') count++;
    if (onlyAvailable.value) count++;
    if (minRating.value > 0) count++;
    return count;
  });

  // ── Actions ────────────────────────────────────
  function resetFilters() {
    searchQuery.value = '';
    selectedCategory.value = 'Tous';
    selectedCity.value = 'Toutes';
    onlyAvailable.value = false;
    minRating.value = 0;
    sortBy.value = 'pertinence';
  }

  return {
    searchQuery,
    selectedCategory,
    selectedCity,
    onlyAvailable,
    minRating,
    sortBy,
    filteredTalents,
    activeFiltersCount,
    resetFilters,
  };
});
