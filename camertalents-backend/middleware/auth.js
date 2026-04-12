// ============================================================
//  middleware/auth.js
//  Middleware de vérification du token JWT
//
//  Un "middleware" Express c'est une fonction qui s'exécute
//  entre la réception d'une requête et l'envoi de la réponse.
//  Ici il vérifie que l'utilisateur est bien connecté
//  avant de lui donner accès à une route protégée.
//
//  JWT (JSON Web Token) : c'est un token signé que le serveur
//  génère lors de la connexion. Le client le stocke et l'envoie
//  dans chaque requête. Le serveur vérifie la signature pour
//  confirmer que le token est authentique.
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Middleware principal : protège une route ──────────────
const proteger = async (req, res, next) => {
  try {
    let token;

    // Le token est envoyé dans le header Authorization
    // Format : "Bearer eyJhbGciOi..."
    token = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization?.split(' ')?.[1]
      : undefined;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé — token manquant',
      });
    }

    // jwt.verify() décode et vérifie la signature du token
    // Si le token est expiré ou falsifié, il lance une erreur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On récupère l'utilisateur depuis la base
    // (le mot de passe n'est pas sélectionné grâce à select: false)
    const utilisateur = await User.findById(decoded.id);

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable — token invalide',
      });
    }

    // On attache l'utilisateur à l'objet req pour
    // que la route suivante puisse y accéder via req.user
    req.user = utilisateur;
    next(); // passe au prochain middleware ou à la route
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré ' + error,
    });
  }
};

module.exports = { proteger };
