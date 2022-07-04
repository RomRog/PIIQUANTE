// importe le module de hashage et salage des mdp 
const bcrypt = require("bcrypt");

// importe le module de création de token
const jwt = require("jsonwebtoken");

// importation du modèle de donnée d'un user
const User = require("../models/User");

// Appel de .env pour utiliser les variables d'environnement (npm install dotenv --save)
require("dotenv").config();


// Expression régulière
/*const RegExpEmail =
  /^(([^<()[\]\\.,;:\s@\]+(\.[^<()[\]\\.,;:\s@\]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
*/

// controlleur d'inscription d'un utilisateur

exports.signup = (req, res, next) => {

    // utilise bcrypt pour créer un hash du mot de passe tranmis
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            // crée un objet user
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            // enregistre le nouveau utilisateur
            user
                .save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// controlleur de connexion d'un utilisateur

exports.login = (req, res, next) => {
    // recherche l'adresse mail dans la BDD
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }
            // génère un hash du mdp et le compare à celui associé à l'adresse mail dans la BDD
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: "Mot de passe incorrect !" });
                    }
                    // renvoi le userId et un token généré par jwt (contenant l'id et expire dans 24h)
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.SECRET_CRYPT_TOKEN,
                            { expiresIn: "24h" }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};