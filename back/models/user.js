const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//création du schéma utilisateur
//utilisation mongoose-unique-validator pour éviter d'avoir plus d'un utilisateur avec une adresse e-mail spécifique
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//appliquer le validateur au schéma utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);