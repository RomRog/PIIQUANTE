const mongoose = require('mongoose');

// plugin qui empêche les doublons d'adresse mail 
const uniqueValidator = require('mongoose-unique-validator');

//définit le schéma de données d'un utilisateur pour rendre les entrés dans la BDD plus strictes
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

//utilise le plugin pour s'assurer que l'adresse mail est unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);