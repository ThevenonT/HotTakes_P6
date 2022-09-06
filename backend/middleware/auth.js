const jwt = require('jsonwebtoken');
require('dotenv').config();
// verification du token 
module.exports = (req, res, next) => {
    try {

        // récupère le token 
        const token = req.headers.authorization.split(' ')[1];
        // vérifie la présence du token 
        if (!token) {

            return res.status(403).json({ error: error, msgErr: 'unauthorized request!' });

        }

        // décode le token 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // récupère l'id unique de l'utilisateur dans le token
        const userId = decodedToken.userId;
        // ajout du token dans req.auth
        req.auth = { userId };

        // vérifie si le token n'est pas valide ou n'a pas pue être décodé 
        if (!decodedToken) {

            return res.status(403).json({ error: error, msgErr: 'unauthorized request!' });


        } else {
            next();
        }

    } catch (error) {

        return res.status(403).json({ error: error, msgErr: 'unauthorized request!' });
    }
}