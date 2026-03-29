// ============================================================
//  middleware/roles.js
//  Middleware de vérification des rôles
//
//  Utilisé APRÈS le middleware proteger().
//  Exemple d'usage sur une route :
//    router.delete('/:id', proteger, autoriser('admin'), supprimerTalent)
//
//  autoriser('admin') → seuls les admins peuvent accéder
//  autoriser('talent', 'admin') → talents ET admins peuvent accéder
// ============================================================

const autoriser = (...roles) => {
  return (req, res, next) => {
    // req.user est attaché par le middleware proteger()
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé — rôle '${req.user.role}' non autorisé pour cette action`,
      });
    }
    next();
  };
};

module.exports = { autoriser };
