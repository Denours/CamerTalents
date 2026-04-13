// ============================================================
//  CamerTalents — router/index.js
//  Configuration complète de Vue Router 4
//  avec guards de navigation par rôle
// ============================================================

import { createRouter, createWebHistory } from 'vue-router';

// ── Définition des routes ────────────────────────────────────
// Toutes les vues sont chargées en lazy loading (import dynamique)
// pour optimiser les performances au démarrage
const routes = [
  // ══════════════════════════════════════════════════════════
  //  ROUTES PUBLIQUES
  //  Accessibles par tous (visiteurs, talents, recruteurs, admins)
  // ══════════════════════════════════════════════════════════
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'CamerTalents — Accueil' },
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('../views/ExploreView.vue'),
    meta: { title: 'Explorer les talents — CamerTalents' },
  },
  {
    path: '/talent/:id',
    name: 'talent-profile',
    component: () => import('../views/TalentProfileView.vue'),
    meta: { title: 'Profil Talent — CamerTalents', requiresAuth: true },
    props: true,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Tableau de bord — CamerTalents', requiresAuth: true },
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../views/MapView.vue'),
    meta: { title: 'Carte des talents — CamerTalents' },
  },

  // ══════════════════════════════════════════════════════════
  //  ROUTES AUTH
  //  Accessibles uniquement aux visiteurs NON connectés
  //  (si déjà connecté → redirige vers le bon dashboard)
  // ══════════════════════════════════════════════════════════
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('../views/OnboardingView.vue'),
    meta: { title: 'Rejoindre CamerTalents' },
    // L'onboarding est accessible même connecté
    // (ex: talent connecté qui veut créer un 2e profil)
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { title: 'Créer un compte — CamerTalents', guestOnly: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: 'Connexion — CamerTalents',
      guestOnly: true,
      // redirige si déjà connecté
    },
  },

  // ══════════════════════════════════════════════════════════
  //  ROUTES TALENT
  //  Accessibles uniquement aux utilisateurs connectés
  //  avec le rôle 'talent'
  // ══════════════════════════════════════════════════════════
  {
    path: '/talent/dashboard',
    name: 'talent-dashboard',
    component: () => import('../views/TalentDashboardView.vue'),
    meta: { title: 'Mon espace — CamerTalents', requiresAuth: true, role: 'talent' },
  },
  {
    path: '/talent/edit',
    name: 'talent-edit',
    component: () => import('../views/TalentEditView.vue'),
    meta: { title: 'Modifier mon profil — CamerTalents', requiresAuth: true, role: 'talent' },
  },

  // ══════════════════════════════════════════════════════════
  //  ROUTES RECRUTEUR
  //  Accessibles uniquement aux utilisateurs connectés
  //  avec le rôle 'recruteur'
  // ══════════════════════════════════════════════════════════
  {
    path: '/recruteur/dashboard',
    name: 'recruteur-dashboard',
    component: () => import('../views/RecruiterDashboardView.vue'),
    meta: { title: 'Espace Recruteur — CamerTalents', requiresAuth: true, role: 'recruteur' },
  },
  {
    path: '/recruteur/favoris',
    name: 'recruteur-favoris',
    component: () => import('@/views/RecruiterFavoritesView.vue'),
    meta: { title: 'Mes favoris — CamerTalents', requiresAuth: true, role: 'recruteur' },
  },

  // ══════════════════════════════════════════════════════════
  //  ROUTES ADMIN
  //  Accessibles uniquement aux administrateurs
  // ══════════════════════════════════════════════════════════
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { title: 'Administration — CamerTalents', requiresAuth: true, role: 'admin' },
  },

  // ══════════════════════════════════════════════════════════
  //  ROUTE 404
  //  Toute URL inconnue → redirige vers l'accueil
  // ══════════════════════════════════════════════════════════
  {
    // Redirection page inconnue
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
];

// ── Création du router ───────────────────────────────────────
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Retour en haut à chaque changement de page
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // Restaure la position si on revient en arrière (bouton back)
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  },
});

// ── Guards de navigation ─────────────────────────────────────
router.beforeEach((to, from) => {
  // ── 1. Mise à jour du titre de la page ────────────────────
  document.title = to.meta.title || 'CamerTalents';

  const token = localStorage.getItem('camertalents_token');
  const isLoggedIn = !!token;
  const userRole = localStorage.getItem('camertalents_role');
  const userTalentId = localStorage.getItem('camertalents_talentId'); // On devra stocker ça

  // ── 3. Routes guestOnly (login, register) ─────────────────
  // Si l'utilisateur est déjà connecté et essaie d'accéder
  // à /login ou /register → redirige vers son dashboard
  if (to.meta.guestOnly && isLoggedIn && userRole) {
    return getDashboardRoute(userRole);
  }

  // ── 4. Routes protégées (requiresAuth) ───────────────────
  // Si la route nécessite une auth et que l'utilisateur
  // n'est pas connecté → redirige vers /login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
      // Le ?redirect= permet à LoginView de rediriger
      // vers la page demandée après connexion
    };
  }

  // ── 5. Vérification du rôle ───────────────────────────────
  // Si la route nécessite un rôle spécifique et que
  // l'utilisateur n'a pas ce rôle → redirige vers son dashboard
  if (to.meta.requiresAuth && to.meta.role && isLoggedIn && userRole) {
    if (userRole !== to.meta.role) {
      // L'utilisateur est connecté mais n'a pas le bon rôle
      // Ex: un talent qui essaie d'accéder à /admin
      return getDashboardRoute(userRole);
    }
  }

  // ── 6. Règles spéciales pour les talents ─────────────────
  // Les talents peuvent voir leur propre profil
  if (to.name === 'talent-profile' && isLoggedIn && userRole === 'talent') {
    const talentId = to.params.id;
    if (userTalentId && userTalentId === talentId) {
      // Autoriser l'accès à son propre profil
      return true;
    } else {
      // Interdire l'accès aux autres profils
      return getDashboardRoute(userRole);
    }
  }

  // ── 7. Navigation autorisée ───────────────────────────────
  return true;
});

// ── Helper : retourne la route du dashboard selon le rôle ───
function getDashboardRoute(role) {
  const map = { talent: 'talent-dashboard', recruteur: 'recruteur-dashboard', admin: 'admin' };
  return { name: map[role] || 'home' };
}

export default router;
