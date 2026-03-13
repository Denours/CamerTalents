<script setup>
import { ref } from 'vue';
import AppNavbar from './components/layout/AppNavbar.vue';

const isDark = ref(false);
const toggleTheme = () => (isDark.value = !isDark.value);
</script>

<template>
  <div
    :class="isDark ? 'dark' : ''"
    class="min-h-screen bg-[#F8F7FF] dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <AppNavbar @toggle-theme="toggleTheme" :is-dark="isDark"/>

    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
/* Transition entre les pages */
.page-enter-active,
.page-leave-active {
  transition: all 0.35s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
