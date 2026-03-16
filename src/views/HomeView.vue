<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white overflow-x-hidden">
    <!-- ══════════════════════════════════════════════════
         SECTION 1 — HERO
    ══════════════════════════════════════════════════ -->
    <section class="relative min-h-[92vh] flex items-center">
      <!-- Fond décoratif : grille + glow violet -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Glow violet central -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/20 blur-[120px]"
        />
        <!-- Glow orange bas-gauche -->
        <div
          class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]"
        />
        <!-- Grille de points -->
        <svg
          class="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-24"
      >
        <!-- Colonne gauche : texte -->
        <div class="hero-text">
          <!-- Badge animé -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary-100 text-sm font-medium mb-8"
          >
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Plateforme #1 des talents camerounais
          </div>

          <!-- Titre principal -->
          <h1
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
            class="font-title text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
          >
            Les talents<br />
            camerounais<br />
            <span class="text-gradient">méritent d'être vus</span>
          </h1>

          <!-- Sous-titre -->
          <p
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
            class="text-white/60 text-lg leading-relaxed mb-10 max-w-lg"
          >
            Développeurs, artisans, créatifs, formateurs — CamerTalents connecte les talents locaux
            avec ceux qui en ont besoin, partout au Cameroun.
          </p>

          <!-- CTAs -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300 } }"
            class="flex flex-wrap gap-4"
          >
            <RouterLink to="/explore" class="btn-primary">
              Explorer les talents
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </RouterLink>
            <RouterLink to="/onboarding" class="btn-ghost"> Créer mon profil </RouterLink>
          </div>
        </div>

        <!-- Colonne droite : floating talent cards -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 700, delay: 200 } }"
          class="relative hidden lg:block h-[520px]"
        >
          <!-- Card centrale (grande) -->
          <div
            class="floating-card floating-card--main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              :src="featuredTalents[0]?.avatar"
              alt="Avatar"
              class="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
            />
            <div>
              <p class="font-semibold text-sm text-white">{{ featuredTalents[0]?.nom }}</p>
              <p class="text-xs text-white/50">{{ featuredTalents[0]?.metier }}</p>
            </div>
            <span class="availability-dot bg-green-400" />
          </div>

          <!-- Card haut-gauche -->
          <div
            class="floating-card absolute top-8 left-4 animate-float"
            style="animation-delay: 0s"
          >
            <img
              :src="featuredTalents[1]?.avatar"
              alt=""
              class="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p class="text-xs font-medium text-white">{{ featuredTalents[1]?.nom }}</p>
              <p class="text-[10px] text-white/40">{{ featuredTalents[1]?.metier }}</p>
            </div>
          </div>

          <!-- Card haut-droite -->
          <div
            class="floating-card absolute top-16 right-8 animate-float"
            style="animation-delay: 0.8s"
          >
            <img
              :src="featuredTalents[2]?.avatar"
              alt=""
              class="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p class="text-xs font-medium text-white">{{ featuredTalents[2]?.nom }}</p>
              <p class="text-[10px] text-white/40">{{ featuredTalents[2]?.metier }}</p>
            </div>
          </div>

          <!-- Card bas-gauche -->
          <div
            class="floating-card absolute bottom-20 left-8 animate-float"
            style="animation-delay: 1.4s"
          >
            <img
              :src="featuredTalents[3]?.avatar"
              alt=""
              class="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p class="text-xs font-medium text-white">{{ featuredTalents[3]?.nom }}</p>
              <p class="text-[10px] text-white/40">{{ featuredTalents[3]?.metier }}</p>
            </div>
          </div>

          <!-- Card bas-droite -->
          <div
            class="floating-card absolute bottom-12 right-4 animate-float"
            style="animation-delay: 2s"
          >
            <img
              :src="featuredTalents[4]?.avatar"
              alt=""
              class="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p class="text-xs font-medium text-white">{{ featuredTalents[4]?.nom }}</p>
              <p class="text-[10px] text-white/40">{{ featuredTalents[4]?.metier }}</p>
            </div>
          </div>

          <!-- Lignes de connexion SVG entre les cards -->
          <svg
            class="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 500 520"
          >
            <line
              x1="250"
              y1="260"
              x2="80"
              y2="60"
              stroke="#6C3CE1"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
            <line
              x1="250"
              y1="260"
              x2="390"
              y2="100"
              stroke="#6C3CE1"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
            <line
              x1="250"
              y1="260"
              x2="90"
              y2="380"
              stroke="#F97316"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
            <line
              x1="250"
              y1="260"
              x2="400"
              y2="420"
              stroke="#F97316"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
          </svg>

          <!-- Badge "vues" décoratif -->
          <div
            class="absolute top-36 right-0 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-xl px-3 py-2 text-center"
          >
            <p class="font-mono text-lg font-bold text-secondary">+156</p>
            <p class="text-[10px] text-white/50">vues ce mois</p>
          </div>

          <!-- Badge "note" décoratif -->
          <div
            class="absolute bottom-36 left-0 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl px-3 py-2 text-center"
          >
            <p class="font-mono text-lg font-bold text-yellow-400">⭐ 4.8</p>
            <p class="text-[10px] text-white/50">note moyenne</p>
          </div>
        </div>
      </div>

      <!-- Flèche scroll-down -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         SECTION 2 — STATS ANIMÉES
    ══════════════════════════════════════════════════ -->
    <section ref="statsSection" class="py-16 border-y border-white/[0.06] bg-white/[0.02]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="(stat, i) in bigStats"
            :key="stat.label"
            class="text-center"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 100 } }"
          >
            <p class="font-mono text-4xl sm:text-5xl font-bold text-white mb-2">
              <span class="text-gradient-orange">{{ statsVisible ? stat.display : '0' }}</span>
            </p>
            <p class="text-white/50 text-sm">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         SECTION 3 — CATÉGORIES
    ══════════════════════════════════════════════════ -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- En-tête de section -->
        <div
          class="text-center mb-16"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <p class="text-secondary text-sm font-semibold tracking-widest uppercase mb-3">
            Domaines
          </p>
          <h2 class="font-title text-4xl sm:text-5xl font-bold">Un talent pour chaque besoin</h2>
        </div>

        <!-- Grille des catégories -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <RouterLink
            v-for="(cat, i) in categories"
            :key="cat.label"
            :to="`/explore?category=${encodeURIComponent(cat.label)}`"
            class="category-card group"
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :visible="{ opacity: 1, scale: 1, transition: { duration: 400, delay: i * 60 } }"
          >
            <span
              class="text-3xl mb-3 block transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            >
              <component :is="cat.emoji" class="text-primary" />
            </span>
            <p class="font-semibold text-sm text-white">{{ cat.label }}</p>
            <p class="text-[11px] text-white/40 mt-1">{{ cat.count }} talents</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         SECTION 4 — TALENTS EN VEDETTE
    ══════════════════════════════════════════════════ -->
    <section class="py-24 bg-white/[0.02] border-y border-white/[0.06]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- En-tête -->
        <div
          class="flex items-end justify-between mb-12"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div>
            <p class="text-secondary text-sm font-semibold tracking-widest uppercase mb-3">
              Mis en avant
            </p>
            <h2 class="font-title text-4xl sm:text-5xl font-bold">Talents du moment</h2>
          </div>
          <RouterLink
            to="/explore"
            class="hidden sm:flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors duration-200"
          >
            Voir tous
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

        <!-- Grille de TalentCards -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="skeleton-card rounded-2xl h-64" />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TalentCard
            v-for="(talent, i) in topTalents"
            :key="talent.id"
            :talent="talent"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 80 } }"
          />
        </div>

        <!-- CTA centré -->
        <div class="text-center mt-12">
          <RouterLink to="/explore" class="btn-primary-outline">
            Voir tous les talents
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         SECTION 5 — COMMENT ÇA MARCHE
    ══════════════════════════════════════════════════ -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="text-center mb-16"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <p class="text-secondary text-sm font-semibold tracking-widest uppercase mb-3">
            Simple & rapide
          </p>
          <h2 class="font-title text-4xl sm:text-5xl font-bold">Comment ça marche</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(step, i) in howItWorks"
            :key="step.title"
            class="relative"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 150 } }"
          >
            <!-- Ligne de connexion entre étapes -->
            <div
              v-if="i < 2"
              class="hidden md:block absolute top-8 left-[60%] right-0 border-t border-dashed border-white/10 z-0"
            />

            <div class="relative z-10">
              <!-- Numéro d'étape -->
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 hover:scale-110"
                :class="step.bgClass"
              >
                <component :is="step.emoji" />
              </div>
              <span class="text-xs font-mono text-white/30 mb-2 block"> 0{{ i + 1 }} </span>
              <h3 class="font-title text-xl font-bold mb-3">{{ step.title }}</h3>
              <p class="text-white/50 leading-relaxed text-sm">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         SECTION 6 — CTA FINAL
    ══════════════════════════════════════════════════ -->
    <section class="py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Carte CTA avec effet glassmorphism -->
        <div
          class="cta-card"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :visible="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
        >
          <div class="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10"
            />
            <div
              class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            />
          </div>

          <div class="relative">
            <p class="text-secondary text-sm font-semibold tracking-widest uppercase mb-4">
              Tu as un talent ?
            </p>
            <h2 class="font-title text-4xl sm:text-5xl font-bold mb-6">
              Rejoins CamerTalents<br />
              <span class="text-gradient">gratuitement</span>
            </h2>
            <p class="text-white/50 text-lg mb-10 max-w-lg mx-auto">
              Crée ton profil en 3 minutes et commence à être visible par des milliers de recruteurs
              et particuliers au Cameroun.
            </p>
            <RouterLink to="/onboarding" class="btn-primary btn-primary--large">
              Créer mon profil maintenant
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </RouterLink>
            <p class="text-white/30 text-xs mt-4">Gratuit · Sans engagement · En 3 minutes</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTalents } from '../composables/useTalents';
import TalentCard from '../components/talent/TalentCard.vue';
import { CATEGORIES } from '../data/mockData';
import {
  Laptop,
  Hammer,
  Palette,
  GraduationCap,
  HandPlatter,
  Car,
  Search,
  User,
  Handshake,
} from 'lucide-vue-next';

// ── Données des talents ──────────────────────────────────────
const { talents, isLoading } = useTalents();

// 5 premiers talents pour les floating cards du hero
const featuredTalents = computed(() => talents.value.slice(0, 5));

// 6 meilleurs talents (triés par note) pour la section "Talents du moment"
const topTalents = computed(() => [...talents.value].sort((a, b) => b.note - a.note).slice(0, 6));

// ── Stats animées ────────────────────────────────────────────
const statsSection = ref(null);
const statsVisible = ref(false);

const bigStats = computed(() => [
  {
    display: statsVisible.value ? '1 240+' : '0',
    label: 'Talents inscrits',
  },
  {
    display: statsVisible.value ? '18' : '0',
    label: 'Villes couvertes',
  },
  {
    display: statsVisible.value ? '87%' : '0%',
    label: 'Taux de dispo.',
  },
  {
    display: statsVisible.value ? '4.8★' : '0★',
    label: 'Note moyenne',
  },
]);

// IntersectionObserver pour déclencher l'animation des stats
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        statsVisible.value = true;
        observer.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  if (statsSection.value) observer.observe(statsSection.value);
});

onUnmounted(() => {
  observer?.disconnect();
});

// ── Catégories ───────────────────────────────────────────────
const categories = computed(() => {
  const counts = {};
  talents.value.forEach((t) => {
    counts[t.categorie] = (counts[t.categorie] || 0) + 1;
  });

  const meta = {
    'Tech & Digital': { emoji: Laptop },
    'Artisanat & BTP': { emoji: Hammer },
    'Créatif & Art': { emoji: Palette },
    'Éducation & Formation': { emoji: GraduationCap },
    'Services & Lifestyle': { emoji: HandPlatter },
    'Transport & Logistique': { emoji: Car },
  };

  return CATEGORIES.map((label) => ({
    label,
    emoji: meta[label]?.emoji || '✨',
    count: counts[label] || 0,
  }));
});

// ── Comment ça marche ────────────────────────────────────────
const howItWorks = [
  {
    emoji: Search,
    bgClass: 'bg-primary/15 border border-primary/20',
    title: 'Cherche un talent',
    desc: 'Filtre par métier, ville ou compétence. Trouve le bon profil en quelques secondes.',
  },
  {
    emoji: User,
    bgClass: 'bg-secondary/15 border border-secondary/20',
    title: 'Consulte le profil',
    desc: 'Explore les compétences, les réalisations et la disponibilité du talent avant de le contacter.',
  },
  {
    emoji: Handshake,
    bgClass: 'bg-green-500/15 border border-green-500/20',
    title: 'Contacte directement',
    desc: "Prends contact par téléphone ou email. Pas d'intermédiaire, pas de commission.",
  },
];
</script>

<style scoped>
/* ── Dégradés texte ─────────────────────────────────────────── */
.text-gradient {
  background: linear-gradient(135deg, #a78bf6 0%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-orange {
  background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Boutons ─────────────────────────────────────────────────── */
.btn-primary {
  @apply inline-flex items-center gap-2
         px-6 py-3 rounded-xl
         bg-primary text-white font-semibold
         hover:bg-primary-600 active:scale-95
         transition-all duration-200;
}

.btn-primary--large {
  @apply px-8 py-4 text-lg rounded-2xl;
}

.btn-ghost {
  @apply inline-flex items-center gap-2
         px-6 py-3 rounded-xl
         border border-white/20 text-white/70 font-semibold
         hover:border-white/40 hover:text-white hover:bg-white/5
         active:scale-95 transition-all duration-200;
}

.btn-primary-outline {
  @apply inline-flex items-center gap-2
         px-6 py-3 rounded-xl
         border border-primary/40 text-primary-100 font-semibold
         hover:bg-primary/10 hover:border-primary/60
         active:scale-95 transition-all duration-200;
}

/* ── Floating cards du hero ──────────────────────────────────── */
.floating-card {
  @apply flex items-center gap-3 p-3 rounded-2xl
         bg-white/[0.06] backdrop-blur-sm
         border border-white/10
         shadow-xl;
}

.floating-card--main {
  @apply p-4 bg-white/[0.10] border-primary/30
         shadow-2xl shadow-primary/10;
  animation: float 4s ease-in-out infinite;
}

.availability-dot {
  @apply w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse;
}

/* ── Category cards ──────────────────────────────────────────── */
.category-card {
  @apply flex flex-col items-center justify-center
         p-6 rounded-2xl text-center cursor-pointer
         bg-white/[0.04] border border-white/[0.08]
         hover:bg-primary/10 hover:border-primary/30
         transition-all duration-300;
}

/* ── CTA card ────────────────────────────────────────────────── */
.cta-card {
  @apply relative p-12 rounded-3xl
         border border-white/10 bg-white/[0.03];
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
  animation: skeleton-shimmer 1.5s infinite;
}

/* ── Animations keyframes ────────────────────────────────────── */
@keyframes float {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-12px);
  }
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
