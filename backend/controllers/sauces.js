const Sauce = require('../models/Sauce');
const fs = require('fs');

// afficher tous les objet 
exports.getAllSauce = (req, res, next) => {
    //récupère toute les sauces présente 
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// enregistrer un objet 
exports.createSauce = async (req, res, next) => {

    // récupère les information de la sauce dans une variable 
    const Sauces = await JSON.parse(req.body.sauce);

    // crée un nouvel element sauce avec l'url de l'image associer 
    const sauce = new Sauce({
        ...Sauces,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    // sauvegarde le nouvel element 
    sauce.save()
        .then(() => res.status(201).json({ message: 'objet enregistrer' }))
        .catch(error => res.status(400).json({ error }));

};

// afficher un objet 
exports.getOneSauce = (req, res, next) => {
    // recherche la sauce avec l'id associer 
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// supprimer un element
exports.deleteSauce = (req, res, next) => {

    // recherche la sauce avec l'id associer 
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            // récupère le nom de l'image associer 
            const filename = sauce.imageUrl.split('/images/')[1];

            // supprime l'image avec le nom associer dans le dossier image 
            fs.unlink(`images/${filename}`, () => {
                // supprime la sauce avec l'id associer 
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json('objet supprimé !'))
                    .catch(error => res.status(400).json({ error }));

            })
        })
        .catch(error => res.status(500).json({ error }));
};