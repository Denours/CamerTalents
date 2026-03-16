<template>
  <footer class="border-t border-white/[0.06] bg-[#0A0718] text-white">
    <!-- Corps principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <!-- Colonne 1 : Branding -->
        <div class="lg:col-span-2">
          <!-- Logo -->
          <RouterLink to="/" class="inline-flex items-center gap-2.5 mb-5 group">
            <div
              class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <circle cx="6" cy="6" r="4" stroke="white" stroke-width="1.5" />
                <circle cx="11" cy="11" r="3" stroke="#F97316" stroke-width="1.5" />
              </svg>
            </div>
            <span class="font-title font-bold text-lg text-white tracking-tight">
              CamerTalents
            </span>
          </RouterLink>

          <p class="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
            La plateforme qui connecte les talents camerounais avec ceux qui en ont besoin.
            Développeurs, artisans, créatifs — tous méritent d'être vus.
          </p>

          <!-- Badges stats -->
          <div class="flex flex-wrap gap-3">
            <div class="stat-badge">
              <span class="font-mono font-bold text-white"> {{ totalTalents }}+ </span>
              <span class="text-white/30">talents</span>
            </div>
            <div class="stat-badge">
              <span class="font-mono font-bold text-white">10</span>
              <span class="text-white/30">villes</span>
            </div>
            <div class="stat-badge">
              <span class="font-mono font-bold text-white">6</span>
              <span class="text-white/30">catégories</span>
            </div>
          </div>
        </div>

        <!-- Colonne 2 : Navigation -->
        <div>
          <h3 class="footer-heading">Réseaux sociaux</h3>
          <ul class="space-y-3">
            <li>
              <a href="#" class="footer-link flex items-center gap-2">
                <Phone />
                WhatsApp</a
              >
            </li>
            <li>
              <a href="#" class="footer-link flex items-center gap-2">
                <Facebook />
                Facebook</a
              >
            </li>
            <li>
              <a href="https://www.linkedin.com/in/d-keufack/" class="footer-link flex items-center gap-2">
                <Linkedin />
                LinkedIn</a
              >
            </li>
          </ul>
        </div>

        <!-- Colonne 3 : Catégories -->
        <div>
          <h3 class="footer-heading">Catégories</h3>
          <ul class="space-y-3">
            <li v-for="cat in categories" :key="cat.label">
              <RouterLink
                :to="`/explore?category=${encodeURIComponent(cat.label)}`"
                class="footer-link flex items-center gap-2"
              >
                <span class="text-sm">
                  <component :is="cat.emoji" />
                </span>
                {{ cat.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <!-- Colonne 4 : Liens -->
        <div>
          <h3 class="footer-heading">Liens</h3>
          <ul class="space-y-3">
            <li class="footer-link flex items-center gap-2"><a href="#">Mentions Légales</a></li>
            <li class="footer-link flex items-center gap-2">
              <a href="#"> Politique de confidentialité</a>
            </li>
            <li class="footer-link flex items-center gap-2">
              <a href="#">Conditions Générales d'utilisation</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Séparateur -->
    <div class="border-t border-white/[0.05]" />

    <!-- Bas de page -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-white/25 text-sm text-center sm:text-left">
          © {{ currentYear }} CamerTalents — Fait avec ❤️ pour le Cameroun
        </p>
        <span class="text-white/25 text-sm">Développeur : Keufack Denis</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useTalentStore } from '../../stores/talentStore';
import {
  Phone,
  Facebook,
  Linkedin,
  Laptop,
  Hammer,
  Palette,
  GraduationCap,
  HandPlatter,
  Car,
} from 'lucide-vue-next';
import { CATEGORIES } from '../../data/mockData';

const store = useTalentStore();
const totalTalents = computed(() => store.totalTalents);
const currentYear = new Date().getFullYear();

const catEmojis = {
  'Tech & Digital': Laptop,
  'Artisanat & BTP': Hammer,
  'Créatif & Art': Palette,
  'Éducation & Formation': GraduationCap,
  'Services & Lifestyle': HandPlatter,
  'Transport & Logistique': Car,
};

const categories = CATEGORIES.map((label) => ({
  label,
  emoji: catEmojis[label] || '✨',
}));
</script>

<style scoped>
.footer-heading {
  @apply text-xs font-semibold text-white/30
         uppercase tracking-widest mb-5;
}

.footer-link {
  @apply text-sm text-white/50 hover:text-white
         transition-colors duration-200;
}

.stat-badge {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-lg
         bg-white/[0.04] border border-white/[0.08]
         text-sm;
}
</style>
