<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white pb-24">
    <!-- ════════════════════════════════════════════
      HEADER
    ════════════════════════════════════════════ -->
    <section class="relative py-16 border-b border-white/[0.06] overflow-hidden">
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p class="text-secondary text-sm font-semibold tracking-widest uppercase mb-3">
              Statistiques
            </p>
            <h1 class="font-title text-4xl sm:text-5xl font-bold">Tableau de bord</h1>
          </div>
          <div
            class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 text-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Mis à jour le {{ todayFormatted }}
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- ════════════════════════════════════════════
           LIGNE 1 — KPI CARDS
      ════════════════════════════════════════════ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard v-for="(kpi, i) in kpis" :key="kpi.label" :kpi="kpi" :index="i" />
      </div>

      <!-- ════════════════════════════════════════════
           LIGNE 2 — Donut + Line chart
      ════════════════════════════════════════════ -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Répartition par catégorie — Donut -->
        <div
          class="chart-card"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div class="chart-card__header">
            <h2 class="chart-card__title">Répartition par catégorie</h2>
            <span class="chart-badge">Donut</span>
          </div>
          <div class="relative flex items-center justify-center h-64">
            <Doughnut
              v-if="categoryChartData"
              :data="categoryChartData"
              :options="doughnutOptions"
            />
            <!-- Centre du donut -->
            <div class="absolute text-center pointer-events-none">
              <p class="font-mono text-3xl font-bold text-white">
                {{ totalTalents }}
              </p>
              <p class="text-xs text-white/30">talents</p>
            </div>
          </div>
          <!-- Légende custom -->
          <div class="grid grid-cols-2 gap-2 mt-4">
            <div
              v-for="(item, i) in categoryLegend"
              :key="item.label"
              class="flex items-center gap-2"
            >
              <span
                class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                :style="`background: ${chartColors[i]}`"
              />
              <span class="text-xs text-white/50 truncate">{{ item.label }}</span>
              <span class="text-xs font-mono text-white/30 ml-auto">
                {{ item.count }}
              </span>
            </div>
          </div>
        </div>

        <!-- Évolution des inscriptions — Line chart -->
        <div
          class="chart-card"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
        >
          <div class="chart-card__header">
            <h2 class="chart-card__title">Croissance mensuelle</h2>
            <span class="chart-badge">{{ currentYear }}</span>
          </div>
          <div class="h-64">
            <Line v-if="growthChartData" :data="growthChartData" :options="lineOptions" />
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════
        LIGNE 3 — Bar charts
      ════════════════════════════════════════════ -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Top villes — Bar horizontal -->
        <div
          class="chart-card"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div class="chart-card__header">
            <h2 class="chart-card__title">Top villes</h2>
            <span class="chart-badge">Talents / ville</span>
          </div>
          <div class="h-64">
            <Bar v-if="cityChartData" :data="cityChartData" :options="barHorizontalOptions" />
          </div>
        </div>

        <!-- Top compétences — Bar horizontal -->
        <div
          class="chart-card"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
        >
          <div class="chart-card__header">
            <h2 class="chart-card__title">Compétences les plus représentées</h2>
            <span class="chart-badge">Top 6</span>
          </div>
          <div class="h-64">
            <Bar v-if="skillsChartData" :data="skillsChartData" :options="barHorizontalOptions" />
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════
           LIGNE 4 — Taux de disponibilité
      ════════════════════════════════════════════ -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Disponibilité — Gauge donut -->
        <div
          class="chart-card"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div class="chart-card__header">
            <h2 class="chart-card__title">Disponibilité globale</h2>
          </div>
          <div class="relative flex items-center justify-center h-48">
            <Doughnut
              v-if="availabilityChartData"
              :data="availabilityChartData"
              :options="gaugeOptions"
            />
            <div class="absolute text-center pointer-events-none">
              <p
                class="font-mono text-3xl font-bold"
                :class="availabilityRate >= 70 ? 'text-green-400' : 'text-yellow-400'"
              >
                {{ availabilityRate }}%
              </p>
              <p class="text-xs text-white/30">disponibles</p>
            </div>
          </div>
          <!-- Légende disponibilité -->
          <div class="space-y-2 mt-2">
            <div
              v-for="item in availabilityLegend"
              :key="item.label"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :style="`background: ${item.color}`" />
                <span class="text-white/50">{{ item.label }}</span>
              </div>
              <span class="font-mono text-white/30">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- Notes moyennes par catégorie -->
        <div
          class="chart-card lg:col-span-2"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
        >
          <div class="chart-card__header">
            <h2 class="chart-card__title">Note moyenne par catégorie</h2>
          </div>
          <div class="space-y-4 mt-2">
            <div v-for="(item, i) in ratingByCategory" :key="item.label" class="space-y-1.5">
              <div class="flex items-center justify-between text-sm">
                <span class="text-white/60">{{ item.label }}</span>
                <div class="flex items-center gap-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="#FBBF24"
                    stroke="#FBBF24"
                    stroke-width="1"
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27
                                     17 14.14 18.18 21.02 12 17.77
                                     5.82 21.02 7 14.14 2 9.27
                                     8.91 8.26 12 2"
                    />
                  </svg>
                  <span class="font-mono text-white font-bold">
                    {{ item.avg }}
                  </span>
                </div>
              </div>
              <!-- Barre de note -->
              <div class="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :style="`
                    width: ${(item.avg / 5) * 100}%;
                    background: ${chartColors[i % chartColors.length]};
                    transition-delay: ${i * 100}ms
                  `"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════
           LIGNE 5 — Tableau des talents récents
      ════════════════════════════════════════════ -->
      <div
        class="chart-card"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div class="chart-card__header mb-6">
          <h2 class="chart-card__title">Talents récemment inscrits</h2>
          <RouterLink
            to="/explore"
            class="text-xs text-primary-100 hover:text-white transition-colors duration-200"
          >
            Voir tous →
          </RouterLink>
        </div>

        <!-- Tableau responsive -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/[0.06]">
                <th class="table-head text-left pb-3">Talent</th>
                <th class="table-head text-left pb-3 hidden sm:table-cell">Catégorie</th>
                <th class="table-head text-left pb-3 hidden md:table-cell">Ville</th>
                <th class="table-head text-right pb-3">Note</th>
                <th class="table-head text-right pb-3 hidden sm:table-cell">Vues</th>
                <th class="table-head text-right pb-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="talent in recentTalents"
                :key="talent._id || talent.id"
                class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer group"
                @click="$router.push(`/talent/${talent._id || talent.id}`)"
              >
                <!-- Talent -->
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="
                        talent.avatar
                          ? talent.avatar
                          : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
                      "
                      :alt="talent.nom"
                      class="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <p
                        class="text-sm font-medium text-white group-hover:text-primary-100 transition-colors duration-200"
                      >
                        {{ talent.nom }}
                      </p>
                      <p class="text-xs text-white/40">{{ talent.metier }}</p>
                    </div>
                  </div>
                </td>
                <!-- Catégorie -->
                <td class="py-4 hidden sm:table-cell">
                  <span class="text-xs text-white/50">{{ talent.categorie }}</span>
                </td>
                <!-- Ville -->
                <td class="py-4 hidden md:table-cell">
                  <span class="text-xs text-white/50">{{ talent.ville }}</span>
                </td>
                <!-- Note -->
                <td class="py-4 text-right">
                  <span class="font-mono text-sm text-yellow-400">
                    ★ {{ talent.note.toFixed(1) }}
                  </span>
                </td>
                <!-- Vues -->
                <td class="py-4 text-right hidden sm:table-cell">
                  <span class="font-mono text-sm text-white/40">
                    {{ talent.vues }}
                  </span>
                </td>
                <!-- Statut -->
                <td class="py-4 text-right">
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                    :class="getStatusClass(talent.disponibilite)"
                  >
                    {{ getStatusLabel(talent.disponibilite) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'vue-chartjs';

import { useTalents } from '../composables/useTalents';
import { useStats } from '../composables/useStats';
import StatCard from '../components/dashboard/StatCard.vue';

// ── Enregistrement des modules Chart.js ─────────────────────
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
);

// ── Données ──────────────────────────────────────────────────
const { talents } = useTalents();
const { availabilityRate, averageRating, topSkills, talentsByCategory, talentsByCity } = useStats();

// ── Palette de couleurs des graphiques ───────────────────────
const chartColors = ['#6C3CE1', '#F97316', '#EC4899', '#06B6D4', '#22C55E', '#EAB308'];

// ── KPI Cards — Croissance jour par jour ─────────────────
const totalTalents = computed(() => talents.value.length);

// Fonction utilitaire pour obtenir la date au format YYYY-MM-DD
function formatDateToDay(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Aujourd'hui et hier
const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
const todayString = formatDateToDay(todayDate);
const todayFormatted = todayDate.toLocaleDateString('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const yesterday = new Date(todayDate);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayString = formatDateToDay(yesterday);

const currentYear = new Date().getFullYear();

// ── Données d'aujourd'hui vs hier ────────────────────────
const talentsAujourdhui = computed(
  () => talents.value.filter((t) => formatDateToDay(t.dateInscription) === todayString).length,
);

const talentsHier = computed(
  () => talents.value.filter((t) => formatDateToDay(t.dateInscription) === yesterdayString).length,
);

const villesAujourdhui = computed(() => {
  const villesSet = new Set(
    talents.value
      .filter((t) => formatDateToDay(t.dateInscription) === todayString)
      .map((t) => t.ville),
  );
  return villesSet.size;
});

const villesHier = computed(() => {
  const villesSet = new Set(
    talents.value
      .filter((t) => formatDateToDay(t.dateInscription) === yesterdayString)
      .map((t) => t.ville),
  );
  return villesSet.size;
});

const tauxDispoAujourdhui = computed(() => {
  const talentsAuj = talents.value.filter(
    (t) => formatDateToDay(t.dateInscription) === todayString,
  );
  if (talentsAuj.length === 0) return 0;
  const dispoCount = talentsAuj.filter((t) => t.disponibilite === 'disponible').length;
  return Math.round((dispoCount / talentsAuj.length) * 100);
});

const tauxDispoHier = computed(() => {
  const talentsHier_ = talents.value.filter(
    (t) => formatDateToDay(t.dateInscription) === yesterdayString,
  );
  if (talentsHier_.length === 0) return 0;
  const dispoCount = talentsHier_.filter((t) => t.disponibilite === 'disponible').length;
  return Math.round((dispoCount / talentsHier_.length) * 100);
});

const noteAujourdhui = computed(() => {
  const talentsAuj = talents.value.filter(
    (t) => formatDateToDay(t.dateInscription) === todayString,
  );
  if (talentsAuj.length === 0) return 0;
  const sum = talentsAuj.reduce((acc, t) => acc + (t.note || 0), 0);
  return Math.round((sum / talentsAuj.length) * 10) / 10;
});

const noteHier = computed(() => {
  const talentsHier_ = talents.value.filter(
    (t) => formatDateToDay(t.dateInscription) === yesterdayString,
  );
  if (talentsHier_.length === 0) return 0;
  const sum = talentsHier_.reduce((acc, t) => acc + (t.note || 0), 0);
  return Math.round((sum / talentsHier_.length) * 10) / 10;
});

// ── Calcul des pourcentages de croissance ────────────────
const croissanceTalents = computed(() => {
  if (talentsHier.value === 0) return talentsAujourdhui.value > 0 ? 100 : 0;
  return Math.round(((talentsAujourdhui.value - talentsHier.value) / talentsHier.value) * 100);
});

const croissanceVilles = computed(() => {
  if (villesHier.value === 0) return villesAujourdhui.value > 0 ? 100 : 0;
  return Math.round(((villesAujourdhui.value - villesHier.value) / villesHier.value) * 100);
});

const croissanceDispo = computed(() => {
  if (tauxDispoHier.value === 0) return tauxDispoAujourdhui.value > 0 ? 100 : 0;
  return tauxDispoAujourdhui.value - tauxDispoHier.value; // Différence en points
});

const croissanceNote = computed(() => {
  if (noteHier.value === 0) return noteAujourdhui.value > 0 ? 100 : 0;
  return Math.round(((noteAujourdhui.value - noteHier.value) / noteHier.value) * 100);
});

const nombreVilles = computed(() => Object.keys(talentsByCity.value).length);

const kpis = computed(() => [
  {
    label: 'Talents inscrits',
    value: totalTalents.value,
    suffix: '',
    icon: 'users',
    trend: `${croissanceTalents.value >= 0 ? '+' : ''}${croissanceTalents.value}%`,
    trendLabel: 'vs hier',
    up: croissanceTalents.value >= 0,
    color: '#6C3CE1',
  },
  {
    label: 'Villes couvertes',
    value: nombreVilles.value,
    suffix: '',
    icon: 'map',
    trend: `${croissanceVilles.value >= 0 ? '+' : ''}${croissanceVilles.value}%`,
    trendLabel: 'vs hier',
    up: croissanceVilles.value >= 0,
    color: '#F97316',
  },
  {
    label: 'Taux de dispo.',
    value: availabilityRate.value,
    suffix: '%',
    icon: 'check',
    trend: `${croissanceDispo.value >= 0 ? '+' : ''}${croissanceDispo.value}%`,
    trendLabel: 'vs hier',
    up: croissanceDispo.value >= 0,
    color: '#22C55E',
  },
  {
    label: 'Note moyenne',
    value: averageRating.value,
    suffix: '★',
    icon: 'star',
    trend: `${croissanceNote.value >= 0 ? '+' : ''}${croissanceNote.value}%`,
    trendLabel: 'vs hier',
    up: croissanceNote.value >= 0,
    color: '#FBBF24',
  },
]);

// ── Graphique : Catégories (Donut) ───────────────────────────
const categoryChartData = computed(() => {
  const entries = Object.entries(talentsByCategory.value);
  return {
    labels: entries.map(([k]) => k),
    datasets: [
      {
        data: entries.map(([, v]) => v),
        backgroundColor: chartColors,
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };
});

const categoryLegend = computed(() =>
  Object.entries(talentsByCategory.value).map(([label, count]) => ({
    label,
    count,
  })),
);

// ── Graphique : Croissance (Line) — données dynamiques ────
const growthChartData = computed(() => {
  // Grouper les talents par mois-année
  const monthlyData = {};

  talents.value.forEach((talent) => {
    const date = new Date(talent.dateInscription);
    const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    const monthNum = date.getMonth();
    const yearNum = date.getFullYear();
    const key = `${yearNum}-${monthNum}`;

    if (!monthlyData[key]) {
      monthlyData[key] = { label: monthYear, count: 0, date };
    }
    monthlyData[key].count += 1;
  });

  // Trier par date et créer les données
  const sorted = Object.values(monthlyData)
    .sort((a, b) => a.date - b.date)
    .slice(-12); // Derniers 12 mois

  // Calculer les totaux cumulés (croissance)
  let cumulative = 0;
  const cumulativeData = sorted.map((item) => {
    cumulative += item.count;
    return cumulative;
  });

  return {
    labels: sorted.map((item) => item.label),
    datasets: [
      {
        label: 'Inscriptions cumulées',
        data: cumulativeData,
        borderColor: '#6C3CE1',
        backgroundColor: 'rgba(108, 60, 225, 0.12)',
        borderWidth: 2.5,
        pointBackgroundColor: '#6C3CE1',
        pointBorderColor: 'transparent',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };
});

// ── Graphique : Villes (Bar horizontal) ──────────────────────
const cityChartData = computed(() => {
  const entries = Object.entries(talentsByCity.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  return {
    labels: entries.map(([k]) => k),
    datasets: [
      {
        label: 'Talents',
        data: entries.map(([, v]) => v),
        backgroundColor: chartColors.map((c) => c + '99'),
        borderColor: chartColors,
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };
});

// ── Graphique : Compétences (Bar horizontal) ─────────────────
const skillsChartData = computed(() => ({
  labels: topSkills.value.map((s) => s.nom),
  datasets: [
    {
      label: 'Occurrences',
      data: topSkills.value.map((s) => s.count),
      backgroundColor: chartColors.map((c) => c + '99'),
      borderColor: chartColors,
      borderWidth: 1.5,
      borderRadius: 6,
    },
  ],
}));

// ── Graphique : Disponibilité (Gauge donut) ───────────────────
const availabilityChartData = computed(() => {
  const dispo = talents.value.filter((t) => t.disponibilite === 'disponible').length;
  const partiel = talents.value.filter(
    (t) => t.disponibilite === 'partiellement disponible',
  ).length;
  const occupe = talents.value.filter((t) => t.disponibilite === 'occupé').length;
  return {
    labels: ['Disponible', 'Partiel', 'Occupé'],
    datasets: [
      {
        data: [dispo, partiel, occupe],
        backgroundColor: ['#22C55E', '#EAB308', '#EF4444'],
        borderColor: 'transparent',
        borderWidth: 0,
      },
    ],
  };
});

const availabilityLegend = computed(() => {
  const dispo = talents.value.filter((t) => t.disponibilite === 'disponible').length;
  const partiel = talents.value.filter(
    (t) => t.disponibilite === 'partiellement disponible',
  ).length;
  const occupe = talents.value.filter((t) => t.disponibilite === 'occupé').length;
  return [
    { label: 'Disponible', count: dispo, color: '#22C55E' },
    { label: 'Partiel', count: partiel, color: '#EAB308' },
    { label: 'Occupé', count: occupe, color: '#EF4444' },
  ];
});

// ── Notes moyennes par catégorie ─────────────────────────────
const ratingByCategory = computed(() => {
  const groups = {};
  talents.value.forEach((t) => {
    if (!groups[t.categorie]) groups[t.categorie] = [];
    groups[t.categorie].push(t.note);
  });
  return Object.entries(groups)
    .map(([label, notes]) => ({
      label,
      avg: (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1),
    }))
    .sort((a, b) => b.avg - a.avg);
});

// ── Talents récents (tableau) ─────────────────────────────────
const recentTalents = computed(() =>
  [...talents.value]
    .sort((a, b) => new Date(b.dateInscription) - new Date(a.dateInscription))
    .slice(0, 8),
);

// ── Helpers statut ────────────────────────────────────────────
function getStatusClass(dispo) {
  const map = {
    disponible: 'bg-green-500/15 text-green-400',
    occupé: 'bg-red-500/15 text-red-400',
    'partiellement disponible': 'bg-yellow-500/15 text-yellow-400',
  };
  return map[dispo] || 'bg-white/10 text-white/40';
}

function getStatusLabel(dispo) {
  const map = {
    disponible: 'Dispo.',
    occupé: 'Occupé',
    'partiellement disponible': 'Partiel',
  };
  return map[dispo] || dispo;
}

// ══════════════════════════════════════════════════════════════
//  OPTIONS DES GRAPHIQUES CHART.JS
// ══════════════════════════════════════════════════════════════

// Options communes (réutilisées dans plusieurs charts)
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1A1230',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#ffffff',
      bodyColor: 'rgba(255,255,255,0.6)',
      padding: 10,
      cornerRadius: 8,
    },
  },
};

// Donut (catégories)
const doughnutOptions = {
  ...commonOptions,
  cutout: '72%',
  plugins: {
    ...commonOptions.plugins,
    legend: { display: false },
  },
};

// Gauge (disponibilité) — demi-donut
const gaugeOptions = {
  ...commonOptions,
  cutout: '75%',
  rotation: -90,
  circumference: 180,
  plugins: {
    ...commonOptions.plugins,
    legend: { display: false },
  },
};

// Line chart
const lineOptions = {
  ...commonOptions,
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: 'rgba(255,255,255,0.30)', font: { size: 11 } },
      border: { color: 'transparent' },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: 'rgba(255,255,255,0.30)', font: { size: 11 } },
      border: { color: 'transparent' },
    },
  },
};

// Bar horizontal
const barHorizontalOptions = {
  ...commonOptions,
  indexAxis: 'y',
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: 'rgba(255,255,255,0.30)', font: { size: 11 } },
      border: { color: 'transparent' },
    },
    y: {
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.50)', font: { size: 12 } },
      border: { color: 'transparent' },
    },
  },
};
</script>

<style scoped>
/* ── Carte de graphique ─────────────────────────────────── */
.chart-card {
  @apply p-6 rounded-2xl
         bg-white/[0.04] border border-white/[0.08];
}

.chart-card__header {
  @apply flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5;
}

.chart-card__title {
  @apply font-title text-base font-bold text-white;
}

.chart-badge {
  @apply px-2.5 py-1 rounded-lg text-xs font-medium
         bg-white/[0.06] text-white/40 border border-white/[0.08];
}

/* ── Tableau ─────────────────────────────────────────────── */
.table-head {
  @apply text-xs font-semibold text-white/30
         uppercase tracking-widest;
}
</style>
