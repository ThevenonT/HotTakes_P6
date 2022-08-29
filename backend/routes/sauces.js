const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');


// afficher tous les elements  
router.get('/', auth, sauceCtrl.getAllSauce);

// enregistrer un element  
router.post('/', auth, multer, sauceCtrl.createSauce);

// afficher un element 
router.get('/:id', auth, sauceCtrl.getOneSauce);

// supprimer un element
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// modifie un element 
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// modifier un like 
router.post('/:id/like', auth, sauceCtrl.likes);

module.exports = router;