// importe express
const express = require("express");

// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();

// importe le controleur associé
const sauceCtrl = require("../controllers/sauce");

// importe le middleware de verification du token 
const auth = require("../middleware/auth");

// importe le middleware multer de contrôle des fichiers images
const multer = require("../middleware/multer-config")

router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauceOrNot);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;