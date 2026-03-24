<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white pb-24">
    <!-- ════════════════════════════════════════════
         HEADER
    ════════════════════════════════════════════ -->
    <section class="relative py-12 border-b border-white/[0.06] overflow-hidden">
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none"
      />
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex items-center justify-between"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div class="flex items-center gap-4">
            <RouterLink
              to="/talent/dashboard"
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
                Mon espace
              </p>
              <h1 class="font-title text-3xl font-bold">Modifier mon profil</h1>
            </div>
          </div>

          <!-- Bouton sauvegarder (sticky en haut) -->
          <button
            @click="saveProfile"
            :disabled="isSaving || !hasChanges"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg
              v-if="isSaving"
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
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {{ isSaving ? 'Sauvegarde...' : hasChanges ? 'Sauvegarder' : 'À jour ✓' }}
          </button>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         FORMULAIRE
    ════════════════════════════════════════════ -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- ── Section 1 : Informations générales ──── -->
      <div
        class="edit-section"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div class="edit-section__header">
          <div class="edit-section__icon">👤</div>
          <div>
            <h2 class="edit-section__title">Informations générales</h2>
            <p class="edit-section__subtitle">Ton identité visible par les recruteurs</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5 mt-6">
          <!-- Photo de profil -->
          <div class="sm:col-span-2 form-group">
            <div class="form-label">Photo de profil</div>
            <div class="flex items-center gap-4">
              <div
                class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.06] border border-white/[0.10] flex items-center justify-center"
              >
                <img
                  v-if="avatarPreview || editForm.avatar"
                  :src="avatarPreview || editForm.avatar"
                  alt="avatar"
                  class="w-full h-full object-cover"
                  @error="avatarPreview = ''"
                />
                <svg
                  v-else
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  stroke-width="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div class="flex-1">
                <input
                  v-model="editForm.avatar"
                  type="url"
                  name="url"
                  placeholder="https://... (URL de ta photo)"
                  class="form-input"
                  @input="debouncedAvatar"
                />
                <p class="text-xs text-white/25 mt-1.5">
                  Colle l'URL d'une photo hébergée en ligne
                </p>
              </div>
            </div>
          </div>

          <!-- Nom -->
          <div class="form-group">
            <div class="form-label">Nom complet *</div>
            <input
              v-model="editForm.nom"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="Ton nom complet"
              class="form-input"
              :class="errors.nom ? 'form-input--error' : ''"
              @blur="validateField('nom')"
            />
            <p v-if="errors.nom" class="form-error">{{ errors.nom }}</p>
          </div>

          <!-- Métier -->
          <div class="form-group">
            <div class="form-label">Titre / Métier *</div>
            <input
              v-model="editForm.metier"
              type="text"
              name="metier"
              placeholder="Ex : Développeur Web Frontend"
              class="form-input"
              :class="errors.metier ? 'form-input--error' : ''"
              @blur="validateField('metier')"
            />
            <p v-if="errors.metier" class="form-error">{{ errors.metier }}</p>
          </div>

          <!-- Catégorie -->
          <div class="sm:col-span-2 form-group">
            <div class="form-label">Catégorie *</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                v-for="cat in CATEGORIES"
                :key="cat"
                type="button"
                @click="editForm.categorie = cat"
                class="category-btn"
                :class="editForm.categorie === cat ? 'category-btn--active' : ''"
              >
                {{ catEmojis[cat] }} {{ cat }}
              </button>
            </div>
          </div>

          <!-- Ville -->
          <div class="form-group">
            <div class="form-label">Ville</div>
            <select name="edit-ville" v-model="editForm.ville" class="form-input form-select">
              <option value="" class="text-black">Choisir une ville...</option>
              <option v-for="v in VILLES" :key="v" :value="v" class="text-black">{{ v }}</option>
            </select>
          </div>

          <!-- Quartier -->
          <div class="form-group">
            <div class="form-label">Quartier</div>
            <input
              v-model="editForm.quartier"
              type="text"
              name="quartier"
              placeholder="Ex : Akwa"
              class="form-input"
            />
          </div>

          <!-- Bio -->
          <div class="sm:col-span-2 form-group">
            <div class="form-label">
              Bio
              <span class="text-white/30 text-xs font-normal ml-1">
                ({{ editForm.bio?.length || 0 }}/400)
              </span>
            </div>
            <textarea
              v-model="editForm.bio"
              name="edit-bio"
              rows="4"
              maxlength="400"
              placeholder="Décris ton expérience, ce qui te différencie..."
              class="form-input resize-none"
            />
          </div>
        </div>
      </div>

      <!-- ── Section 2 : Contact & Tarif ──────────── -->
      <div
        class="edit-section"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div class="edit-section__header">
          <div class="edit-section__icon">📞</div>
          <div>
            <h2 class="edit-section__title">Contact & Tarif</h2>
            <p class="edit-section__subtitle">Comment les recruteurs te joignent</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5 mt-6">
          <!-- Téléphone -->
          <div class="form-group">
            <div class="form-label">Téléphone</div>
            <input
              v-model="editForm.telephone"
              type="tel"
              name="tel"
              autocomplete="tel"
              placeholder="+237 6XX XXX XXX"
              class="form-input"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <div class="form-label">Email de contact</div>
            <input
              v-model="editForm.email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="ton@email.com"
              class="form-input"
              :class="errors.email ? 'form-input--error' : ''"
              @blur="validateField('email')"
            />
            <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
          </div>

          <!-- Tarif journalier -->
          <div class="form-group">
            <div class="form-label">
              Tarif journalier
              <span class="text-white/30 text-xs font-normal ml-1"> optionnel </span>
            </div>
            <div class="relative">
              <input
                v-model.number="editForm.tarifJour"
                type="number"
                name="tarif"
                min="0"
                step="1000"
                placeholder="Ex : 25000"
                class="form-input pr-20"
              />
              <span class="absolute right-10 top-1/2 -translate-y-1/2 text-sm text-white/30"
                >FCFA</span
              >
            </div>
          </div>

          <!-- Disponibilité -->
          <div class="form-group">
            <div class="form-label">Disponibilité</div>
            <div class="flex flex-col gap-2">
              <button
                v-for="opt in disponibiliteOptions"
                :key="opt.value"
                type="button"
                @click="editForm.disponibilite = opt.value"
                class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200"
                :class="
                  editForm.disponibilite === opt.value
                    ? opt.activeClass
                    : 'border-white/10 text-white/40'
                "
              >
                <span class="w-2 h-2 rounded-full" :class="opt.dotClass" />
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Section 3 : Compétences ───────────────── -->
      <div
        class="edit-section"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div class="edit-section__header">
          <div class="edit-section__icon">💡</div>
          <div>
            <h2 class="edit-section__title">Compétences</h2>
            <p class="edit-section__subtitle">Maximum 6 compétences avec niveau</p>
          </div>
        </div>

        <div class="space-y-4 mt-6">
          <TransitionGroup name="skill-list" tag="div" class="space-y-3">
            <div v-for="(skill, i) in editForm.competences" :key="skill.id || i" class="skill-row">
              <input
                v-model="skill.nom"
                type="text"
                name="skill"
                placeholder="Ex : Vue.js"
                class="form-input flex-1 min-w-0"
              />
              <div class="flex flex-col gap-1 w-36 flex-shrink-0">
                <div class="flex justify-between text-xs text-white/40">
                  <span>Niveau</span>
                  <span class="font-mono font-bold text-white"> {{ skill.niveau }}% </span>
                </div>
                <div class="h-1.5 rounded-full bg-white/[0.08]">
                  <div
                    class="h-full rounded-full bg-primary transition-all duration-200"
                    :style="`width: ${skill.niveau}%`"
                  />
                </div>
                <input
                  v-model.number="skill.niveau"
                  type="range"
                  name="skill-level"
                  min="10"
                  max="100"
                  step="5"
                  class="skill-slider"
                />
              </div>
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
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6
                           m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                  />
                </svg>
              </button>
            </div>
          </TransitionGroup>

          <button
            v-if="editForm.competences.length < 6"
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
            <span class="text-white/25 text-xs"> ({{ editForm.competences.length }}/6) </span>
          </button>
        </div>
      </div>

      <!-- ── Section 4 : Portfolio ──────────────────── -->
      <div
        class="edit-section"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div class="edit-section__header">
          <div class="edit-section__icon">🖼️</div>
          <div>
            <h2 class="edit-section__title">Portfolio</h2>
            <p class="edit-section__subtitle">URLs de tes réalisations — max 5 images</p>
          </div>
        </div>

        <div class="space-y-3 mt-6">
          <TransitionGroup name="skill-list" tag="div" class="space-y-3">
            <div
              v-for="(_, i) in editForm.portfolio"
              :key="`portfolio-${i}`"
              class="flex items-center gap-3"
            >
              <div
                class="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden bg-white/[0.06] border border-white/[0.08] flex items-center justify-center"
              >
                <img
                  v-if="portfolioPreviews[i]"
                  :src="portfolioPreviews[i]"
                  alt="portfolioprev"
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
              <input
                v-model="editForm.portfolio[i]"
                type="url"
                name="edit-portfolio"
                :placeholder="`https://i.imgur.com/... (image ${i + 1})`"
                class="form-input flex-1 min-w-0"
                @input="debouncedPortfolioPreview(i)"
              />
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

          <button
            v-if="editForm.portfolio.length < 5"
            type="button"
            @click="addPortfolioLink"
            class="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 text-sm hover:border-secondary/40 hover:text-secondary hover:bg-secondary/5 transition-all duration-200 flex items-center justify-center gap-2"
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
            Ajouter une image
            <span class="text-white/25 text-xs"> ({{ editForm.portfolio.length }}/5) </span>
          </button>
        </div>
      </div>

      <!-- ── Section 5 : CV ─────────────────────────── -->
      <div
        class="edit-section"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div class="edit-section__header">
          <div class="edit-section__icon">📄</div>
          <div>
            <h2 class="edit-section__title">Curriculum Vitae</h2>
            <p class="edit-section__subtitle">PDF, DOC ou DOCX — max 5 Mo</p>
          </div>
        </div>

        <div class="mt-6">
          <!-- CV déjà présent -->
          <div
            v-if="editForm.cvBase64"
            class="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-4"
          >
            <div
              class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0"
            >
              <svg
                width="18"
                height="18"
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
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">
                {{ editForm.cvNom || 'CV importé' }}
              </p>
              <p class="text-xs text-green-400 mt-0.5">CV actuel</p>
            </div>
            <button
              type="button"
              @click="removeCV"
              class="text-white/30 hover:text-red-400 transition-colors duration-200"
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

          <!-- Zone d'upload -->
          <div
            class="flex flex-col items-center justify-center gap-3 w-full py-8 rounded-xl border-2 border-dashed border-white/15 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
          >
            <div
              class="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                stroke-width="1.5"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12
                         a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <div class="text-center">
              <p
                class="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-200"
              >
                {{ editForm.cvBase64 ? 'Remplacer le CV' : 'Importer un CV' }}
              </p>
              <p class="text-xs text-white/25 mt-1">PDF, DOC ou DOCX — max 5 Mo</p>
            </div>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              class="hidden"
              @change="handleCvUpload"
            />
          </div>
          <p v-if="cvError" class="text-xs text-red-400 mt-2">{{ cvError }}</p>
        </div>
      </div>

      <!-- Bouton sauvegarder (bas de page) -->
      <div class="flex justify-end gap-4 pt-4">
        <RouterLink
          to="/talent/dashboard"
          class="px-5 py-2.5 rounded-xl border border-white/20 text-white/60 text-sm font-medium hover:border-white/40 hover:text-white transition-all duration-200"
        >
          Annuler
        </RouterLink>
        <button
          @click="saveProfile"
          :disabled="isSaving || !hasChanges"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <svg
            v-if="isSaving"
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
          {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications' }}
        </button>
      </div>
    </div>

    <!-- Toast succès -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="showToast"
          class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-green-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm text-green-400 text-sm font-medium shadow-xl"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Profil mis à jour avec succès !
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTalentStore } from '../stores/talentStore';
import { CATEGORIES, VILLES } from '../data/mockData';

const router = useRouter();
const authStore = useAuthStore();
const talentStore = useTalentStore();

// ── Profil actuel du talent ──────────────────────────────────
const monProfil = computed(() => {
  if (!authStore.user?.talentId) return null;
  return talentStore.getTalentById(authStore.user.talentId);
});

// Redirige si pas de profil talent
onMounted(() => {
  if (!authStore.isLoggedIn || !authStore.isTalent) {
    router.push('/login');
    return;
  }
  if (!monProfil.value) {
    router.push('/onboarding');
    return;
  }
  // Initialise le formulaire avec les données actuelles
  initForm();
});

// ── Formulaire d'édition ─────────────────────────────────────
const editForm = ref({
  nom: '',
  metier: '',
  categorie: '',
  ville: '',
  quartier: '',
  bio: '',
  telephone: '',
  email: '',
  tarifJour: null,
  disponibilite: 'disponible',
  avatar: '',
  competences: [],
  portfolio: [],
  cvBase64: '',
  cvNom: '',
});

// Snapshot initial pour détecter les changements
const originalForm = ref('');

function initForm() {
  if (!monProfil.value) return;
  const p = monProfil.value;
  editForm.value = {
    nom: p.nom || '',
    metier: p.metier || '',
    categorie: p.categorie || '',
    ville: p.ville || '',
    quartier: p.quartier || '',
    bio: p.bio || '',
    telephone: p.telephone || '',
    email: p.email || '',
    tarifJour: p.tarifJour || null,
    disponibilite: p.disponibilite || 'disponible',
    avatar: p.avatar || '',
    // Clone profond des tableaux pour éviter la mutation directe
    competences: (p.competences || []).map((c, i) => ({
      ...c,
      id: c.id || i,
    })),
    portfolio: [...(p.portfolio || [])],
    cvBase64: p.cvBase64 || '',
    cvNom: p.cvNom || '',
  };
  originalForm.value = JSON.stringify(editForm.value);
  // Initialise les previews portfolio
  portfolioPreviews.value = editForm.value.portfolio.map((url) => url);
}

// ── Détection des changements ────────────────────────────────
const hasChanges = computed(() => JSON.stringify(editForm.value) !== originalForm.value);

// ── Erreurs de validation ────────────────────────────────────
const errors = ref({ nom: '', metier: '', email: '' });

const validators = {
  nom: (v) => (v.trim() ? '' : 'Le nom est requis'),
  metier: (v) => (v.trim() ? '' : 'Le métier est requis'),
  email: (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email invalide' : ''),
};

function validateField(field) {
  if (validators[field]) errors.value[field] = validators[field](editForm.value[field]);
}

// ── Options disponibilité ────────────────────────────────────
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

// ── Emojis catégories ────────────────────────────────────────
const catEmojis = {
  'Tech & Digital': '💻',
  'Artisanat & BTP': '🔨',
  'Créatif & Art': '🎨',
  'Éducation & Formation': '📚',
  'Services & Lifestyle': '🍳',
  'Transport & Logistique': '🚗',
};

// ── Preview avatar ───────────────────────────────────────────
const avatarPreview = ref('');
let avatarTimer = null;
function debouncedAvatar() {
  clearTimeout(avatarTimer);
  avatarTimer = setTimeout(() => {
    avatarPreview.value = editForm.value.avatar;
  }, 600);
}

// ── Portfolio ────────────────────────────────────────────────
const portfolioPreviews = ref([]);
const portfolioTimers = {};

function addPortfolioLink() {
  if (editForm.value.portfolio.length >= 5) return;
  editForm.value.portfolio.push('');
  portfolioPreviews.value.push('');
}

function removePortfolioLink(i) {
  editForm.value.portfolio.splice(i, 1);
  portfolioPreviews.value.splice(i, 1);
}

function debouncedPortfolioPreview(i) {
  clearTimeout(portfolioTimers[i]);
  portfolioTimers[i] = setTimeout(() => {
    portfolioPreviews.value[i] = editForm.value.portfolio[i];
  }, 700);
}

// ── Compétences ──────────────────────────────────────────────
function addSkill() {
  if (editForm.value.competences.length >= 6) return;
  editForm.value.competences.push({
    id: Date.now(),
    nom: '',
    niveau: 70,
  });
}

function removeSkill(i) {
  editForm.value.competences.splice(i, 1);
}

// ── CV ───────────────────────────────────────────────────────
const cvError = ref('');

function handleCvUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (!allowed.includes(file.type)) {
    cvError.value = 'Format non supporté. Acceptés : PDF, DOC, DOCX';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    cvError.value = 'Fichier trop lourd. Maximum 5 Mo.';
    return;
  }
  cvError.value = '';
  editForm.value.cvNom = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    editForm.value.cvBase64 = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removeCV() {
  editForm.value.cvBase64 = '';
  editForm.value.cvNom = '';
}

// ── Sauvegarde ───────────────────────────────────────────────
const isSaving = ref(false);
const showToast = ref(false);

async function saveProfile() {
  validateField('nom');
  validateField('metier');
  validateField('email');
  if (errors.value.nom || errors.value.metier || errors.value.email) return;

  isSaving.value = true;

  await new Promise((resolve) => setTimeout(resolve, 800));

  // Nettoie les compétences (retire les entrées vides)
  const cleanCompetences = editForm.value.competences
    .filter((s) => s.nom.trim())
    .map(({ nom, niveau }) => ({ nom, niveau }));

  // Nettoie le portfolio (retire les URLs vides)
  const cleanPortfolio = editForm.value.portfolio.filter((url) => url.trim().length > 0);

  // Met à jour dans talentStore
  const idx = talentStore.addedTalents.findIndex((t) => t.id === monProfil.value?.id);

  if (idx !== -1) {
    // Talent créé via onboarding — on peut le modifier directement
    talentStore.addedTalents[idx] = {
      ...talentStore.addedTalents[idx],
      ...editForm.value,
      competences: cleanCompetences,
      portfolio: cleanPortfolio,
    };
    localStorage.setItem('camertalents_added_talents', JSON.stringify(talentStore.addedTalents));
  }
  // Note : les talents du mockData sont en lecture seule
  // (ils n'existent pas dans addedTalents)

  // Met à jour aussi l'avatar dans authStore si changé
  if (editForm.value.avatar !== authStore.user?.avatar) {
    await authStore.updateProfile({ avatar: editForm.value.avatar });
  }

  isSaving.value = false;
  // Met à jour le snapshot
  originalForm.value = JSON.stringify(editForm.value);
  // Affiche le toast
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}
</script>

<style scoped>
/* ── Section ─────────────────────────────────────────────── */
.edit-section {
  @apply p-8 rounded-3xl bg-white/[0.04] border border-white/[0.08];
}

.edit-section__header {
  @apply flex items-start gap-4;
}

.edit-section__icon {
  @apply w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08]
         flex items-center justify-center text-2xl flex-shrink-0;
}

.edit-section__title {
  @apply font-title text-lg font-bold text-white;
}

.edit-section__subtitle {
  @apply text-sm text-white/40 mt-0.5;
}

/* ── Formulaire ─────────────────────────────────────────── */
.form-group {
  @apply space-y-2;
}
.form-label {
  @apply block text-sm font-medium text-white/70;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10]
         text-white placeholder-white/25 text-sm focus:outline-none
         focus:border-primary/50 focus:bg-white/[0.08] transition-all duration-200;
}
.form-input--error {
  @apply border-red-500/50;
}

.form-select {
  @apply appearance-none cursor-pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.form-error {
  @apply text-xs text-red-400;
}
.form-error::before {
  content: '⚠ ';
}

/* ── Catégories ──────────────────────────────────────────── */
.category-btn {
  @apply px-3 py-2.5 rounded-xl text-xs font-medium text-left
         bg-white/[0.04] border border-white/[0.08] text-white/50
         hover:text-white hover:bg-white/[0.08] transition-all duration-200;
}
.category-btn--active {
  @apply bg-primary/15 border-primary/40 text-white font-semibold;
}

/* ── Compétences ─────────────────────────────────────────── */
.skill-row {
  @apply flex items-center gap-3 p-3 rounded-xl
         bg-white/[0.03] border border-white/[0.06];
}

.skill-slider {
  @apply w-full h-1 appearance-none rounded-full bg-white/[0.10] cursor-pointer;
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
}

/* ── Animations ──────────────────────────────────────────── */
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

.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
