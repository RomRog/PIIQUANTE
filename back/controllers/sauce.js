// importation du modèle de donnée d'une sauce
const Sauce = require("../models/Sauce");

// Importation du package Node File Systeme

// Renvoie un tableau de toutes les sauces de la base de données
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

// Renvoie la sauce avec l’_id fourni
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

// Ajout d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // récupère l'objet sauce et la transforme en objet
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // forme l'objet de la requête en le faisant correspondre avec le modèle d'un sauce
    const sauce = new Sauce({
        ...sauceObject,
        // génère un url dynamique, chaine complexe qui récupère chaque élément dynamique (protocole, hôte, dossier images puis nom du fichier)
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    // ajoute la ligne dans la BDD en utilisant les données fournis
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Modifie/mettre à jour une sauce
exports.modifySauce = (req, res, next) => {
    // test si un nouveau fichier image est chargé ou non
    const sauceObject = req.file ?
        {
            // récupère la chaine de car et la modifie en objet et actualise son URL
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        : { ...req.body }; // sinon, envoi le corps de la requête sans nouvelle image

    // actualise la BDD à la ligne concernée par l'id
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Supprime une sauce
exports.deleteSauce = (req, res, next) => {
    // trouve le fichier concerné (par id)
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // récupère le nom du fichier, récupère la partie présente aprés '/images/' dans l'URL
            const filename = sauce.imageUrl.split("/images/")[1];
            // utilise fs pour unlink donc suppr le fichier du dossier
            fs.unlink(`images/${filename}`, () => {
                // supprime l'objet sauce concerné de la base de donnée
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch((error) => {
                        console.log(error);
                        res.status(400).json({ error })
                    });
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error })
            });
};

// Gestion des likes d'une sauce
exports.likeSauce = (req, res, next) => {
    let stateLike = req.body.like;
    let idLikeUser = req.body.userId;
    let idLikeSauce = req.params.id;
    console.log(req.body)

    // récupère les attributs de la sauce concernée
    Sauce.findOne({ _id: idLikeSauce })
        .then((sauce) => {
            // Si like = 1, alors on like
            if (stateLike == 1) {
                Sauce.updateOne(
                    { _id: idLikeSauce },
                    {
                        // on ajoute ensuite le userId dans le array usersLiked
                        $push: {
                            usersLiked: idLikeUser,
                        },
                        // et on incrémente 1 au compteur likes
                        $inc: {
                            likes: +1,
                        },
                    }
                )
                    .then(() => res.status(200).json({ message: "Like ajouté !" }))
                    .catch((error) => res.status(400).json({ error }));
            }

            // Si like = -1, alors on Dislike
            if (stateLike == -1) {
                Sauce.updateOne(
                    { _id: idLikeSauce },
                    {
                        // on ajoute ensuite le userId dans le array usersDisliked
                        $push: {
                            usersDisliked: idLikeUser,
                        },
                        // et on incrémente 1 au compteur dislikes
                        $inc: {
                            dislikes: +1,
                        },
                    }
                )
                    .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
                    .catch((error) => res.status(400).json({ error }));
            }

            // Si like = 0, alors on annule le potentiel like ou Dislike
            if (stateLike == 0) {
                // si le array usersLiked contient l'id du user, il a donc liké cette sauce avant
                if (sauce.usersLiked.includes(idLikeUser)) {
                    Sauce.updateOne(
                        { _id: idLikeSauce },
                        {
                            // alors on supprime le userId du array
                            $pull: {
                                usersLiked: idLikeUser,
                            },
                            // et on décrémente 1 au compteur de likes
                            $inc: {
                                likes: -1,
                            },
                        }
                    )
                        .then(() => res.status(200).json({ message: "Like supprimé !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
                // si le array usersDisliked contient l'id du user, il a donc disliké cette sauce avant
                if (sauce.usersDisliked.includes(idLikeUser)) {
                    Sauce.updateOne(
                        { _id: idLikeSauce },
                        {
                            // alors on supprime le userId du array
                            $pull: {
                                usersDisliked: idLikeUser,
                            },
                            // et on décrémente 1 au compteur de dislikes
                            $inc: {
                                dislikes: -1,
                            },
                        }
                    )
                        .then(() => res.status(200).json({ message: "Like supprimé !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
            }
        })
        .catch((error) => res.status(500).json({ error: error + " erreur lors du like" }));
};