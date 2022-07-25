const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// inscrit un nouvel user et hash le mots de passe 
exports.signup = (req, res, next) => {
    //hash le mot de passe 
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Créer un user avec l'email et le mot de passe 
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // inscrit l'utilisateur dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};


// vérifie si l'email et le mot de passe son enregistrer dans la bdd
exports.login = (req, res, next) => {
    // vérifie si l'email est enregistré 
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'utiliateur non trouvé !' });
            }
            // vérifie le mots de passe fournit 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'mot de passe incorrect !' });
                    }
                    // return user._id et le token 
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};