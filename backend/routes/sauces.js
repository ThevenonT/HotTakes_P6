const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');


// afficher tous les objet 
router.get('/', auth, sauceCtrl.getAllSauce);

// enregistrer un objet 
router.post('/', auth, multer, sauceCtrl.createSauce);

// afficher un objet 
router.get('/:id', auth, sauceCtrl.getOneSauce);

module.exports = router;