<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- ════════════════════════════════════════════
           EN-TÊTE
      ════════════════════════════════════════════ -->
      <div
        class="text-center mb-12"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 mb-8 text-white/30 hover:text-white/60 transition-colors duration-200 text-sm"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour à l'accueil
        </RouterLink>
        <h1 class="font-title text-4xl font-bold mb-3">Rejoins TalentCam</h1>
        <p class="text-white/50">Crée ton profil en 3 étapes et commence à être visible</p>
      </div>

      <!-- ════════════════════════════════════════════
           STEPPER
      ════════════════════════════════════════════ -->
      <div
        class="flex items-center justify-center mb-12"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 500, delay: 100 } }"
      >
        <div class="flex items-center gap-0">
          <div v-for="(step, i) in steps" :key="step.id" class="flex items-center">
            <!-- Cercle d'étape -->
            <div class="flex flex-col items-center gap-2">
              <div class="stepper-circle" :class="getStepClass(i)">
                <!-- Checkmark si étape complétée -->
                <svg
                  v-if="currentStep > i"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <!-- Numéro si étape non complétée -->
                <span v-else class="text-sm font-bold">{{ i + 1 }}</span>
              </div>
              <span
                class="text-[11px] font-medium whitespace-nowrap hidden sm:block"
                :class="
                  currentStep === i
                    ? 'text-white'
                    : currentStep > i
                      ? 'text-green-400'
                      : 'text-white/30'
                "
              >
                {{ step.label }}
              </span>
            </div>

            <!-- Ligne de connexion -->
            <div
              v-if="i < steps.length - 1"
              class="w-16 sm:w-24 h-px mx-2 mb-5 transition-all duration-500"
              :class="currentStep > i ? 'bg-green-500/60' : 'bg-white/10'"
            />
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════
           CARTE DU FORMULAIRE
      ════════════════════════════════════════════ -->
      <div
        class="form-card"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
      >
        <!-- Transition entre étapes -->
        <TransitionGroup name="step-slide">
          <!-- ══════════════════════════════════════
               ÉTAPE 1 — Informations personnelles
          ══════════════════════════════════════ -->
          <div v-if="currentStep === 0" key="step1">
            <h2 class="step-title">Informations personnelles</h2>
            <p class="step-subtitle">Dis-nous qui tu es</p>

            <div class="space-y-5 mt-8">
              <!-- Nom complet -->
              <div class="form-group">
                <label for class="form-label">Nom complet *</label>
                <input
                  v-model="form.nom"
                  type="text"
                  placeholder="Ex : Tamo Dominique"
                  class="form-input"
                  :class="errors.nom ? 'form-input--error' : ''"
                  @blur="validateField('nom')"
                />
                <p v-if="errors.nom" class="form-error">{{ errors.nom }}</p>
              </div>

              <!-- Métier -->
              <div class="form-group">
                <label for class="form-label">Titre / Métier *</label>
                <input
                  v-model="form.metier"
                  type="text"
                  placeholder="Ex : Développeur Web Frontend"
                  class="form-input"
                  :class="errors.metier ? 'form-input--error' : ''"
                  @blur="validateField('metier')"
                />
                <p v-if="errors.metier" class="form-error">{{ errors.metier }}</p>
              </div>

              <!-- Catégorie -->
              <div class="form-group">
                <label for class="form-label">Catégorie *</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="cat in CATEGORIES"
                    :key="cat"
                    type="button"
                    @click="
                      form.categorie = cat;
                      validateField('categorie');
                    "
                    class="category-btn"
                    :class="form.categorie === cat ? 'category-btn--active' : ''"
                  >
                    {{ catEmojis[cat] }} {{ cat }}
                  </button>
                </div>
                <p v-if="errors.categorie" class="form-error">
                  {{ errors.categorie }}
                </p>
              </div>

              <!-- Ville + Quartier -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label for class="form-label">Ville *</label>
                  <select
                    v-model="form.ville"
                    class="form-input form-select"
                    :class="errors.ville ? 'form-input--error' : ''"
                    @change="validateField('ville')"
                  >
                    <option value="" disabled>Choisir...</option>
                    <option v-for="v in VILLES" :key="v" :value="v" class="text-black">
                      {{ v }}
                    </option>
                  </select>
                  <p v-if="errors.ville" class="form-error">{{ errors.ville }}</p>
                </div>
                <div class="form-group">
                  <label for class="form-label">Quartier</label>
                  <input
                    v-model="form.quartier"
                    type="text"
                    placeholder="Ex : Akwa"
                    class="form-input"
                  />
                </div>
              </div>
              <!-- Bio -->
              <div class="form-group">
                <label for class="form-label">
                  Bio
                  <span class="text-white/30 text-xs font-normal ml-1">
                    ({{ form.bio.length }}/400)
                  </span>
                </label>
                <textarea
                  v-model="form.bio"
                  rows="4"
                  maxlength="400"
                  placeholder="Décris ton expérience, ton style, ce qui te différencie..."
                  class="form-input resize-none"
                />
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════
               ÉTAPE 2 — Compétences
          ══════════════════════════════════════ -->
          <div v-if="currentStep === 1" key="step2">
            <h2 class="step-title">Tes compétences</h2>
            <p class="step-subtitle">Ajoute jusqu'à 6 compétences avec ton niveau</p>

            <div class="space-y-4 mt-8">
              <!-- Liste des compétences ajoutées -->
              <TransitionGroup name="skill-list" tag="div" class="space-y-3">
                <div v-for="(skill, i) in form.competences" :key="skill.id" class="skill-row">
                  <!-- Nom de la compétence -->
                  <input
                    v-model="skill.nom"
                    type="text"
                    placeholder="Ex : Vue.js si vous êtes développeur"
                    class="form-input flex-1 min-w-0"
                  />

                  <!-- Niveau (slider) -->
                  <div class="flex flex-col gap-1 w-36 flex-shrink-0">
                    <div class="flex justify-between text-xs text-white/40">
                      <span>Niveau</span>
                      <span class="font-mono font-bold text-white"> {{ skill.niveau }}% </span>
                    </div>
                    <!-- Barre de preview -->
                    <div class="h-1.5 rounded-full bg-white/[0.08]">
                      <div
                        class="h-full rounded-full bg-primary transition-all duration-200"
                        :style="`width: ${skill.niveau}%`"
                      />
                    </div>
                    <input
                      v-model.number="skill.niveau"
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      class="skill-slider"
                    />
                  </div>

                  <!-- Supprimer -->
                  <button
                    type="button"
                    @click="removeSkill(i)"
                    class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7
                               a2 2 0 0 1-2-2V6m3 0V4
                               a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                      />
                    </svg>
                  </button>
                </div>
              </TransitionGroup>

              <!-- Bouton ajouter compétence -->
              <button
                v-if="form.competences.length < 6"
                type="button"
                @click="addSkill"
                class="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 text-sm hover:border-primary/40 hover:text-primary-100 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Ajouter une compétence
                <span class="text-white/25 text-xs"> ({{ form.competences.length }}/6) </span>
              </button>

              <!-- Message si aucune compétence -->
              <div
                v-if="form.competences.length === 0"
                class="text-center py-8 text-white/20 text-sm"
              >
                Aucune compétence ajoutée — clique sur "Ajouter" ci-dessus
              </div>

              <!-- Disponibilité -->
              <div class="form-group mt-6 pt-6 border-t border-white/[0.06]">
                <label for class="form-label">Disponibilité actuelle</label>
                <div class="flex flex-wrap gap-3 mt-2">
                  <button
                    v-for="opt in disponibiliteOptions"
                    :key="opt.value"
                    type="button"
                    @click="form.disponibilite = opt.value"
                    class="dispo-btn"
                    :class="
                      form.disponibilite === opt.value
                        ? `dispo-btn--active dispo-btn--${opt.color}`
                        : ''
                    "
                  >
                    <span
                      class="w-2 h-2 rounded-full flex-shrink-0"
                      :class="`bg-${opt.color}-400`"
                    />
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════
            ÉTAPE 3 — Finalisation
          ══════════════════════════════════════ -->
          <div v-if="currentStep === 2" key="step3">
            <h2 class="step-title">Finalisation</h2>
            <p class="step-subtitle">Derniers détails avant publication</p>

            <div class="space-y-5 mt-8">
              <!-- Avatar URL -->
              <div class="form-group">
                <label for class="form-label">Photo de profil</label>
                <div class="flex items-center gap-4">
                  <!-- Preview -->
                  <div
                    class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.06] border border-white/[0.10] flex items-center justify-center"
                  >
                    <img
                      v-if="avatarPreview"
                      :src="avatarPreview"
                      alt="avatar"
                      class="w-full h-full object-cover"
                      @error="avatarPreview = ''"
                    />
                    <svg
                      v-else
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      stroke-width="1.5"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8
                               a4 4 0 0 0-4 4v2"
                      />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <input
                      v-model="form.avatar"
                      type="url"
                      placeholder="https://... (URL de ta photo)"
                      class="form-input"
                      @input="debouncedAvatarPreview"
                    />
                    <p class="text-xs text-white/25 mt-1.5">Colle l'URL de ta photo</p>
                  </div>
                </div>
              </div>

              <!-- Téléphone -->
              <div class="form-group">
                <label for class="form-label">Téléphone *</label>
                <input
                  v-model="form.telephone"
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  class="form-input"
                  :class="errors.telephone ? 'form-input--error' : ''"
                  @blur="validateField('telephone')"
                />
                <p v-if="errors.telephone" class="form-error">
                  {{ errors.telephone }}
                </p>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for class="form-label">Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="ton@email.com"
                  class="form-input"
                  :class="errors.email ? 'form-input--error' : ''"
                  @blur="validateField('email')"
                />
                <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
              </div>

              <!-- Tarif journalier -->
              <div class="form-group">
                <label for class="form-label">
                  Tarif journalier (FCFA)
                  <span class="text-white/30 text-xs font-normal ml-1"> optionnel </span>
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.tarifJour"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Ex : 25000"
                    class="form-input pr-20"
                  />
                  <span class="absolute right-10 top-1/2 -translate-y-1/2 text-sm text-white/30">
                    FCFA
                  </span>
                </div>
              </div>
              <!-- ─────────────────────────────────────────
                PORTFOLIO — Liens vers réalisations
              ───────────────────────────────────────── -->
              <div class="form-group pt-2">
                <label for class="form-label">
                  Portfolio
                  <span class="text-white/30 text-xs font-normal ml-1">
                    images de tes réalisations (max 5)
                  </span>
                </label>
                <p class="text-xs text-white/30 mb-3">
                  Colle des liens vers tes images hébergées (Imgur, Cloudinary, Google Drive, etc.)
                </p>

                <TransitionGroup name="skill-list" tag="div" class="space-y-3">
                  <div
                    v-for="(_, i) in form.portfolio"
                    :key="`portfolio-${i}`"
                    class="flex items-center gap-3"
                  >
                    <!-- Miniature preview -->
                    <div
                      class="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden bg-white/[0.06] border border-white/[0.08] flex items-center justify-center"
                    >
                      <img
                        v-if="portfolioPreviews[i]"
                        :src="portfolioPreviews[i]"
                        alt="portfolio"
                        class="w-full h-full object-cover"
                        @error="portfolioPreviews[i] = ''"
                      />
                      <svg
                        v-else
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        stroke-width="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>

                    <!-- Input URL -->
                    <input
                      v-model="form.portfolio[i]"
                      type="url"
                      :placeholder="`https://i.imgur.com/... (image ${i + 1})`"
                      class="form-input flex-1 min-w-0"
                      @input="debouncedPortfolioPreview(i)"
                    />

                    <!-- Supprimer -->
                    <button
                      type="button"
                      @click="removePortfolioLink(i)"
                      class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
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
                </TransitionGroup>

                <!-- Bouton ajouter un lien -->
                <button
                  v-if="form.portfolio.length < 5"
                  type="button"
                  @click="addPortfolioLink"
                  class="w-full mt-3 py-3 rounded-xl border border-dashed border-white/20 text-white/40 text-sm hover:border-secondary/40 hover:text-secondary hover:bg-secondary/5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Ajouter une image de portfolio
                  <span class="text-white/25 text-xs">({{ form.portfolio.length }}/5)</span>
                </button>

                <div
                  v-if="form.portfolio.length === 0"
                  class="text-center py-6 text-white/20 text-sm"
                >
                  Aucune réalisation ajoutée — optionnel mais recommandé
                </div>
              </div>
              <!-- ─────────────────────────────────────────
                   FIN PORTFOLIO
              ───────────────────────────────────────── -->
              <!-- Récapitulatif -->
              <div
                class="mt-8 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3"
              >
                <p class="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                  Récapitulatif
                </p>
                <RecapRow label="Nom" :value="form.nom || '—'" />
                <RecapRow label="Métier" :value="form.metier || '—'" />
                <RecapRow label="Catégorie" :value="form.categorie || '—'" />
                <RecapRow
                  label="Localisation"
                  :value="
                    form.ville ? `${form.ville}${form.quartier ? ', ' + form.quartier : ''}` : '—'
                  "
                />
                <RecapRow label="Compétences" :value="`${form.competences.length} ajoutée(s)`" />
                <RecapRow
                  label="Portfolio"
                  :value="portfolioFilled > 0 ? `${portfolioFilled} image(s)` : 'Aucune image'"
                />
                <RecapRow label="Disponibilité" :value="form.disponibilite || '—'" />
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- ════════════════════════════════════════
             BOUTONS DE NAVIGATION
        ════════════════════════════════════════ -->
        <div class="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
          <!-- Précédent -->
          <button
            v-if="currentStep > 0"
            type="button"
            @click="prevStep"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/60 text-sm font-medium hover:border-white/40 hover:text-white transition-all duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Précédent
          </button>
          <div v-else />

          <!-- Suivant / Soumettre -->
          <button
            type="button"
            @click="currentStep < steps.length - 1 ? nextStep() : submitForm()"
            :disabled="isSubmitting"
            class="submit-btn"
            :class="isSubmitting ? 'opacity-60 cursor-not-allowed' : ''"
          >
            <span v-if="isSubmitting" class="flex items-center gap-2">
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
              Création en cours...
            </span>
            <span v-else-if="currentStep < steps.length - 1" class="flex items-center gap-2">
              Continuer
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <span v-else class="flex items-center gap-2"> ✅ Créer mon profil </span>
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         MODAL DE SUCCÈS
    ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="success-modal">
        <div
          v-if="showSuccess"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            class="max-w-md w-full bg-[#1A1230] border border-white/10 rounded-3xl p-10 text-center"
            v-motion
            :initial="{ scale: 0.8, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { duration: 400 } }"
          >
            <!-- Animation succès -->
            <div
              class="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 animate-bounce-once"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22C55E"
                stroke-width="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 class="font-title text-3xl font-bold mb-3">Bienvenue sur CamerTalents ! 🎉</h2>
            <p class="text-white/50 mb-8 leading-relaxed">
              Ton profil <strong class="text-white">{{ form.nom }}</strong>
              a été créé avec succès. Tu es maintenant visible par des milliers de personnes au
              Cameroun.
            </p>

            <div class="flex flex-col gap-3">
              <RouterLink
                :to="`/talent/${newTalentId}`"
                @click="showSuccess = false"
                class="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 transition-colors duration-200"
              >
                Voir mon profil →
              </RouterLink>
              <RouterLink
                to="/explore"
                @click="showSuccess = false"
                class="w-full py-3.5 rounded-xl border border-white/20 text-white/60 font-medium text-sm hover:border-white/40 hover:text-white transition-all duration-200"
              >
                Explorer les autres talents
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useTalentStore } from '../stores/talentStore';
import { CATEGORIES, VILLES } from '../data/mockData';
import RecapRow from '../components/onboarding/RecapRow.vue';

// ── Store ────────────────────────────────────────────────────
const talentStore = useTalentStore();

// ── Étapes du stepper ────────────────────────────────────────
const steps = [
  { id: 'info', label: 'Informations' },
  { id: 'skills', label: 'Compétences' },
  { id: 'final', label: 'Finalisation' },
];
const currentStep = ref(0);
const isSubmitting = ref(false);
const showSuccess = ref(false);
const newTalentId = ref('');

// ── Formulaire ───────────────────────────────────────────────
const form = ref({
  nom: '',
  metier: '',
  categorie: '',
  ville: '',
  quartier: '',
  bio: '',
  competences: [],
  disponibilite: 'disponible',
  avatar: '',
  telephone: '',
  email: '',
  tarifJour: null,
  portfolio: [],
});

// ── Erreurs de validation ────────────────────────────────────
const errors = ref({
  nom: '',
  metier: '',
  categorie: '',
  ville: '',
  telephone: '',
  email: '',
});

// ── Emojis des catégories ────────────────────────────────────
const catEmojis = {
  'Tech & Digital': '💻',
  'Artisanat & BTP': '🔨',
  'Créatif & Art': '🎨',
  'Éducation & Formation': '📚',
  'Services & Lifestyle': '🍳',
  'Transport & Logistique': '🚗',
};

// ── Options de disponibilité ─────────────────────────────────
const disponibiliteOptions = [
  { value: 'disponible', label: 'Disponible', color: 'green' },
  { value: 'partiellement disponible', label: 'Partiel', color: 'yellow' },
  { value: 'occupé', label: 'Occupé', color: 'red' },
];

// ── Preview avatar ───────────────────────────────────────────
const avatarPreview = ref('');
let avatarTimer = null;

function debouncedAvatarPreview() {
  clearTimeout(avatarTimer);
  avatarTimer = setTimeout(() => {
    avatarPreview.value = form.value.avatar;
  }, 600);
}

// ── Portfolio ────────────────────────────────────────────────
// portfolioPreviews[i] contient l'URL validée après debounce
// (séparé de form.portfolio pour éviter des requêtes à chaque frappe)
const portfolioPreviews = ref([]);
const portfolioTimers = {};

function addPortfolioLink() {
  if (form.value.portfolio.length >= 5) return;
  form.value.portfolio.push('');
  portfolioPreviews.value.push('');
}

function removePortfolioLink(index) {
  form.value.portfolio.splice(index, 1);
  portfolioPreviews.value.splice(index, 1);
}

function debouncedPortfolioPreview(index) {
  clearTimeout(portfolioTimers[index]);
  portfolioTimers[index] = setTimeout(() => {
    portfolioPreviews.value[index] = form.value.portfolio[index];
  }, 700);
}

const portfolioFilled = computed(
  () => form.value.portfolio.filter((url) => url.trim().length > 0).length,
);

// ── Gestion des compétences ──────────────────────────────────
function addSkill() {
  if (form.value.competences.length >= 6) return;
  form.value.competences.push({
    id: Date.now(), // clé unique pour TransitionGroup
    nom: '',
    niveau: 70,
  });
}

function removeSkill(index) {
  form.value.competences.splice(index, 1);
}

// ── Validation ───────────────────────────────────────────────
const validators = {
  nom: (v) => {
    if (!v.trim()) return 'Le nom est requis';
    if (v.trim().length < 3) return 'Minimum 3 caractères';
    return '';
  },
  metier: (v) => {
    if (!v.trim()) return 'Le métier est requis';
    return '';
  },
  categorie: (v) => {
    if (!v) return 'Choisis une catégorie';
    return '';
  },
  ville: (v) => {
    if (!v) return 'Choisis une ville';
    return '';
  },
  telephone: (v) => {
    if (!v.trim()) return 'Le téléphone est requis';
    const clean = v.replaceAll(/\s/g, '');
    if (!/^[+]?\d{8,15}$/.test(clean)) return 'Numéro invalide';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return "L'email est requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email invalide';
    return '';
  },
};

function validateField(field) {
  if (validators[field]) {
    errors.value[field] = validators[field](form.value[field]);
  }
}

// Valide tous les champs d'une étape et retourne true si OK
function validateStep(stepIndex) {
  let valid = true;

  if (stepIndex === 0) {
    const fields = ['nom', 'metier', 'categorie', 'ville'];
    fields.forEach((f) => {
      validateField(f);
      if (errors.value[f]) valid = false;
    });
  }

  if (stepIndex === 2) {
    const fields = ['telephone', 'email'];
    fields.forEach((f) => {
      validateField(f);
      if (errors.value[f]) valid = false;
    });
  }

  return valid;
}

// ── Navigation ───────────────────────────────────────────────
function nextStep() {
  if (!validateStep(currentStep.value)) return;
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── Couleur du stepper ───────────────────────────────────────
function getStepClass(index) {
  if (currentStep.value > index) return 'stepper-circle--done';
  if (currentStep.value === index) return 'stepper-circle--active';
  return 'stepper-circle--pending';
}

// ── Soumission du formulaire ─────────────────────────────────
async function submitForm() {
  if (!validateStep(2)) return;
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Nettoyage des données avant envoi
  const cleanCompetences = form.value.competences
    .filter((s) => s.nom.trim())
    .map(({ nom, niveau }) => ({ nom, niveau }));

  const cleanPortfolio = form.value.portfolio.filter((url) => url.trim().length > 0);

  // addTalent() persiste automatiquement dans localStorage
  const newTalent = talentStore.addTalent({
    ...form.value,
    competences: cleanCompetences,
    portfolio: cleanPortfolio,
    avatar: form.value.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
  });

  newTalentId.value = newTalent.id;
  isSubmitting.value = false;
  showSuccess.value = true;
}
</script>

<style scoped>
/* ── Carte du formulaire ──────────────────────────────────── */
.form-card {
  @apply p-8 rounded-3xl
         bg-white/[0.04] border border-white/[0.08];
}

/* ── Stepper ──────────────────────────────────────────────── */
.stepper-circle {
  @apply w-10 h-10 rounded-full flex items-center justify-center
         font-bold text-sm transition-all duration-300;
}
.stepper-circle--active {
  @apply bg-primary text-white ring-4 ring-primary/25;
}
.stepper-circle--done {
  @apply bg-green-500 text-white;
}
.stepper-circle--pending {
  @apply bg-white/[0.06] text-white/30 border border-white/[0.10];
}

/* ── Titres d'étape ───────────────────────────────────────── */
.step-title {
  @apply font-title text-2xl font-bold;
}
.step-subtitle {
  @apply text-white/40 text-sm mt-1;
}

/* ── Champs de formulaire ─────────────────────────────────── */
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-white/70;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl
         bg-white/[0.06] border border-white/[0.10]
         text-white placeholder-white/25 text-sm
         focus:outline-none focus:border-primary/50
         focus:bg-white/[0.08]
         transition-all duration-200;
}

.form-input--error {
  @apply border-red-500/50 focus:border-red-500/70;
}

.form-select {
  @apply appearance-none cursor-pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.form-error {
  @apply text-xs text-red-400 flex items-center gap-1;
}
.form-error::before {
  content: '⚠ ';
}

/* ── Catégories ───────────────────────────────────────────── */
.category-btn {
  @apply px-3 py-2.5 rounded-xl text-xs font-medium text-left
         bg-white/[0.04] border border-white/[0.08]
         text-white/50 hover:text-white hover:bg-white/[0.08]
         transition-all duration-200;
}
.category-btn--active {
  @apply bg-primary/15 border-primary/40 text-white font-semibold;
}

/* ── Disponibilité ────────────────────────────────────────── */
.dispo-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-xl text-sm
         font-medium border border-white/10 text-white/50
         hover:text-white hover:border-white/30
         transition-all duration-200;
}
.dispo-btn--active {
  @apply border-opacity-50 font-semibold;
}
.dispo-btn--active.dispo-btn--green {
  @apply bg-green-500/15 border-green-500/40 text-green-400;
}
.dispo-btn--active.dispo-btn--yellow {
  @apply bg-yellow-500/15 border-yellow-500/40 text-yellow-400;
}
.dispo-btn--active.dispo-btn--red {
  @apply bg-red-500/15 border-red-500/40 text-red-400;
}

/* ── Ligne de compétence ──────────────────────────────────── */
.skill-row {
  @apply flex items-center gap-3 p-3 rounded-xl
         bg-white/[0.03] border border-white/[0.06];
}

/* ── Slider de compétence ─────────────────────────────────── */
.skill-slider {
  @apply w-full h-1 appearance-none rounded-full
         bg-white/[0.10] cursor-pointer;
}
.skill-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #6c3ce1;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
}
.skill-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #6c3ce1;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

/* ── Bouton soumettre ─────────────────────────────────────── */
.submit-btn {
  @apply px-6 py-2.5 rounded-xl bg-primary text-white
         font-semibold text-sm
         hover:bg-primary-600 active:scale-95
         transition-all duration-200
         disabled:opacity-60 disabled:cursor-not-allowed;
}

/* ── Transitions entre étapes ────────────────────────────── */
.step-slide-enter-active {
  transition: all 0.3s ease;
}
.step-slide-leave-active {
  transition: all 0.2s ease;
  position: absolute;
}
.step-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* ── Animation liste compétences ─────────────────────────── */
.skill-list-enter-active {
  transition: all 0.3s ease;
}
.skill-list-leave-active {
  transition: all 0.25s ease;
}
.skill-list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.skill-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.skill-list-move {
  transition: transform 0.3s ease;
}

/* ── Modal de succès ──────────────────────────────────────── */
.success-modal-enter-active,
.success-modal-leave-active {
  transition: all 0.3s ease;
}
.success-modal-enter-from,
.success-modal-leave-to {
  opacity: 0;
}

/* ── Animation bounce unique ─────────────────────────────── */
@keyframes bounce-once {
  0%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-12px);
  }
  60% {
    transform: translateY(-6px);
  }
}
.animate-bounce-once {
  animation: bounce-once 0.8s ease-out 0.3s both;
}
</style>
