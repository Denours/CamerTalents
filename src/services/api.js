// ============================================================
//  src/services/api.js
//  Couche centrale de communication avec le backend
//
//  Toutes les vues et stores passent par ce fichier pour
//  parler au serveur. Un seul endroit à modifier si l'URL
//  de l'API change (ex: passage en production).
// ============================================================

// URL de base de l'API — définie dans .env du frontend
// Vite expose les variables préfixées VITE_ via import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Helper : récupère le token JWT depuis localStorage ────
function getToken() {
  return localStorage.getItem('camertalents_token');
}

// ── Helper principal : effectue une requête HTTP ──────────
// method  : 'GET' | 'POST' | 'PUT' | 'DELETE'
// endpoint: '/auth/login', '/talents', etc.
// data    : corps de la requête (pour POST/PUT)
async function request(method, endpoint, data = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Si un token existe, on l'ajoute dans le header Authorization
  // Le backend le lira dans req.headers.authorization
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  // Pour POST et PUT, on convertit les données en JSON
  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const json = await response.json();

  // Si le serveur répond avec une erreur HTTP (4xx, 5xx)
  // on lance une erreur JavaScript avec le message du serveur
  if (!response.ok) {
    throw new Error(json.message || 'Erreur serveur');
  }

  return json;
}

// ── Raccourcis pour chaque méthode HTTP ───────────────────
const api = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, data) => request('POST', endpoint, data),
  put: (endpoint, data) => request('PUT', endpoint, data),
  delete: (endpoint) => request('DELETE', endpoint),
};

// ══════════════════════════════════════════════════════════
//  AUTHENTIFICATION
// ══════════════════════════════════════════════════════════
export const authAPI = {
  // Inscription d'un talent (appelée depuis OnboardingView)
  registerTalent: (formData) => api.post('/auth/register/talent', formData),

  // Inscription d'un recruteur (appelée depuis RegisterView)
  registerRecruteur: (formData) => api.post('/auth/register/recruteur', formData),

  // Connexion (appelée depuis LoginView)
  login: (email, password) => api.post('/auth/login', { email, password }),

  // Déconnexion
  logout: () => api.post('/auth/logout'),

  // Récupère le profil de l'utilisateur connecté
  me: () => api.get('/auth/me'),
};

// ══════════════════════════════════════════════════════════
//  TALENTS
// ══════════════════════════════════════════════════════════
export const talentsAPI = {
  // Liste avec filtres optionnels
  // params = { search, categorie, ville, disponibilite, minNote, sortBy, page, limit }
  getAll: (params = {}) => {
    // Construit la query string à partir des paramètres
    // ex: { categorie: 'Tech', ville: 'Douala' } → '?categorie=Tech&ville=Douala'
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return api.get(`/talents${queryString ? '?' + queryString : ''}`);
  },

  // Profil complet d'un talent par son id MongoDB
  getById: (id) => api.get(`/talents/${id}`),

  // Modifier son profil (talent connecté)
  update: (id, data) => api.put(`/talents/${id}`, data),

  // Supprimer un profil (admin)
  delete: (id) => api.delete(`/talents/${id}`),

  // Incrémenter le compteur de vues
  incrementerVues: (id) => api.post(`/talents/${id}/vue`),
};

// ══════════════════════════════════════════════════════════
//  RECRUTEUR — FAVORIS
// ══════════════════════════════════════════════════════════
export const recruteurAPI = {
  // Liste des talents favoris du recruteur connecté
  getFavoris: () => api.get('/recruteur/favoris'),

  // Ajouter un talent aux favoris
  ajouterFavori: (talentId) => api.post(`/recruteur/favoris/${talentId}`),

  // Retirer un talent des favoris
  retirerFavori: (talentId) => api.delete(`/recruteur/favoris/${talentId}`),
};

// ══════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════
export const adminAPI = {
  // Statistiques globales de la plateforme
  getStats: () => api.get('/admin/stats'),

  // Liste de tous les comptes
  getComptes: () => api.get('/admin/comptes'),

  // Supprimer un compte
  supprimerCompte: (id) => api.delete(`/admin/comptes/${id}`),

  // Reset complet (développement uniquement)
  reset: () => api.delete('/admin/reset'),
};

export default api;
