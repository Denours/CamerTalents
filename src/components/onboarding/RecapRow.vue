<!-- Composant inline léger pour le récapitulatif
 Composant RecapRow déclaré globalement dans ce fichier -->

<template>
  <div class="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
    <span class="text-sm text-white/40">{{ label }}</span>
    <span class="text-sm text-white font-medium">{{ value }}</span>
  </div>
</template>
<script setup>
defineProps({
  label: String,
  value: String,
});
</script>
