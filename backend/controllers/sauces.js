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
exports.createSauce = (req, res, next) => {

    // récupère les information de la sauce dans une variable 
    const sauces = JSON.parse(req.body.sauce);
    console.log(sauces);
    // crée un nouvel element sauce avec l'url de l'image associer 
    const sauce = new Sauce({
        ...sauces,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    // sauvegarde le nouvel element 
    sauce.save()
        .then(() => res.status(201).json({ message: 'objet enregistrer' }))
        .catch(() => res.status(400).json({ error }));

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

// modifier un objet 
exports.modifySauce = (req, res, next) => {
    // récupère les information si il y en 
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        } : { ...req.body };

    Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet modifier' }))
        .catch(() => res.status(304).json({ error }));

};

/**
    ** Gère la demande utilisateur 
    ** si l'utilisateur ajoute un like = 1 -> addLike() 
    ** si l'utilisateur ajoute un dislike = -1 -> addDislike()
    ** si l'utilisateur retire un like ou un disLike = 0 -> updateLike()
*/
exports.likes = (req, res, next) => {
    const userId = req.body.userId;
    const sauceId = req.params.id;
    console.log(sauceId);
    console.log(userId);
    console.log(req.body.like);
    switch (req.body.like) {
        case 1:
            addLike(res, sauceId, userId);
            break;
        case -1:
            addDislike(res, sauceId, userId);
            break;
        case 0:
            updateLike(res, sauceId, userId);
            break;
    };
};

// ajoute un like
function addLike(res, sauceId, userId) {

    // mets a jour les likes de la sauce sélectionnée et ajoute l'id de l'utilisateurs dans le tableau des likes
    Sauce.updateOne({ _id: sauceId }, {
        $inc: { likes: 1 },
        $push: { usersLiked: userId }
    })
        .then(() => res.status(200).json({ message: 'like updated !' }))
        .catch(error => res.status(400).json({ error }));
}

// ajoute un dislike
function addDislike(res, sauceId, userId) {
    console.log(sauceId);
    // mets a jour les disLikes de la sauce sélectionnée et ajoute l'id de l'utilisateurs dans le tableau des Dislikes
    Sauce.updateOne({ _id: sauceId }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: userId }
    })
        .then(() => res.status(200).json({ message: 'dislike updated !' }))
        .catch(error => res.status(400).json({ error }));
}

// retire un like ou un disLike
function updateLike(res, sauceId, userId) {
    console.log(sauceId);
    // récupère la sauce concernée 
    Sauce.findById({ _id: sauceId })
        .then((sauce) => {
            console.log(sauce);
            console.log(sauce.usersLiked);
            // vérifie si l'id de l'utilisateur est présent dans le tableau de liked 
            if (sauce.usersLiked.includes(userId)) {
                // mets a jour la sauce pour ajouté -1 au like et retiré l'id de l'utilisateur du tableau de like 
                Sauce.updateOne({ _id: sauceId },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    }
                )
                    .then(() => res.status(200).json({ message: 'updated successfully !' }))
                    .catch(error => res.status(400).json({ error }));
            };
            // vérifie si l'id de l'utilisateur est présent dans le tableau de dislike
            if (sauce.usersDisliked.includes(userId)) {
                // mets a jour la sauce pour ajouté -1 au like et retiré l'id de l'utilisateur du tableau de dislike
                Sauce.updateOne({ _id: sauceId },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: userId }
                    }
                )
                    .then(() => res.status(200).json({ message: 'updated successfully !' }))
                    .catch(error => res.status(400).json({ error }));
            };

        })
        .catch(error => res.status(400).json({ error }));
}

