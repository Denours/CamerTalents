<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white">
    <!-- ════════════════════════════════════════════
      HEADER
    ════════════════════════════════════════════ -->
    <section class="relative py-16 border-b border-white/[0.06] overflow-hidden">
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
            Géographie
          </p>
          <h1 class="font-title text-4xl sm:text-5xl font-bold mb-4">Carte des talents</h1>
          <p class="text-white/50 text-lg max-w-xl">
            Découvre la répartition des talents à travers tout le Cameroun, ville par ville.
          </p>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- ════════════════════════════════════════
          CARTE LEAFLET (2/3)
        ════════════════════════════════════════ -->
        <div class="lg:col-span-2">
          <div
            class="map-container"
            v-motion
            :initial="{ opacity: 0, scale: 0.98 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
          >
            <!-- Rendu de la carte -->
            <div ref="mapEl" class="w-full h-[520px] rounded-2xl z-10" />

            <!-- Légende superposée -->
            <div
              class="absolute bottom-4 left-4 z-20 bg-[#0F0A1E]/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 space-y-2"
            >
              <p class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                Légende
              </p>
              <template v-for="item in legend" :key="item.label">
                <div v-if="item.label" class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="`background: ${item.color}`"
                  />
                  <span class="text-xs text-white/60"
                    >{{ item.label }} talent{{ item.label > 1 ? 's' : '' }}</span
                  >
                </div>
              </template>
            </div>
          </div>

          <!-- Instruction -->
          <p class="text-xs text-white/25 text-center mt-3">
            Clique sur un marqueur pour voir les détails de la ville
          </p>
        </div>

        <!-- ════════════════════════════════════════
             SIDEBAR : classement des villes (1/3)
        ════════════════════════════════════════ -->
        <div
          class="space-y-4"
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 200 } }"
        >
          <h2 class="font-title text-lg font-bold">Classement des villes</h2>

          <!-- Liste triée par nombre de talents -->
          <div class="space-y-3">
            <div
              v-for="(city, i) in sortedCities"
              :key="city.ville"
              @click="flyToCity(city)"
              class="city-rank-card group cursor-pointer"
              :class="selectedCity?.ville === city.ville ? 'city-rank-card--active' : ''"
              v-motion
              :initial="{ opacity: 0, x: 20 }"
              :visible="{ opacity: 1, x: 0, transition: { duration: 400, delay: i * 60 } }"
            >
              <!-- Rang -->
              <span
                class="text-2xl font-mono font-bold w-8 flex-shrink-0"
                :class="
                  i === 0
                    ? 'text-yellow-400'
                    : i === 1
                      ? 'text-white/40'
                      : i === 2
                        ? 'text-secondary/70'
                        : 'text-white/20'
                "
              >
                {{ i + 1 }}
              </span>

              <!-- Infos ville -->
              <div class="flex-1 min-w-0">
                <p
                  class="font-semibold text-sm text-white group-hover:text-primary-100 transition-colors duration-200"
                >
                  {{ city.ville }}
                </p>
                <!-- Barre de proportion -->
                <div class="mt-1.5 h-1 rounded-full bg-white/[0.06]">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    :style="`
                      width: ${(city.count / maxCityCount) * 100}%;
                      background: ${getCityBarColor(i)};
                      transition-delay: ${i * 80}ms
                    `"
                  />
                </div>
              </div>

              <!-- Compte -->
              <span
                class="font-mono text-sm font-bold flex-shrink-0"
                :class="i === 0 ? 'text-yellow-400' : 'text-white/50'"
              >
                {{ city.count }}
              </span>
            </div>
          </div>

          <!-- Stats globales -->
          <div class="mt-6 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-3">
            <p class="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Vue d'ensemble
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-white/50">Villes couvertes</span>
              <span class="font-mono font-bold text-white">
                {{ sortedCities.length }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-white/50">Total talents</span>
              <span class="font-mono font-bold text-white">
                {{ totalTalents }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-white/50">Ville #1</span>
              <span class="font-mono font-bold text-yellow-400">
                {{ sortedCities[0]?.ville || '—' }}
              </span>
            </div>
          </div>

          <!-- Lien vers l'annuaire filtré -->
          <div
            v-if="selectedCity"
            @click="goToCity(selectedCity.ville)"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/15 border border-primary/30 text-primary-100 text-sm font-medium hover:bg-primary/25 transition-colors duration-200 cursor-pointer"
          >
            Voir les talents de {{ selectedCity.ville }}
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
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useTalents } from '../composables/useTalents';
import { useStats } from '../composables/useStats';
import { useFilterStore } from '../stores/filterStore';
import { useRouter } from 'vue-router';
import { VILLES_COORDS } from '../data/constants';

// ── Données ──────────────────────────────────────────────────
const { talents } = useTalents();
const { talentsByCity } = useStats();
const router = useRouter();
const filterStore = useFilterStore();

// ── Refs ─────────────────────────────────────────────────────
const mapEl = ref(null); // div hôte de Leaflet
const selectedCity = ref(null); // ville sélectionnée au clic

let mapInstance = null; // instance Leaflet (en dehors de la réactivité)
let markersLayer = null; // couche des marqueurs

function goToCity(cityLabel) {
  // 1. Réinitialise tous les filtres proprement
  filterStore.resetFilters();
  // 2. Applique la catégorie cliquée
  filterStore.selectedCity = cityLabel;
  // 3. Navigue vers l'annuaire (les filtres sont déjà en place)
  router.push('/explore');
}

function getCityBarColor(index) {
  const colors = [
    '#EAB308',
    '#6C3CE1',
    '#F97316',
    '#22C55E',
    '#06B6D4',
    '#EC4899',
    '#8B5CF6',
    '#14B8A6',
    '#F41B3A',
    '#EAC777',
  ];
  return colors[index % colors.length];
}

// ── Classement des villes ────────────────────────────────────
const sortedCities = computed(() =>
  Object.entries(talentsByCity.value)
    .map(([ville, count]) => ({ ville, count }))
    .sort((a, b) => b.count - a.count),
);

const maxCityCount = computed(() => sortedCities.value[0]?.count || 1);
const totalTalents = computed(() => talents.value.length);

// ── Couleurs par catégorie ────────────────────────────────────
const legend = [
  { label: maxCityCount.value, color: '#EAB308' },
  { label: sortedCities.value[1].count, color: '#6C3CE1' },
  { label: sortedCities.value[2].count, color: '#F97316' },
  { label: sortedCities.value[3]?.count, color: '#22C55E' },
  { label: sortedCities.value[4]?.count, color: '#06B6D4' },
  { label: sortedCities.value[5]?.count, color: '#EC4899' },
  { label: sortedCities.value[6]?.count, color: '#8B5CF6' },
  { label: sortedCities.value[7]?.count, color: '#14B8A6' },
  { label: sortedCities.value[8]?.count, color: '#F41B3A' },
  { label: sortedCities.value[9]?.count, color: '#EAC777' },
];

function getMarkerColor(count) {
  if (count === legend[0].label) return '#EAB308';
  else if (count === legend[1].label) return '#6C3CE1';
  else if (count === legend[2].label) return '#F97316';
  else if (count === legend[3].label) return '#22C55E';
  else if (count === legend[4].label) return '#06B6D4';
  else if (count === legend[5].label) return '#EC4899';
  else if (count === legend[6].label) return '#8B5CF6';
  else if (count === legend[7].label) return '#14B8A6';
  else if (count === legend[8].label) return '#F41B3A';
  else if (count === legend[9].label) return '#EAC777';
  else return null;
}
// ── Initialisation Leaflet ───────────────────────────────────
async function initMap() {
  // Import dynamique de Leaflet (évite les erreurs SSR)
  const L = (await import('leaflet')).default;
  await import('leaflet/dist/leaflet.css');

  if (!mapEl.value || mapInstance) return;

  // Crée la carte centrée sur le Cameroun
  mapInstance = L.map(mapEl.value, {
    center: [4.5, 12.5],
    zoom: 6,
    zoomControl: true,
    attributionControl: false,
  });

  // Tuile sombre (CartoDB Dark Matter) — s'intègre parfaitement au dark theme
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
  }).addTo(mapInstance);

  // Attribution discrète
  L.control.attribution({ prefix: false }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
  renderMarkers(L);
}

// ── Rendu des marqueurs ──────────────────────────────────────
function renderMarkers(L) {
  if (!markersLayer) return;
  markersLayer.clearLayers();

  VILLES_COORDS.forEach(({ ville, lat, lng }) => {
    const count = talentsByCity.value[ville] || 0;
    if (count === 0) return;

    const color = getMarkerColor(count);
    const radius = Math.max(8, Math.min(28, 8 + count * 1.8));

    // Marqueur cercle personnalisé
    const marker = L.circleMarker([lat, lng], {
      radius,
      fillColor: color,
      fillOpacity: 0.85,
      color: color,
      weight: 2,
      opacity: 0.4,
    });

    // Popup au clic
    marker.bindPopup(
      `
      <div style="
        background: #1A1230;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 12px 16px;
        color: white;
        font-family: sans-serif;
        min-width: 160px;
      ">
        <p style="font-weight: 700; font-size: 15px; margin: 0 0 4px;">
          ${ville}
        </p>
        <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0 0 8px;">
          ${count} talent${count > 1 ? 's' : ''} inscrit${count > 1 ? 's' : ''}
        </p>
        <div style="
          background: ${color}22;
          border: 1px solid ${color}44;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          color: ${color};
          display: inline-block;
        ">
          Voir les profils →
        </div>
      </div>
    `,
      {
        className: 'custom-popup',
        closeButton: false,
      },
    );

    marker.on('click', () => {
      selectedCity.value = { ville, count };
    });

    markersLayer.addLayer(marker);
  });
}

// ── Voler vers une ville (animation de zoom) ─────────────────
function flyToCity(city) {
  selectedCity.value = city;
  const coords = VILLES_COORDS.find((v) => v.ville === city.ville);
  if (!coords || !mapInstance) return;
  mapInstance.flyTo([coords.lat, coords.lng], 10, {
    duration: 1.2,
    easeLinearity: 0.25,
  });
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(() => {
  // Petit délai pour s'assurer que le DOM est monté
  setTimeout(initMap, 100);
});

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});

// Recharge les marqueurs si les données changent
watch(
  talentsByCity,
  async () => {
    if (mapInstance) {
      const L = (await import('leaflet')).default;
      renderMarkers(L);
    }
  },
  { deep: true },
);
</script>

<style scoped>
.map-container {
  @apply relative rounded-2xl overflow-hidden
         border border-white/[0.08];
}

.city-rank-card {
  @apply flex items-center gap-4 p-4 rounded-2xl
         bg-white/[0.04] border border-white/[0.08]
         hover:bg-white/[0.07] hover:border-primary/20
         transition-all duration-200;
}

.city-rank-card--active {
  @apply bg-primary/10 border-primary/30;
}
</style>

<!-- Styles globaux pour la popup Leaflet (non scopés car injectés dans le DOM) -->
<style>
.custom-popup .leaflet-popup-content-wrapper {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}
.custom-popup .leaflet-popup-content {
  margin: 0 !important;
}
.custom-popup .leaflet-popup-tip-container {
  display: none !important;
}
.leaflet-container {
  background: #0f0a1e !important;
}
</style>
