// ============================================================
//  src/data/constants.js
//  Constantes statiques de l'application
//  (listes qui ne changent pas, pas besoin d'API pour ça)
//
//  On garde ces données en frontend car elles définissent
//  l'interface (options des filtres, formulaires, etc.)
//  Elles correspondent exactement aux enums dans Talent.js
// ============================================================

export const CATEGORIES = [
  'Tech & Digital',
  'Artisanat & BTP',
  'Créatif & Art',
  'Éducation & Formation',
  'Services & Lifestyle',
  'Transport & Logistique',
];

export const VILLES = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Bamenda',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
  'Buea',
  'Limbé',
  'Kribi',
];

export const DISPONIBILITES = ['disponible', 'occupé', 'partiellement disponible'];

// Coordonnées GPS des villes pour la carte Leaflet
export const VILLES_COORDS = [
  { ville: 'Douala', lat: 4.0511, lng: 9.7679 },
  { ville: 'Yaoundé', lat: 3.848, lng: 11.5021 },
  { ville: 'Bafoussam', lat: 5.4737, lng: 10.4174 },
  { ville: 'Bamenda', lat: 5.9527, lng: 10.1582 },
  { ville: 'Garoua', lat: 9.3017, lng: 13.3921 },
  { ville: 'Maroua', lat: 10.595, lng: 14.315 },
  { ville: 'Ngaoundéré', lat: 7.3167, lng: 13.5833 },
  { ville: 'Buea', lat: 4.1527, lng: 9.2408 },
  { ville: 'Limbé', lat: 4.0167, lng: 9.2 },
  { ville: 'Kribi', lat: 2.9398, lng: 9.9077 },
];

// Données de croissance mensuelle pour le dashboard
// (restent simulées — les vraies viendront du backend plus tard)
export const GROWTH_DATA = [
  { month: 'Jan', inscriptions: 45 },
  { month: 'Fév', inscriptions: 62 },
  { month: 'Mar', inscriptions: 78 },
  { month: 'Avr', inscriptions: 91 },
  { month: 'Mai', inscriptions: 110 },
  { month: 'Jun', inscriptions: 134 },
  { month: 'Jul', inscriptions: 158 },
  { month: 'Aoû', inscriptions: 172 },
  { month: 'Sep', inscriptions: 201 },
  { month: 'Oct', inscriptions: 228 },
  { month: 'Nov', inscriptions: 256 },
  { month: 'Déc', inscriptions: 289 },
];
