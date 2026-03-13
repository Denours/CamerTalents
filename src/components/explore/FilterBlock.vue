<template>
  <div class="filter-block">
    <!-- En-tête cliquable -->
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between py-2 text-left group"
    >
      <span
        class="text-xs font-semibold text-white/30 uppercase tracking-widest group-hover:text-white/50 transition-colors duration-200"
      >
        {{ title }}
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="text-white/20 transition-transform duration-300"
        :class="isOpen ? 'rotate-180' : ''"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <!-- Contenu déroulant -->
    <Transition name="accordion">
      <div v-if="isOpen" class="mt-2 space-y-1">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
});

// Ouvert par défaut
const isOpen = ref(true);
</script>

<style scoped>
.filter-block {
  @apply border-b border-white/[0.06] pb-5;
}

/* Animation accordéon */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
