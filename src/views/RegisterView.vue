<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-lg">
      <!-- ════════════════════════════════════════════
           EN-TÊTE
      ════════════════════════════════════════════ -->
      <div
        class="text-center mb-10"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <h1 class="font-title text-3xl sm:text-4xl font-bold mb-3">Créer un compte</h1>
        <p class="text-white/50">
          Déjà inscrit ?
          <RouterLink
            to="/login"
            class="text-secondary hover:text-white transition-colors duration-200 font-bold"
          >
            Se connecter
          </RouterLink>
        </p>
      </div>

      <!-- ════════════════════════════════════════════
        ÉTAPE 1 : CHOIX DU RÔLE
      ════════════════════════════════════════════ -->
      <Transition name="step-fade" mode="out-in">
        <div
          v-if="step === 'role'"
          key="role"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
        >
          <p class="text-center text-white/50 text-sm mb-6">
            Comment souhaites-tu utiliser CamerTalents ?
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Carte : Je suis un Talent -->
            <button
              @click="selectRole('talent')"
              class="role-card group"
              :class="selectedRole === 'talent' ? 'role-card--active' : ''"
            >
              <div
                class="role-card__icon bg-primary/15 border-primary/20 group-hover:bg-primary/25"
              >
                🎨
              </div>
              <h3 class="font-title font-bold text-lg mt-4 mb-2">Je suis un Talent</h3>
              <p class="text-sm text-white/50 leading-relaxed">
                Développeur, artisan, créatif, formateur... Crée ton profil et sois visible par des
                milliers de recruteurs.
              </p>
              <ul class="mt-4 space-y-1.5 text-left">
                <li
                  v-for="item in talentPerks"
                  :key="item"
                  class="flex items-center gap-2 text-xs text-white/40"
                >
                  <Check size="14" class="text-green-600" />
                  {{ item }}
                </li>
              </ul>
            </button>

            <!-- Carte : Je recrute -->
            <button
              @click="selectRole('recruteur')"
              class="role-card group"
              :class="selectedRole === 'recruteur' ? 'role-card--active' : ''"
            >
              <div
                class="role-card__icon bg-secondary/15 border-secondary/20 group-hover:bg-secondary/25"
              >
                🏢
              </div>
              <h3 class="font-title font-bold text-lg mt-4 mb-2">Je recrute</h3>
              <p class="text-sm text-white/50 leading-relaxed">
                Particulier ou entreprise, trouve le talent qu'il te faut parmi des centaines de
                profils qualifiés.
              </p>
              <ul class="mt-4 space-y-1.5 text-left">
                <li
                  v-for="item in recruteurPerks"
                  :key="item"
                  class="flex items-center gap-2 text-xs text-white/40"
                >
                  <Check size="14" class="text-green-600" />
                  {{ item }}
                </li>
              </ul>
            </button>
          </div>

          <!-- Bouton Continuer -->
          <button
            @click="goToForm"
            :disabled="!selectedRole"
            class="w-full mt-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            :class="
              selectedRole ? 'bg-primary hover:bg-primary-600 active:scale-95' : 'bg-white/10'
            "
          >
            Continuer
            <span v-if="selectedRole" class="ml-1">→</span>
          </button>
        </div>
      </Transition>

      <!-- ════════════════════════════════════════════
           ÉTAPE 2A : FORMULAIRE TALENT
           (redirige vers l'onboarding existant)
      ════════════════════════════════════════════ -->
      <Transition name="step-fade" mode="out-in">
        <div v-if="step === 'talent-redirect'" key="talent-redirect" class="text-center py-8">
          <div
            class="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="animate-spin"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A78BF6"
              stroke-width="2"
            >
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
            </svg>
          </div>
          <p class="text-white/50">Redirection vers le formulaire talent...</p>
        </div>
      </Transition>

      <!-- ════════════════════════════════════════════
          ÉTAPE 2B : FORMULAIRE RECRUTEUR
      ════════════════════════════════════════════ -->
      <Transition name="step-fade" mode="out-in">
        <div v-if="step === 'recruteur'" key="recruteur">
          <!-- Bouton retour -->
          <button
            @click="step = 'role'"
            class="flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors duration-200"
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
            Retour
          </button>

          <div class="form-card">
            <h2 class="font-title text-xl font-bold mb-1">Créer un compte Recruteur</h2>
            <p class="text-white/40 text-sm mb-8">Tous les champs marqués * sont obligatoires</p>

            <div class="space-y-5">
              <!-- Nom complet -->
              <div class="form-group">
                <div class="form-label">Nom complet *</div>
                <input
                  v-model="recruteurForm.nom"
                  type="text"
                  name="namerec"
                  placeholder="Ex : Marie Tchinda"
                  class="form-input"
                  :class="recruteurErrors.nom ? 'form-input--error' : ''"
                  @blur="validateRecruteur('nom')"
                />
                <p v-if="recruteurErrors.nom" class="form-error">
                  {{ recruteurErrors.nom }}
                </p>
              </div>

              <!-- Email -->
              <div class="form-group">
                <div class="form-label">Email *</div>
                <input
                  v-model="recruteurForm.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="votre@email.com"
                  class="form-input"
                  :class="recruteurErrors.email ? 'form-input--error' : ''"
                  @blur="validateRecruteur('email')"
                />
                <p v-if="recruteurErrors.email" class="form-error">
                  {{ recruteurErrors.email }}
                </p>
              </div>

              <!-- Mot de passe -->
              <div class="form-group">
                <div class="form-label">Mot de passe *</div>
                <div class="relative">
                  <input
                    v-model="recruteurForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    placeholder="Minimum 6 caractères"
                    class="form-input pr-12"
                    :class="recruteurErrors.password ? 'form-input--error' : ''"
                    @blur="validateRecruteur('password')"
                  />
                  <!-- Toggle visibilité mot de passe -->
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-200"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <template v-if="showPassword">
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0 1 12 20
                                 c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                        />
                        <path
                          d="M9.9 4.24A9.12 9.12 0 0 1 12 4
                                 c7 0 11 8 11 8
                                 a18.5 18.5 0 0 1-2.16 3.19"
                        />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </template>
                      <template v-else>
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8
                                 -4 8-11 8-11-8-11-8z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </template>
                    </svg>
                  </button>
                </div>
                <!-- Indicateur de force du mot de passe -->
                <div v-if="recruteurForm.password" class="mt-2">
                  <div class="flex gap-1">
                    <div
                      v-for="n in 4"
                      :key="n"
                      class="h-1 flex-1 rounded-full transition-all duration-300"
                      :class="passwordStrength >= n ? passwordStrengthColor : 'bg-white/10'"
                    />
                  </div>
                  <p class="text-xs mt-1" :class="passwordStrengthTextColor">
                    {{ passwordStrengthLabel }}
                  </p>
                </div>
                <p v-if="recruteurErrors.password" class="form-error">
                  {{ recruteurErrors.password }}
                </p>
              </div>
              <!-- Confirmation mot de passe -->
              <div class="form-group">
                <div class="form-label">Confirmer le mot de passe *</div>
                <div class="relative">
                  <input
                    v-model="recruteurForm.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    name="confirm-password"
                    placeholder="Répète ton mot de passe"
                    class="form-input"
                    :class="recruteurErrors.confirmPassword ? 'form-input--error' : ''"
                    @blur="validateRecruteur('confirmPassword')"
                  />
                  <!-- Icône check si les mots de passe correspondent -->
                  <div
                    v-if="
                      recruteurForm.confirmPassword &&
                      recruteurForm.confirmPassword === recruteurForm.password
                    "
                    class="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22C55E"
                      stroke-width="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <p v-if="recruteurErrors.confirmPassword" class="form-error">
                  {{ recruteurErrors.confirmPassword }}
                </p>
              </div>

              <!-- Entreprise -->
              <div class="form-group">
                <div class="form-label">
                  Entreprise / Organisation
                  <span class="text-white/30 text-xs font-normal ml-1"> optionnel </span>
                </div>
                <input
                  v-model="recruteurForm.entreprise"
                  type="text"
                  name="entreprise"
                  placeholder="Ex : TechCorp Cameroun"
                  class="form-input"
                />
              </div>

              <!-- Poste -->
              <div class="form-group">
                <div class="form-label">
                  Votre poste
                  <span class="text-white/30 text-xs font-normal ml-1"> optionnel </span>
                </div>
                <input
                  v-model="recruteurForm.poste"
                  type="text"
                  name="poste"
                  placeholder="Ex : DRH, Manager, Particulier..."
                  class="form-input"
                />
              </div>

              <!-- Erreur globale -->
              <div
                v-if="authStore.authError"
                class="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ authStore.authError }}
              </div>

              <!-- Bouton créer le compte -->
              <button
                type="button"
                @click="submitRecruteur"
                :disabled="authStore.isLoading"
                class="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  v-if="authStore.isLoading"
                  class="animate-spin"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
                </svg>
                {{ authStore.isLoading ? 'Création en cours...' : 'Créer mon compte Recruteur' }}
              </button>

              <p class="text-center text-xs text-white/25">
                En créant un compte, tu acceptes nos
                <button
                  class="text-white/40 hover:text-white underline transition-colors duration-200"
                >
                  CGV
                </button>
                et notre
                <button
                  class="text-white/40 hover:text-white underline transition-colors duration-200"
                >
                  politique de confidentialité
                </button>
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { Check } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

// ── Étape courante ───────────────────────────────────────────
// 'role'            → choix du rôle
// 'talent-redirect' → animation avant redirection onboarding
// 'recruteur'       → formulaire recruteur
const step = ref('role');
const selectedRole = ref('');

// ── Avantages affichés sur les cartes de rôle ────────────────
const talentPerks = [
  'Profil public visible par tous',
  'Mise en avant de tes compétences',
  'Contact direct sans commission',
  '100% gratuit',
];

const recruteurPerks = [
  'Accès à tous les profils',
  'Sauvegarde tes talents favoris',
  'Recherche avancée par compétence',
  'Contact direct et rapide',
];

// ── Sélection du rôle ────────────────────────────────────────
function selectRole(role) {
  selectedRole.value = role;
}

// ── Navigation vers le formulaire ───────────────────────────
async function goToForm() {
  if (!selectedRole.value) return;

  if (selectedRole.value === 'talent') {
    // Redirige vers l'onboarding existant
    step.value = 'talent-redirect';
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push('/onboarding');
  } else {
    step.value = 'recruteur';
  }
}

// ── Formulaire recruteur ─────────────────────────────────────
const recruteurForm = ref({
  nom: '',
  email: '',
  password: '',
  confirmPassword: '',
  entreprise: '',
  poste: '',
});

const recruteurErrors = ref({
  nom: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const showPassword = ref(false);

// ── Validation recruteur ─────────────────────────────────────
const recruteurValidators = {
  nom: (v) => {
    if (!v.trim()) return 'Le nom est requis';
    if (v.trim().length < 2) return 'Minimum 2 caractères';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return "L'email est requis";
    else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return '';
    else return 'Email invalide';
  },
  password: (v) => {
    if (!v) return 'Le mot de passe est requis';
    else if (v.length < 6) return 'Minimum 6 caractères';
    else return '';
  },
  confirmPassword: (v) => {
    if (!v) return 'Confirme ton mot de passe';
    else if (v === recruteurForm.value.password) return '';
    else return 'Les mots de passe ne correspondent pas';
  },
};

function validateRecruteur(field) {
  if (recruteurValidators[field]) {
    recruteurErrors.value[field] = recruteurValidators[field](recruteurForm.value[field]);
  }
}

function validateAllRecruteur() {
  let valid = true;
  Object.keys(recruteurValidators).forEach((f) => {
    validateRecruteur(f);
    if (recruteurErrors.value[f]) valid = false;
  });
  return valid;
}

// ── Force du mot de passe ────────────────────────────────────
const passwordStrength = computed(() => {
  const p = recruteurForm.value.password;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) && /\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const passwordStrengthColor = computed(() => {
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];
  return colors[passwordStrength.value] || 'bg-white/10';
});

const passwordStrengthTextColor = computed(() => {
  const colors = ['', 'text-red-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'];
  return colors[passwordStrength.value] || '';
});

const passwordStrengthLabel = computed(() => {
  const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  return labels[passwordStrength.value] || '';
});

// ── Soumission recruteur ─────────────────────────────────────
async function submitRecruteur() {
  if (!validateAllRecruteur()) return;
  authStore.clearError();

  const result = await authStore.registerRecruteur(recruteurForm.value);

  if (result.success) {
    // Redirige vers le dashboard recruteur
    router.push('/recruteur/dashboard');
  }
}
</script>

<style scoped>
/* ── Cartes de rôle ──────────────────────────────────────────── */
.role-card {
  @apply flex flex-col items-center text-center p-6 rounded-2xl
         border border-white/[0.08] bg-white/[0.04]
         hover:bg-white/[0.07] hover:border-white/[0.15]
         transition-all duration-300 cursor-pointer;
}

.role-card--active {
  @apply bg-primary/10 border-primary/40;
  box-shadow: 0 0 0 3px rgba(108, 60, 225, 0.15);
}

.role-card__icon {
  @apply w-16 h-16 rounded-2xl border
         flex items-center justify-center
         text-3xl transition-all duration-200;
}

/* ── Formulaire ──────────────────────────────────────────────── */
.form-card {
  @apply p-8 rounded-3xl bg-white/[0.04] border border-white/[0.08];
}

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
         focus:bg-white/[0.08] transition-all duration-200;
}

.form-input--error {
  @apply border-red-500/50 focus:border-red-500/70;
}

.form-error {
  @apply text-xs text-red-400;
}
.form-error::before {
  content: '⚠ ';
}

/* ── Transitions ─────────────────────────────────────────────── */
.step-fade-enter-active {
  transition: all 0.35s ease;
}
.step-fade-leave-active {
  transition: all 0.2s ease;
}
.step-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.step-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
