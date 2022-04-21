//Import
const multer = require('multer');

//Création d'un dictionnaire MIME_TYPES comprenant les extensions de fichiers
const MIME_TYPES = {
	'images/jpg': 'jpg',
	'images/jpeg': 'jpg',
	'images/png': 'png',
};

//Creation d'un objet de configuration pour 'multer'
const storage = multer.diskStorage({
	//Destination pour l'enregistrement de l'image importée
	destination: (req, file, callback) => {
		//On appelle un callback
		callback(null, 'images');
	},
	// Génération du nom de fichier
	filename: (req, file, callback) => {
		//On utilise le nom d'origine du fichier en eliminant les espaces
		const name = file.originalname.split(' ').join('_');
		//On genere l'extension du fichier qui sera l element du dictionnaire qui correspond au myme type du fichier envoyé depuis le front-end
		const extension = MIME_TYPES[file.mimeType];
		//On appelle à nouveau un callback avec un argument null pour préciser qu'il n y a pas d'erreur et on créer le file name entier avec l'usage d'un time stamp pour le rendre unique
		callback(null, name + Date.now() + '.' + extension);
	},
});

//Export du middleware multer
module.exports = multer({ storage }).single('image');
