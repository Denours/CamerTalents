<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white pb-24">
    <!-- ════════════════════════════════════════════
         HEADER
    ════════════════════════════════════════════ -->
    <section class="relative py-12 border-b border-white/[0.06] overflow-hidden">
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-secondary/10 blur-[100px] pointer-events-none"
      />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex items-center justify-between gap-4"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div class="flex items-center gap-4">
            <!-- Retour dashboard -->
            <RouterLink
              to="/recruteur/dashboard"
              class="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.10] transition-all duration-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </RouterLink>
            <div>
              <p class="text-secondary text-sm font-semibold tracking-widest uppercase mb-1">
                Espace Recruteur
              </p>
              <h1 class="font-title text-3xl sm:text-4xl font-bold">Mes talents favoris</h1>
            </div>
          </div>

          <!-- Compteur + lien explorer -->
          <div class="flex items-center gap-3">
            <span
              v-if="talentsFavoris.length > 0"
              class="px-4 py-2 rounded-xl bg-secondary/15 border border-secondary/25 text-secondary font-mono font-bold text-sm"
            >
              {{ talentsFavoris.length }} talent{{ talentsFavoris.length > 1 ? 's' : '' }}
            </span>
            <RouterLink
              to="/explore"
              class="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors duration-200"
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
              Explorer
            </RouterLink>
          </div>
        </div>

        <!-- Barre de recherche dans les favoris -->
        <div
          v-if="talentsFavoris.length > 0"
          class="relative mt-8 max-w-xl"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 150 } }"
        >
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            name="search"
            placeholder="Rechercher dans mes favoris..."
            class="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white placeholder-white/30 text-sm focus:outline-none focus:border-secondary/50 transition-all duration-200"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors duration-200"
          >
            <svg
              width="14"
              height="14"
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- ════════════════════════════════════════════
           ÉTAT VIDE
      ════════════════════════════════════════════ -->
      <div
        v-if="talentsFavoris.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
      >
        <div class="text-7xl mb-6">💔</div>
        <h2 class="font-title text-2xl font-bold mb-3">Pas encore de favoris</h2>
        <p class="text-white/40 text-base mb-8 max-w-md">
          Explore les talents et clique sur le bouton ❤️ sur leurs profils pour les sauvegarder ici
          et les retrouver facilement.
        </p>
        <RouterLink
          to="/explore"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/80 transition-colors duration-200"
        >
          <svg
            width="16"
            height="16"
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
      </div>

      <!-- ════════════════════════════════════════════
           FILTRES RAPIDES (si favoris > 0)
      ════════════════════════════════════════════ -->
      <div v-if="talentsFavoris.length > 0">
        <!-- Filtres par disponibilité -->
        <div
          class="flex flex-wrap items-center gap-2 mb-8"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
        >
          <span class="text-xs text-white/30 mr-1">Filtrer :</span>
          <button
            v-for="filtre in filtres"
            :key="filtre.value"
            @click="filtreActif = filtre.value"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            :class="
              filtreActif === filtre.value
                ? filtre.activeClass
                : 'bg-white/[0.06] text-white/40 border border-white/[0.08] hover:bg-white/[0.10]'
            "
          >
            {{ filtre.label }}
            <span class="ml-1 opacity-60"> ({{ getFilterCount(filtre.value) }}) </span>
          </button>

          <!-- Tri -->
          <div class="ml-auto flex items-center gap-2">
            <span class="text-xs text-white/30">Trier :</span>
            <select
              v-model="sortBy"
              name="sorting"
              class="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-white/60 focus:outline-none focus:border-secondary/50 transition-all duration-200 cursor-pointer"
            >
              <option value="note">Mieux notés</option>
              <option value="nom">Nom A–Z</option>
              <option value="vues">Plus vus</option>
              <option value="recent">Récemment ajoutés</option>
            </select>
          </div>
        </div>

        <!-- Résultat vide après filtre -->
        <div v-if="favorisAffiches.length === 0" class="text-center py-16">
          <div class="text-4xl mb-4">🔍</div>
          <p class="text-white/40">Aucun favori ne correspond à ta recherche.</p>
          <button
            @click="resetFiltres"
            class="mt-4 text-sm text-secondary hover:text-white transition-colors duration-200"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <!-- ════════════════════════════════════════
             GRILLE DES FAVORIS
        ════════════════════════════════════════ -->
        <TransitionGroup
          v-else
          name="cards-grid"
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <div v-for="talent in favorisAffiches" :key="talent.id" class="favori-card group">
            <!-- Bouton retirer (coin haut droit) -->
            <button
              @click="confirmerSuppression(talent)"
              class="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-secondary/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Retirer des favoris"
            >
              <svg
                width="13"
                height="13"
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

            <!-- Lien vers le profil -->
            <RouterLink :to="`/talent/${talent.id}`" class="block">
              <!-- En-tête de la card -->
              <div class="flex items-start gap-4 mb-4">
                <img
                  :src="talent.avatar"
                  :alt="talent.nom"
                  class="w-14 h-14 rounded-2xl object-cover flex-shrink-0 ring-2 ring-white/10 group-hover:ring-secondary/30 transition-all duration-300"
                />
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-title font-bold text-white text-base group-hover:text-secondary transition-colors duration-200 truncate"
                  >
                    {{ talent.nom }}
                  </h3>
                  <p class="text-sm text-white/50 truncate">
                    {{ talent.metier }}
                  </p>
                  <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span class="flex items-center gap-1 text-xs text-white/30">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M21 10c0 7-9 13-9 13s-9-6-9-13
                                 a9 9 0 0 1 18 0z"
                        />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {{ talent.ville }}
                    </span>
                    <span class="flex items-center gap-1 text-xs text-yellow-400">
                      ★ {{ talent.note.toFixed(1) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Compétences -->
              <div class="flex flex-wrap gap-1.5 mb-4">
                <span
                  v-for="skill in talent.competences.slice(0, 3)"
                  :key="skill.nom"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/[0.06] text-white/60 border border-white/[0.08]"
                >
                  {{ skill.nom }}
                </span>
                <span
                  v-if="talent.competences.length > 3"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-secondary/10 text-secondary border border-secondary/20"
                >
                  +{{ talent.competences.length - 3 }}
                </span>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <span
                  class="text-xs font-medium px-2.5 py-1 rounded-lg"
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
                      ? '● Disponible'
                      : talent.disponibilite === 'occupé'
                        ? '● Occupé'
                        : '● Partiel'
                  }}
                </span>

                <!-- Boutons contact rapide -->
                <div class="flex items-center gap-2">
                  <a
                    :href="`tel:${talent.telephone}`"
                    @click.stop
                    class="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
                    title="Appeler"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2
                            c-3.56-.35-6.84-1.67-9.51-3.73
                            a16.5 16.5 0 0 1-3-3
                            c-2.06-2.67-3.38-5.95-3.73-9.51
                            A2 2 0 0 1 5.83 2.75h3
                            a2 2 0 0 1 2 1.72
                            c.12.96.36 1.9.7 2.81
                            a2 2 0 0 1-.45 2.11L9.91 10.09
                            a16 16 0 0 0 6 6
                            l1.27-1.27
                            a2 2 0 0 1 2.11-.45
                            c.91.34 1.85.57 2.81.7
                            A2 2 0 0 1 22 16.92z"
                      />
                    </svg>
                  </a>
                  <a
                    :href="`mailto:${talent.email}`"
                    @click.stop
                    class="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
                    title="Envoyer un email"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4
                               c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </a>
                </div>
              </div>
            </RouterLink>
          </div>
        </TransitionGroup>

        <!-- Résumé bas de page -->
        <p v-if="favorisAffiches.length > 0" class="text-center text-xs text-white/20 mt-10">
          {{ favorisAffiches.length }} talent{{ favorisAffiches.length > 1 ? 's' : '' }} affiché{{
            favorisAffiches.length > 1 ? 's' : ''
          }}
          sur {{ talentsFavoris.length }} sauvegardé{{ talentsFavoris.length > 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         MODALE DE CONFIRMATION SUPPRESSION
    ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="talentASupprimer"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          @click.self="talentASupprimer = null"
        >
          <div
            class="w-full max-w-sm bg-[#1A1230] border border-white/10 rounded-2xl p-8 text-center"
            v-motion
            :initial="{ scale: 0.9, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { duration: 300 } }"
          >
            <div class="text-5xl mb-4">💔</div>
            <h3 class="font-title text-xl font-bold mb-2">Retirer des favoris ?</h3>
            <p class="text-white/50 text-sm mb-8">
              <strong class="text-white">{{ talentASupprimer?.nom }}</strong>
              sera retiré de ta liste de favoris. Tu pourras le rajouter à tout moment.
            </p>
            <div class="flex gap-3">
              <button
                @click="talentASupprimer = null"
                class="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 text-sm font-medium hover:border-white/40 hover:text-white transition-all duration-200"
              >
                Annuler
              </button>
              <button
                @click="supprimerFavori"
                class="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-all duration-200"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useTalentStore } from '@/stores/talentStore';

const authStore = useAuthStore();
const talentStore = useTalentStore();

// ── Recherche & filtres ──────────────────────────────────────
const searchQuery = ref('');
const filtreActif = ref('tous');
const sortBy = ref('note');

// ── Talent à supprimer (modale de confirmation) ──────────────
const talentASupprimer = ref(null);

// ── Filtres disponibles ──────────────────────────────────────
const filtres = [
  {
    value: 'tous',
    label: 'Tous',
    activeClass: 'bg-white/10 text-white border border-white/20',
  },
  {
    value: 'disponible',
    label: 'Disponibles',
    activeClass: 'bg-green-500/15 text-green-400 border border-green-500/30',
  },
  {
    value: 'partiellement disponible',
    label: 'Partiels',
    activeClass: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  },
  {
    value: 'occupé',
    label: 'Occupés',
    activeClass: 'bg-red-500/15 text-red-400 border border-red-500/30',
  },
];

// ── Tous les talents favoris (objets complets) ───────────────
const talentsFavoris = computed(() =>
  authStore.favoris.map((id) => talentStore.getTalentById(id)).filter(Boolean),
);

// ── Favoris filtrés + triés + recherchés ─────────────────────
const favorisAffiches = computed(() => {
  let results = [...talentsFavoris.value];

  // Filtre par disponibilité
  if (filtreActif.value !== 'tous') {
    results = results.filter((t) => t.disponibilite === filtreActif.value);
  }

  // Filtre par recherche textuelle
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    results = results.filter(
      (t) =>
        t.nom.toLowerCase().includes(q) ||
        t.metier.toLowerCase().includes(q) ||
        t.ville.toLowerCase().includes(q) ||
        t.competences.some((c) => c.nom.toLowerCase().includes(q)),
    );
  }

  // Tri
  switch (sortBy.value) {
    case 'note':
      results.sort((a, b) => b.note - a.note);
      break;
    case 'nom':
      results.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
      break;
    case 'vues':
      results.sort((a, b) => b.vues - a.vues);
      break;
    case 'recent':
      // Ordre d'ajout dans authStore.favoris (les plus récents en premier)
      results.sort((a, b) => authStore.favoris.indexOf(b.id) - authStore.favoris.indexOf(a.id));
      break;
  }

  return results;
});

// ── Compte par filtre ────────────────────────────────────────
function getFilterCount(value) {
  if (value === 'tous') return talentsFavoris.value.length;
  return talentsFavoris.value.filter((t) => t.disponibilite === value).length;
}

// ── Reset filtres ────────────────────────────────────────────
function resetFiltres() {
  searchQuery.value = '';
  filtreActif.value = 'tous';
  sortBy.value = 'note';
}

// ── Suppression avec confirmation ────────────────────────────
function confirmerSuppression(talent) {
  talentASupprimer.value = talent;
}

function supprimerFavori() {
  if (!talentASupprimer.value) return;
  authStore.toggleFavori(talentASupprimer.value.id);
  talentASupprimer.value = null;
}
</script>

<style scoped>
/* ── Card favori ─────────────────────────────────────────── */
.favori-card {
  @apply relative p-5 rounded-2xl
         bg-white/[0.04] border border-white/[0.08]
         hover:bg-white/[0.07] hover:border-secondary/25
         hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/10
         transition-all duration-300;
}

/* ── Animation grille ────────────────────────────────────── */
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

/* ── Modal ───────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
