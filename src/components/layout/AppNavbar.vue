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
          <button
            v-for="link in navLinks"
            :key="link.to"
            @click="handleNavClick(link)"
            class="nav-link"
            :class="isActive(link.to) ? 'nav-link--active' : ''"
          >
            {{ link.label }}
          </button>
        </div>

        <!-- ── Actions desktop ───────────────────────── -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Dark mode toggle -->
          <button
            @click="$emit('toggle-theme')"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            :title="isDark ? 'Mode clair' : 'Mode sombre'"
          >
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

          <!-- ════════════════════════════════════════
               ÉTAT : NON CONNECTÉ
          ════════════════════════════════════════ -->
          <template v-if="!authStore.isLoggedIn">
            <RouterLink
              to="/register"
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white font-bold text-md hover:bg-primary-600 active:scale-95 transition-all duration-200"
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
              S'inscrire
            </RouterLink>
            <RouterLink
              to="/login"
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-900 text-white font-bold text-md hover:bg-orange-600 active:scale-95 transition-all duration-200"
            >
              Se connecter
            </RouterLink>
          </template>

          <!-- ════════════════════════════════════════
               ÉTAT : CONNECTÉ — Menu utilisateur
          ════════════════════════════════════════ -->
          <template v-else>
            <!-- Badge rôle -->
            <span class="px-2.5 py-1 rounded-lg text-xs font-bold" :class="roleBadgeClass">
              {{ roleLabel }}
            </span>

            <!-- Avatar + Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.10] hover:border-white/20 transition-all duration-200"
              >
                <img
                  :src="authStore.displayAvatar"
                  :alt="authStore.displayName"
                  class="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                  @error="$event.target.src = 'https://i.pravatar.cc/150?u=' + authStore.user?.id"
                />
                <span class="text-sm font-medium text-white max-w-[100px] truncate">
                  {{ authStore.displayName.split(' ')[0] }}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  stroke-width="2"
                  class="transition-transform duration-200"
                  :class="dropdownOpen ? 'rotate-180' : ''"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <!-- Dropdown -->
              <Transition name="dropdown">
                <div
                  v-if="dropdownOpen"
                  class="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#1A1230] shadow-xl overflow-hidden z-50"
                >
                  <!-- Infos utilisateur -->
                  <div class="px-4 py-3 border-b border-white/[0.08]">
                    <p class="text-sm font-semibold text-white truncate">
                      {{ authStore.displayName }}
                    </p>
                    <p class="text-xs text-white/40 truncate mt-0.5">
                      {{ authStore.user?.email }}
                    </p>
                  </div>

                  <!-- Liens selon le rôle -->
                  <div class="py-2">
                    <RouterLink
                      v-for="item in userMenuItems"
                      :key="item.to"
                      :to="item.to"
                      @click="dropdownOpen = false"
                      class="dropdown-item"
                    >
                      <span class="text-base">{{ item.emoji }}</span>
                      {{ item.label }}
                    </RouterLink>
                  </div>

                  <!-- Déconnexion -->
                  <div class="border-t border-white/[0.08] py-2">
                    <button
                      @click="handleLogout"
                      class="dropdown-item w-full text-left text-red-400 hover:bg-red-500/10"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>
        </div>

        <!-- ── Bouton hamburger (mobile) ─────────────── -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
          :aria-label="mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        >
          <span
            class="block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
            :class="mobileMenuOpen ? 'rotate-45 translate-y-2' : ''"
          />
          <span
            class="block w-5 h-0.5 bg-white rounded-full transition-all duration-300"
            :class="mobileMenuOpen ? 'opacity-0 scale-x-0' : ''"
          />
          <span
            class="block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
            :class="mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"
          />
        </button>
      </div>
    </div>

    <!-- ── Menu mobile ───────────────────────────────────── -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-white/[0.06] bg-dark/98 backdrop-blur-md"
      >
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
          <!-- Liens de navigation publics -->
          <button
            v-for="link in navLinks"
            :key="link.to"
            @click="handleNavClick(link)"
            class="mobile-nav-link"
            :class="isActive(link.to) ? 'mobile-nav-link--active' : ''"
          >
            {{ link.label }}
          </button>

          <!-- Séparateur -->
          <div class="my-2 border-t border-white/[0.06]" />

          <!-- ════════════════════════════════════════
               MOBILE — NON CONNECTÉ
          ════════════════════════════════════════ -->
          <template v-if="!authStore.isLoggedIn">
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
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                {{ isDark ? 'Mode clair' : 'Mode sombre' }}
              </button>
            </div>

            <RouterLink
              to="/register"
              class="mt-1 px-4 py-3 rounded-lg bg-primary text-white font-bold text-sm text-center hover:bg-primary-600 transition-colors duration-200"
              @click="closeMobileMenu"
            >
              + S'inscrire
            </RouterLink>
            <RouterLink
              to="/login"
              class="mt-1 px-4 py-3 rounded-lg bg-primary-900 text-white font-bold text-sm text-center hover:bg-orange-600 transition-colors duration-200"
              @click="closeMobileMenu"
            >
              Se connecter
            </RouterLink>
          </template>

          <!-- ════════════════════════════════════════
               MOBILE — CONNECTÉ
          ════════════════════════════════════════ -->
          <template v-else>
            <!-- Infos utilisateur -->
            <div class="flex items-center gap-3 px-3 py-2 mb-1">
              <img
                :src="authStore.displayAvatar"
                alt="avatar"
                class="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                @error="$event.target.src = 'https://i.pravatar.cc/150?u=' + authStore.user?.id"
              />
              <div class="min-w-0">
                <p class="text-sm font-semibold text-white truncate">
                  {{ authStore.displayName }}
                </p>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" :class="roleBadgeClass">
                  {{ roleLabel }}
                </span>
              </div>
            </div>

            <!-- Liens du menu selon le rôle -->
            <RouterLink
              v-for="item in userMenuItems"
              :key="item.to"
              :to="item.to"
              @click="closeMobileMenu"
              class="mobile-nav-link flex items-center gap-2"
            >
              <span>{{ item.emoji }}</span>
              {{ item.label }}
            </RouterLink>

            <div class="my-2 border-t border-white/[0.06]" />

            <!-- Dark mode -->
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
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                {{ isDark ? 'Mode clair' : 'Mode sombre' }}
              </button>
            </div>

            <!-- Déconnexion -->
            <button
              @click="handleLogout"
              class="mobile-nav-link text-red-400 flex items-center gap-2 mt-1"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Se déconnecter
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- Spacer -->
  <div class="h-16" />

  <!-- Modal Explorer pour talents -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="exploreModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="exploreModalOpen = false"
      >
        <div class="bg-[#1A1230] rounded-2xl p-6 max-w-md w-full border border-white/10">
          <div class="text-center">
            <div class="text-4xl mb-4">🚫</div>
            <h3 class="text-xl font-bold text-white mb-2">Accès refusé</h3>
            <p class="text-white/70 mb-6">
              En tant que Talent vous ne pouvez pas explorer d'autres talents.
            </p>
            <button
              @click="exploreModalOpen = false"
              class="px-6 py-2 bg-primary rounded-lg text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Modal Statistiques pour talents -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="statsModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="statsModalOpen = false"
      >
        <div class="bg-[#1A1230] rounded-2xl p-6 max-w-md w-full border border-white/10">
          <div class="text-center">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-bold text-white mb-2">Accès refusé</h3>
            <p class="text-white/70 mb-6">
              En tant que Talent vous ne pouvez pas consulter l'aperçu des statistiques de
              CamerTalents.
            </p>
            <button
              @click="statsModalOpen = false"
              class="px-6 py-2 bg-primary rounded-lg text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

// ── Props & Emits ────────────────────────────────────────────
defineProps({
  isDark: { type: Boolean, default: false },
});
defineEmits(['toggle-theme']);

// ── Stores & Router ──────────────────────────────────────────
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// ── État local ───────────────────────────────────────────────
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const dropdownOpen = ref(false);
const dropdownRef = ref(null);
const exploreModalOpen = ref(false);
const statsModalOpen = ref(false);

// ── Liens de navigation publics ──────────────────────────────
const navLinks = computed(() => [
  { to: '/', label: 'Accueil' },
  { to: '/explore', label: 'Explorer', modal: authStore.isTalent ? 'explore' : null },
  { to: '/dashboard', label: 'Statistiques', modal: authStore.isTalent ? 'stats' : null },
  { to: '/map', label: 'Carte' },
]);

// ── Badge rôle ───────────────────────────────────────────────
const roleLabel = computed(() => {
  const map = {
    talent: 'TALENT',
    recruteur: 'RECRUTEUR',
    admin: 'ADMIN',
  };
  return map[authStore.role] || '';
});

const roleBadgeClass = computed(() => {
  const map = {
    talent: 'bg-primary/15 text-primary-100 border border-primary/25',
    recruteur: 'bg-secondary/15 text-secondary border border-secondary/25',
    admin: 'bg-red-500/15 text-red-400 border border-red-500/25',
  };
  return map[authStore.role] || '';
});

// ── Menu utilisateur selon le rôle ───────────────────────────
const userMenuItems = computed(() => {
  if (authStore.isTalent) {
    return [
      { emoji: '🏠', label: 'Mon espace', to: '/talent/dashboard' },
      { emoji: '✏️', label: 'Modifier mon profil', to: '/talent/edit' },
      {
        emoji: '👁️',
        label: 'Voir mon profil public',
        to: `/talent/${authStore.user?.talentId}?from=dashboard`,
      },
    ];
  }
  if (authStore.isRecruteur) {
    return [
      { emoji: '🏠', label: 'Mon espace', to: '/recruteur/dashboard' },
      { emoji: '❤️', label: 'Mes favoris', to: '/recruteur/favoris' },
      { emoji: '🔍', label: 'Explorer', to: '/explore' },
    ];
  }
  if (authStore.isAdmin) {
    return [{ emoji: '🛡️', label: 'Tableau de bord Admin', to: '/admin' }];
  }
  return [];
});

// ── Helpers ──────────────────────────────────────────────────
function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/');
}

function handleNavClick(link) {
  if (link.modal === 'explore') {
    exploreModalOpen.value = true;
    mobileMenuOpen.value = false;
  } else if (link.modal === 'stats') {
    statsModalOpen.value = true;
    mobileMenuOpen.value = false;
  } else {
    router.push(link.to);
    mobileMenuOpen.value = false;
  }
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}
function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

// ── Déconnexion ──────────────────────────────────────────────
function handleLogout() {
  dropdownOpen.value = false;
  mobileMenuOpen.value = false;
  authStore.logout();
  router.push('/');
}

// ── Fermeture dropdown au clic extérieur ─────────────────────
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

// ── Scroll ───────────────────────────────────────────────────
function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* ── Lien desktop ────────────────────────────────────────── */
.nav-link {
  @apply px-3 py-1.5 rounded-lg text-lg font-medium
         text-white/50 hover:text-white hover:bg-white/10
         transition-all duration-200;
}
.nav-link--active {
  @apply text-primary-100 bg-primary/15 border border-primary/30
         hover:bg-primary/20 hover:text-primary-100;
}

/* ── Lien mobile ─────────────────────────────────────────── */
.mobile-nav-link {
  @apply px-4 py-3 rounded-lg text-sm font-medium
         text-white/60 hover:text-white hover:bg-white/10
         transition-all duration-200;
}
.mobile-nav-link--active {
  @apply text-primary-100 bg-primary/10 font-semibold;
}

/* ── Dropdown items ──────────────────────────────────────── */
.dropdown-item {
  @apply flex items-center gap-3 w-full px-4 py-2.5
         text-sm text-white/60 hover:text-white
         hover:bg-white/[0.06] transition-all duration-150
         cursor-pointer;
}

/* ── Animation dropdown ──────────────────────────────────── */
.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Animation menu mobile ───────────────────────────────── */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Animation modals ───────────────────────────────────── */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
