// ============================================================
//  server.js
//  Point d'entrée du serveur CamerTalents Backend
//
//  Express est un framework Node.js qui simplifie la création
//  de serveurs HTTP. Il gère les routes, les middlewares,
//  et les réponses JSON.
// ============================================================

// dotenv charge les variables du fichier .env dans process.env
// DOIT être appelé en PREMIER avant tout autre import
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');

// ── Import des routes ─────────────────────────────────────
const authRoutes      = require('./routes/auth');
const talentsRoutes   = require('./routes/talents');
const recruteurRoutes = require('./routes/recruteur');
const adminRoutes     = require('./routes/admin');

// ── Connexion à MongoDB ───────────────────────────────────
connectDB();

// ── Création de l'application Express ────────────────────
const app = express();

// ════════════════════════════════════════════════════════════
//  MIDDLEWARES GLOBAUX
//  Fonctions exécutées sur TOUTES les requêtes entrantes
// ════════════════════════════════════════════════════════════

// CORS : autorise le frontend Vue.js à communiquer avec ce serveur
// Sans ça, le navigateur bloquerait les requêtes cross-origin
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // autorise l'envoi de cookies si besoin
}));

// Permet à Express de lire les corps de requête JSON
// ex: req.body contiendra { nom: "Kamga", email: "..." }
app.use(express.json({ limit: '10mb' })); // 10mb pour les CV en base64

// Permet de lire les données de formulaires URL-encodés
app.use(express.urlencoded({ extended: true }));

// ════════════════════════════════════════════════════════════
//  ROUTES
//  Chaque groupe de routes a un préfixe d'URL
// ════════════════════════════════════════════════════════════

// Routes d'authentification → /api/auth/...
app.use('/api/auth', authRoutes);

// Routes des talents → /api/talents/...
app.use('/api/talents', talentsRoutes);

// Routes du recruteur → /api/recruteur/...
app.use('/api/recruteur', recruteurRoutes);

// Routes d'administration → /api/admin/...
app.use('/api/admin', adminRoutes);

// ── Route de santé (health check) ────────────────────────
// Permet de vérifier que le serveur tourne
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Serveur CamerTalents opérationnel',
    version: '1.0.0',
    env:     process.env.NODE_ENV,
  });
});

// ── Route 404 ─────────────────────────────────────────────
// Toute route inconnue retourne une erreur JSON claire
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.originalUrl}`,
  });
});

// ── Middleware de gestion d'erreurs globales ──────────────
// Express le reconnaît grâce aux 4 paramètres (err, req, res, next)
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
  });
});

// ════════════════════════════════════════════════════════════
//  DÉMARRAGE DU SERVEUR
// ════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ════════════════════════════════════════');
  console.log(`   CamerTalents Backend`);
  console.log(`   Serveur démarré sur le port ${PORT}`);
  console.log(`   Environnement : ${process.env.NODE_ENV}`);
  console.log(`   API : http://localhost:${PORT}/api`);
  console.log('   ════════════════════════════════════════');
  console.log('');
});

module.exports = app;
