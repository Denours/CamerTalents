// ============================================================
//  models/Talent.js
//  Schéma Mongoose pour les profils publics des talents
//
//  Séparé du modèle User car :
//  - Un User "talent" a des infos privées (email, password)
//  - Un Talent a des infos publiques (compétences, portfolio...)
//  - La séparation permet de renvoyer le profil public
//    sans exposer les données sensibles
// ============================================================

const mongoose = require('mongoose');

// ── Sous-schéma : une compétence ──────────────────────────
const CompetenceSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    niveau: { type: Number, min: 0, max: 100, default: 50 },
  },
  { _id: false }, // pas besoin d'un _id pour chaque compétence
);

// ── Schéma principal ──────────────────────────────────────
const TalentSchema = new mongoose.Schema(
  {
    // Lien vers le User propriétaire de ce profil
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // un user = un seul profil talent
    },

    // ── Infos de base ─────────────────────────────────────
    nom: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    metier: {
      type: String,
      required: [true, 'Le métier est requis'],
      trim: true,
    },
    categorie: {
      type: String,
      enum: [
        'Tech & Digital',
        'Artisanat & BTP',
        'Créatif & Art',
        'Éducation & Formation',
        'Services & Lifestyle',
        'Transport & Logistique',
      ],
      required: [true, 'La catégorie est requise'],
    },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 400 },

    // ── Localisation ──────────────────────────────────────
    ville: {
      type: String,
      enum: [
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
      ],
      required: [true, 'La ville est requise'],
    },
    quartier: { type: String, default: '', trim: true },

    // ── Disponibilité & contact ───────────────────────────
    disponibilite: {
      type: String,
      enum: ['disponible', 'occupé', 'partiellement disponible'],
      default: 'disponible',
    },
    telephone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    tarifJour: { type: Number, default: null, min: 0 },

    // ── Compétences ───────────────────────────────────────
    competences: {
      type: [CompetenceSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 6,
        message: 'Maximum 6 compétences',
      },
    },

    // ── Portfolio ─────────────────────────────────────────
    // Tableau d'URLs d'images hébergées
    portfolio: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'Maximum 5 images de portfolio',
      },
    },

    // ── CV ────────────────────────────────────────────────
    // Stocké en base64 (string) — fonctionnel pour commencer
    // En production on préférera stocker le fichier sur S3/Cloudinary
    cvBase64: { type: String, default: '' },
    cvNom: { type: String, default: '' },

    // ── Date d'inscription ────────────────────────────────
    dateInscription: {
      type: Date,
      default: Date.now, // Par défaut = date du jour
    },

    // ── Métriques ─────────────────────────────────────────
    vues: { type: Number, default: 0, min: 0 },
    note: { type: Number, default: 0, min: 0, max: 5 },
    avis: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true, // createdAt, updatedAt automatiques
  },
);

// ── Index pour accélérer les recherches ──────────────────
// MongoDB utilise ces index pour trouver les documents
// plus rapidement (comme un index dans un livre)
TalentSchema.index({ categorie: 1 });
TalentSchema.index({ ville: 1 });
TalentSchema.index({ disponibilite: 1 });
TalentSchema.index({ note: -1 }); // -1 = ordre décroissant
// Index "texte" pour la recherche full-text sur nom, métier
TalentSchema.index({ nom: 'text', metier: 'text' });

module.exports = mongoose.model('Talent', TalentSchema);
