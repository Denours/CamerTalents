// ============================================================
//  routes/auth.js
//  Routes d'authentification :
//  POST /api/auth/register/talent    ← inscription talent
//  POST /api/auth/register/recruteur ← inscription recruteur
//  POST /api/auth/login              ← connexion
//  POST /api/auth/logout             ← déconnexion
//  GET  /api/auth/me                 ← profil utilisateur connecté
// ============================================================

const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const Talent  = require('../models/Talent');
const { proteger } = require('../middleware/auth');

const router = express.Router();

// ── Helper : génère un token JWT ──────────────────────────
// jwt.sign(payload, secret, options)
// payload = données stockées dans le token (ici juste l'id)
// Le token expire après JWT_EXPIRES_IN (7 jours dans .env)
function genererToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// ── Helper : envoie la réponse avec le token ─────────────
function envoyerToken(user, statusCode, res) {
  const token = genererToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:           user._id,
      nom:          user.nom,
      email:        user.email,
      role:         user.role,
      avatar:       user.avatar,
      talentId:     user.talentId,
      entreprise:   user.entreprise,
      poste:        user.poste,
      favoris:      user.favoris,
      dateCreation: user.createdAt,
    },
  });
}

// ════════════════════════════════════════════════════════════
//  POST /api/auth/register/talent
//  Inscription d'un nouveau Talent
//  Crée d'abord un User, puis un profil Talent lié
// ════════════════════════════════════════════════════════════
router.post('/register/talent', async (req, res) => {
  try {
    const {
      nom, email, password,
      metier, categorie, ville, quartier, bio,
      telephone, tarifJour, disponibilite,
      competences, portfolio, cvBase64, cvNom, avatar,
    } = req.body;

    // Vérifie si l'email est déjà utilisé
    const existant = await User.findOne({ email: email.toLowerCase() });
    if (existant) {
      return res.status(400).json({
        success: false,
        message: 'Un compte existe déjà avec cet email.',
      });
    }

    // 1. Crée le compte utilisateur
    const user = await User.create({
      nom,
      email,
      password, // sera hashé automatiquement par le middleware pre('save')
      role:      'talent',
      avatar:    avatar || '',
    });

    // 2. Crée le profil public du talent lié au User
    const talent = await Talent.create({
      userId:       user._id,
      nom,
      metier,
      categorie,
      ville,
      quartier:     quartier    || '',
      bio:          bio         || '',
      telephone:    telephone   || '',
      email:        email,
      tarifJour:    tarifJour   || null,
      disponibilite: disponibilite || 'disponible',
      competences:  competences || [],
      portfolio:    portfolio   || [],
      cvBase64:     cvBase64    || '',
      cvNom:        cvNom       || '',
      avatar:       avatar      || '',
    });

    // 3. Met à jour le User avec l'id du profil talent créé
    user.talentId = talent._id;
    await user.save({ validateBeforeSave: false });

    envoyerToken(user, 201, res);
  } catch (error) {
    // Erreur de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    // Email déjà utilisé (erreur MongoDB duplicate key)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un compte existe déjà avec cet email.',
      });
    }
    console.error('Erreur register talent:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  POST /api/auth/register/recruteur
//  Inscription d'un nouveau Recruteur
// ════════════════════════════════════════════════════════════
router.post('/register/recruteur', async (req, res) => {
  try {
    const { nom, email, password, entreprise, poste } = req.body;

    const existant = await User.findOne({ email: email.toLowerCase() });
    if (existant) {
      return res.status(400).json({
        success: false,
        message: 'Un compte existe déjà avec cet email.',
      });
    }

    const user = await User.create({
      nom,
      email,
      password,
      role:       'recruteur',
      entreprise: entreprise || '',
      poste:      poste      || '',
    });

    envoyerToken(user, 201, res);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un compte existe déjà avec cet email.',
      });
    }
    console.error('Erreur register recruteur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  POST /api/auth/login
//  Connexion d'un utilisateur existant
// ════════════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    // On cherche l'utilisateur ET son mot de passe
    // (select: false dans le schéma → on doit le demander explicitement)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Aucun compte trouvé avec cet email.',
      });
    }

    // Vérifie le mot de passe avec bcrypt
    const motDePasseCorrect = await user.verifierMotDePasse(password);
    if (!motDePasseCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect.',
      });
    }

    envoyerToken(user, 200, res);
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  POST /api/auth/logout
//  Déconnexion — côté serveur on ne fait rien de spécial
//  Le client supprime simplement le token de son stockage
// ════════════════════════════════════════════════════════════
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie',
  });
});

// ════════════════════════════════════════════════════════════
//  GET /api/auth/me
//  Retourne le profil de l'utilisateur connecté
//  Route protégée → nécessite un token valide
// ════════════════════════════════════════════════════════════
router.get('/me', proteger, async (req, res) => {
  try {
    // req.user est attaché par le middleware proteger()
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id:           user._id,
        nom:          user.nom,
        email:        user.email,
        role:         user.role,
        avatar:       user.avatar,
        talentId:     user.talentId,
        entreprise:   user.entreprise,
        poste:        user.poste,
        favoris:      user.favoris,
        dateCreation: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Erreur /me:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
