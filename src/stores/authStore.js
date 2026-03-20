// ============================================================
//  CamerTalents — authStore.js
//  Gère l'état de l'utilisateur connecté, son rôle,
//  son profil, et toute la logique d'authentification.
//
//  Rôles possibles : 'talent' | 'recruteur' | 'admin' | null
//
//  ⚠️  Pour l'instant tout est simulé (pas de vrai backend).
//      Quand le backend sera prêt, on remplacera les fonctions
//      simulées par de vrais appels API.
// ============================================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// ── Clés localStorage ────────────────────────────────────────
const LS_USER_KEY = 'camertalents_user';
const LS_SESSION_KEY = 'camertalents_session';

// ── Helpers localStorage ─────────────────────────────────────
function loadUser() {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(LS_USER_KEY);
    return null;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  } catch {
    console.warn('CamerTalents: impossible de sauvegarder la session');
  }
}

function clearUser() {
  localStorage.removeItem(LS_USER_KEY);
  localStorage.removeItem(LS_SESSION_KEY);
}

// ── Store ────────────────────────────────────────────────────
export const useAuthStore = defineStore('auth', () => {
  // ══════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════

  // Utilisateur connecté (null si non connecté)
  // Structure :
  // {
  //   id:          string (uuid)
  //   nom:         string
  //   email:       string
  //   role:        'talent' | 'recruteur' | 'admin'
  //   avatar:      string (url)
  //   talentId:    string | null  (si rôle = talent, id dans talentStore)
  //   entreprise:  string | null  (si rôle = recruteur)
  //   poste:       string | null  (si rôle = recruteur)
  //   dateCreation: string (ISO)
  //   favoris:     string[]  (ids de talents sauvegardés, recruteur only)
  // }
  const user = ref(loadUser());
  const isLoading = ref(false);
  const authError = ref('');

  // ══════════════════════════════════════════════════════════
  //  GETTERS
  // ══════════════════════════════════════════════════════════

  // Est-ce qu'un utilisateur est connecté ?
  const isLoggedIn = computed(() => user.value !== null);

  // Rôle de l'utilisateur connecté
  const role = computed(() => user.value?.role ?? null);

  // Raccourcis de rôle
  const isTalent = computed(() => role.value === 'talent');
  const isRecruteur = computed(() => role.value === 'recruteur');
  const isAdmin = computed(() => role.value === 'admin');

  // Nom affiché (avec fallback)
  const displayName = computed(() => user.value?.nom || user.value?.email || 'Utilisateur');

  // Avatar (avec fallback généré)
  const displayAvatar = computed(
    () => user.value?.avatar || `https://i.pravatar.cc/150?u=${user.value?.id}`,
  );

  // IDs des talents mis en favoris par le recruteur
  const favoris = computed(() => user.value?.favoris ?? []);

  // Vérifie si un talent est dans les favoris
  const isFavori = (talentId) => favoris.value.includes(talentId);

  // ══════════════════════════════════════════════════════════
  //  ACTIONS — Inscription
  // ══════════════════════════════════════════════════════════

  /**
   * Inscription d'un nouveau Talent
   * Appelée depuis OnboardingView après la création du profil talent
   *
   * @param {Object} talentData  - données du formulaire onboarding
   * @param {string} talentId    - id du talent créé dans talentStore
   */
  async function registerTalent(talentData, talentId) {
    isLoading.value = true;
    authError.value = '';

    try {
      // Simule un délai API (à remplacer par fetch('/api/auth/register'))
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser = {
        id: crypto.randomUUID(),
        nom: talentData.nom,
        email: talentData.email,
        role: 'talent',
        avatar: talentData.avatar || '',
        // ── Infos métier (pour affichage dans l'espace talent) ──
        metier: talentData.metier || '',
        ville: talentData.ville || '',
        quartier: talentData.quartier || '',
        disponibilite: talentData.disponibilite || 'disponible',
        // ── Lien vers le profil complet dans talentStore ─────────
        // Toutes les autres données (CV, portfolio, compétences,
        // bio, tarifJour, telephone...) restent dans talentStore
        // et sont accessibles via getTalentById(talentId)
        talentId: talentId,
        // ── Champs recruteur (null pour un talent) ───────────────
        entreprise: null,
        poste: null,
        dateCreation: new Date().toISOString(),
        favoris: [],
      };

      user.value = newUser;
      saveUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      authError.value = "Erreur lors de l'inscription. Réessaie.";
      return { success: false, error: authError.value };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Inscription d'un nouveau Recruteur
   * Appelée depuis RegisterView (parcours recruteur)
   *
   * @param {Object} formData - { nom, email, password, entreprise, poste }
   */
  async function registerRecruteur(formData) {
    isLoading.value = true;
    authError.value = '';

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Vérifie si l'email existe déjà (simulation)
      const existing = loadUser();
      if (existing && existing.email === formData.email) {
        authError.value = 'Un compte existe déjà avec cet email.';
        return { success: false, error: authError.value };
      }

      const newUser = {
        id: crypto.randomUUID(),
        nom: formData.nom,
        email: formData.email,
        role: 'recruteur',
        avatar: '',
        talentId: null,
        entreprise: formData.entreprise || '',
        poste: formData.poste || '',
        dateCreation: new Date().toISOString(),
        favoris: [],
      };

      user.value = newUser;
      saveUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      authError.value = "Erreur lors de l'inscription. Réessaie.";
      return { success: false, error: authError.value };
    } finally {
      isLoading.value = false;
    }
  }

  // ══════════════════════════════════════════════════════════
  //  ACTIONS — Connexion / Déconnexion
  // ══════════════════════════════════════════════════════════

  /**
   * Connexion d'un utilisateur existant
   * Simulation : on cherche dans localStorage
   * (À remplacer par fetch('/api/auth/login'))
   *
   * @param {string} email
   * @param {string} password
   */
  async function login(email, password) {
    isLoading.value = true;
    authError.value = '';

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // ── Simulation de comptes de démonstration ────────────
      // En production, le backend vérifiera les credentials
      const demoAccounts = {
        'admin@camertalents.cm': {
          id: 'admin-001',
          nom: 'Administrateur',
          email: 'admin@camertalents.cm',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?img=60',
          talentId: null,
          entreprise: 'CamerTalents',
          poste: 'Administrateur',
          dateCreation: '2024-01-01T00:00:00.000Z',
          favoris: [],
        },
        'recruteur@demo.cm': {
          id: 'recruiter-001',
          nom: 'Marie Tchinda',
          email: 'recruteur@demo.cm',
          role: 'recruteur',
          avatar: 'https://i.pravatar.cc/150?img=47',
          talentId: null,
          entreprise: 'TechCorp Cameroun',
          poste: 'DRH',
          dateCreation: '2024-02-15T00:00:00.000Z',
          favoris: [],
        },
        'talent@demo.cm': {
          id: 'talent-demo-001',
          nom: 'Kamga Jean-Pierre',
          email: 'talent@demo.cm',
          role: 'talent',
          avatar:
            'https://img.freepik.com/photos-gratuite/bel-homme-afro-americain-posant_23-2148634065.jpg?semt=ais_hybrid&w=740&q=80',
          talentId: '1a2b3c4d', // ← ID du premier talent dans mockData.js
          entreprise: null,
          poste: null,
          dateCreation: '2024-01-15T00:00:00.000Z',
          favoris: [],
        },
      };

      // Vérifie d'abord les comptes démo
      const demoUser = demoAccounts[email.toLowerCase()];
      if (demoUser && password === 'demo1234') {
        user.value = demoUser;
        saveUser(demoUser);
        return { success: true, user: demoUser };
      }

      // Vérifie ensuite le compte sauvegardé (utilisateur réel inscrit)
      const savedUser = loadUser();
      if (savedUser && savedUser.email === email) {
        // En prod : vérification du hash du mot de passe côté serveur
        // Pour la démo, on accepte tout mot de passe non vide
        if (password.length >= 6) {
          user.value = savedUser;
          return { success: true, user: savedUser };
        }
      }

      // Aucun compte trouvé
      authError.value = 'Email ou mot de passe incorrect.';
      return { success: false, error: authError.value };
    } catch (err) {
      authError.value = 'Erreur de connexion. Réessaie.';
      return { success: false, error: authError.value };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Déconnexion
   */
  function logout() {
    user.value = null;
    authError.value = '';
    clearUser();
  }

  // ══════════════════════════════════════════════════════════
  //  ACTIONS — Favoris (Recruteur)
  // ══════════════════════════════════════════════════════════

  /**
   * Ajoute ou retire un talent des favoris du recruteur
   * @param {string} talentId
   */
  function toggleFavori(talentId) {
    if (!user.value || !isRecruteur.value) return;

    const idx = user.value.favoris.indexOf(talentId);
    if (idx === -1) {
      // Ajoute aux favoris
      user.value.favoris.push(talentId);
    } else {
      // Retire des favoris
      user.value.favoris.splice(idx, 1);
    }
    // Persiste la mise à jour
    saveUser(user.value);
  }

  // ══════════════════════════════════════════════════════════
  //  ACTIONS — Mise à jour du profil
  // ══════════════════════════════════════════════════════════

  /**
   * Met à jour les infos de l'utilisateur connecté
   * @param {Object} updates - champs à mettre à jour
   */
  async function updateProfile(updates) {
    isLoading.value = true;
    authError.value = '';

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      user.value = { ...user.value, ...updates };
      saveUser(user.value);
      return { success: true };
    } catch (err) {
      authError.value = 'Erreur lors de la mise à jour.';
      return { success: false, error: authError.value };
    } finally {
      isLoading.value = false;
    }
  }

  // ══════════════════════════════════════════════════════════
  //  ACTIONS — Utilitaires
  // ══════════════════════════════════════════════════════════

  /**
   * Réinitialise l'erreur d'auth
   */
  function clearError() {
    authError.value = '';
  }

  // ══════════════════════════════════════════════════════════
  //  EXPOSE
  // ══════════════════════════════════════════════════════════
  return {
    // State
    user,
    isLoading,
    authError,

    // Getters
    isLoggedIn,
    role,
    isTalent,
    isRecruteur,
    isAdmin,
    displayName,
    displayAvatar,
    favoris,
    isFavori,

    // Actions — Inscription
    registerTalent,
    registerRecruteur,

    // Actions — Auth
    login,
    logout,

    // Actions — Favoris
    toggleFavori,

    // Actions — Profil
    updateProfile,
    clearError,
  };
});
