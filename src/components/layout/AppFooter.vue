<template>
  <footer class="border-t border-white/[0.06] bg-[#0A0718] text-white">
    <!-- ════════════════════════════════════════════
         BANDE NEWSLETTER
    ════════════════════════════════════════════ -->
    <div class="border-b border-white/[0.06]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 class="font-title text-xl font-bold mb-1">Restez informé des nouveaux talents</h3>
            <p class="text-white/40 text-sm">
              Recevez chaque semaine les meilleurs profils directement dans votre boîte mail.
            </p>
          </div>
          <form @submit.prevent="subscribeNewsletter" class="flex gap-3 w-full md:w-auto">
            <input
              v-model="newsletterEmail"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="votre@email.com"
              class="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 transition-all duration-200"
            />
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold whitespace-nowrap hover:bg-primary-600 active:scale-95 transition-all duration-200"
            >
              {{ subscribed ? '✅ Inscrit !' : "S'inscrire" }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         CORPS PRINCIPAL
    ════════════════════════════════════════════ -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <!-- Colonne 1 : Branding (3 cols) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Logo -->
          <RouterLink to="/" class="inline-flex items-center gap-2.5 group">
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

          <p class="text-white/40 text-sm leading-relaxed max-w-xs">
            La plateforme qui connecte les talents camerounais avec ceux qui en ont besoin.
            Développeurs, artisans, créatifs — tous méritent d'être vus.
          </p>

          <!-- Badges stats -->
          <div class="flex flex-wrap gap-3">
            <div class="stat-badge">
              <span class="font-mono font-bold text-white">{{ totalTalents }}+</span>
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

          <!-- Réseaux sociaux -->
          <div>
            <p class="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
              Nous suivre
            </p>
            <div class="flex items-center gap-3">
              <a
                v-for="social in socials"
                :key="social.label"
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                :title="social.label"
                class="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.12] hover:border-white/20 transition-all duration-200"
              >
                <component :is="social.icon" />
              </a>
            </div>
          </div>
        </div>

        <!-- Colonne 4 : Informations légales -->
        <div>
          <h3 class="footer-heading">Informations</h3>
          <ul class="space-y-3">
            <li v-for="link in legalLinks" :key="link.label">
              <button @click="openModal(link.id)" class="footer-link text-left w-full">
                {{ link.label }}
              </button>
            </li>
          </ul>
        </div>
        <!-- Coordonnées -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Contact</p>
          <a
            href="mailto:contact@camertalents.cm"
            class="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-200"
          >
            <svg
              width="14"
              height="14"
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
            contact@camertalents.cm
          </a>
          <a
            href="tel:+237693792808"
            class="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              ></path>
            </svg>

            +237 693 792 808
          </a>
          <p class="flex items-center gap-2 text-sm text-white/40">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Douala, Cameroun
          </p>
        </div>
        <!-- Bloc réassurance -->
        <div class="space-y-3">
          <h3 class="footer-heading">Pourquoi nous ?</h3>
          <div v-for="item in reassurance" :key="item.text" class="flex items-start gap-2">
            <span class="mt-0.5 flex-shrink-0 text-white/30">
              <Check size="14" />
            </span>
            <span class="text-xs text-white/40 leading-relaxed">
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         BANDE BAS DE PAGE
    ════════════════════════════════════════════ -->
    <div class="border-t border-white/[0.05]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-white/20 text-xs text-center sm:text-left">
            © {{ currentYear }} CamerTalents · Tous droits réservés · Fait avec ❤️ pour le Cameroun
            🇨🇲
          </p>

          <div class="flex items-center gap-4">
            <!-- Bouton retour en haut -->
            <button
              @click="scrollToTop"
              title="Retour en haut"
              class="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         MODALS LÉGALES
    ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="activeModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          @click.self="activeModal = null"
        >
          <div
            class="max-w-lg w-full bg-[#1A1230] border border-white/10 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            <!-- En-tête modal -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h3 class="font-title font-bold text-white">
                {{ currentModalContent?.title }}
              </h3>
              <button
                @click="activeModal = null"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
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

            <!-- Corps modal (scrollable) -->
            <div class="px-6 py-5 overflow-y-auto text-sm text-white/50 leading-relaxed space-y-4">
              <p v-for="(para, i) in currentModalContent?.paragraphs" :key="i" class="text-justify">
                {{ para }}
              </p>
            </div>

            <!-- Pied modal -->
            <div class="px-6 py-4 border-t border-white/[0.08] text-right">
              <button
                @click="activeModal = null"
                class="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </footer>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { useTalentStore } from '../../stores/talentStore';
import { Check } from 'lucide-vue-next';

// ── Store ────────────────────────────────────────────────────
const store = useTalentStore();
const totalTalents = computed(() => store.totalTalents);
const currentYear = new Date().getFullYear();

// ── Newsletter ───────────────────────────────────────────────
const newsletterEmail = ref('');
const subscribed = ref(false);

function subscribeNewsletter() {
  if (!newsletterEmail.value) return;
  // Simule l'inscription (remplacer par un vrai appel API plus tard)
  subscribed.value = true;
  setTimeout(() => {
    subscribed.value = false;
    newsletterEmail.value = '';
  }, 3000);
}

// ── Retour en haut ───────────────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Liens légaux ─────────────────────────────────────────────
const legalLinks = [
  { id: 'mentions', label: 'Mentions légales' },
  { id: 'cgv', label: 'CGV' },
  { id: 'confidentialite', label: 'Politique de confidentialité' },
  { id: 'cookies', label: 'Politique de cookies' },
  { id: 'about', label: 'À propos de CamerTalents' },
  { id: 'faq', label: 'FAQ' },
  { id: 'recrutement', label: 'Recrutement' },
];

// ── Réassurance ──────────────────────────────────────────────
const reassurance = [
  { text: 'Plateforme 100% gratuite pour les talents' },
  { text: 'Aucune commission sur les contrats' },
  { text: 'Contact direct sans intermédiaire' },
  { text: 'Données sécurisées et confidentielles' },
];

// ── Réseaux sociaux ──────────────────────────────────────────
// Icônes SVG inline via h() pour rester léger (pas de dépendance externe)
const FacebookIcon = {
  render: () =>
    h(
      'svg',
      {
        width: '15',
        height: '15',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
      },
      [h('path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' })],
    ),
};

const LinkedInIcon = {
  render: () =>
    h(
      'svg',
      {
        width: '15',
        height: '15',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
      },
      [
        h('path', {
          d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
        }),
        h('rect', { x: '2', y: '9', width: '4', height: '12' }),
        h('circle', { cx: '4', cy: '4', r: '2' }),
      ],
    ),
};

const InstagramIcon = {
  render: () =>
    h(
      'svg',
      {
        width: '15',
        height: '15',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      [
        h('rect', { x: '2', y: '2', width: '20', height: '20', rx: '5', ry: '5' }),
        h('path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }),
        h('line', { x1: '17.5', y1: '6.5', x2: '17.51', y2: '6.5' }),
      ],
    ),
};

const TwitterIcon = {
  render: () =>
    h(
      'svg',
      {
        width: '15',
        height: '15',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
      },
      [
        h('path', {
          d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
        }),
      ],
    ),
};

const WhatsAppIcon = {
  render: () =>
    h(
      'svg',
      {
        width: '15',
        height: '15',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
      },
      [
        h('path', {
          d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z',
        }),
      ],
    ),
};

const socials = [
  { label: 'Facebook', href: 'https://facebook.com/camertalents', icon: FacebookIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/camertalents', icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://instagram.com/camertalents', icon: InstagramIcon },
  { label: 'X (Twitter)', href: 'https://x.com/camertalents', icon: TwitterIcon },
  { label: 'WhatsApp', href: 'https://wa.me/237699000000', icon: WhatsAppIcon },
];

// ── Modals légales ────────────────────────────────────────────
const activeModal = ref(null);

function openModal(id) {
  activeModal.value = id;
}

const modalContents = {
  mentions: {
    title: 'Mentions légales',
    paragraphs: [
      'CamerTalents est une plateforme numérique éditée par CamerTalents SAS, société par actions simplifiée au capital de 1 000 000 FCFA, immatriculée au Registre du Commerce et du Crédit Mobilier de Douala sous le numéro RC/DLA/2024/B/1234.',
      'Siège social : Bonaberi, CEBEC, Douala, Cameroun.',
      'Directeur de la publication : Le représentant légal de CamerTalents SAS.',
      "Hébergement : Le site est hébergé par un prestataire certifié disposant de serveurs situés en Europe et en Afrique de l'Ouest.",
      "Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse : legal@camertalents.cm",
    ],
  },
  cgv: {
    title: 'Conditions Générales de Vente',
    paragraphs: [
      "L'accès et l'utilisation de CamerTalents sont entièrement gratuits pour les talents qui créent un profil. Aucune commission n'est prélevée sur les contrats conclus entre talents et clients via la plateforme.",
      "CamerTalents agit exclusivement en tant qu'intermédiaire de mise en relation. La plateforme ne saurait être tenue responsable des engagements contractuels pris entre les utilisateurs.",
      'Les profils publiés sur CamerTalents doivent être exacts, sincères et mis à jour régulièrement. Tout profil frauduleux ou trompeur sera supprimé sans préavis.',
      'CamerTalents se réserve le droit de modifier ses conditions à tout moment. Les utilisateurs seront notifiés par email de tout changement substantiel.',
    ],
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    paragraphs: [
      'CamerTalents collecte uniquement les données personnelles nécessaires au fonctionnement du service : nom, email, numéro de téléphone, ville, métier et compétences.',
      "Ces données sont utilisées exclusivement pour la création et l'affichage des profils publics sur la plateforme, et ne sont jamais vendues à des tiers.",
      "Conformément à la loi camerounaise n°2010/012 du 21 décembre 2010 relative à la cybersécurité et à la cybercriminalité, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.",
      'Pour exercer ces droits, contactez-nous à : privacy@camertalents.cm',
      "Les données sont conservées pendant la durée d'activité du compte, puis supprimées dans un délai de 30 jours après la demande de suppression.",
    ],
  },
  cookies: {
    title: 'Politique de cookies',
    paragraphs: [
      "CamerTalents utilise des cookies techniques strictement nécessaires au bon fonctionnement de la plateforme (gestion de session, préférences d'affichage).",
      "Nous utilisons également des cookies analytiques anonymisés pour mesurer l'audience et améliorer l'expérience utilisateur. Ces cookies ne permettent pas de vous identifier personnellement.",
      "Aucun cookie publicitaire ou de traçage tiers n'est utilisé sur CamerTalents.",
      'Vous pouvez configurer votre navigateur pour refuser les cookies. Cela pourrait cependant affecter certaines fonctionnalités de la plateforme.',
    ],
  },
  about: {
    title: 'À propos de CamerTalents',
    paragraphs: [
      "CamerTalents est née d'un constat simple : au Cameroun, des milliers de talents qualifiés — développeurs, artisans, créatifs, formateurs — restent invisibles faute d'une vitrine numérique adaptée à leur réalité.",
      "Notre mission : donner à chaque talent camerounais la visibilité qu'il mérite, en connectant directement les compétences locales avec les besoins des particuliers et des entreprises.",
      "La plateforme est entièrement gratuite pour les talents. Nous croyons que l'accès à l'opportunité ne devrait pas avoir de prix.",
      'CamerTalents est un projet en constante évolution. Nous travaillons chaque jour à améliorer la plateforme grâce aux retours de notre communauté.',
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    paragraphs: [
      'Est-ce gratuit ? Oui, CamerTalents est 100% gratuit pour les talents. La création de profil, la mise en ligne et la visibilité sur la plateforme ne coûtent rien.',
      "Comment créer mon profil ? Cliquez sur 'Rejoindre CamerTalents' depuis n'importe quelle page, remplissez le formulaire en 3 étapes et votre profil est publié immédiatement.",
      'Puis-je modifier mon profil après création ? La gestion de compte complète (modification, suppression) sera disponible dans la prochaine version de la plateforme.',
      'Comment les recruteurs me contactent-ils ? Directement via votre téléphone ou email affichés sur votre profil. Aucun intermédiaire, aucune commission.',
      'Mon profil est-il visible après actualisation de la page ? Oui. Vos données sont sauvegardées localement et restent disponibles même après rechargement de la page.',
    ],
  },
  recrutement: {
    title: "Rejoindre l'équipe CamerTalents",
    paragraphs: [
      'CamerTalents est un projet en croissance et nous sommes toujours à la recherche de personnes talentueuses et motivées pour rejoindre notre aventure.',
      'Postes ouverts : Développeur(se) Full-Stack (Vue.js / Node.js), Designer UI/UX, Chargé(e) de communication et partenariats, Business Developer.',
      "Nous valorisons la passion, l'autonomie et l'impact. Si vous croyez en la mission de CamerTalents et souhaitez contribuer au développement du numérique camerounais, nous voulons vous rencontrer.",
      'Envoyez votre candidature (CV + courte lettre de motivation) à : careers@camertalents.cm',
    ],
  },
};

const currentModalContent = computed(() =>
  activeModal.value ? modalContents[activeModal.value] : null,
);
</script>

<style scoped>
.footer-heading {
  @apply text-xs font-semibold text-white/30
         uppercase tracking-widest mb-4;
}

.footer-link {
  @apply text-sm text-white/50 hover:text-white
         transition-colors duration-200;
}

.stat-badge {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-lg
         bg-white/[0.04] border border-white/[0.08] text-sm;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
