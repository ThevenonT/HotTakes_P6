const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// créer un schéma pour l'email et le mot de passe 
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
// vérifie si l'email est unique 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);