<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-dark'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- ── Logo ─────────────────────────────────── -->
        <RouterLink to="/" class="flex items-center gap-2 group" @click="closeMobileMenu">
          <div
            class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="6" r="4" stroke="white" stroke-width="1.5" />
              <circle cx="11" cy="11" r="3" stroke="#F97316" stroke-width="1.5" />
            </svg>
          </div>
          <span class="font-title font-semibold text-[20px] text-white tracking-tight">
            CamerTalents
          </span>
        </RouterLink>

        <!-- ── Navigation desktop ────────────────────── -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="isActive(link.to) ? 'nav-link--active' : ''"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- ── Actions desktop ───────────────────────── -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Dark mode toggle -->
          <button
            @click="$emit('toggle-theme')"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            :title="isDark ? 'Mode clair' : 'Mode sombre'"
          >
            <!-- Icône Soleil (mode clair) -->
            <svg
              v-if="isDark"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <!-- Icône Lune (mode sombre) -->
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <!-- CTA Rejoindre -->
          <RouterLink
            to="/onboarding"
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white font-medium text-md hover:bg-primary-600 active:scale-95 transition-all duration-200"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line
                x1="6"
                y1="1"
                x2="6"
                y2="11"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="1"
                y1="6"
                x2="11"
                y2="6"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Rejoindre
          </RouterLink>
        </div>

        <!-- ── Bouton hamburger (mobile) ─────────────── -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
          :aria-label="mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        >
          <!-- Barre 1 — tourne en X quand menu ouvert -->
          <span
            class="block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
            :class="mobileMenuOpen ? 'rotate-45 translate-y-2' : ''"
          />
          <!-- Barre 2 — disparaît quand menu ouvert -->
          <span
            class="block w-5 h-0.5 bg-white rounded-full transition-all duration-300"
            :class="mobileMenuOpen ? 'opacity-0 scale-x-0' : ''"
          />
          <!-- Barre 3 — tourne en X quand menu ouvert -->
          <span
            class="block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
            :class="mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"
          />
        </button>
      </div>
    </div>

    <!-- ── Menu mobile (drawer) ───────────────────────── -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-white/[0.06] bg-dark/98 backdrop-blur-md"
      >
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
          <!-- Liens de navigation -->
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="mobile-nav-link"
            :class="isActive(link.to) ? 'mobile-nav-link--active' : ''"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </RouterLink>

          <!-- Séparateur -->
          <div class="my-2 border-t border-white/[0.06]" />

          <!-- Dark mode + CTA -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-sm text-white/50">Apparence</span>
            <button
              @click="$emit('toggle-theme')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/15 transition-colors duration-200"
            >
              <svg
                v-if="isDark"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
              </svg>
              <svg
                v-else
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              {{ isDark ? 'Mode clair' : 'Mode sombre' }}
            </button>
          </div>

          <RouterLink
            to="/onboarding"
            class="mt-1 px-4 py-3 rounded-lg bg-primary text-white font-medium text-sm text-center hover:bg-primary-600 transition-colors duration-200"
            @click="closeMobileMenu"
          >
            + Rejoindre CamerTalents
          </RouterLink>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- Spacer pour compenser la navbar fixe -->
  <div class="h-16" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// ── Props ────────────────────────────────────────────────────
defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
});

// ── Emits ────────────────────────────────────────────────────
defineEmits(['toggle-theme']);

// ── State ────────────────────────────────────────────────────
const route = useRoute();
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);

// ── Liens de navigation ──────────────────────────────────────
const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/explore', label: 'Explorer' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/map', label: 'Carte' },
];

// ── Helpers ──────────────────────────────────────────────────

// Détermine si un lien est actif (route courante)
function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/');
}

// Toggle menu mobile
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

// Ferme le menu mobile (appelé après un clic sur un lien)
function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

// Détecte le scroll pour changer l'apparence de la navbar
function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* ── Lien de navigation desktop ──────────────────────────── */
.nav-link {
  @apply px-3 py-1.5 rounded-lg text-lg font-medium
         text-white/50 hover:text-white hover:bg-white/10
         transition-all duration-200;
}

.nav-link--active {
  @apply text-primary-100 bg-primary/15 border border-primary/30
         hover:bg-primary/20 hover:text-primary-100;
}

/* ── Lien de navigation mobile ───────────────────────────── */
.mobile-nav-link {
  @apply px-4 py-3 rounded-lg text-sm font-medium
         text-white/60 hover:text-white hover:bg-white/10
         transition-all duration-200;
}

.mobile-nav-link--active {
  @apply text-primary-100 bg-primary/10 font-semibold;
}

/* ── Animation du menu mobile ────────────────────────────── */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.25s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
