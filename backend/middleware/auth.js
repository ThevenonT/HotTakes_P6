const jwt = require('jsonwebtoken');
require('dotenv').config();
// ajout d'un token securisé
module.exports = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = { userId };

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch {
        res.status(403).json({ error: error | 'unauthorized request!' });
    }
}