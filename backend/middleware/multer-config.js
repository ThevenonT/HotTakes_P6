const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        console.log(file);
        console.log(JSON.parse(JSON.parse(JSON.stringify(req.body)).sauce).name);
        let NameOfSauce = JSON.parse(JSON.parse(JSON.stringify(req.body)).sauce).name.split(' ').join('-');
        const FileName = file.originalname.split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, FileName + '_' + NameOfSauce + '.' + extension)
    }
});

module.exports = multer({ storage }).single('image');