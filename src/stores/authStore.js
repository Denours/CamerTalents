// ============================================================
//  src/stores/authStore.js  — VERSION BACKEND
//  Toute la logique d'auth passe maintenant par l'API.
//  Le token JWT est stocké dans localStorage.
//  Les données utilisateur sont rechargées depuis /api/auth/me
// ============================================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI, recruteurAPI } from '../services/api';

// Clés de stockage
const TOKEN_KEY = 'camertalents_token';
const ROLE_KEY = 'camertalents_role'; // lu par le router guard

export const useAuthStore = defineStore('auth', () => {
  // ══════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════

  const user = ref(null);
  const isLoading = ref(false);
  const authError = ref('');

  // ══════════════════════════════════════════════════════════
  //  GETTERS
  // ══════════════════════════════════════════════════════════

  const isLoggedIn = computed(() => user.value !== null);
  const role = computed(() => user.value?.role ?? null);
  const isTalent = computed(() => role.value === 'talent');
  const isRecruteur = computed(() => role.value === 'recruteur');
  const isAdmin = computed(() => role.value === 'admin');

  const displayName = computed(() => user.value?.nom || user.value?.email || 'Utilisateur');

  const displayAvatar = computed(
    () =>
      user.value?.avatar ||
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
  );

  const favoris = computed(() => user.value?.favoris ?? []);

  const isFavori = (talentId) => favoris.value.some((id) => id.toString() === talentId.toString());

  // ══════════════════════════════════════════════════════════
  //  INITIALISATION — recharge la session au démarrage
  // ══════════════════════════════════════════════════════════

  // Appelée dans App.vue au montage de l'application.
  // Si un token existe en localStorage, on demande au serveur
  // de nous redonner le profil utilisateur correspondant.
  async function init() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const data = await authAPI.me();
      if (data.success) {
        user.value = data.user;
      }
    } catch {
      // Token expiré ou invalide → on le supprime
      localStorage.removeItem(TOKEN_KEY);
      user.value = null;
    }
  }

  // ══════════════════════════════════════════════════════════
  //  INSCRIPTION TALENT
  // ══════════════════════════════════════════════════════════

  async function registerTalent(talentData) {
    isLoading.value = true;
    authError.value = '';

    try {
      const data = await authAPI.registerTalent(talentData);

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(ROLE_KEY, data.user.role);
      user.value = data.user;

      return { success: true, user: data.user, talentId: data.user.talentId };
    } catch (error) {
      authError.value = error.message || "Erreur lors de l'inscription.";
      return { success: false, error: authError.value };
    } finally {
      isLoading.value = false;
    }
  }

  // ══════════════════════════════════════════════════════════
  //  INSCRIPTION RECRUTEUR
  // ══════════════════════════════════════════════════════════

  async function registerRecruteur(formData) {
    isLoading.value = true;
    authError.value = '';

    try {
      const data = await authAPI.registerRecruteur(formData);

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(ROLE_KEY, data.user.role);
      user.value = data.user;

      return { success: true, user: data.user };
    } catch (error) {
      authError.value = error.message || "Erreur lors de l'inscription.";
      return { success: false, error: authError.value };
    } finally {
      isLoading.value = false;
    }
  }

  // ══════════════════════════════════════════════════════════
  //  CONNEXION
  // ══════════════════════════════════════════════════════════

  async function login(email, password) {
    isLoading.value = true;
    authError.value = '';

    try {
      const data = await authAPI.login(email, password);

      // Sauvegarde le token ET le rôle (lu par le router guard)
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(ROLE_KEY, data.user.role);
      user.value = data.user;

      return { success: true, user: data.user };
    } catch (error) {
      authError.value = error.message || 'Email ou mot de passe incorrect.';
      return { success: false, error: authError.value };
    } finally {
      isLoading.value = false;
    }
  }

  // ══════════════════════════════════════════════════════════
  //  DÉCONNEXION
  // ══════════════════════════════════════════════════════════

  async function logout() {
    try {
      await authAPI.logout();
    } catch {
      // Peu importe si l'appel échoue, on déconnecte quand même
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      user.value = null;
      authError.value = '';
    }
  }

  // ══════════════════════════════════════════════════════════
  //  FAVORIS RECRUTEUR
  // ══════════════════════════════════════════════════════════

  async function toggleFavori(talentId) {
    if (!user.value || !isRecruteur.value) return;

    const estFavori = isFavori(talentId);

    try {
      let data;
      if (estFavori) {
        data = await recruteurAPI.retirerFavori(talentId);
      } else {
        data = await recruteurAPI.ajouterFavori(talentId);
      }

      // Met à jour la liste des favoris dans le store
      if (data.success) {
        user.value = { ...user.value, favoris: data.favoris };
      }
    } catch (error) {
      console.error('Erreur toggle favori:', error.message);
    }
  }

  // ══════════════════════════════════════════════════════════
  //  MISE À JOUR LOCALE DU PROFIL UTILISATEUR
  // ══════════════════════════════════════════════════════════

  function updateUserLocalement(updates) {
    if (!user.value) return;
    user.value = { ...user.value, ...updates };
  }

  function clearError() {
    authError.value = '';
  }

  // ══════════════════════════════════════════════════════════
  //  EXPOSE
  // ══════════════════════════════════════════════════════════
  return {
    user,
    isLoading,
    authError,
    isLoggedIn,
    role,
    isTalent,
    isRecruteur,
    isAdmin,
    displayName,
    displayAvatar,
    favoris,
    isFavori,
    init,
    registerTalent,
    registerRecruteur,
    login,
    logout,
    toggleFavori,
    updateUserLocalement,
    clearError,
  };
});
