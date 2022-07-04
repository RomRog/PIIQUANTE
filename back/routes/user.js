const express = require('express');

//créer un routeur avec la fonction Router()
const router = express.Router();

//importation du contrôleur utilisateur
const userCtrl = require('../controllers/user');

//création des routes d'inscription et de connexion

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;