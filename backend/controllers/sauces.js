const Sauce = require('../models/Sauce');
const fs = require('fs');

/** affiche tous les objet 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllSauce = (req, res) => {
    //récupère toute les sauces présente 
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/** enregistre un objet
 * @param {*} req 
 * @param {*} res 
 */
exports.createSauce = (req, res) => {

    // récupère les information de la sauce dans une variable 
    const sauces = JSON.parse(req.body.sauce);

    // crée un nouvel element sauce avec l'url de l'image associer 
    const sauce = new Sauce({
        ...sauces,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    // sauvegarde le nouvel element 
    sauce.save()
        .then(() => res.status(201).json({ message: 'objet enregistrer' }))
        .catch((error) => res.status(400).json({ error }));

};

/** affiche un objet
 * @param {*} req 
 * @param {*} res 
 */
exports.getOneSauce = (req, res) => {
    // recherche la sauce avec l'id associer 
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/** supprime un element
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteSauce = (req, res) => {

    /** id de l'utilisateur connecté  */
    const userId = req.auth.userId;
    /** id de la sauce a modifié  */
    const sauceId = req.params.id;

    // recherche la sauce avec l'id associer 
    Sauce.findOne({ _id: sauceId }).then((sauce) => {

        // vérifie si l'utilisateur connecté est le propriétaire de la sauce 
        if (userId === sauce.userId) {
            // récupère le nom de l'image associer 
            const filename = sauce.imageUrl.split('/images/')[1];

            // supprime l'image avec le nom associer dans le dossier image 
            fs.unlink(`images/${filename}`, () => {

                // supprime la sauce avec l'id associer 
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json('objet supprimé !'))
                    .catch((error) => res.status(400).json({ error }));

            })
        } else {

            return res.status(400).json({ msgErr: 'impossible de supprimé ! vous n\'êtes pas le propriétaire de la sauce !!' })
        }
    })
        .catch((error) => res.status(500).json({ error, msgErr: 'Aucune sauce corespondent à l\'id fournit ' }));
};

/** modifie un objet 
 * @param {*} req 
 * @param {*} res 
 */
exports.modifySauce = (req, res) => {
    /** id de l'utilisateur connecté */
    const userId = req.auth.userId;
    /** id de la sauce a modifié */
    const sauceId = req.params.id;

    // recherche la sauce a modifié
    Sauce.findOne({ _id: sauceId }).then((sauce) => {

        // vérifie si l'utilisateur connecté est le propriétaire de la sauce 
        if (userId === sauce.userId) {
            // récupère les informations modifier de la sauce
            const thingObject = req.file ?
                {
                    userId: userId,
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

                } : { userId: userId, ...JSON.parse(req.body.sauce) };

            // mets a jour la sauce 
            Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'objet modifier !' }))
                .catch(() => res.status(304).json({ error }));

        } else {

            return res.status(400).json({ msgErr: 'impossible de modifier ! vous n\'êtes pas le propriétaire de la sauce !!' })
        }

    })
        .catch(() => res.status(400).json({ msgErr: 'aucune sauce ne correspondant à l\'id fournit !' }))


};

/** * Gère la demande utilisateur 
    ** si l'utilisateur ajoute un like = 1 -> addLike() 
    ** si l'utilisateur ajoute un dislike = -1 -> addDislike()
    ** si l'utilisateur retire un like ou un disLike = 0 -> updateLike()
*/
exports.likes = (req, res) => {
    // id de l'utilisateur
    const userId = req.body.userId;
    // id de la sauce 
    const sauceId = req.params.id;

    // gère le système de like 
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

/** ajoute un like et enregistre l'id de l'utilisateur dans le tableau de like
 * @param {*} res réponse au de la requête
 * @param {*} sauceId id de la sauce concernée 
 * @param {*} userId id de l'utilisateur concernée 
 */
function addLike(res, sauceId, userId) {
    // récupère la sauce sélectionnée 
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            // si l'id de l'utilisateur est présent dans le tableau des like de la sauce
            if (sauce.usersLiked.includes(userId)) {
                // retourne une erreur 
                return res.status(400).json({ message: 'this user already likes this sauce !' });
                // sinon
            } else if (sauce.usersDisliked.includes(userId)) {
                // retourne une erreur 
                return res.status(400).json({ message: 'impossible to like and dislike the same sauce !' });
                // sinon
            } else {
                // mets a jour les likes de la sauce sélectionnée et ajoute l'id de l'utilisateurs dans le tableau des likes
                Sauce.updateOne({ _id: sauceId }, {
                    $inc: { likes: 1 },
                    $push: { usersLiked: userId }
                })
                    .then(() => res.status(200).json({ message: 'adds like !' }))
                    .catch(error => res.status(400).json({ error }));
            }

        })
        .catch(error => res.status(400).json({ error }));
}

/** ajoute un dislike et enregistre l'id de l'utilisateur dans le tableau de dislike
 * @param {*} res réponse au de la requête
 * @param {*} sauceId id de la sauce concernée 
 * @param {*} userId id de l'utilisateur concernée 
 */
function addDislike(res, sauceId, userId) {

    // récupère la sauce sélectionnée
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            // si l'id de l'utilisateur est présent dans le tableau des dislike de la sauce
            if (sauce.usersDisliked.includes(userId)) {
                // retourne une erreur 
                return res.status(400).json({ message: 'this user already dislikes this sauce !' });
                // sinon

            } else if (sauce.usersLiked.includes(userId)) {
                // retourne une erreur 
                return res.status(400).json({ message: 'impossible to like and dislike the same sauce !' });
                // sinon
            } else {
                // mets a jour les likes de la sauce sélectionnée et ajoute l'id de l'utilisateurs dans le tableau des dislikes
                Sauce.updateOne({ _id: sauceId }, {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: userId }
                })
                    .then(() => res.status(200).json({ message: 'adds dislike !' }))
                    .catch(error => res.status(400).json({ error }));
            }

        })
        .catch(error => res.status(400).json({ error }));


}

/** retire un like ou un dislike et retire l'id de l'utilisateur du tableau concernée
 * @param {*} res réponse au de la requête
 * @param {*} sauceId id de la sauce concernée 
 * @param {*} userId id de l'utilisateur concernée 
 */
function updateLike(res, sauceId, userId) {

    // récupère la sauce concernée 
    Sauce.findById({ _id: sauceId })
        .then((sauce) => {

            // vérifie si l'id de l'utilisateur est présent dans le tableau de liked 
            if (sauce.usersLiked.includes(userId)) {
                // mets a jour la sauce pour ajouté -1 au like et retiré l'id de l'utilisateur du tableau de like 
                Sauce.updateOne({ _id: sauceId },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    }
                )
                    .then(() => res.status(200).json({ message: 'removed like !!!!' }))
                    .catch(error => res.status(400).json({ error }));

            } else {// sinon
                // vérifie si l'id de l'utilisateur est présent dans le tableau de dislike
                if (sauce.usersDisliked.includes(userId)) {
                    // mets a jour la sauce pour ajouté -1 au like et retiré l'id de l'utilisateur du tableau de dislike
                    Sauce.updateOne({ _id: sauceId },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'removed dislike !!' }))
                        .catch(error => res.status(400).json({ error }));
                    // sinon
                } else {
                    // retourne une erreur 
                    return res.status(400).json({ message: 'user has like or dislike no sauce !' })
                }
            };

        })
        .catch(error => res.status(400).json({ error }));
}

