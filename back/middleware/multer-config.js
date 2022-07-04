// importe le module multer une fois installé (npm install --save multer)
const multer = require("multer");

// dictionnaire de type MIME
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
    // indique à multer d'enregistrer les fichiers dans le dossier images
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_").split(".")[0];
        // utilisation ensuite de la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
        const extension = MIME_TYPES[file.mimetype];
        // crée un nom de fichier (relativement unique)
        callback(null, name + Date.now() + "." + extension);
    },
});

// exporte multer une fois configuré. Lui indique que nous génerons uniquement les téléchargements de fichiers image
module.exports = multer({ storage }).single("image");