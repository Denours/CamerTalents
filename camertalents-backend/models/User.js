// ============================================================
//  models/User.js
//  Schéma Mongoose pour les utilisateurs (talents, recruteurs, admins)
//
//  Un "modèle" Mongoose c'est la définition de la structure
//  d'une collection MongoDB. Chaque document dans la collection
//  "users" respectera ce schéma.
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // ── Informations communes à tous les rôles ────────────
    nom: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true, // pas deux comptes avec le même email
      lowercase: true, // stocké toujours en minuscules
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Minimum 6 caractères'],
      select: false, // ← par défaut, le mot de passe n'est PAS
      //   renvoyé dans les requêtes (sécurité)
    },
    role: {
      type: String,
      enum: ['talent', 'recruteur', 'admin'],
      default: 'talent',
    },
    avatar: {
      type: String,
      default: '',
    },

    // ── Champs spécifiques au Talent ──────────────────────
    // talentId pointe vers le document Talent correspondant
    // (le profil public visible dans l'annuaire)
    talentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Talent', // référence au modèle Talent
      default: null,
    },

    // ── Champs spécifiques au Recruteur ───────────────────
    entreprise: { type: String, default: '' },
    poste: { type: String, default: '' },

    // Liste des IDs de talents mis en favoris
    favoris: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Talent',
      },
    ],

    // Liste des IDs de talents dont le profil a été vu (pour les recruteurs)
    vuesTalents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Talent',
      },
    ],
  },
  {
    // timestamps: true → MongoDB ajoute automatiquement
    // createdAt et updatedAt à chaque document
    timestamps: true,
  },
);

// ── Middleware Mongoose : hashage du mot de passe ─────────
// Ce code s'exécute automatiquement AVANT chaque .save()
// Il hash le mot de passe uniquement s'il a été modifié
UserSchema.pre('save', async function () {
  // Si le mot de passe n'a pas changé, on passe au suivant
  if (!this.isModified('password')) return;

  // bcrypt.hash(password, saltRounds)
  // saltRounds = 12 → niveau de sécurité du hashage
  // Plus c'est élevé, plus c'est lent (mais plus sécurisé)
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Méthode d'instance : vérification du mot de passe ────
// Utilisée dans la route de login
// this.password = le hash stocké en base
// candidatePassword = le mot de passe saisi par l'utilisateur
UserSchema.methods.verifierMotDePasse = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ── Méthode pour transformer l'objet en JSON ─────────────
// Retire le mot de passe de toute réponse JSON automatiquement
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
