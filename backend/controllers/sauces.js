const Sauce = require('../models/Sauce');
const fs = require('fs');

// afficher tous les objet 
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// enregistrer un objet 
exports.createSauce = async (req, res, next) => {

    const Sauces = await JSON.parse(req.body.sauce);
    delete Sauces._id;
    const sauce = new Sauce({
        ...Sauces,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    sauce.save()

        .then(() => res.status(201).json({ message: 'objet enregistrer' }))
        .catch(error => res.status(400).json({ error }));

};

// afficher un objet 
exports.getOneSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
