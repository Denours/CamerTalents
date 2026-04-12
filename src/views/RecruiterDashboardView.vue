<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white pb-24">
    <!-- ════════════════════════════════════════════
    HEADER
    ════════════════════════════════════════════ -->
    <section class="relative py-12 border-b border-white/[0.06] overflow-hidden">
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[100px] pointer-events-none"
      />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <!-- Infos recruteur -->
          <div class="flex items-center gap-5">
            <div class="relative flex-shrink-0">
              <div
                class="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center"
              >
                <span class="font-title font-bold text-2xl text-secondary">
                  {{ initiales }}
                </span>
              </div>
              <span
                class="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-secondary text-white border-2 border-[#0F0A1E]"
              >
                REC.
              </span>
            </div>
            <div>
              <p class="text-white/40 text-sm mb-0.5">Espace recruteur</p>
              <h1 class="font-title text-2xl sm:text-3xl font-bold">
                {{ authStore.displayName }} 👋
              </h1>
              <p class="text-white/50 text-sm mt-0.5">
                {{ authStore.user?.entreprise || 'Recruteur indépendant' }}
                <span v-if="authStore.user?.poste" class="text-white/30">
                  · {{ authStore.user.poste }}
                </span>
              </p>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="flex flex-wrap gap-3">
            <RouterLink
              to="/explore"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-white/60 text-sm font-medium hover:border-white/40 hover:text-white transition-all duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Explorer les talents
            </RouterLink>
            <RouterLink
              to="/recruteur/favoris"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                         a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23
                         l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              Mes favoris
              <span
                v-if="authStore.favoris.length > 0"
                class="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {{ authStore.favoris.length }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- ════════════════════════════════════════════
           KPI CARDS
      ════════════════════════════════════════════ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(kpi, i) in kpis"
          :key="kpi.label"
          class="kpi-card"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: i * 80 } }"
        >
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            :style="`background: ${kpi.color}20;
                        border: 1px solid ${kpi.color}30`"
          >
            <span class="text-lg">{{ kpi.emoji }}</span>
          </div>
          <p class="font-mono text-2xl font-bold text-white">{{ kpi.value }}</p>
          <p class="text-xs text-white/40 mt-1">{{ kpi.label }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- ════════════════════════════════════════
             COLONNE PRINCIPALE (2/3)
        ════════════════════════════════════════ -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Talents favoris (aperçu) -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          >
            <div class="section-card__header">
              <h2 class="section-card__title">
                Mes talents favoris
                <span
                  v-if="talentsFavoris.length > 0"
                  class="ml-2 px-2 py-0.5 rounded-lg text-xs bg-secondary/15 text-secondary border border-secondary/25"
                >
                  {{ talentsFavoris.length }}
                </span>
              </h2>
              <RouterLink
                v-if="talentsFavoris.length > 0"
                to="/recruteur/favoris"
                class="text-xs text-secondary hover:text-white transition-colors duration-200"
              >
                Voir tous →
              </RouterLink>
            </div>

            <!-- Liste des favoris -->
            <div v-if="talentsFavoris.length > 0" class="space-y-3">
              <RouterLink
                v-for="talent in talentsFavoris.slice(0, 4)"
                :key="talent.id"
                :to="`/talent/${talent.id}`"
                class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 group"
              >
                <img
                  :src="talent.avatar"
                  :alt="talent.nom"
                  class="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p
                    class="font-semibold text-sm text-white group-hover:text-secondary transition-colors duration-200 truncate"
                  >
                    {{ talent.nom }}
                  </p>
                  <p class="text-xs text-white/40 mt-0.5 truncate">
                    {{ talent.metier }}
                    <span class="text-white/25"> · {{ talent.ville }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <!-- Disponibilité -->
                  <span
                    class="text-xs px-2.5 py-1 rounded-lg font-medium"
                    :class="
                      talent.disponibilite === 'disponible'
                        ? 'bg-green-500/15 text-green-400'
                        : talent.disponibilite === 'occupé'
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-yellow-500/15 text-yellow-400'
                    "
                  >
                    {{
                      talent.disponibilite === 'disponible'
                        ? 'Disponible'
                        : talent.disponibilite === 'occupé'
                          ? 'Occupé'
                          : 'Partiel'
                    }}
                  </span>
                  <!-- Bouton retirer des favoris -->
                  <button
                    @click.prevent="toggleFavoriEtRecharger(talent._id)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Retirer des favoris"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67
                               l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78
                               l1.06 1.06L12 21.23l7.78-7.78
                               1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      />
                    </svg>
                  </button>
                </div>
              </RouterLink>
            </div>

            <!-- État vide -->
            <div v-else class="text-center py-12">
              <div class="text-5xl mb-4">💔</div>
              <h3 class="font-title text-lg font-bold mb-2">Pas encore de favoris</h3>
              <p class="text-white/40 text-sm mb-6">
                Explore les talents et clique sur ❤️ pour les sauvegarder ici
              </p>
              <RouterLink
                to="/explore"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors duration-200"
              >
                Explorer les talents
              </RouterLink>
            </div>
          </div>

          <!-- Talents recommandés -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
          >
            <div class="section-card__header">
              <h2 class="section-card__title">Talents recommandés</h2>
              <span
                class="text-xs text-white/30 bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/[0.08]"
              >
                Sélection du jour
              </span>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <RouterLink
                v-for="talent in talentsRecommandes"
                :key="talent.id"
                :to="`/talent/${talent.id}`"
                class="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-secondary/20 transition-all duration-200 group"
              >
                <img
                  :src="talent.avatar"
                  :alt="talent.nom"
                  class="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p
                    class="font-semibold text-sm text-white truncate group-hover:text-secondary transition-colors duration-200"
                  >
                    {{ talent.nom }}
                  </p>
                  <p class="text-xs text-white/40 truncate">
                    {{ talent.metier }}
                  </p>
                  <div class="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      v-for="skill in talent.competences.slice(0, 2)"
                      :key="skill.nom"
                      class="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-white/50 border border-white/[0.08]"
                    >
                      {{ skill.nom }}
                    </span>
                  </div>
                </div>
                <!-- Bouton favori rapide -->
                <button
                  @click.prevent="toggleFavoriEtRecharger(talent._id)"
                  class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-200"
                  :class="
                    authStore.isFavori(talent.id)
                      ? 'text-secondary bg-secondary/15'
                      : 'text-white/20 hover:text-secondary hover:bg-secondary/10'
                  "
                  :title="
                    authStore.isFavori(talent.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'
                  "
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    :fill="authStore.isFavori(talent.id) ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67
                             l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78
                             l1.06 1.06L12 21.23l7.78-7.78
                             1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>
                </button>
              </RouterLink>
            </div>

            <RouterLink
              to="/explore"
              class="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] text-sm text-white/40 hover:text-white hover:border-white/20 transition-all duration-200"
            >
              Voir tous les talents
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </RouterLink>
          </div>
        </div>

        <!-- ════════════════════════════════════════
             SIDEBAR (1/3)
        ════════════════════════════════════════ -->
        <div class="space-y-5">
          <!-- Infos du compte -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, x: 20 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 500 } }"
          >
            <h3 class="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              Mon compte
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm text-white/40 flex-shrink-0">Email</span>
                <span class="text-sm text-white font-medium truncate">
                  {{ authStore.user?.email }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">Entreprise</span>
                <span class="text-sm text-white">
                  {{ authStore.user?.entreprise || '—' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">Poste</span>
                <span class="text-sm text-white">
                  {{ authStore.user?.poste || '—' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">Membre depuis</span>
                <span class="text-sm text-white">{{ memberSince }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">Rôle</span>
                <span
                  class="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-secondary/15 text-secondary border border-secondary/25"
                >
                  Recruteur
                </span>
              </div>
            </div>
          </div>

          <!-- Recherche rapide par catégorie -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, x: 20 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 500, delay: 100 } }"
          >
            <h3 class="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              Recherche rapide
            </h3>
            <div class="space-y-1">
              <RouterLink
                v-for="cat in categoriesRapides"
                :key="cat.label"
                :to="`/explore?category=${encodeURIComponent(cat.label)}`"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              >
                <span class="text-base">{{ cat.emoji }}</span>
                <span class="flex-1">{{ cat.label }}</span>
                <span class="font-mono text-xs text-white/25">
                  {{ cat.count }}
                </span>
              </RouterLink>
            </div>
          </div>

          <!-- Liens rapides -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, x: 20 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 500, delay: 200 } }"
          >
            <h3 class="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <div class="space-y-1">
              <RouterLink
                v-for="link in quickLinks"
                :key="link.to"
                :to="link.to"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              >
                <span class="text-base">{{ link.emoji }}</span>
                {{ link.label }}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="ml-auto opacity-30"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </RouterLink>
            </div>
          </div>

          <!-- Déconnexion -->
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400/70 text-sm font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 transition-all duration-200"
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
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useStats } from '../composables/useStats';
import { CATEGORIES } from '../data/constants';
import { useTalents } from '../composables/useTalents';
import { recruteurAPI, talentsAPI } from '../services/api';

const router = useRouter();
const authStore = useAuthStore();
const { talentsByCategory } = useStats();
const { talents } = useTalents();

const talentsFavoris = ref([]);
const talentsRecommandesData = ref([]);

onMounted(async () => {
  const [favorisRes, talentsRes] = await Promise.all([
    recruteurAPI.getFavoris(),
    talentsAPI.getAll({ sortBy: 'note', limit: 6 }),
  ]);
  if (favorisRes.success) talentsFavoris.value = favorisRes.favoris;
  if (talentsRes.success) talentsRecommandesData.value = talentsRes.talents;
});

// Talents recommandés = top notés, pas encore en favoris
const talentsRecommandes = computed(() =>
  talentsRecommandesData.value.filter((t) => !authStore.isFavori(t._id)).slice(0, 4),
);

async function toggleFavoriEtRecharger(talentId) {
  await authStore.toggleFavori(talentId);
  const data = await recruteurAPI.getFavoris();
  if (data.success) talentsFavoris.value = data.favoris;
}
// ── Initiales du recruteur (pour l'avatar) ───────────────────
const initiales = computed(() => {
  const nom = authStore.user?.nom || '';
  return nom
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// ── Date d'inscription ───────────────────────────────────────
const memberSince = computed(() => {
  if (!authStore.user?.dateCreation) return '—';
  return new Date(authStore.user.dateCreation).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

// ── KPI Cards ────────────────────────────────────────────────
const kpis = computed(() => [
  {
    emoji: '❤️',
    value: authStore.favoris.length,
    label: 'Talents sauvegardés',
    color: '#F97316',
  },
  {
    emoji: '👥',
    value: talents.value.length,
    label: 'Talents disponibles',
    color: '#6C3CE1',
  },
  {
    emoji: '🏙️',
    value: Object.keys(talentsByCategory.value).length,
    label: 'Catégories',
    color: '#06B6D4',
  },
  {
    emoji: '⭐',
    value:
      talents.value.length > 0
        ? (talents.value.reduce((s, t) => s + t.note, 0) / talents.value.length).toFixed(1)
        : '—',
    label: 'Note moyenne',
    color: '#FBBF24',
  },
]);

// ── Catégories rapides avec compteurs ───────────────────────
const catEmojis = {
  'Tech & Digital': '💻',
  'Artisanat & BTP': '🔨',
  'Créatif & Art': '🎨',
  'Éducation & Formation': '📚',
  'Services & Lifestyle': '🍳',
  'Transport & Logistique': '🚗',
};

const categoriesRapides = computed(() =>
  CATEGORIES.map((label) => ({
    label,
    emoji: catEmojis[label] || '✨',
    count: talentsByCategory.value[label] || 0,
  })).sort((a, b) => b.count - a.count),
);

// ── Liens rapides ────────────────────────────────────────────
const quickLinks = [
  { emoji: '🔍', label: 'Explorer les talents', to: '/explore' },
  { emoji: '❤️', label: 'Mes favoris', to: '/recruteur/favoris' },
  { emoji: '📊', label: 'Tableau de bord public', to: '/dashboard' },
  { emoji: '🗺️', label: 'Carte des talents', to: '/map' },
];

// ── Déconnexion ──────────────────────────────────────────────
function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.kpi-card {
  @apply p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]
         hover:border-white/[0.14] transition-all duration-300;
}

.section-card {
  @apply p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08];
}

.section-card__header {
  @apply flex items-center justify-between mb-5;
}

.section-card__title {
  @apply font-title text-base font-bold text-white
         flex items-center;
}
</style>
