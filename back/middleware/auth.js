// Pour verifier les tokens
const jwt = require("jsonwebtoken");

// Appel de .env pour utiliser les variables d'environnement (npm install dotenv --save)
require("dotenv").config();

// middleware d'authentification :
module.exports = (req, res, next) => {
    try {
        // récupère le token du user (bearer)
        const token = req.headers.authorization.split(" ")[1];
        // décode ce token à partir de la clé (voir .env)
        const decodedToken = jwt.verify(token, process.env.SECRET_CRYPT_TOKEN);
        // récupère le userId
        const userId = decodedToken.userId;

        // vérifie si l'id encodé et l'id du user sont identiques
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID non valide !";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | "Requête non authentifiée !" });
    }
};