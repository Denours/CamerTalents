<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md">
      <!-- ════════════════════════════════════════════
           EN-TÊTE
      ════════════════════════════════════════════ -->
      <div
        class="text-center mb-10"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <h1 class="font-title text-3xl sm:text-4xl font-bold mb-3">Bon retour ! 👋</h1>
        <p class="text-white/50">
          Pas encore de compte ?
          <RouterLink
            to="/register"
            class="text-secondary hover:text-white font-medium transition-colors duration-200"
          >
            S'inscrire gratuitement
          </RouterLink>
        </p>
      </div>

      <!-- ════════════════════════════════════════════
           CARTE DU FORMULAIRE
      ════════════════════════════════════════════ -->
      <div
        class="form-card"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
      >
        <!-- Comptes démo (aide visuelle) -->
        <!-- <div class="mb-7 p-4 rounded-xl bg-primary/8 border border-primary/20">
          <p class="text-xs font-semibold text-primary-100 uppercase tracking-widest mb-3">
            Comptes de démonstration
          </p>
          <div class="space-y-2">
            <button
              v-for="demo in demoAccounts"
              :key="demo.email"
              @click="fillDemo(demo)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 group"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-lg">{{ demo.emoji }}</span>
                <div class="text-left">
                  <p class="text-xs font-medium text-white/80">
                    {{ demo.label }}
                  </p>
                  <p class="text-[10px] text-white/30">
                    {{ demo.email }}
                  </p>
                </div>
              </div>
              <span
                class="text-[10px] text-white/25 group-hover:text-primary-100 transition-colors duration-200"
              >
                Utiliser →
              </span>
            </button>
          </div>
          <p class="text-[10px] text-white/25 mt-2 text-center">
            Mot de passe démo : <span class="font-mono text-white/40">Admin@2024!</span>
          </p>
        </div> -->

        <!-- Séparateur -->
        <!-- <div class="flex items-center gap-3 mb-7">
          <div class="flex-1 h-px bg-white/[0.08]" />
          <span class="text-xs text-white/25">ou connecte-toi avec ton compte</span>
          <div class="flex-1 h-px bg-white/[0.08]" />
        </div> -->

        <!-- Formulaire -->
        <form @submit.prevent="submitLogin" class="space-y-5">
          <!-- Email -->
          <div class="form-group">
            <svg
              class="absolute text-white/25 pointer-events-none mt-1"
              width="15"
              height="15"
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
            <div class="form-label ml-5">Email</div>

            <div class="relative">
              <input
                v-model="form.email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                autocomplete="email"
                class="form-input pl-11"
                :class="errors.email ? 'form-input--error' : ''"
                @blur="validateField('email')"
              />
            </div>
            <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
          </div>

          <!-- Mot de passe -->
          <div class="form-group">
            <div class="flex items-center justify-between mb-2">
              <svg
                class="absolute text-white/25 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div class="form-label ml-5">Mot de passe</div>
              <button
                type="button"
                @click="showForgotPassword = true"
                class="text-xs text-white/35 hover:text-primary-100 transition-colors duration-200"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                placeholder="Ton mot de passe"
                class="form-input pl-11 pr-12 placeholder:text-red-500"
                :class="errors.password ? 'form-input--error' : ''"
                @blur="validateField('password')"
              />
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
            <p v-if="errors.password" class="form-error">
              {{ errors.password }}
            </p>
          </div>

          <!-- Se souvenir de moi -->
          <div class="flex items-center gap-3 cursor-pointer group">
            <div
              @click="rememberMe = !rememberMe"
              class="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-200"
              :class="
                rememberMe
                  ? 'bg-primary border-primary'
                  : 'border-white/20 group-hover:border-white/40'
              "
            >
              <svg
                v-if="rememberMe"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span
              class="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-200"
            >
              Se souvenir de moi
            </span>
          </div>

          <!-- Erreur globale -->
          <Transition name="error-slide">
            <div
              v-if="authStore.authError"
              class="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ authStore.authError }}</span>
            </div>
          </Transition>

          <!-- Bouton connexion -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
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
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>

      <!-- Lien retour accueil -->
      <p class="text-center mt-6">
        <RouterLink
          to="/"
          class="text-sm text-white/25 hover:text-white/50 transition-colors duration-200 flex items-center justify-center gap-1.5"
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
      </p>
    </div>

    <!-- ════════════════════════════════════════════
         MODALE MOT DE PASSE OUBLIÉ
    ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showForgotPassword"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          @click.self="showForgotPassword = false"
        >
          <div
            class="w-full max-w-sm bg-[#1A1230] border border-white/10 rounded-2xl p-8"
            v-motion
            :initial="{ scale: 0.9, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { duration: 300 } }"
          >
            <h3 class="font-title text-xl font-bold mb-2">Mot de passe oublié</h3>
            <p class="text-white/40 text-sm mb-6">
              Cette fonctionnalité sera disponible avec le backend. Pour l'instant, utilise un
              compte de démonstration.
            </p>

            <!-- Info comptes démo dans la modale -->
            <div class="p-4 rounded-xl bg-primary/8 border border-primary/20 mb-6 space-y-2">
              <p class="text-xs text-primary-100 font-semibold mb-3">Comptes disponibles :</p>
              <div
                v-for="demo in demoAccounts"
                :key="demo.email"
                class="text-xs text-white/50 flex items-center gap-2"
              >
                <span>{{ demo.emoji }}</span>
                <span class="font-mono">{{ demo.email }}</span>
                <span class="text-white/25">/ demo1234</span>
              </div>
            </div>

            <button
              @click="showForgotPassword = false"
              class="w-full py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-600 transition-colors duration-200"
            >
              Compris
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// ── Formulaire ───────────────────────────────────────────────
const form = ref({
  email: '',
  password: '',
});

const errors = ref({
  email: '',
  password: '',
});

const showPassword = ref(false);
const rememberMe = ref(false);
const showForgotPassword = ref(false);

// ── Comptes démo (affichés en haut du formulaire) ────────────
const demoAccounts = [
  {
    label: 'Administrateur',
    email: 'admin@camertalents.cm',
    emoji: '🛡️',
    // mot de passe défini dans seed.js : Admin@2024!
  },
  // Pour les comptes démo recruteur/talent, ils doivent
  // être créés via l'API (register) — plus de simulation
];
// const demoPassword = ref('Admin@2024!');
// Remplit le formulaire avec les credentials du compte démo
// function fillDemo(demo) {
//   form.value.email = demo.email;
//   form.value.password = demoPassword;
//   authStore.clearError();
// }

// ── Validation ───────────────────────────────────────────────
const validators = {
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
};

function validateField(field) {
  errors.value[field] = validators[field](form.value[field]);
}

function validateAll() {
  let valid = true;
  Object.keys(validators).forEach((f) => {
    validateField(f);
    if (errors.value[f]) valid = false;
  });
  return valid;
}

// ── Connexion ────────────────────────────────────────────────
async function submitLogin() {
  if (!validateAll()) return;
  authStore.clearError();

  const result = await authStore.login(form.value.email, form.value.password);

  if (result.success) {
    // Redirige selon le rôle de l'utilisateur connecté
    const redirectPath = route.query.redirect;

    if (redirectPath) {
      // Retourne à la page demandée avant la redirection vers /login
      router.push(redirectPath);
    } else if (result.user.role === 'admin') {
      router.push('/admin');
    } else if (result.user.role === 'recruteur') {
      router.push('/recruteur/dashboard');
    } else if (result.user.role === 'talent') {
      router.push('/talent/dashboard');
    } else {
      router.push('/');
    }
  }
}
</script>

<style scoped>
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

/* Erreur globale */
.error-slide-enter-active {
  transition: all 0.3s ease;
}
.error-slide-leave-active {
  transition: all 0.2s ease;
}
.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
