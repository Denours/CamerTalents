// ============================================================
//  routes/admin.js
//  Routes d'administration (accessibles aux admins uniquement) :
//  GET    /api/admin/stats          ← statistiques globales
//  GET    /api/admin/comptes        ← liste de tous les comptes
//  DELETE /api/admin/comptes/:id    ← supprimer un compte
//  DELETE /api/admin/reset          ← reset complet (dev only)
// ============================================================

const express = require('express');
const User    = require('../models/User');
const Talent  = require('../models/Talent');
const { proteger }  = require('../middleware/auth');
const { autoriser } = require('../middleware/roles');

const router = express.Router();

// Toutes les routes admin nécessitent d'être admin
router.use(proteger, autoriser('admin'));

// ════════════════════════════════════════════════════════════
//  GET /api/admin/stats
//  Statistiques globales de la plateforme
// ════════════════════════════════════════════════════════════
router.get('/stats', async (req, res) => {
  try {
    // Promise.all = exécute toutes les requêtes en parallèle
    // (plus rapide que de les faire une par une)
    const [
      totalTalents,
      totalUsers,
      talentsDisponibles,
      talentsOccupes,
      talentsPartiels,
      repartitionCategories,
      repartitionVilles,
      derniersInscrits,
      noteMoyenne,
    ] = await Promise.all([

      // Nombre total de profils talents
      Talent.countDocuments(),

      // Nombre total de comptes utilisateurs
      User.countDocuments(),

      // Talents par disponibilité
      Talent.countDocuments({ disponibilite: 'disponible' }),
      Talent.countDocuments({ disponibilite: 'occupé' }),
      Talent.countDocuments({ disponibilite: 'partiellement disponible' }),

      // Répartition par catégorie (aggregation MongoDB)
      // $group = regroupe les documents par champ
      // $sum: 1 = compte chaque document
      Talent.aggregate([
        { $group: { _id: '$categorie', count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
      ]),

      // Répartition par ville
      Talent.aggregate([
        { $group: { _id: '$ville', count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 10 },
      ]),

      // 5 derniers inscrits
      Talent.find()
        .select('nom metier ville avatar createdAt')
        .sort({ createdAt: -1 })
        .limit(5),

      // Note moyenne de tous les talents
      Talent.aggregate([
        { $group: { _id: null, moyenne: { $avg: '$note' } } },
      ]),
    ]);

    // Taux de disponibilité
    const tauxDisponibilite = totalTalents > 0
      ? Math.round((talentsDisponibles / totalTalents) * 100)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalTalents,
        totalUsers,
        totalVilles:       repartitionVilles.length,
        tauxDisponibilite,
        noteMoyenne:       noteMoyenne[0]?.moyenne?.toFixed(1) || '0.0',
        disponibilite: {
          disponible:              talentsDisponibles,
          occupe:                  talentsOccupes,
          partiellementDisponible: talentsPartiels,
        },
        repartitionCategories: repartitionCategories.map((c) => ({
          label: c._id,
          count: c.count,
        })),
        repartitionVilles: repartitionVilles.map((v) => ({
          ville: v._id,
          count: v.count,
        })),
        derniersInscrits,
      },
    });
  } catch (error) {
    console.error('Erreur GET /admin/stats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  GET /api/admin/comptes
//  Liste tous les comptes utilisateurs
// ════════════════════════════════════════════════════════════
router.get('/comptes', async (req, res) => {
  try {
    const comptes = await User.find()
      .select('-password -favoris')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comptes });
  } catch (error) {
    console.error('Erreur GET /admin/comptes:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  DELETE /api/admin/comptes/:id
//  Supprimer un compte utilisateur
// ════════════════════════════════════════════════════════════
router.delete('/comptes/:id', async (req, res) => {
  try {
    // Empêche un admin de se supprimer lui-même
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Compte introuvable' });
    }

    // Si c'est un talent, on supprime aussi son profil public
    if (user.talentId) {
      await Talent.findByIdAndDelete(user.talentId);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Compte supprimé avec succès',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Compte introuvable' });
    }
    console.error('Erreur DELETE /admin/comptes/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  DELETE /api/admin/reset
//  Remet la base de données à zéro
//  ⚠️ Disponible uniquement en développement
// ════════════════════════════════════════════════════════════
router.delete('/reset', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Action interdite en production',
    });
  }

  try {
    // Supprime tous les documents SAUF les admins
    await Talent.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } });

    res.status(200).json({
      success: true,
      message: 'Base de données réinitialisée (admins conservés)',
    });
  } catch (error) {
    console.error('Erreur DELETE /admin/reset:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
