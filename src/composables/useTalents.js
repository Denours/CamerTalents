// src/composables/useTalents.js
import { useTalentStore } from '../stores/talentStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

export function useTalents() {
  const store = useTalentStore();
  const { talents, isLoading, totalTalents } = storeToRefs(store);

  onMounted(async () => {
    if (talents.value.length === 0) {
      await store.fetchTalents();
    }
  });

  return {
    talents,
    isLoading,
    totalTalents,
    getTalentById: store.getTalentById,
    addTalent: store.addTalent,
  };
}
