// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
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
    meta: { title: 'Explorer les talents' },
  },
  {
    path: '/talent/:id',
    name: 'talent-profile',
    component: () => import('../views/TalentProfileView.vue'),
    meta: { title: 'Profil Talent' },
    props: true,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard — CamerTalents' },
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../views/MapView.vue'),
    meta: { title: 'Carte des talents' },
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('../views/OnboardingView.vue'),
    meta: { title: 'Rejoindre CamerTalents' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { title: 'Administration — CamerTalents', requiresAuth: true, role: 'admin' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { title: 'Créer un compte — CamerTalents' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Connexion — CamerTalents' },
  },
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
    meta: { title: 'Modifier mon profil', requiresAuth: true, role: 'talent' },
  },
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
  {
    // Redirection page inconnue
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll en haut à chaque changement de page
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
});

// Guard de navigation — titre dynamique
router.beforeEach((to) => {
  document.title = to.meta.title || 'CamerTalents';
});

export default router;
