// src/composables/useTalents.js — VERSION BACKEND
import { useTalentStore } from '../stores/talentStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

export function useTalents() {
  const store = useTalentStore();
  const { talents, isLoading, totalTalents } = storeToRefs(store);

  onMounted(async () => {
    // Charge depuis l'API si le store est vide
    if (talents.value.length === 0) {
      await store.fetchTalents();
    }
  });

  return {
    talents,
    isLoading,
    totalTalents,
    getTalentById: store.getTalentById,
    // addTalent et removeTalent sont maintenant gérés
    // directement via talentsAPI dans les vues concernées
  };
}
