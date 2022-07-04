// importe express

const express = require("express");

// crée une application express

const app = express();

// importe helmet qui aide à sécuriser l'applications Express en définissant divers en-têtes HTTP

const helmet = require("helmet");

// importe Mongoose qui permet d'utiliser des fonctions complète pour intéragir avec la BDD

const mongoose = require("mongoose");

// importe path qui permet de connaitre le chemin du système de fichier

const path = require("path");

// importe les routes

const userRoutes = require("./routes/user");

// Appel de .env pour utiliser les variables d'environnement (npm install dotenv --save)

require('dotenv').config()

// définit l'accès à la BDD MongoDB (utilise les var d'env pour ne pas transmettre les logs de connexion en clair dans le code)

mongoose
  .connect(
    'mongodb+srv://RomRog:CalimerO01@atlascluster.n2czjzy.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Utilise les services des middlewares proposés par helmet

app.use(helmet());

// Middlewares

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {

  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine

  res.setHeader("Access-Control-Allow-Origin", "*");

  // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation

  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");

  // on indique les méthodes autorisées pour les requêtes HTTP

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// affiche le corps de la requête

app.use(express.json());

// utilise les middlewares importés depuis notre fichier routes
app.use("/api/auth", userRoutes);

// exporte l'app pour l'utiliser/l'appeler dans les autres fichiers par la suite

module.exports = app;