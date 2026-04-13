<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white pb-24">
    <!-- ════════════════════════════════════════════
         HEADER — Bienvenue
    ════════════════════════════════════════════ -->
    <section class="relative py-12 border-b border-white/[0.06] overflow-hidden">
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <!-- Infos utilisateur -->
          <div class="flex items-center gap-5">
            <div class="relative flex-shrink-0">
              <img
                :src="authStore.displayAvatar"
                :alt="authStore.displayName"
                class="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30"
              />
              <!-- Badge rôle -->
              <span
                class="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-primary text-white border-2 border-[#0F0A1E]"
              >
                TALENT
              </span>
            </div>
            <div>
              <p class="text-white/40 text-sm mb-0.5">Bon retour,</p>
              <h1 class="font-title text-2xl sm:text-3xl font-bold">
                {{ authStore.displayName }} 👋
              </h1>
              <p class="text-white/50 text-sm mt-0.5">
                {{ monProfil?.metier || 'Talent CamerTalents' }}
                <span v-if="monProfil?.ville" class="text-white/30"> · {{ monProfil.ville }}</span>
              </p>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="flex flex-wrap gap-3">
            <RouterLink
              v-if="monProfil"
              :to="`/talent/${monProfil?._id}?from=dashboard`"
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
                <path
                  d="M1 12s4-8 11-8 11 8 11 8
                         -4 8-11 8-11-8-11-8z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Voir mon profil public
            </RouterLink>
            <RouterLink
              to="/talent/edit"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors duration-200"
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
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14
                         a2 2 0 0 0 2-2v-7"
                />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Modifier mon profil
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- ════════════════════════════════════════════
           ALERTE si profil incomplet
      ════════════════════════════════════════════ -->
      <div
        v-if="profilIncomplet"
        class="flex items-start gap-4 p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20"
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EAB308"
          stroke-width="2"
          class="flex-shrink-0 mt-0.5"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94
                   a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div class="flex-1">
          <p class="font-semibold text-yellow-400 text-sm mb-1">Profil incomplet</p>
          <p class="text-white/50 text-sm">
            Complète ton profil pour être mieux référencé. Il te manque :
            <span class="text-yellow-400">
              {{ champsManquants.join(', ') }}
            </span>
          </p>
        </div>
        <RouterLink
          to="/talent/edit"
          class="text-xs text-yellow-400 hover:text-white whitespace-nowrap transition-colors duration-200"
        >
          Compléter →
        </RouterLink>
      </div>

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
          <p class="font-mono text-2xl font-bold text-white">
            {{ kpi.value }}
          </p>
          <p class="text-xs text-white/40 mt-1">{{ kpi.label }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- ════════════════════════════════════════
             COLONNE PRINCIPALE (2/3)
        ════════════════════════════════════════ -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Aperçu du profil public -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          >
            <div class="section-card__header">
              <h2 class="section-card__title">Mon profil public</h2>
              <RouterLink
                to="/talent/edit"
                class="text-xs text-primary-100 hover:text-white transition-colors duration-200"
              >
                Modifier →
              </RouterLink>
            </div>

            <div v-if="monProfil" class="space-y-5">
              <!-- Bio -->
              <div>
                <p class="text-xs text-white/30 uppercase tracking-widest mb-2">Bio</p>
                <p v-if="monProfil.bio" class="text-sm text-white/60 leading-relaxed">
                  {{ monProfil.bio }}
                </p>
                <p v-else class="text-sm text-white/25 italic">
                  Aucune bio — ajoute une description pour te démarquer
                </p>
              </div>

              <!-- Compétences -->
              <div>
                <p class="text-xs text-white/30 uppercase tracking-widest mb-3">Compétences</p>
                <div v-if="monProfil.competences?.length > 0" class="space-y-3">
                  <div v-for="skill in monProfil.competences.slice(0, 4)" :key="skill.nom">
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-white/70">{{ skill.nom }}</span>
                      <span class="font-mono text-white/40"> {{ skill.niveau }}% </span>
                    </div>
                    <div class="h-1.5 rounded-full bg-white/[0.08]">
                      <div
                        class="h-full rounded-full bg-primary transition-all duration-700"
                        :style="`width: ${skill.niveau}%`"
                      />
                    </div>
                  </div>
                  <p v-if="monProfil.competences.length > 4" class="text-xs text-white/25">
                    + {{ monProfil.competences.length - 4 }} autres compétences
                  </p>
                </div>
                <p v-else class="text-sm text-white/25 italic">
                  Aucune compétence — ajoute tes compétences
                </p>
              </div>

              <!-- Portfolio -->
              <div v-if="monProfil.portfolio?.length > 0">
                <p class="text-xs text-white/30 uppercase tracking-widest mb-3">
                  Portfolio ({{ monProfil.portfolio.length }} image(s))
                </p>
                <div class="flex gap-3">
                  <div
                    v-for="(img, i) in monProfil.portfolio.slice(0, 4)"
                    :key="i"
                    class="w-16 h-16 rounded-xl overflow-hidden border border-white/[0.08] flex-shrink-0"
                  >
                    <img
                      :src="img"
                      :alt="`Portfolio ${i + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-if="monProfil.portfolio.length > 4"
                    class="w-16 h-16 rounded-xl bg-white/[0.06] border border-white/[0.08] flex-shrink-0 flex items-center justify-center"
                  >
                    <span class="text-xs text-white/40 font-mono">
                      +{{ monProfil.portfolio.length - 4 }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- CV -->
              <div>
                <p class="text-xs text-white/30 uppercase tracking-widest mb-2">Curriculum Vitae</p>
                <div
                  v-if="monProfil.cvBase64"
                  class="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22C55E"
                    stroke-width="2"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12
                             a2 2 0 0 0 2-2V8z"
                    />
                    <polyline points="14 2 14 8 20 8" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span class="text-sm text-green-400 font-medium">
                    {{ monProfil.cvNom || 'CV importé' }}
                  </span>
                </div>
                <p v-else class="text-sm text-white/25 italic">
                  Pas encore de CV — importe-le depuis ton profil
                </p>
              </div>
            </div>

            <!-- Pas encore de profil -->
            <div v-else class="text-center py-8">
              <p class="text-white/40 text-sm mb-4">
                Aucun profil trouvé. Lance l'onboarding pour créer le tien.
              </p>
              <RouterLink
                to="/onboarding"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors duration-200"
              >
                Créer mon profil
              </RouterLink>
            </div>
          </div>

          <!-- Conseils pour améliorer la visibilité -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
          >
            <h2 class="section-card__title mb-5">Conseils pour booster ta visibilité</h2>
            <div class="space-y-3">
              <div
                v-for="tip in visibilityTips"
                :key="tip.text"
                class="flex items-start gap-3 p-3 rounded-xl"
                :class="
                  tip.done
                    ? 'bg-green-500/8 border border-green-500/15'
                    : 'bg-white/[0.03] border border-white/[0.06]'
                "
              >
                <div
                  class="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                  :class="tip.done ? 'bg-green-500/20' : 'bg-white/[0.06]'"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    :stroke="tip.done ? '#22C55E' : 'rgba(255,255,255,0.2)'"
                    stroke-width="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p
                    class="text-sm font-medium"
                    :class="tip.done ? 'text-green-400' : 'text-white/60'"
                  >
                    {{ tip.text }}
                  </p>
                  <p class="text-xs text-white/25 mt-0.5">
                    {{ tip.desc }}
                  </p>
                </div>
                <RouterLink
                  v-if="!tip.done"
                  :to="tip.link"
                  class="text-xs text-primary-100 hover:text-white whitespace-nowrap transition-colors duration-200"
                >
                  Faire →
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════════
             SIDEBAR (1/3)
        ════════════════════════════════════════ -->
        <div class="space-y-5">
          <!-- Statut de disponibilité -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, x: 20 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 500 } }"
          >
            <h3 class="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              Disponibilité
            </h3>
            <div class="space-y-2">
              <button
                v-for="opt in disponibiliteOptions"
                :key="opt.value"
                @click="updateDisponibilite(opt.value)"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200"
                :class="
                  currentDisponibilite === opt.value
                    ? `${opt.activeClass} font-medium`
                    : 'border-white/[0.08] text-white/40 hover:border-white/20'
                "
              >
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="opt.dotClass" />
                <span class="text-sm">{{ opt.label }}</span>
                <svg
                  v-if="currentDisponibilite === opt.value"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="ml-auto"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Infos du compte -->
          <div
            class="section-card"
            v-motion
            :initial="{ opacity: 0, x: 20 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 500, delay: 100 } }"
          >
            <h3 class="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              Mon compte
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">Email</span>
                <span class="text-sm text-white font-medium truncate max-w-[160px]">
                  {{ authStore.user?.email }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">Membre depuis</span>
                <span class="text-sm text-white">{{ memberSince }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">Rôle</span>
                <span
                  class="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/15 text-primary-100 border border-primary/25"
                >
                  Talent
                </span>
              </div>
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
import { talentsAPI } from '../services/api';

const router = useRouter();
const authStore = useAuthStore();

const monProfil = ref(null);

onMounted(async () => {
  if (authStore.user?.talentId) {
    try {
      const data = await talentsAPI.getById(authStore.user.talentId);
      if (data.success) {
        monProfil.value = data.talent;
      }
    } catch (error) {
      console.error(`Erreur :  ${error.message}`);
    }
  }
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
    emoji: '👁️',
    value: monProfil.value?.vues ?? 0,
    label: 'Vues du profil',
    color: '#6C3CE1',
  },
  {
    emoji: '⭐',
    value: monProfil.value?.note ? monProfil.value.note.toFixed(1) : '—',
    label: 'Note moyenne',
    color: '#FBBF24',
  },
  {
    emoji: '💼',
    value: monProfil.value?.competences?.length ?? 0,
    label: 'Compétences',
    color: '#22C55E',
  },
  {
    emoji: '🖼️',
    value: monProfil.value?.portfolio?.length ?? 0,
    label: 'Réalisations',
    color: '#F97316',
  },
]);

// ── Profil incomplet ─────────────────────────────────────────
const champsManquants = computed(() => {
  if (!monProfil.value) return [];
  const manquants = [];
  if (!monProfil.value.bio) manquants.push('bio');
  if (!monProfil.value.avatar) manquants.push('photo');
  if (!monProfil.value.competences?.length) manquants.push('compétences');
  if (!monProfil.value.portfolio?.length) manquants.push('portfolio');
  if (!monProfil.value.cvBase64) manquants.push('CV');
  if (!monProfil.value.tarifJour) manquants.push('tarif');
  return manquants;
});

const profilIncomplet = computed(() => champsManquants.value.length > 0);

// ── Conseils de visibilité ───────────────────────────────────
const visibilityTips = computed(() => [
  {
    text: 'Ajouter une photo de profil',
    desc: 'Les profils avec photo reçoivent 3x plus de vues',
    done: !!monProfil.value?.avatar,
    link: '/talent/edit',
  },
  {
    text: 'Rédiger une bio complète',
    desc: 'Décris ton expérience et ce qui te différencie',
    done: (monProfil.value?.bio?.length ?? 0) > 50,
    link: '/talent/edit',
  },
  {
    text: 'Ajouter au moins 3 compétences',
    desc: 'Les recruteurs cherchent par compétence',
    done: (monProfil.value?.competences?.length ?? 0) >= 3,
    link: '/talent/edit',
  },
  {
    text: 'Importer un CV',
    desc: 'Renforce la confiance des recruteurs',
    done: !!monProfil.value?.cvBase64,
    link: `/talent/${monProfil.value?.id}`,
  },
  {
    text: 'Ajouter des réalisations',
    desc: 'Le portfolio montre concrètement ton travail',
    done: (monProfil.value?.portfolio?.length ?? 0) > 0,
    link: '/talent/edit',
  },
]);

// ── Disponibilité ────────────────────────────────────────────
const disponibiliteOptions = [
  {
    value: 'disponible',
    label: 'Disponible',
    dotClass: 'bg-green-400',
    activeClass: 'bg-green-500/15 border-green-500/40 text-green-400',
  },
  {
    value: 'partiellement disponible',
    label: 'Partiellement disponible',
    dotClass: 'bg-yellow-400',
    activeClass: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400',
  },
  {
    value: 'occupé',
    label: 'Occupé',
    dotClass: 'bg-red-400',
    activeClass: 'bg-red-500/15 border-red-500/40 text-red-400',
  },
];

const currentDisponibilite = computed(() => monProfil.value?.disponibilite || 'disponible');

async function updateDisponibilite(value) {
  if (!monProfil.value) return;
  try {
    const data = await talentsAPI.update(monProfil.value._id, {
      disponibilite: value,
    });
    if (data.success) {
      monProfil.value = { ...monProfil.value, disponibilite: value };
    }
  } catch (error) {
    console.error('Erreur update disponibilité:', error.message);
  }
}

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
  @apply font-title text-base font-bold text-white;
}
</style>
