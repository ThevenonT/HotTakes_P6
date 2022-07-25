const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// si /api/auth/signup est présent dans l'URL return la fonction signup présent dans ../controllers/user
router.post('/signup', userCtrl.signup);
// si /api/auth/login est présent dans l'URL return la fonction login présent dans ../controllers/user
router.post('/login', userCtrl.login);


module.exports = router;