const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

// parse le corps des requête 
app.use(express.json());

/* connection a la base de donner mongoDB */
mongoose.connect('mongodb+srv://root:ZnK0eofQmGi8gsJ3@databasehottakes.3fulf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

// route
app.use('/api/auth', userRoutes);

module.exports = app;