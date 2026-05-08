// ============================================================
//  routes/talents.js
//  Routes des profils talents :
//  GET    /api/talents           ← liste avec filtres/pagination
//  GET    /api/talents/:id       ← profil d'un talent
//  PUT    /api/talents/:id       ← modifier son profil (talent connecté)
//  DELETE /api/talents/:id       ← supprimer un profil (admin)
//  POST   /api/talents/:id/vue   ← incrémenter le compteur de vues
// ============================================================

const express = require('express');
const Talent = require('../models/Talent');
const User = require('../models/User');
const { proteger } = require('../middleware/auth');
const { autoriser } = require('../middleware/roles');

const router = express.Router();

// ════════════════════════════════════════════════════════════
//  GET /api/talents
//  Récupère tous les talents avec filtres, recherche, pagination
//  Route PUBLIQUE (pas besoin d'être connecté)
// ════════════════════════════════════════════════════════════
router.get('/', async (req, res) => {
  try {
    // ── Lecture des paramètres de requête (query params) ──
    // Ex: GET /api/talents?categorie=Tech&ville=Douala&page=2
    const {
      search,
      categorie,
      ville,
      disponibilite,
      minNote,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    // ── Construction du filtre MongoDB ────────────────────
    const filtre = {};

    // Recherche full-text sur nom et métier
    if (search?.trim()) {
      filtre.$text = { $search: search.trim() };
    }

    if (categorie && categorie !== 'Tous') {
      filtre.categorie = categorie;
    }

    if (ville && ville !== 'Toutes') {
      filtre.ville = ville;
    }

    if (disponibilite) {
      filtre.disponibilite = disponibilite;
    }

    if (minNote && Number.parseFloat(minNote) > 0) {
      filtre.note = { $gte: Number.parseFloat(minNote) };
    }

    // ── Tri ───────────────────────────────────────────────
    const sortOptions = {};
    const sortOrder = order === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'note':
        sortOptions.note = sortOrder;
        break;
      case 'vues':
        sortOptions.vues = sortOrder;
        break;
      case 'recent':
        sortOptions.createdAt = sortOrder;
        break;
      default:
        sortOptions.createdAt = sortOrder;
        break;
    }

    // ── Pagination ────────────────────────────────────────
    // skip = combien de documents sauter (page 2 = sauter les 12 premiers)
    const pageNum = Number.parseInt(page);
    const limitNum = Number.parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ── Exécution de la requête ───────────────────────────
    // .select('-cvBase64') → on exclut le CV de la liste
    // (trop lourd, on le charge seulement sur le profil individuel)
    const [talents, total] = await Promise.all([
      Talent.find(filtre).select('-cvBase64').sort(sortOptions).skip(skip).limit(limitNum),
      Talent.countDocuments(filtre),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      talents,
    });
  } catch (error) {
    console.error('Erreur GET /talents:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  GET /api/talents/:id
//  Récupère le profil complet d'un talent (avec CV)
//  Route PUBLIQUE
// ════════════════════════════════════════════════════════════
router.get('/:id', async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent introuvable',
      });
    }

    res.status(200).json({ success: true, talent });
  } catch (error) {
    // CastError = l'id fourni n'est pas un ObjectId MongoDB valide
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Talent introuvable' });
    }
    console.error('Erreur GET /talents/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  PUT /api/talents/:id
//  Modifier son propre profil talent
//  Route PROTÉGÉE → talent connecté (ou admin)
// ════════════════════════════════════════════════════════════
router.put('/:id', proteger, autoriser('talent', 'admin'), async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({ success: false, message: 'Talent introuvable' });
    }

    // Vérifie que le talent connecté modifie bien SON profil
    // (sauf si c'est un admin qui peut tout modifier)
    if (req.user.role !== 'admin' && talent.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez modifier que votre propre profil',
      });
    }

    // Champs autorisés à la modification
    const champsModifiables = [
      'nom',
      'metier',
      'categorie',
      'ville',
      'quartier',
      'bio',
      'telephone',
      'email',
      'tarifJour',
      'disponibilite',
      'competences',
      'portfolio',
      'cvBase64',
      'cvNom',
      'avatar',
    ];

    // On ne met à jour que les champs envoyés dans la requête
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        talent[champ] = req.body[champ];
      }
    });

    const talentMisAJour = await talent.save();

    // Si l'avatar a changé, on met aussi à jour le User
    if (req.body.avatar !== undefined) {
      await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar });
    }

    res.status(200).json({ success: true, talent: talentMisAJour });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Erreur PUT /talents/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  DELETE /api/talents/:id
//  Supprimer un profil talent
//  Route PROTÉGÉE → admin uniquement
// ════════════════════════════════════════════════════════════
router.delete('/:id', proteger, autoriser('admin'), async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({ success: false, message: 'Talent introuvable' });
    }

    // Supprime le profil talent
    await Talent.findByIdAndDelete(req.params.id);

    // Met à jour le User associé (retire le talentId)
    await User.findByIdAndUpdate(talent.userId, { talentId: null });

    res.status(200).json({
      success: true,
      message: 'Profil talent supprimé avec succès',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Talent introuvable' });
    }
    console.error('Erreur DELETE /talents/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ════════════════════════════════════════════════════════════
//  POST /api/talents/:id/vue
//  Incrémente le compteur de vues d'un profil
//  Route PUBLIQUE — appelée quand on visite un profil
// ════════════════════════════════════════════════════════════
router.post('/:id/vue', async (req, res) => {
  try {
    const talentId = req.params.id;

    // Récupérer le token si présent (route optionnellement authentifiée)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Visiteur non connecté → on incrémente quand même les vues
      await Talent.findByIdAndUpdate(talentId, { $inc: { vues: 1 } });
      return res.status(200).json({ success: true });
    }

    // Décoder le token manuellement pour identifier l'utilisateur
    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch {
      // Token invalide → on incrémente quand même sans tracer l'utilisateur
      await Talent.findByIdAndUpdate(talentId, { $inc: { vues: 1 } });
      return res.status(200).json({ success: true });
    }

    // Si c'est un talent qui visite un profil → on ne compte pas la vue
    // (un talent qui visite son propre profil ou celui d'un autre ne génère pas de vue)
    if (decoded.role === 'talent') {
      return res.status(200).json({ success: true, message: 'Vue non comptée pour les talents.' });
    }

    // Pour les recruteurs et admins → vérifier si déjà vu
    const user = await User.findById(decoded.id).select('vuesTalents role');
    if (!user) {
      return res.status(200).json({ success: true });
    }

    if (user.vuesTalents.includes(talentId)) {
      return res.status(200).json({ success: true, message: 'Vue déjà comptée.' });
    }

    // Incrémenter les vues du talent et tracer le recruteur
    await Talent.findByIdAndUpdate(talentId, { $inc: { vues: 1 } });
    await User.findByIdAndUpdate(decoded.id, { $push: { vuesTalents: talentId } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur POST /talents/:id/vue:', error.message);
    res.status(200).json({ success: true });
  }
});

// ════════════════════════════════════════════════════════════
//  POST /api/talents/:id/avis
//  Ajoute un avis (note + commentaire) d'un recruteur
//  Route PROTÉGÉE — seuls les recruteurs peuvent laisser des avis
// ════════════════════════════════════════════════════════════
router.post('/:id/avis', proteger, async (req, res) => {
  try {
    const talentId = req.params.id;
    const { note, commentaire } = req.body;
    const recruteur = req.user;

    // Vérifier que l'utilisateur est un recruteur
    if (recruteur.role !== 'recruteur') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les recruteurs peuvent laisser des avis.',
      });
    }

    // Valider la note
    if (!note || note < 1 || note > 5) {
      return res.status(400).json({ success: false, message: 'La note doit être entre 1 et 5.' });
    }

    // Récupérer le talent
    const talent = await Talent.findById(talentId);
    if (!talent) {
      return res.status(404).json({ success: false, message: 'Talent introuvable.' });
    }

    // Vérifier s'il a déjà laissé un avis pour ce talent
    const avisExistant = talent.avisListe.find(
      (a) => a.auteurId.toString() === recruteur._id.toString(),
    );

    if (avisExistant) {
      // Mettre à jour l'avis existant
      avisExistant.note = note;
      avisExistant.commentaire = commentaire || '';
      avisExistant.dateAvis = new Date();
    } else {
      // Créer un nouvel avis
      talent.avisListe.push({
        auteurId: recruteur._id,
        auteurNom: recruteur.nom,
        auteurAvatar: recruteur.avatar,
        note,
        commentaire: commentaire || '',
        dateAvis: new Date(),
      });
    }

    // Recalculer la note moyenne
    const noteMoyenne =
      talent.avisListe.reduce((sum, avis) => sum + avis.note, 0) / talent.avisListe.length;
    talent.note = Math.round(noteMoyenne * 10) / 10; // Arrondir à 1 décimale
    talent.avis = talent.avisListe.length;

    const talentMisAJour = await talent.save();

    res.status(200).json({
      success: true,
      message: avisExistant ? 'Avis mis à jour.' : 'Avis créé.',
      talent: talentMisAJour,
    });
  } catch (error) {
    console.error('Erreur POST /talents/:id/avis:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ════════════════════════════════════════════════════════════
//  GET /api/talents/:id/avis
//  Récupère tous les avis d'un talent
//  Route PUBLIQUE — accessible à tous
// ════════════════════════════════════════════════════════════
router.get('/:id/avis', async (req, res) => {
  try {
    const talentId = req.params.id;

    const talent = await Talent.findById(talentId).select('avisListe note avis');
    if (!talent) {
      return res.status(404).json({ success: false, message: 'Talent introuvable.' });
    }

    // Trier les avis par date décroissante (plus récents en premier)
    const avisTriés = talent.avisListe.sort((a, b) => new Date(b.dateAvis) - new Date(a.dateAvis));

    res.status(200).json({
      success: true,
      avis: avisTriés,
      stats: {
        note: talent.note,
        total: talent.avis,
      },
    });
  } catch (error) {
    console.error('Erreur GET /talents/:id/avis:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
