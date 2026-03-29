// ============================================================
//  routes/recruteur.js
//  Routes du recruteur :
//  GET    /api/recruteur/favoris      ← liste des talents favoris
//  POST   /api/recruteur/favoris/:id  ← ajouter aux favoris
//  DELETE /api/recruteur/favoris/:id  ← retirer des favoris
// ============================================================

const express = require('express');
const User    = require('../models/User');
const Talent  = require('../models/Talent');
const { proteger }  = require('../middleware/auth');
const { autoriser } = require('../middleware/roles');

const router = express.Router();

// Toutes les routes recruteur nécessitent d'être connecté
// et d'avoir le rôle 'recruteur'
router.use(proteger, autoriser('recruteur'));

// ════════════════════════════════════════════════════════════
//  GET /api/recruteur/favoris
//  Retourne les profils complets des talents favoris
// ════════════════════════════════════════════════════════════
router.get('/favoris', async (req, res) => {
  try {
    // req.user.favoris = tableau d'IDs (ObjectId)
    // On récupère les profils complets de chaque favori
    // .select('-cvBase64') → exclut le CV (trop lourd pour la liste)
    const favoris = await Talent.find({
      _id: { $in: req.user.favoris },
    }).select('-cvBase64');

    res.status(200).json({ success: true, favoris });
  } catch (error) {
    console.error('Erreur GET /recruteur/favoris:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  POST /api/recruteur/favoris/:id
//  Ajoute un talent aux favoris du recruteur
// ════════════════════════════════════════════════════════════
router.post('/favoris/:id', async (req, res) => {
  try {
    const talentId = req.params.id;

    // Vérifie que le talent existe
    const talent = await Talent.findById(talentId);
    if (!talent) {
      return res.status(404).json({ success: false, message: 'Talent introuvable' });
    }

    // Vérifie que le talent n'est pas déjà dans les favoris
    const dejaFavori = req.user.favoris.some(
      (id) => id.toString() === talentId,
    );
    if (dejaFavori) {
      return res.status(400).json({
        success: false,
        message: 'Ce talent est déjà dans vos favoris',
      });
    }

    // $addToSet = ajoute à un tableau uniquement si l'élément n'y est pas
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favoris: talentId } },
      { new: true }, // retourne le document mis à jour
    );

    res.status(200).json({
      success: true,
      message: 'Talent ajouté aux favoris',
      favoris: user.favoris,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Talent introuvable' });
    }
    console.error('Erreur POST /recruteur/favoris/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  DELETE /api/recruteur/favoris/:id
//  Retire un talent des favoris du recruteur
// ════════════════════════════════════════════════════════════
router.delete('/favoris/:id', async (req, res) => {
  try {
    // $pull = retire un élément d'un tableau MongoDB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favoris: req.params.id } },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: 'Talent retiré des favoris',
      favoris: user.favoris,
    });
  } catch (error) {
    console.error('Erreur DELETE /recruteur/favoris/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
