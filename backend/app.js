const express = require('express');
const app = express();
const mongoose = require('mongoose');
/**  Route user 
    ** Gère la création de compte, la connexion de l'utilisateur
    ** et la création d'un token sécurisé.
*/
const userRoutes = require('./routes/user');
/**  Route sauces 
    ** Gère la création ,la suppression, la modification d'une sauces
    ** et la possibilité du like ou dislike une sauce.
*/
const sauceRoutes = require('./routes/sauces');
const path = require('path');
require('dotenv').config();

// parse le corps des requête 
app.use(express.json());

/* connection a la base de donnée mongoDB */
mongoose.connect(process.env.CONNEXION_MONGO_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// declaration du header pour les requête
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// redirection des routes 
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
// ajout du chemin static 
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;