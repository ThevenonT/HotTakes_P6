const multer = require('multer');

// Créer un type de donnée 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
};
/**
* ajout de la configuration pour le stockage de l'image 
*/
const storage = multer.diskStorage({
    // retourne le dossier de destination de l'image 
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    // configure le chemin et le nom du fichier 
    filename: (req, file, callback) => {
        console.log(file);
        /** * récupère le nom de l'image */
        const name = file.originalname.split(' ').join('_');

        /** * récupère le nom de l'image sans l'extension */
        const imageName = name.split('.')[0];

        /** * récupère l'extension du l'image */
        const extension = MIME_TYPES[file.mimetype];

        //crée le callback contenant le nom de l'image et son extension  
        callback(null, imageName + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');