<template>
  <main class="min-h-screen bg-[#0F0A1E] text-white pb-24">
    <!-- ════════════════════════════════════════════
         HEADER
    ════════════════════════════════════════════ -->
    <section class="relative py-12 border-b border-white/[0.06] overflow-hidden">
      <div class="absolute top-0 left-0 w-96 h-96 bg-red-500/8 blur-[100px] pointer-events-none" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                stroke-width="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p class="text-red-400 text-sm font-semibold tracking-widest uppercase mb-1">
                Administration
              </p>
              <h1 class="font-title text-3xl font-bold">Panneau d'administration</h1>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Indicateur admin connecté -->
            <div
              class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span class="text-sm text-red-400 font-medium">
                {{ authStore.displayName }}
              </span>
            </div>
            <!-- Déconnexion -->
            <button
              @click="handleLogout"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-white/50 text-sm hover:border-red-500/40 hover:text-red-400 transition-all duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>

        <!-- Tabs de navigation -->
        <div class="flex gap-1 mt-8 border-b border-white/[0.06]">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap"
            :class="
              activeTab === tab.id
                ? 'border-red-400 text-white'
                : 'border-transparent text-white/40 hover:text-white/70'
            "
          >
            <span>{{ tab.emoji }}</span>
            {{ tab.label }}
            <span
              v-if="tab.count !== undefined"
              class="px-1.5 py-0.5 rounded text-[10px] font-mono"
              :class="
                activeTab === tab.id
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/[0.06] text-white/30'
              "
            >
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- ════════════════════════════════════════════
           TAB 1 : VUE D'ENSEMBLE
      ════════════════════════════════════════════ -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'overview'" key="overview" class="space-y-8">
          <!-- KPI Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="(kpi, i) in kpis"
              :key="kpi.label"
              class="admin-kpi-card"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: i * 80 } }"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-2xl">{{ kpi.emoji }}</span>
                <span
                  class="text-xs font-mono px-2 py-0.5 rounded-lg"
                  :class="kpi.up ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'"
                >
                  {{ kpi.trend }}
                </span>
              </div>
              <p class="font-mono text-3xl font-bold text-white mb-1">
                {{ kpi.value }}
              </p>
              <p class="text-xs text-white/40">{{ kpi.label }}</p>
            </div>
          </div>

          <!-- Répartition + Activité récente -->
          <div class="grid lg:grid-cols-2 gap-6">
            <!-- Répartition par catégorie -->
            <div class="admin-card">
              <h2 class="admin-card__title mb-5">Répartition par catégorie</h2>
              <div class="space-y-3">
                <div
                  v-for="(item, i) in repartitionCategories"
                  :key="item.label"
                  class="space-y-1.5"
                >
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/60">
                      {{ catEmojis[item.label] }} {{ item.label }}
                    </span>
                    <span class="font-mono text-white/50">
                      {{ item.count }}
                    </span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/[0.06]">
                    <div
                      class="h-full rounded-full transition-all duration-700"
                      :style="`
                           width: ${(item.count / maxCatCount) * 100}%;
                           background: ${barColors[i % barColors.length]};
                           transition-delay: ${i * 80}ms
                         `"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Dernières inscriptions -->
            <div class="admin-card">
              <h2 class="admin-card__title mb-5">Dernières inscriptions</h2>
              <div class="space-y-3">
                <div
                  v-for="talent in derniersInscrits"
                  :key="talent.id"
                  class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <img
                    :src="talent.avatar"
                    :alt="talent.nom"
                    class="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">
                      {{ talent.nom }}
                    </p>
                    <p class="text-xs text-white/40 truncate">
                      {{ talent.metier }} · {{ talent.ville }}
                    </p>
                  </div>
                  <span class="text-[10px] text-white/25 flex-shrink-0">
                    {{ formatDate(talent.dateInscription) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ════════════════════════════════════════════
           TAB 2 : GESTION DES TALENTS
      ════════════════════════════════════════════ -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'talents'" key="talents" class="space-y-6">
          <!-- Barre d'outils -->
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Recherche -->
              <div class="relative">
                <svg
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  v-model="searchAdmin"
                  type="text"
                  placeholder="Rechercher un talent..."
                  class="pl-9 pr-4 py-2 rounded-xl text-sm w-64 bg-white/[0.06] border border-white/[0.10] text-white placeholder-white/30 focus:outline-none focus:border-red-500/40 transition-all duration-200"
                />
              </div>
              <!-- Filtre statut -->
              <select
                v-model="filtreStatutAdmin"
                class="px-3 py-2 rounded-xl text-sm bg-white/[0.06] border border-white/[0.10] text-white/60 focus:outline-none focus:border-red-500/40 transition-all duration-200 cursor-pointer"
              >
                <option value="tous">Tous les statuts</option>
                <option value="disponible">Disponibles</option>
                <option value="occupé">Occupés</option>
                <option value="partiellement disponible">Partiels</option>
              </select>
            </div>
            <!-- Compteur -->
            <p class="text-sm text-white/40">
              {{ talentsFiltresAdmin.length }} talent{{ talentsFiltresAdmin.length > 1 ? 's' : '' }}
            </p>
          </div>

          <!-- Tableau des talents -->
          <div class="admin-card overflow-hidden p-0">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-white/[0.06]">
                    <th class="admin-th text-left px-6 py-4">Talent</th>
                    <th class="admin-th text-left px-4 py-4 hidden md:table-cell">Catégorie</th>
                    <th class="admin-th text-left px-4 py-4 hidden lg:table-cell">Ville</th>
                    <th class="admin-th text-right px-4 py-4">Statut</th>
                    <th class="admin-th text-right px-4 py-4 hidden sm:table-cell">Note</th>
                    <th class="admin-th text-right px-4 py-4 hidden sm:table-cell">Vues</th>
                    <th class="admin-th text-right px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="talent in talentsFiltresAdmin"
                    :key="talent.id"
                    class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <!-- Talent -->
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img
                          :src="talent.avatar"
                          :alt="talent.nom"
                          class="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <p class="text-sm font-medium text-white">
                            {{ talent.nom }}
                          </p>
                          <p class="text-xs text-white/40">
                            {{ talent.metier }}
                          </p>
                        </div>
                      </div>
                    </td>

                    <!-- Catégorie -->
                    <td class="px-4 py-4 hidden md:table-cell">
                      <span class="text-xs text-white/50">
                        {{ talent.categorie }}
                      </span>
                    </td>

                    <!-- Ville -->
                    <td class="px-4 py-4 hidden lg:table-cell">
                      <span class="text-xs text-white/50">{{ talent.ville }}</span>
                    </td>

                    <!-- Statut -->
                    <td class="px-4 py-4 text-right">
                      <span
                        class="text-xs px-2.5 py-1 rounded-lg font-medium"
                        :class="
                          talent.disponibilite === 'disponible'
                            ? 'bg-green-500/15 text-green-400'
                            : talent.disponibilite === 'occupé'
                              ? 'bg-red-500/15 text-red-400'
                              : 'bg-yellow-500/15 text-yellow-400'
                        "
                      >
                        {{
                          talent.disponibilite === 'disponible'
                            ? 'Dispo.'
                            : talent.disponibilite === 'occupé'
                              ? 'Occupé'
                              : 'Partiel'
                        }}
                      </span>
                    </td>

                    <!-- Note -->
                    <td class="px-4 py-4 text-right hidden sm:table-cell">
                      <span class="font-mono text-sm text-yellow-400">
                        ★ {{ talent.note.toFixed(1) }}
                      </span>
                    </td>

                    <!-- Vues -->
                    <td class="px-4 py-4 text-right hidden sm:table-cell">
                      <span class="font-mono text-sm text-white/40">
                        {{ talent.vues }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <!-- Voir le profil -->
                        <RouterLink
                          :to="`/talent/${talent.id}`"
                          class="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
                          title="Voir le profil"
                        >
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
                        </RouterLink>
                        <!-- Supprimer (uniquement addedTalents) -->
                        <button
                          v-if="isAddedTalent(talent.id)"
                          @click="confirmerSuppression(talent)"
                          class="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200"
                          title="Supprimer le profil"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path
                              d="M19 6v14a2 2 0 0 1-2 2H7
                                     a2 2 0 0 1-2-2V6m3 0V4
                                     a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                            />
                          </svg>
                        </button>
                        <!-- Label "Mock" pour les talents non modifiables -->
                        <span
                          v-else
                          class="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/20 border border-white/[0.06]"
                        >
                          mock
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ════════════════════════════════════════════
           TAB 3 : COMPTES UTILISATEURS
      ════════════════════════════════════════════ -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'comptes'" key="comptes" class="space-y-6">
          <div class="admin-card">
            <h2 class="admin-card__title mb-6">Comptes inscrits</h2>

            <div v-if="comptesInscrits.length === 0" class="text-center py-12 text-white/30">
              <div class="text-4xl mb-3">👥</div>
              <p>Aucun compte inscrit pour l'instant.</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="compte in comptesInscrits"
                :key="compte.id"
                class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
              >
                <!-- Avatar -->
                <div
                  class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                  :class="compte.role === 'talent' ? 'bg-primary/15' : 'bg-secondary/15'"
                >
                  <img
                    v-if="compte.avatar"
                    :src="compte.avatar"
                    alt="avatar"
                    class="w-full h-full object-cover"
                    @error="$event.target.style.display = 'none'"
                  />
                  <span
                    v-else
                    class="font-bold text-sm"
                    :class="compte.role === 'talent' ? 'text-primary-100' : 'text-secondary'"
                  >
                    {{ compte.nom.charAt(0).toUpperCase() }}
                  </span>
                </div>

                <!-- Infos -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-medium text-white">
                      {{ compte.nom }}
                    </p>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="
                        compte.role === 'talent'
                          ? 'bg-primary/15 text-primary-100'
                          : compte.role === 'admin'
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-secondary/15 text-secondary'
                      "
                    >
                      {{ compte.role.toUpperCase() }}
                    </span>
                  </div>
                  <p class="text-xs text-white/40 truncate">
                    {{ compte.email }}
                    <span v-if="compte.entreprise" class="text-white/25">
                      · {{ compte.entreprise }}
                    </span>
                  </p>
                </div>

                <!-- Date -->
                <span class="text-xs text-white/25 flex-shrink-0">
                  {{ formatDate(compte.dateCreation) }}
                </span>

                <!-- Supprimer compte -->
                <button
                  v-if="compte.id !== authStore.user?.id"
                  @click="supprimerCompte(compte)"
                  class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  title="Supprimer ce compte"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6
                             m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Comptes démo (lecture seule) -->
          <div class="admin-card">
            <h2 class="admin-card__title mb-2">Comptes de démonstration</h2>
            <p class="text-xs text-white/30 mb-5">Préconfigurés — non modifiables</p>
            <div class="space-y-2">
              <div
                v-for="demo in comptesDemos"
                :key="demo.email"
                class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <span class="text-lg flex-shrink-0">{{ demo.emoji }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white/70">{{ demo.label }}</p>
                  <p class="text-xs text-white/30 font-mono">{{ demo.email }}</p>
                </div>
                <span
                  class="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.06]"
                >
                  demo
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ════════════════════════════════════════════
           TAB 4 : PARAMÈTRES
      ════════════════════════════════════════════ -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'settings'" key="settings" class="space-y-6">
          <!-- Danger zone -->
          <div class="admin-card border-red-500/20">
            <h2 class="admin-card__title text-red-400 mb-2">⚠️ Zone dangereuse</h2>
            <p class="text-sm text-white/40 mb-6">
              Ces actions sont irréversibles. Procède avec prudence.
            </p>
            <div class="space-y-4">
              <!-- Supprimer tous les talents ajoutés -->
              <div
                class="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10"
              >
                <div>
                  <p class="text-sm font-medium text-white">Supprimer tous les profils créés</p>
                  <p class="text-xs text-white/40 mt-0.5">
                    Supprime uniquement les talents inscrits via l'onboarding. Les données mock sont
                    conservées.
                  </p>
                </div>
                <button
                  @click="supprimerTousLesTalents"
                  class="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-medium flex-shrink-0 hover:bg-red-500/25 transition-all duration-200"
                >
                  Supprimer
                </button>
              </div>

              <!-- Supprimer tous les comptes inscrits -->
              <div
                class="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10"
              >
                <div>
                  <p class="text-sm font-medium text-white">Supprimer tous les comptes inscrits</p>
                  <p class="text-xs text-white/40 mt-0.5">
                    Supprime tous les comptes créés via l'inscription. Les comptes démo sont
                    conservés.
                  </p>
                </div>
                <button
                  @click="supprimerTousLesComptes"
                  class="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-medium flex-shrink-0 hover:bg-red-500/25 transition-all duration-200"
                >
                  Supprimer
                </button>
              </div>

              <!-- Reset complet -->
              <div
                class="flex items-center justify-between p-4 rounded-xl bg-red-500/8 border border-red-500/15"
              >
                <div>
                  <p class="text-sm font-medium text-red-300">Reset complet de la plateforme</p>
                  <p class="text-xs text-white/40 mt-0.5">
                    Efface toutes les données : profils, comptes, favoris. Remet la plateforme à son
                    état initial.
                  </p>
                </div>
                <button
                  @click="resetComplet"
                  class="px-4 py-2 rounded-xl bg-red-500/25 border border-red-500/40 text-red-300 text-sm font-bold flex-shrink-0 hover:bg-red-500/35 transition-all duration-200"
                >
                  Reset total
                </button>
              </div>
            </div>
          </div>

          <!-- Infos de la plateforme -->
          <div class="admin-card">
            <h2 class="admin-card__title mb-5">Informations plateforme</h2>
            <div class="space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-white/[0.05]">
                <span class="text-sm text-white/40">Nom</span>
                <span class="text-sm text-white font-medium">CamerTalents</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-white/[0.05]">
                <span class="text-sm text-white/40">Version</span>
                <span class="font-mono text-sm text-white">1.0.0-beta</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-white/[0.05]">
                <span class="text-sm text-white/40">Stack</span>
                <span class="text-sm text-white">Vue.js 3 + Pinia</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-white/[0.05]">
                <span class="text-sm text-white/40">Talents mock</span>
                <span class="font-mono text-sm text-white">
                  {{ mockTalentsCount }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm text-white/40">Talents inscrits</span>
                <span class="font-mono text-sm text-white">
                  {{ talentStore.addedTalents.length }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ════════════════════════════════════════════
         MODALE CONFIRMATION SUPPRESSION TALENT
    ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="talentASupprimer"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          @click.self="talentASupprimer = null"
        >
          <div
            class="w-full max-w-sm bg-[#1A1230] border border-red-500/20 rounded-2xl p-8 text-center"
            v-motion
            :initial="{ scale: 0.9, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { duration: 300 } }"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-5"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                stroke-width="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6
                         m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                />
              </svg>
            </div>
            <h3 class="font-title text-xl font-bold mb-2">Supprimer ce profil ?</h3>
            <p class="text-white/50 text-sm mb-8">
              Le profil de
              <strong class="text-white">{{ talentASupprimer?.nom }}</strong>
              sera définitivement supprimé. Cette action est irréversible.
            </p>
            <div class="flex gap-3">
              <button
                @click="talentASupprimer = null"
                class="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 text-sm font-medium hover:border-white/40 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                @click="executerSuppression"
                class="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-all duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useTalentStore } from '@/stores/talentStore';
import { useStats } from '@/composables/useStats';
import { mockTalents } from '@/data/mockData';

const router = useRouter();
const authStore = useAuthStore();
const talentStore = useTalentStore();
const { talentsByCategory } = useStats();

// ── Tabs ─────────────────────────────────────────────────────
const activeTab = ref('overview');

const tabs = computed(() => [
  {
    id: 'overview',
    emoji: '📊',
    label: "Vue d'ensemble",
  },
  {
    id: 'talents',
    emoji: '👤',
    label: 'Talents',
    count: talentStore.talents.length,
  },
  {
    id: 'comptes',
    emoji: '🔑',
    label: 'Comptes',
    count: comptesInscrits.value.length,
  },
  {
    id: 'settings',
    emoji: '⚙️',
    label: 'Paramètres',
  },
]);

// ── KPIs ─────────────────────────────────────────────────────
const kpis = computed(() => [
  {
    emoji: '👤',
    value: talentStore.talents.length,
    label: 'Total talents',
    trend: `+${talentStore.addedTalents.length} inscrits`,
    up: true,
  },
  {
    emoji: '🟢',
    value: talentStore.talents.filter((t) => t.disponibilite === 'disponible').length,
    label: 'Disponibles',
    trend: `${Math.round(
      (talentStore.talents.filter((t) => t.disponibilite === 'disponible').length /
        talentStore.talents.length) *
        100,
    )}%`,
    up: true,
  },
  {
    emoji: '🔑',
    value: comptesInscrits.value.length,
    label: 'Comptes inscrits',
    trend: 'Hors démos',
    up: true,
  },
  {
    emoji: '⭐',
    value:
      talentStore.talents.length > 0
        ? (
            talentStore.talents.reduce((s, t) => s + t.note, 0) / talentStore.talents.length
          ).toFixed(1)
        : '—',
    label: 'Note moyenne',
    trend: 'Stable',
    up: null,
  },
]);

// ── Répartition catégories ───────────────────────────────────
const barColors = ['#6C3CE1', '#F97316', '#EC4899', '#06B6D4', '#22C55E', '#EAB308'];

const catEmojis = {
  'Tech & Digital': '💻',
  'Artisanat & BTP': '🔨',
  'Créatif & Art': '🎨',
  'Éducation & Formation': '📚',
  'Services & Lifestyle': '🍳',
  'Transport & Logistique': '🚗',
};

const repartitionCategories = computed(() =>
  Object.entries(talentsByCategory.value)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count),
);

const maxCatCount = computed(() => Math.max(...repartitionCategories.value.map((c) => c.count), 1));

// ── Derniers inscrits ────────────────────────────────────────
const derniersInscrits = computed(() =>
  [...talentStore.talents]
    .sort((a, b) => new Date(b.dateInscription) - new Date(a.dateInscription))
    .slice(0, 5),
);

// ── Gestion talents ──────────────────────────────────────────
const searchAdmin = ref('');
const filtreStatutAdmin = ref('tous');
const talentASupprimer = ref(null);

const talentsFiltresAdmin = computed(() => {
  let results = [...talentStore.talents];
  if (searchAdmin.value.trim()) {
    const q = searchAdmin.value.toLowerCase();
    results = results.filter(
      (t) =>
        t.nom.toLowerCase().includes(q) ||
        t.metier.toLowerCase().includes(q) ||
        t.ville.toLowerCase().includes(q),
    );
  }
  if (filtreStatutAdmin.value !== 'tous') {
    results = results.filter((t) => t.disponibilite === filtreStatutAdmin.value);
  }
  return results;
});

function isAddedTalent(id) {
  return talentStore.addedTalents.some((t) => t.id === id);
}

function confirmerSuppression(talent) {
  talentASupprimer.value = talent;
}

function executerSuppression() {
  if (!talentASupprimer.value) return;
  talentStore.removeTalent(talentASupprimer.value.id);
  talentASupprimer.value = null;
}

// ── Gestion comptes ──────────────────────────────────────────
const comptesInscrits = computed(() => {
  try {
    const raw = localStorage.getItem('camertalents_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
});

const comptesDemos = [
  { emoji: '🛡️', label: 'Administrateur', email: 'admin@camertalents.cm' },
  { emoji: '🏢', label: 'Recruteur — Marie T.', email: 'recruteur@demo.cm' },
  { emoji: '🎨', label: 'Talent — Kamga J-P', email: 'talent@demo.cm' },
];

function supprimerCompte(compte) {
  try {
    const accounts = JSON.parse(localStorage.getItem('camertalents_accounts') || '[]');
    const filtered = accounts.filter((a) => a.id !== compte.id);
    localStorage.setItem('camertalents_accounts', JSON.stringify(filtered));
    // Force le rechargement du computed
    globalThis.dispatchEvent(new Event('storage'));
  } catch {
    /* silencieux */
  }
}

// ── Paramètres — Actions dangereuses ─────────────────────────
function supprimerTousLesTalents() {
  if (!confirm('Supprimer tous les profils créés ?')) return;
  talentStore.clearAddedTalents();
}

function supprimerTousLesComptes() {
  if (!confirm('Supprimer tous les comptes inscrits ?')) return;
  localStorage.removeItem('camertalents_accounts');
  globalThis.dispatchEvent(new Event('storage'));
}

function resetComplet() {
  if (!confirm('Reset complet ? Cette action est irréversible !')) return;
  talentStore.clearAddedTalents();
  localStorage.removeItem('camertalents_accounts');
  localStorage.removeItem('camertalents_user');
  authStore.logout();
  router.push('/');
}

// ── Infos mock ───────────────────────────────────────────────
const mockTalentsCount = mockTalents.length;

// ── Helpers ──────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

// ── Déconnexion ──────────────────────────────────────────────
function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>

<style scoped>
.admin-kpi-card {
  @apply p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]
         hover:border-red-500/20 transition-all duration-300;
}

.admin-card {
  @apply p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08];
}

.admin-card__title {
  @apply font-title text-base font-bold text-white;
}

.admin-th {
  @apply text-xs font-semibold text-white/30 uppercase tracking-widest;
}

.tab-fade-enter-active {
  transition: all 0.25s ease;
}
.tab-fade-leave-active {
  transition: all 0.15s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.tab-fade-leave-to {
  opacity: 0;
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
