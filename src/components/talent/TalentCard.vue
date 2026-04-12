<template>
  <RouterLink :to="`/talent/${talent._id}`" class="talent-card group block">
    <!-- En-tête : avatar + disponibilité -->
    <div class="flex items-start justify-between mb-4">
      <div class="relative">
        <img
          :src="
            talent.avatar
              ? talent.avatar
              : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
          "
          :alt="talent.nom"
          class="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-300"
        />
        <!-- Point de disponibilité -->
        <span
          class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0F0A1E]"
          :class="availabilityColor"
        />
      </div>

      <!-- Note -->
      <div
        class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08]"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="#FBBF24"
          stroke="#FBBF24"
          stroke-width="1"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27
                           17 14.14 18.18 21.02 12 17.77
                           5.82 21.02 7 14.14 2 9.27
                           8.91 8.26 12 2"
          />
        </svg>
        <span class="text-xs font-mono font-bold text-white">
          {{ talent.note.toFixed(1) }}
        </span>
      </div>
    </div>

    <!-- Nom & métier -->
    <h3
      class="font-title font-bold text-base text-white mb-0.5 group-hover:text-primary-100 transition-colors duration-200 line-clamp-1"
    >
      {{ talent.nom }}
    </h3>
    <p class="text-sm text-white/50 mb-3 line-clamp-1">{{ talent.metier }}</p>

    <!-- Localisation -->
    <div class="flex items-center gap-1.5 mb-4">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="text-white/30 flex-shrink-0"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span class="text-xs text-white/40"> {{ talent.ville }}, {{ talent.quartier }} </span>
    </div>

    <!-- Compétences (max 3) -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span v-for="skill in talent.competences.slice(0, 3)" :key="skill.nom" class="skill-tag">
        {{ skill.nom }}
      </span>
      <span v-if="talent.competences.length > 3" class="skill-tag skill-tag--more">
        +{{ talent.competences.length - 3 }}
      </span>
    </div>

    <!-- Footer : disponibilité + vues -->
    <div class="flex items-center justify-between pt-3 border-t border-white/[0.06]">
      <span class="text-xs font-medium px-2 py-1 rounded-lg" :class="availabilityBadgeClass">
        {{ availabilityLabel }}
      </span>
      <div class="flex items-center gap-1 text-white/30">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span class="text-xs font-mono">{{ talent.vues }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  talent: {
    type: Object,
    required: true,
  },
});

// ── Disponibilité ────────────────────────────────────────────
const availabilityColor = computed(() => {
  const map = {
    disponible: 'bg-green-400',
    occupé: 'bg-red-400',
    'partiellement disponible': 'bg-yellow-400',
  };
  return map[props.talent.disponibilite] || 'bg-gray-400';
});

const availabilityBadgeClass = computed(() => {
  const map = {
    disponible: 'bg-green-500/15 text-green-400',
    occupé: 'bg-red-500/15 text-red-400',
    'partiellement disponible': 'bg-yellow-500/15 text-yellow-400',
  };
  return map[props.talent.disponibilite] || 'bg-white/10 text-white/50';
});

const availabilityLabel = computed(() => {
  const map = {
    disponible: 'Disponible',
    occupé: 'Occupé',
    'partiellement disponible': 'Partiel',
  };
  return map[props.talent.disponibilite] || props.talent.disponibilite;
});
</script>

<style scoped>
/* ── Carte principale ────────────────────────────────────────── */
.talent-card {
  @apply p-5 rounded-2xl
         bg-white/[0.04] border border-white/[0.08]
         hover:bg-white/[0.07] hover:border-primary/25
         hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10
         transition-all duration-300 cursor-pointer;
}

/* ── Tags de compétences ─────────────────────────────────────── */
.skill-tag {
  @apply px-2.5 py-1 rounded-lg text-[11px] font-medium
         bg-white/[0.06] text-white/60 border border-white/[0.08];
}

.skill-tag--more {
  @apply bg-primary/10 text-primary-100 border-primary/20;
}
</style>
