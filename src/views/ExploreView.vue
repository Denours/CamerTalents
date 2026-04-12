<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white">
    <!-- ══════════════════════════════════════════════════
      HEADER DE PAGE
    ══════════════════════════════════════════════════ -->
    <section class="relative py-16 border-b border-white/[0.06] overflow-hidden">
      <!-- Glow décoratif -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <p class="text-secondary text-sm font-semibold tracking-widest uppercase mb-3">
            Annuaire
          </p>
          <h1 class="font-title text-4xl sm:text-5xl font-bold mb-4">Explorer les talents</h1>
          <p class="text-white/50 text-lg">
            {{ filterStore.filteredTalents.length }} talent{{
              filterStore.filteredTalents.length > 1 ? 's' : ''
            }}
            trouvé{{ filterStore.filteredTalents.length > 1 ? 's' : '' }}
            <span v-if="filterStore.activeFiltersCount > 0" class="text-primary-100">
              · {{ filterStore.activeFiltersCount }} filtre{{
                filterStore.activeFiltersCount > 1 ? 's' : ''
              }}
              actif{{ filterStore.activeFiltersCount > 1 ? 's' : '' }}
            </span>
          </p>
        </div>

        <!-- Barre de recherche principale -->
        <div
          class="relative mt-8 max-w-2xl"
          v-motion
          :initial="{ opacity: 0, y: 15 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
        >
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="filterStore.searchQuery"
            type="text"
            name="search"
            placeholder="Chercher un métier, une compétence, un nom..."
            class="search-input"
          />
          <!-- Bouton clear -->
          <button
            v-if="filterStore.searchQuery"
            @click="filterStore.searchQuery = ''"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors duration-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
      CORPS : FILTRES + GRILLE
    ══════════════════════════════════════════════════ -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex gap-8">
        <!-- ── PANNEAU DE FILTRES (desktop) ───────────── -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="sticky top-24 space-y-6">
            <!-- En-tête filtres -->
            <div class="flex items-center justify-between">
              <h2 class="font-semibold text-white">Filtres</h2>
              <button
                v-if="filterStore.activeFiltersCount > 0"
                @click="filterStore.resetFilters()"
                class="text-xs text-primary-100 hover:text-white transition-colors duration-200 flex items-center gap-1"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Réinitialiser
              </button>
            </div>

            <!-- Filtre : Catégorie -->
            <FilterBlock title="Catégorie">
              <button
                v-for="cat in categoryOptions"
                :key="cat"
                @click="filterStore.selectedCategory = cat"
                class="filter-option"
                :class="filterStore.selectedCategory === cat ? 'filter-option--active' : ''"
              >
                <span>{{ cat }}</span>
                <span class="filter-count">{{ getCategoryCount(cat) }}</span>
              </button>
            </FilterBlock>

            <!-- Filtre : Ville -->
            <FilterBlock title="Ville">
              <button
                v-for="city in cityOptions"
                :key="city"
                @click="filterStore.selectedCity = city"
                class="filter-option"
                :class="filterStore.selectedCity === city ? 'filter-option--active' : ''"
              >
                <span>{{ city }}</span>
                <span class="filter-count">{{ getCityCount(city) }}</span>
              </button>
            </FilterBlock>

            <!-- Filtre : Disponibilité -->
            <FilterBlock title="Disponibilité">
              <div class="flex items-center justify-between py-2 cursor-pointer group">
                <span class="text-sm text-white/60 group-hover:text-white transition-colors">
                  Disponibles uniquement
                </span>
                <!-- Toggle switch -->
                <div
                  class="relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0"
                  :class="filterStore.onlyAvailable ? 'bg-primary' : 'bg-white/10'"
                  @click="filterStore.onlyAvailable = !filterStore.onlyAvailable"
                >
                  <span
                    class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow"
                    :class="filterStore.onlyAvailable ? 'translate-x-5' : 'translate-x-0.5'"
                  />
                </div>
              </div>
            </FilterBlock>

            <!-- Filtre : Note minimum -->
            <FilterBlock title="Note minimum">
              <div class="space-y-2">
                <div class="flex gap-1">
                  <button
                    v-for="n in [0, 3, 4, 4.5]"
                    :key="n"
                    @click="filterStore.minRating = n"
                    class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    :class="
                      filterStore.minRating === n
                        ? 'bg-primary text-white'
                        : 'bg-white/[0.06] text-white/50 hover:bg-white/10'
                    "
                  >
                    {{ n === 0 ? 'Tous' : `${n}+` }}
                  </button>
                </div>
                <p v-if="filterStore.minRating > 0" class="text-xs text-white/30 text-center">
                  ★ {{ filterStore.minRating }}+ uniquement
                </p>
              </div>
            </FilterBlock>
          </div>
        </aside>

        <!-- ── CONTENU PRINCIPAL ──────────────────────── -->
        <div class="flex-1 min-w-0">
          <!-- Barre d'outils : tri + filtre mobile -->
          <div class="flex items-center justify-between mb-6 gap-4">
            <!-- Tri -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-white/30">Trier par</span>
              <button
                v-for="opt in sortOptions"
                :key="opt.value"
                @click="filterStore.sortBy = opt.value"
                class="sort-btn"
                :class="filterStore.sortBy === opt.value ? 'sort-btn--active' : ''"
              >
                {{ opt.label }}
              </button>
            </div>

            <!-- Bouton filtre mobile -->
            <button
              @click="mobileFilterOpen = true"
              class="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition-all duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="12" y1="18" x2="12" y2="18" stroke-linecap="round" />
              </svg>
              Filtres
              <span
                v-if="filterStore.activeFiltersCount > 0"
                class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
              >
                {{ filterStore.activeFiltersCount }}
              </span>
            </button>
          </div>

          <!-- État : chargement -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <div v-for="n in 9" :key="n" class="skeleton-card rounded-2xl h-64" />
          </div>

          <!-- État : aucun résultat -->
          <div v-else-if="filterStore.filteredTalents.length === 0" class="py-24 text-center">
            <div class="text-6xl mb-4">
              <Search class="d-block mx-auto text-secondary size-16" />
            </div>
            <h3 class="font-title text-xl font-bold mb-2">Aucun talent trouvé</h3>
            <p class="text-white/40 mb-6">Essaie d'ajuster tes filtres ou ta recherche.</p>
            <button
              @click="filterStore.resetFilters()"
              class="px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary-100 text-sm font-medium hover:bg-primary/30 transition-colors duration-200"
            >
              Réinitialiser les filtres
            </button>
          </div>

          <!-- État : résultats -->
          <TransitionGroup
            v-else
            name="cards-grid"
            tag="div"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <TalentCard
              v-for="talent in visibleTalents"
              :key="talent._id || talent.id"
              :talent="talent"
            />
          </TransitionGroup>

          <!-- Bouton "Charger plus" -->
          <div v-if="hasMore && !isLoading" class="mt-10 text-center">
            <button @click="loadMore" :disabled="isLoadingMore" class="load-more-btn">
              <span v-if="isLoadingMore" class="flex items-center gap-2">
                <svg
                  class="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
                </svg>
                Chargement...
              </span>
              <span v-else>
                Afficher plus de talents ({{ filterStore.filteredTalents.length - visibleCount }}
                restants)
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
      DRAWER FILTRES MOBILE
    ══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="mobileFilterOpen" class="fixed inset-0 z-50 lg:hidden">
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="mobileFilterOpen = false"
          />

          <!-- Drawer -->
          <Transition name="drawer">
            <div
              v-if="mobileFilterOpen"
              class="absolute bottom-0 left-0 right-0 bg-[#1A1230] rounded-t-3xl border-t border-white/10 max-h-[85vh] overflow-y-auto"
            >
              <!-- Poignée -->
              <div class="flex justify-center pt-3 pb-2">
                <div class="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div class="px-6 pb-8 space-y-6">
                <!-- En-tête -->
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-white text-lg">Filtres</h3>
                  <button @click="mobileFilterOpen = false" class="text-white/50 hover:text-white">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <!-- Catégorie -->
                <div>
                  <p class="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    Catégorie
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="cat in categoryOptions"
                      :key="cat"
                      @click="filterStore.selectedCategory = cat"
                      class="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                      :class="
                        filterStore.selectedCategory === cat
                          ? 'bg-primary text-white'
                          : 'bg-white/[0.06] text-white/50 hover:bg-white/10'
                      "
                    >
                      {{ cat }}
                    </button>
                  </div>
                </div>

                <!-- Ville -->
                <div>
                  <p class="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    Ville
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="city in cityOptions"
                      :key="city"
                      @click="filterStore.selectedCity = city"
                      class="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                      :class="
                        filterStore.selectedCity === city
                          ? 'bg-primary text-white'
                          : 'bg-white/[0.06] text-white/50 hover:bg-white/10'
                      "
                    >
                      {{ city }}
                    </button>
                  </div>
                </div>

                <!-- Disponibilité -->
                <div>
                  <p class="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    Disponibilité
                  </p>
                  <label for="availOnly" class="flex items-center justify-between cursor-pointer">
                    <span class="text-sm text-white/60"> Disponibles uniquement </span>
                    <div
                      class="relative w-10 h-5 rounded-full transition-colors duration-300"
                      :class="filterStore.onlyAvailable ? 'bg-primary' : 'bg-white/10'"
                      @click="filterStore.onlyAvailable = !filterStore.onlyAvailable"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
                        :class="filterStore.onlyAvailable ? 'translate-x-5' : 'translate-x-0.5'"
                      />
                    </div>
                  </label>
                </div>

                <!-- Boutons d'action -->
                <div class="flex gap-3 pt-2">
                  <button
                    @click="filterStore.resetFilters()"
                    class="flex-1 py-3 rounded-xl border border-white/20 text-white/60 font-medium text-sm hover:border-white/40 hover:text-white transition-all duration-200"
                  >
                    Réinitialiser
                  </button>
                  <button
                    @click="mobileFilterOpen = false"
                    class="flex-1 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-600 transition-colors duration-200"
                  >
                    Voir les résultats
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useFilterStore } from '../stores/filterStore';
import { useTalents } from '../composables/useTalents';
import TalentCard from '../components/talent/TalentCard.vue';
import FilterBlock from '../components/explore/FilterBlock.vue';
import { Search } from 'lucide-vue-next';
import { CATEGORIES, VILLES } from '../data/constants';

// ── Stores & composables ─────────────────────────────────────
const filterStore = useFilterStore();
const { talents, isLoading } = useTalents();

// ── État local ───────────────────────────────────────────────
const mobileFilterOpen = ref(false);
const visibleCount = ref(9); // nombre de cards visibles
const isLoadingMore = ref(false);

// ── Options de tri ───────────────────────────────────────────
const sortOptions = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'note', label: 'Mieux notés' },
  { value: 'recent', label: 'Récents' },
  { value: 'vues', label: 'Populaires' },
];

// ── Options de filtre ────────────────────────────────────────
const categoryOptions = computed(() => ['Tous', ...CATEGORIES]);
const cityOptions = computed(() => ['Toutes', ...VILLES]);

// ── Talents paginés (slice des résultats filtrés) ────────────
const visibleTalents = computed(() => filterStore.filteredTalents.slice(0, visibleCount.value));

// Y a-t-il encore des talents à charger ?
const hasMore = computed(() => visibleCount.value < filterStore.filteredTalents.length);

// ── Comptes pour les badges de filtres ───────────────────────
function getCategoryCount(cat) {
  if (cat === 'Tous') return talents.value.length;
  return talents.value.filter((t) => t.categorie === cat).length;
}

function getCityCount(city) {
  if (city === 'Toutes') return talents.value.length;
  return talents.value.filter((t) => t.ville === city).length;
}

// ── Charger plus ─────────────────────────────────────────────
async function loadMore() {
  isLoadingMore.value = true;
  // Simule un délai réseau réaliste
  await new Promise((resolve) => setTimeout(resolve, 600));
  visibleCount.value += 9;
  isLoadingMore.value = false;
}

// ── Réinitialiser la pagination quand les filtres changent ───
// (évite de se retrouver avec une page vide si on filtre fort)
watch(
  () => [
    filterStore.searchQuery,
    filterStore.selectedCategory,
    filterStore.selectedCity,
    filterStore.onlyAvailable,
    filterStore.minRating,
    filterStore.sortBy,
  ],
  () => {
    visibleCount.value = 9;
  },
);
</script>

<style scoped>
/* ── Barre de recherche ──────────────────────────────────────── */
.search-input {
  @apply w-full pl-12 pr-12 py-4 rounded-2xl
         bg-white/[0.06] border border-white/[0.10]
         text-white placeholder-white/30 text-base
         focus:outline-none focus:border-primary/50 focus:bg-white/[0.08]
         transition-all duration-200;
}

/* ── Options de filtre (sidebar) ─────────────────────────────── */
.filter-option {
  @apply w-full flex items-center justify-between
         px-3 py-2 rounded-xl text-sm
         text-white/50 hover:text-white hover:bg-white/[0.06]
         transition-all duration-200 text-left;
}

.filter-option--active {
  @apply text-primary-100 bg-primary/10
         border border-primary/20 font-medium;
}

.filter-count {
  @apply text-xs font-mono text-white/25
         bg-white/[0.04] px-1.5 py-0.5 rounded;
}

/* ── Boutons de tri ──────────────────────────────────────────── */
.sort-btn {
  @apply px-3 py-1.5 rounded-lg text-xs font-medium
         text-white/40 hover:text-white hover:bg-white/[0.06]
         transition-all duration-200;
}

.sort-btn--active {
  @apply text-white bg-white/[0.10] border border-white/[0.15];
}

/* ── Bouton charger plus ─────────────────────────────────────── */
.load-more-btn {
  @apply px-8 py-3.5 rounded-2xl
         border border-white/15 text-white/60
         font-medium text-sm
         hover:border-primary/40 hover:text-white hover:bg-primary/10
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-all duration-200;
}

/* ── Skeleton loader ─────────────────────────────────────────── */
.skeleton-card {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ── Animation de la grille (TransitionGroup) ────────────────── */
.cards-grid-enter-active {
  transition: all 0.4s ease;
}
.cards-grid-leave-active {
  transition: all 0.25s ease;
  position: absolute;
}
.cards-grid-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
.cards-grid-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.cards-grid-move {
  transition: transform 0.4s ease;
}

/* ── Transitions overlay mobile ──────────────────────────────── */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
}
</style>
