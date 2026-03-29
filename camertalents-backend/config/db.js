// ============================================================
//  config/db.js
//  Connexion à MongoDB via Mongoose
//
//  Mongoose est une bibliothèque qui fait le lien entre
//  Node.js et MongoDB. Elle permet de définir des "schémas"
//  (la structure des données) et de faire des requêtes
//  facilement avec des méthodes comme .find(), .save(), etc.
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur connexion MongoDB : ${error.message}`);
    // Arrête le serveur si la base de données est inaccessible
    process.exit(1);
  }
};

module.exports = connectDB;
