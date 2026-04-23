<template>
  <div
    class="stat-card group"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible="{
      opacity: 1,
      y: 0,
      transition: { duration: 500, delay: index * 80 },
    }"
  >
    <!-- Glow décoratif -->
    <div
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      :style="`background: radial-gradient(
        circle at 50% 0%,
        ${kpi.color}15 0%,
        transparent 70%
      )`"
    />

    <!-- Icône -->
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
      :style="`background: ${kpi.color}20;
               border: 1px solid ${kpi.color}30`"
    >
      <!-- Icône dynamique selon le type -->
      <svg
        v-if="kpi.icon === 'users'"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="kpi.color"
        stroke-width="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <svg
        v-else-if="kpi.icon === 'map'"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="kpi.color"
        stroke-width="2"
      >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
      <svg
        v-else-if="kpi.icon === 'check'"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="kpi.color"
        stroke-width="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <svg
        v-else-if="kpi.icon === 'star'"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        :fill="kpi.color"
        :stroke="kpi.color"
        stroke-width="1"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27
                         17 14.14 18.18 21.02 12 17.77
                         5.82 21.02 7 14.14 2 9.27
                         8.91 8.26 12 2"
        />
      </svg>
    </div>

    <!-- Valeur (compteur animé) -->
    <div class="flex items-baseline gap-1 mb-1">
      <span
        class="font-mono text-3xl font-bold text-white tabular-nums transition-all duration-700"
      >
        {{ displayValue }}
      </span>
      <span v-if="kpi.suffix" class="font-mono text-lg font-bold" :style="`color: ${kpi.color}`">
        {{ kpi.suffix }}
      </span>
    </div>

    <!-- Label -->
    <p class="text-sm text-white/40 mb-3">{{ kpi.label }}</p>

    <!-- Tendance -->
    <div class="flex items-center gap-1.5">
      <span
        v-if="kpi.up !== null"
        class="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
        :class="kpi.up ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline v-if="kpi.up" points="18 15 12 9 6 15" />
          <polyline v-else points="6 9 12 15 18 9" />
        </svg>
        {{ kpi.trend }}
      </span>
      <span v-else class="text-xs text-white/25 px-2 py-0.5 rounded-md bg-white/[0.04]">
        {{ kpi.trend }}
      </span>
      <span class="text-xs text-white/25">{{ kpi.trendLabel || 'ce mois' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  kpi: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

// ── Compteur animé ───────────────────────────────────────────
// Anime la valeur de 0 jusqu'à kpi.value au montage
const displayValue = ref(0);

function animateCount(target) {
  const numericTarget = Number.parseFloat(target);
  if (Number.isNaN(numericTarget)) {
    displayValue.value = target;
    return;
  }

  const duration = 1200; // ms
  const steps = 60;
  const stepTime = duration / steps;
  const increment = numericTarget / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(current + increment, numericTarget);

    // Formater selon le type de valeur
    if (Number.isInteger(numericTarget)) {
      displayValue.value = Math.round(current);
    } else {
      displayValue.value = current.toFixed(1);
    }

    if (step >= steps) {
      clearInterval(timer);
      // Valeur finale exacte
      displayValue.value = Number.isInteger(numericTarget)
        ? numericTarget
        : numericTarget.toFixed(1);
    }
  }, stepTime);
}

onMounted(() => {
  // Délai pour que l'animation soit visible après l'entrée de la card
  setTimeout(
    () => {
      animateCount(props.kpi.value);
    },
    props.index * 80 + 400,
  );
});

// Si la valeur change (ex: données chargées), relancer l'animation
watch(
  () => props.kpi.value,
  (newVal) => {
    animateCount(newVal);
  },
);
</script>

<style scoped>
.stat-card {
  @apply relative p-5 rounded-2xl overflow-hidden
         bg-white/[0.04] border border-white/[0.08]
         hover:border-white/[0.14]
         transition-all duration-300;
}
</style>
