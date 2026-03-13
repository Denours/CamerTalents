// src/composables/useStats.js
import { computed } from 'vue';
import { useTalentStore } from '@/stores/talentStore';
import { storeToRefs } from 'pinia';

export function useStats() {
  const store = useTalentStore();
  const { talents, talentsByCategory, talentsByCity } = storeToRefs(store);

  const availabilityRate = computed(() => {
    if (!talents.value.length) return 0;
    const available = talents.value.filter((t) => t.disponibilite === 'disponible').length;
    return Math.round((available / talents.value.length) * 100);
  });

  const averageRating = computed(() => {
    if (!talents.value.length) return 0;
    const sum = talents.value.reduce((acc, t) => acc + t.note, 0);
    return Number.parseFloat((sum / talents.value.length).toFixed(1));
  });

  const topSkills = computed(() => {
    const skillCount = {};
    talents.value.forEach((t) => {
      t.competences.forEach((c) => {
        skillCount[c.nom] = (skillCount[c.nom] || 0) + 1;
      });
    });
    return Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([nom, count]) => ({ nom, count }));
  });

  const growthData = computed(() => {
    // Génère des données d'inscription par mois
    const months = [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Jun',
      'Jul',
      'Aoû',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ];
    return months.map((month, i) => ({
      month,
      inscriptions: Math.floor(40 + Math.random() * 80 + i * 12),
    }));
  });

  return {
    availabilityRate,
    averageRating,
    topSkills,
    growthData,
    talentsByCategory,
    talentsByCity,
  };
}
