<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white">
    <!-- État : chargement -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
        />
        <p class="text-white/30 text-sm">Chargement du profil...</p>
      </div>
    </div>

    <!-- État : talent introuvable -->
    <div v-else-if="!talent" class="flex flex-col items-center justify-center min-h-screen gap-4">
      <div class="text-6xl">😕</div>
      <h2 class="font-title text-2xl font-bold">Profil introuvable</h2>
      <p class="text-white/40">Ce talent n'existe pas ou a été supprimé.</p>
      <button
        @click="goBackToExplore"
        class="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-600 transition-colors"
      >
        Retour à l'annuaire
      </button>
    </div>

    <!-- Profil complet -->
    <template v-else>
      <!-- ════════════════════════════════════════════
        HERO — Bannière du profil
      ════════════════════════════════════════════ -->
      <section class="relative">
        <!-- Bannière dégradée -->
        <div class="h-52 sm:h-64 relative overflow-hidden">
          <div
            class="absolute inset-0"
            :style="`background: linear-gradient(135deg,
                 ${categoryColor}22 0%,
                 #0F0A1E 60%)`"
          />

          <!-- Motif décoratif -->
          <svg class="absolute inset-0 w-full h-full opacity-[0.05]">
            <defs>
              <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
          <!-- Glow centré -->
          <div
            class="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 rounded-full blur-[80px] opacity-30"
            :style="`background: ${categoryColor}`"
          />
        </div>

        <!-- Contenu hero -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative -mt-20 sm:-mt-24 pb-8">
            <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <!-- Avatar + infos principales -->
              <div class="flex items-end gap-5">
                <div class="relative flex-shrink-0">
                  <img
                    :src="
                      talent.avatar
                        ? talent.avatar
                        : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
                    "
                    :alt="talent.nom"
                    class="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-[#0F0A1E] shadow-2xl"
                    v-motion
                    :initial="{ opacity: 0, scale: 0.8 }"
                    :enter="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
                  />
                  <!-- Badge disponibilité -->
                  <span
                    class="absolute -bottom-5 -left-8 px-3 py-1 rounded-full text-xs font-bold border-2 border-[#0F0A1E]"
                    :class="availabilityClass"
                  >
                    {{ availabilityLabel }}
                  </span>
                </div>

                <div
                  class="mb-5"
                  v-motion
                  :initial="{ opacity: 0, x: -20 }"
                  :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 100 } }"
                >
                  <h1 class="font-title text-2xl sm:text-3xl font-bold">
                    {{ talent.nom }}
                  </h1>
                  <p class="text-white/60 mt-3 ml-1">{{ talent.metier }}</p>
                  <div class="flex items-center gap-3 mt-3 flex-wrap">
                    <!-- Localisation -->
                    <span class="flex items-center gap-1.5 text-sm text-white/40">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {{ talent.ville }}, {{ talent.quartier }}
                    </span>
                    <!-- Note -->
                    <span class="flex items-center gap-1 text-sm">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="#FBBF24"
                        stroke="#FBBF24"
                        stroke-width="1"
                      >
                        <polygon
                          points="12 2 15.09 8.26 22 9.27
                                         17 14.14 18.18 21.02 12 17.77
                                         5.82 21.02 7 14.14 2 9.27
                                         8.91 8.26 12 2"
                        />
                      </svg>
                      <span class="font-mono font-bold text-white">
                        {{ talent.note.toFixed(1) }}
                      </span>
                      <span class="text-white/30">({{ talent.avis }} avis)</span>
                    </span>
                    <!-- Vues -->
                    <span class="flex items-center gap-1 text-sm text-white/30">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8
                                 -4 8-11 8-11-8-11-8z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {{ talent.vues }} vues
                    </span>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div
                class="flex flex-wrap gap-3 sm:mb-2"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
              >
                <a :href="`tel:${talent.telephone}`" class="btn-contact btn-contact--primary">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2
                            c-3.56-.35-6.84-1.67-9.51-3.73
                            a16.5 16.5 0 0 1-3-3
                            c-2.06-2.67-3.38-5.95-3.73-9.51
                            A2 2 0 0 1 5.83 2.75h3
                            a2 2 0 0 1 2 1.72
                            c.12.96.36 1.9.7 2.81
                            a2 2 0 0 1-.45 2.11L9.91 10.09
                            a16 16 0 0 0 6 6
                            l1.27-1.27
                            a2 2 0 0 1 2.11-.45
                            c.91.34 1.85.57 2.81.7
                            A2 2 0 0 1 22 16.92z"
                    />
                  </svg>
                  Appeler
                </a>
                <a :href="`mailto:${talent.email}`" class="btn-contact btn-contact--ghost">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12
                        c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email
                </a>
                <!-- Bouton favori — visible uniquement pour les recruteurs -->
                <button
                  v-if="authStore.isRecruteur"
                  @click="authStore.toggleFavori(talent._id)"
                  class="btn-contact btn-contact--ghost"
                  :class="
                    authStore.isFavori(talent._id)
                      ? 'border-secondary/40 text-secondary bg-secondary/10'
                      : ''
                  "
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    :fill="authStore.isFavori(talent._id) ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
             a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23
             l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>
                </button>
                <button @click="shareProfile" class="btn-contact btn-contact--ghost">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Bouton retour dashboard — visible seulement si on vient du dashboard -->

        <RouterLink
          v-if="vientDuDashboard"
          to="/talent/dashboard"
          class="inline-flex items-center gap-2 px-4 py-2 mx-40 mb-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.10] hover:text-white transition-all duration-200"
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
        </RouterLink>
      </section>

      <!-- ════════════════════════════════════════════
           CORPS — Tabs + contenu
      ════════════════════════════════════════════ -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <!-- Navigation par tabs -->
        <div class="flex gap-1 border-b border-white/[0.08] mb-10 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="tab-btn"
            :class="activeTab === tab.id ? 'tab-btn--active' : ''"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="grid lg:grid-cols-3 gap-10">
          <!-- ── Colonne principale (2/3) ────────────── -->
          <div class="lg:col-span-2 space-y-10">
            <!-- TAB : À propos -->
            <Transition name="tab-fade" mode="out-in">
              <div v-if="activeTab === 'about'" key="about">
                <!-- Bio -->
                <section>
                  <h2 class="section-title">À propos</h2>
                  <p class="text-white/60 leading-relaxed text-base">
                    {{ talent.bio }}
                  </p>
                </section>

                <!-- Badge catégorie -->
                <section class="mt-8">
                  <span
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
                    :style="`color: ${categoryColor};
                                 border-color: ${categoryColor}33;
                                 background: ${categoryColor}15`"
                  >
                    {{ talent.categorie }}
                  </span>
                </section>
              </div>
            </Transition>

            <!-- TAB : Compétences -->
            <Transition name="tab-fade" mode="out-in">
              <div v-if="activeTab === 'skills'" key="skills">
                <h2 class="section-title">Compétences</h2>
                <div class="space-y-5" ref="skillsContainer">
                  <div v-for="(skill, i) in talent.competences" :key="skill.nom" class="skill-item">
                    <div class="flex justify-between mb-2">
                      <span class="text-sm font-medium text-white">
                        {{ skill.nom }}
                      </span>
                      <span class="font-mono text-sm text-white/40"> {{ skill.niveau }}% </span>
                    </div>
                    <!-- Barre de compétence animée -->
                    <div class="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-1000 ease-out"
                        :style="`
                          width: ${skillsVisible ? skill.niveau : 0}%;
                          background: linear-gradient(90deg,
                            ${categoryColor} 0%,
                            ${categoryColor}99 100%);
                          transition-delay: ${i * 120}ms
                        `"
                      />
                    </div>
                  </div>
                </div>
                <!-- ── Section CV ──────────────────────────── -->
                <div class="mt-10 pt-8 border-t border-white/[0.06]">
                  <h3 class="font-title text-lg font-bold mb-4">Curriculum Vitae</h3>

                  <!-- Cas 1 : Le talent a un CV → aperçu + téléchargement -->
                  <div v-if="talent.cvBase64" class="space-y-3">
                    <!-- Barre d'action : infos + boutons -->
                    <div
                      class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
                    >
                      <div
                        class="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#A78BF6"
                          stroke-width="1.8"
                        >
                          <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12
                 a2 2 0 0 0 2-2V8z"
                          />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">
                          {{ talent.cvNom || 'Curriculum Vitae' }}
                        </p>
                        <p class="text-xs text-white/40 mt-0.5">
                          Cliquez sur "Visualiser" pour ouvrir sans télécharger
                        </p>
                      </div>
                      <div class="flex items-center gap-2 flex-shrink-0">
                        <!-- Bouton Visualiser -->
                        <button
                          @click="cvViewerOpen = true"
                          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white/70 text-sm font-medium hover:bg-white/[0.14] hover:text-white active:scale-95 transition-all duration-200"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Visualiser
                        </button>
                        <!-- Bouton Télécharger -->
                        <a
                          :href="talent.cvBase64"
                          :download="talent.cvNom || 'CV.pdf'"
                          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 active:scale-95 transition-all duration-200"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Télécharger
                        </a>
                      </div>
                    </div>

                    <!-- Aperçu inline (miniature cliquable) -->
                    <button
                      @click="cvViewerOpen = true"
                      class="w-full rounded-2xl overflow-hidden border border-white/[0.08] hover:border-primary/30 transition-all duration-300 group relative bg-[#1A1230]"
                      style="height: 220px"
                    >
                      <!-- Rendu iframe en miniature (pointer-events none pour éviter
                      les interactions accidentelles sur la miniature) -->
                      <iframe
                        :src="talent.cvBase64"
                        title="curriculum"
                        class="w-full h-full pointer-events-none"
                        style="
                          transform: scale(0.5);
                          transform-origin: top left;
                          width: 200%;
                          height: 200%;
                        "
                      />
                      <!-- Overlay hover -->
                      <div
                        class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300"
                      >
                        <div
                          class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Ouvrir le CV en plein écran
                        </div>
                      </div>
                    </button>
                  </div>

                  <!-- Cas 2 : Pas de CV → input pour en ajouter un -->
                  <div v-else>
                    <p class="text-sm text-white/40 mb-4">
                      Aucun CV ajouté pour l'instant. Tu peux en importer un ci-dessous pour
                      renforcer ton profil.
                    </p>
                    <label
                      class="flex flex-col items-center justify-center gap-3 w-full py-8 rounded-xl border-2 border-dashed border-white/10 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div
                        class="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center group-hover:bg-primary/10 transition-all duration-200"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,0.3)"
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
                          class="text-sm text-white/40 group-hover:text-white/60 transition-colors duration-200"
                        >
                          Importer mon CV
                        </p>
                        <p class="text-xs text-white/20 mt-1">PDF, DOC ou DOCX — max 5 Mo</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        class="hidden"
                        @change="handleCvUploadOnProfile"
                      />
                    </label>
                    <p v-if="cvUploadError" class="text-xs text-red-400 mt-2">
                      {{ cvUploadError }}
                    </p>
                  </div>
                </div>
                <!-- ── Fin section CV ───────────────────────── -->
              </div>
            </Transition>

            <!-- TAB : Portfolio -->
            <Transition name="tab-fade" mode="out-in">
              <div v-if="activeTab === 'portfolio'" key="portfolio">
                <h2 class="section-title">Portfolio</h2>

                <div v-if="talent?.portfolio?.length === 0" class="text-center py-16 text-white/30">
                  <div class="text-4xl mb-3">🖼️</div>
                  <p>Aucune réalisation ajoutée pour l'instant.</p>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    v-for="(img, i) in talent.portfolio"
                    :key="i"
                    @click="openLightbox(i)"
                    class="relative group aspect-square rounded-2xl overflow-hidden border border-white/[0.08] hover:border-primary/30 transition-all duration-300"
                    v-motion
                    :initial="{ opacity: 0, scale: 0.9 }"
                    :enter="{ opacity: 1, scale: 1, transition: { duration: 400, delay: i * 80 } }"
                  >
                    <img
                      :src="img"
                      :alt="`Réalisation ${i + 1}`"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <!-- Overlay au hover -->
                    <div
                      class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        stroke-width="2"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </Transition>

            <!-- TAB : Avis -->
            <Transition name="tab-fade" mode="out-in">
              <div v-if="activeTab === 'avis'" key="avis">
                <div class="space-y-8">
                  <!-- Statistiques des avis -->
                  <div class="flex items-center gap-8">
                    <!-- Note moyenne et count -->
                    <div>
                      <p class="text-4xl font-bold text-white mb-1">
                        {{ talent.note.toFixed(1) }}
                        <span class="text-lg text-white/50">/5</span>
                      </p>
                      <p class="text-sm text-white/50">basé sur {{ talent.avis }} avis</p>
                      <!-- Étoiles -->
                      <div class="flex items-center gap-1 mt-3">
                        <template v-for="i in 5" :key="i">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            :fill="i <= Math.round(talent.note) ? '#EAB308' : 'none'"
                            :stroke="
                              i <= Math.round(talent.note) ? '#EAB308' : 'rgba(255,255,255,0.2)'
                            "
                            stroke-width="2"
                          >
                            <polygon
                              points="12 2 15.09 10.26 24 10.26 17.82 15.88 20.91 24 12 18.35 3.09 24 6.18 15.88 0 10.26 8.91 10.26"
                            />
                          </svg>
                        </template>
                      </div>
                    </div>

                    <!-- Bouton laisser un avis (recruteurs seulement) -->
                    <button
                      v-if="authStore.isRecruteur"
                      @click="ouvrirModuleAvis"
                      class="ml-auto self-start px-6 py-3 rounded-xl bg-primary/15 border border-primary/30 text-primary-100 font-medium hover:bg-primary/25 transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class="inline mr-2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Laisser un avis
                    </button>
                  </div>

                  <!-- Distribution des notes (optionnel mais cool) -->
                  <div class="mt-8 pt-8 border-t border-white/[0.06]">
                    <p class="text-sm font-semibold text-white mb-4">Distribution des notes</p>
                    <div class="space-y-2">
                      <template v-for="stars in [5, 4, 3, 2, 1]" :key="stars">
                        <div class="flex items-center gap-3">
                          <span class="text-xs text-white/40 w-4">{{ stars }}★</span>
                          <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              class="h-full bg-primary transition-all duration-500"
                              :style="{
                                width: avisList.length
                                  ? `${(avisList.filter((a) => a.note === stars).length / avisList.length) * 100}%`
                                  : '0%',
                              }"
                            />
                          </div>
                          <span class="text-xs text-white/40 w-6 text-right">
                            {{ avisList.filter((a) => a.note === stars).length }}
                          </span>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Liste des avis -->
                  <div class="mt-8 pt-8 border-t border-white/[0.06]">
                    <h3 class="font-title font-bold text-white mb-6">
                      {{ avisList.length === 0 ? 'Aucun avis pour le moment' : 'Récents avis' }}
                    </h3>

                    <div v-if="avisList.length === 0" class="text-center py-10">
                      <div class="text-4xl mb-3">💬</div>
                      <p class="text-white/40">Soyez le premier à laisser un avis!</p>
                    </div>

                    <div v-else class="space-y-6">
                      <div
                        v-for="avis in avisList"
                        :key="`${avis.auteurId}-${avis.dateAvis}`"
                        class="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                      >
                        <!-- Header avis -->
                        <div class="flex items-start justify-between mb-3">
                          <div class="flex items-center gap-3">
                            <img
                              :src="
                                avis.auteurAvatar ||
                                'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
                              "
                              :alt="avis.auteurNom"
                              class="w-10 h-10 rounded-full object-cover"
                            />
                            <div class="min-w-0">
                              <p class="text-sm font-semibold text-white truncate">
                                {{ avis.auteurNom }}
                              </p>
                              <p class="text-xs text-white/40">
                                {{
                                  new Date(avis.dateAvis).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                }}
                              </p>
                            </div>
                          </div>
                          <!-- Étoiles de la note -->
                          <div class="flex gap-1">
                            <template v-for="i in 5" :key="i">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                :fill="i <= avis.note ? '#EAB308' : 'none'"
                                :stroke="i <= avis.note ? '#EAB308' : 'rgba(255,255,255,0.2)'"
                                stroke-width="2"
                              >
                                <polygon
                                  points="12 2 15.09 10.26 24 10.26 17.82 15.88 20.91 24 12 18.35 3.09 24 6.18 15.88 0 10.26 8.91 10.26"
                                />
                              </svg>
                            </template>
                          </div>
                        </div>

                        <!-- Commentaire -->
                        <p v-if="avis.commentaire" class="text-sm text-white/70 leading-relaxed">
                          {{ avis.commentaire }}
                        </p>
                        <p v-else class="text-sm text-white/40 italic">Pas de commentaire</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ── Sidebar (1/3) ───────────────────────── -->
          <aside class="space-y-6">
            <!-- Carte tarif -->
            <div class="info-card">
              <p class="text-xs text-white/30 uppercase tracking-widest mb-1">Tarif horaire</p>
              <p class="font-mono text-2xl font-bold text-white">
                {{ talent.tarifJour.toLocaleString('fr-FR') }}
                <span class="text-sm font-normal text-white/40">FCFA/heure</span>
              </p>
            </div>

            <!-- Carte contact -->
            <div class="info-card space-y-3">
              <p class="text-xs text-white/30 uppercase tracking-widest">Contact</p>
              <a
                :href="`tel:${talent.telephone}`"
                class="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0"
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
                      d="M22 16.92v3a2 2 0 0 1-2.18 2
                            c-3.56-.35-6.84-1.67-9.51-3.73
                            a16.5 16.5 0 0 1-3-3
                            c-2.06-2.67-3.38-5.95-3.73-9.51
                            A2 2 0 0 1 5.83 2.75h3
                            a2 2 0 0 1 2 1.72
                            c.12.96.36 1.9.7 2.81
                            a2 2 0 0 1-.45 2.11L9.91 10.09
                            a16 16 0 0 0 6 6
                            l1.27-1.27
                            a2 2 0 0 1 2.11-.45
                            c.91.34 1.85.57 2.81.7
                            A2 2 0 0 1 22 16.92z"
                    />
                  </svg>
                </div>
                {{ talent.telephone }}
              </a>
              <a
                :href="`mailto:${talent.email}`"
                class="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0"
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
                      d="M4 4h16c1.1 0 2 .9 2 2v12
                             c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                {{ talent.email }}
              </a>
            </div>

            <!-- Membre depuis -->
            <div class="info-card">
              <p class="text-xs text-white/30 uppercase tracking-widest mb-1">Membre depuis</p>
              <p class="text-white font-medium">{{ memberSince }}</p>
            </div>
          </aside>
        </div>

        <!-- ════════════════════════════════════════════
             TALENTS SIMILAIRES
        ════════════════════════════════════════════ -->
        <section class="mt-20 pt-10 border-t border-white/[0.06]" v-if="similarTalents.length > 0">
          <h2 class="font-title text-2xl font-bold mb-8">Talents similaires</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TalentCard
              v-for="(t, i) in similarTalents"
              :key="t.id"
              :talent="t"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: i * 80 } }"
            />
          </div>
        </section>
      </div>
    </template>

    <!-- ════════════════════════════════════════════
         LIGHTBOX PORTFOLIO
    ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          @click.self="closeLightbox"
        >
          <!-- Image -->
          <img
            :src="talent?.portfolio[lightboxIndex]"
            :alt="`Réalisation ${lightboxIndex + 1}`"
            class="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />

          <!-- Fermer -->
          <button
            @click="closeLightbox"
            class="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Navigation -->
          <button
            v-if="lightboxIndex > 0"
            @click="lightboxIndex--"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            v-if="talent && lightboxIndex < talent.portfolio.length - 1"
            @click="lightboxIndex++"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <!-- Compteur -->
          <div
            class="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-sm font-mono"
          >
            {{ lightboxIndex + 1 }} / {{ talent?.portfolio.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- ════════════════════════════════════════════
     MODALE VIEWER CV
════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="cvViewerOpen"
          class="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          @click.self="cvViewerOpen = false"
        >
          <!-- Barre d'outils -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F0A1E]/90 flex-shrink-0"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A78BF6"
                  stroke-width="2"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12
                       a2 2 0 0 0 2-2V8z"
                  />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-white">
                  {{ talent?.cvNom || 'Curriculum Vitae' }}
                </p>
                <p class="text-xs text-white/30">
                  {{ talent?.nom }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Télécharger depuis la modale -->
              <a
                :href="talent?.cvBase64"
                :download="talent?.cvNom || 'CV.pdf'"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] text-white/70 text-sm hover:bg-white/[0.14] hover:text-white transition-all duration-200"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Télécharger
              </a>
              <!-- Fermer -->
              <button
                @click="cvViewerOpen = false"
                class="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.14] transition-all duration-200"
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
          </div>

          <!-- iframe plein écran -->
          <iframe :src="talent?.cvBase64" title="cv-fullscreen" class="flex-1 w-full" />
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════
     MODAL EXPLORER BLOQUÉ POUR TALENTS
════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="exploreBlockedModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="exploreBlockedModalOpen = false"
        >
          <div class="bg-[#1A1230] rounded-2xl p-6 max-w-md w-full border border-white/10">
            <div class="text-center">
              <div class="text-4xl mb-4">🚫</div>
              <h3 class="text-xl font-bold text-white mb-2">Accès refusé</h3>
              <p class="text-white/70 mb-6">
                En tant que Talent vous ne pouvez pas explorer d'autres talents.
              </p>
              <button
                @click="exploreBlockedModalOpen = false"
                class="px-6 py-2 bg-primary rounded-lg text-white font-medium hover:bg-primary-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════
     MODAL LAISSER UN AVIS
════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="avisModuleOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="fermerModuleAvis"
        >
          <div class="bg-[#1A1230] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div class="text-center mb-8">
              <h2 class="font-title text-2xl font-bold text-white mb-2">Votre avis</h2>
              <p class="text-white/50">Aidez autres recruteurs avec votre retour d'expérience</p>
            </div>

            <!-- Sélecteur d'étoiles -->
            <div class="flex justify-center gap-3 mb-6">
              <button
                v-for="i in 5"
                :key="i"
                @click="noteForm = i"
                class="group flex items-center justify-center transition-transform duration-200 hover:scale-125"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  :fill="i <= noteForm ? '#EAB308' : 'none'"
                  :stroke="i <= noteForm ? '#EAB308' : 'rgba(255,255,255,0.3)'"
                  stroke-width="2"
                  :class="{ 'transition-all duration-200': i <= noteForm }"
                >
                  <polygon
                    points="12 2 15.09 10.26 24 10.26 17.82 15.88 20.91 24 12 18.35 3.09 24 6.18 15.88 0 10.26 8.91 10.26"
                  />
                </svg>
              </button>
            </div>

            <!-- Affichage de la note sélectionnée -->
            <p v-if="noteForm > 0" class="text-center text-sm text-white/60 mb-6">
              Vous donnez
              <span class="font-bold text-white"
                >{{ noteForm }} étoile{{ noteForm > 1 ? 's' : '' }}</span
              >
            </p>

            <!-- Champ de commentaire -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-white mb-2">
                Commentaire <span class="text-white/40">(optionnel, max 500 caractères)</span>
              </label>
              <textarea
                v-model="commentaireForm"
                placeholder="Partagez votre expérience avec ce talent..."
                maxlength="500"
                rows="4"
                class="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.12] transition-all duration-200 resize-none"
              />
              <p class="text-xs text-white/40 mt-1">{{ commentaireForm.length }} / 500</p>
            </div>

            <!-- Message d'erreur -->
            <p v-if="avisError" class="text-sm text-red-400 mb-6">
              {{ avisError }}
            </p>

            <!-- Boutons -->
            <div class="flex gap-3">
              <button
                @click="fermerModuleAvis"
                class="flex-1 px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 font-medium transition-colors"
                :disabled="submitAvisLoading"
              >
                Annuler
              </button>
              <button
                @click="soumettreAvis"
                class="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="submitAvisLoading || noteForm === 0"
              >
                <svg
                  v-if="!submitAvisLoading"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div
                  v-else
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                {{ submitAvisLoading ? 'Envoi...' : "Envoyer l'avis" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { talentsAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import TalentCard from '../components/talent/TalentCard.vue';

// ── Route & navigation ───────────────────────────────────────
const route = useRoute();
const router = useRouter();

// Vrai uniquement si on vient du dashboard talent
const vientDuDashboard = computed(() => route.query.from === 'dashboard');

// ── Données ──────────────────────────────────────────────────
const authStore = useAuthStore();
const talent = ref(null);
const isLoading = ref(true);

// Charge le profil talent depuis l'API
async function chargerTalent(id) {
  if (!id) return;
  isLoading.value = true;
  try {
    const data = await talentsAPI.getById(id);
    if (data.success) {
      talent.value = data.talent;
      // Incrémente le compteur de vues (feu et oublie)
      talentsAPI.incrementerVues(id).catch(() => {});
    }
  } catch {
    talent.value = null;
  } finally {
    isLoading.value = false;
  }
}

const cvUploadError = ref('');
const cvViewerOpen = ref(false);
const exploreBlockedModalOpen = ref(false);

// ── Avis/Notation ────────────────────────────────────────────
const avisList = ref([]);
const avisLoading = ref(false);
const avisModuleOpen = ref(false);
const noteForm = ref(0);
const commentaireForm = ref('');
const submitAvisLoading = ref(false);
const avisError = ref('');

function goBackToExplore() {
  if (authStore.isTalent) {
    exploreBlockedModalOpen.value = true;
  } else {
    router.push('/explore');
  }
}

async function chargerAvis(id) {
  if (!id) return;
  avisLoading.value = true;
  try {
    const data = await talentsAPI.getAvis(id);
    if (data.success) {
      avisList.value = data.avis || [];
    }
  } catch (err) {
    console.error('Erreur lors du chargement des avis:', err);
    avisList.value = [];
  } finally {
    avisLoading.value = false;
  }
}

function ouvrirModuleAvis() {
  if (!authStore.isRecruteur) {
    alert('Seuls les recruteurs peuvent laisser des avis.');
    return;
  }
  avisModuleOpen.value = true;
}

function fermerModuleAvis() {
  avisModuleOpen.value = false;
  noteForm.value = 0;
  commentaireForm.value = '';
  avisError.value = '';
}

async function soumettreAvis() {
  if (noteForm.value === 0) {
    avisError.value = 'Veuillez donner une note.';
    return;
  }

  submitAvisLoading.value = true;
  avisError.value = '';
  try {
    const res = await talentsAPI.ajouterAvis(talent.value._id, {
      note: noteForm.value,
      commentaire: commentaireForm.value,
    });

    if (res.success) {
      // Recharger les avis et mettre à jour le talent
      await chargerAvis(talent.value._id);
      talent.value = res.talent;
      fermerModuleAvis();
    } else {
      avisError.value = res.message || 'Erreur lors de la soumission.';
    }
  } catch (err) {
    avisError.value = err.message || 'Erreur serveur.';
  } finally {
    submitAvisLoading.value = false;
  }
}
// ── Couleur par catégorie ────────────────────────────────────
const categoryColors = {
  'Tech & Digital': '#6C3CE1',
  'Artisanat & BTP': '#F97316',
  'Créatif & Art': '#EC4899',
  'Éducation & Formation': '#06B6D4',
  'Services & Lifestyle': '#22C55E',
  'Transport & Logistique': '#EAB308',
};

const categoryColor = computed(() => categoryColors[talent.value?.categorie] || '#6C3CE1');

// ── Disponibilité ────────────────────────────────────────────
const availabilityClass = computed(() => {
  const map = {
    disponible: 'bg-green-500/20 text-green-400 border-green-500/30',
    occupé: 'bg-red-500/20 text-red-400 border-red-500/30',
    'partiellement disponible': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  return map[talent.value?.disponibilite] || 'bg-white/10 text-white/50';
});

const availabilityLabel = computed(() => {
  const map = {
    disponible: '● Disponible',
    occupé: '● Occupé',
    'partiellement disponible': '● Partiellement dispo.',
  };
  return map[talent.value?.disponibilite] || talent.value?.disponibilite;
});

// ── Tabs ─────────────────────────────────────────────────────
const tabs = [
  { id: 'about', label: 'À propos' },
  { id: 'skills', label: 'Compétences' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'avis', label: 'Avis' },
];
const activeTab = ref('about');

// ── Animation des skill bars ─────────────────────────────────
const skillsContainer = ref(null);
const skillsVisible = ref(false);

// Lance l'animation quand on passe sur l'onglet compétences
watch(activeTab, async (tab) => {
  if (tab === 'skills') {
    skillsVisible.value = false;
    await nextTick();
    // Petit délai pour que la transition du tab se finisse
    setTimeout(() => {
      skillsVisible.value = true;
    }, 100);
  }
  if (tab === 'avis' && talent.value) {
    // Charger les avis si on n'les a pas encore
    if (avisList.value.length === 0) {
      await chargerAvis(talent.value._id);
    }
  }
});

// ── Lightbox ─────────────────────────────────────────────────
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

function openLightbox(i) {
  lightboxIndex.value = i;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
}

// Clavier : Escape pour fermer, flèches pour naviguer
function handleKeydown(e) {
  if (!lightboxOpen.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (cvViewerOpen.value) cvViewerOpen.value = false;
  if (e.key === 'ArrowLeft' && lightboxIndex.value > 0) lightboxIndex.value--;
  if (
    e.key === 'ArrowRight' &&
    talent.value &&
    lightboxIndex.value < talent.value.portfolio.length - 1
  )
    lightboxIndex.value++;
}

// Upload CV directement depuis le profil (pour les talents sans CV)
async function handleCvUploadOnProfile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (!allowed.includes(file.type)) {
    cvUploadError.value = 'Format non supporté. Acceptés : PDF, DOC, DOCX';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    cvUploadError.value = 'Fichier trop lourd. Maximum 5 Mo.';
    return;
  }

  cvUploadError.value = '';

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = await talentsAPI.update(talent.value._id, {
        cvBase64: e.target.result,
        cvNom: file.name,
      });
      if (data.success) {
        // Met à jour le talent localement sans rechargement
        talent.value = { ...talent.value, cvBase64: e.target.result, cvNom: file.name };
      }
    } catch (error) {
      cvUploadError.value = `Erreur upload : ${error.message}`;
    }
  };
  reader.readAsDataURL(file);
}
onMounted(() => {
  chargerTalent(route.params.id);
  globalThis.addEventListener('keydown', handleKeydown);
});

// Si l'utilisateur navigue vers un autre profil sans rechargement
watch(
  () => route.params.id,
  (newId) => chargerTalent(newId),
);
onUnmounted(() => {
  globalThis.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

// ── Partage du profil ────────────────────────────────────────
async function shareProfile() {
  if (navigator.share) {
    await navigator.share({
      title: `${talent.value?.nom} — CamerTalents`,
      text: `Découvre le profil de ${talent.value?.nom} sur CamerTalents`,
      url: globalThis.location.href,
    });
  } else {
    await navigator.clipboard.writeText(globalThis.location.href);
    alert('Lien copié dans le presse-papier !');
  }
}

// ── Date d'inscription formatée ──────────────────────────────
const memberSince = computed(() => {
  if (!talent.value?.dateInscription) return '—';
  return new Date(talent.value.dateInscription).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// ── Talents similaires (même catégorie, pas le même talent) ──
const similarTalents = ref([]);

// Charge les talents similaires après chargement du profil
watch(talent, async (newTalent) => {
  if (!newTalent) return;
  try {
    const data = await talentsAPI.getAll({
      categorie: newTalent.categorie,
      limit: 4,
    });
    if (data.success) {
      // Exclut le talent courant de la liste
      similarTalents.value = data.talents.filter((t) => t._id !== newTalent._id).slice(0, 3);
    }
  } catch {
    /* silencieux */
  }
});
</script>

<style scoped>
/* ── Boutons de contact ───────────────────────────────────── */
.btn-contact {
  @apply inline-flex items-center gap-2
         px-4 py-2.5 rounded-xl text-sm font-medium
         transition-all duration-200 active:scale-95;
}
.btn-contact--primary {
  @apply bg-primary text-white
         hover:bg-primary-600;
}
.btn-contact--ghost {
  @apply border border-white/20 text-white/70
         hover:border-white/40 hover:text-white hover:bg-white/[0.05];
}

/* ── Tabs ─────────────────────────────────────────────────── */
.tab-btn {
  @apply px-5 py-3 text-sm font-medium
         text-white/40 hover:text-white/70
         border-b-2 border-transparent
         transition-all duration-200
         whitespace-nowrap;
}
.tab-btn--active {
  @apply text-white border-primary;
}

/* ── Titres de section ───────────────────────────────────── */
.section-title {
  @apply font-title text-xl font-bold mb-5
         text-white;
}

/* ── Cards d'info (sidebar) ──────────────────────────────── */
.info-card {
  @apply p-5 rounded-2xl
         bg-white/[0.04] border border-white/[0.08];
}

/* ── Transition des tabs ─────────────────────────────────── */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.2s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Lightbox ────────────────────────────────────────────── */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: all 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
