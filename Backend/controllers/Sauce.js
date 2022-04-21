//Imports
const Sauce = require('../models/Sauce');
const fs = require('fs');

//POST
//On exporte notre fonction 'createSauce' à notre fichier "saucesRoute"
exports.createSauce = (req, res, next) => {
	//On analyse la requete(str) et on la transforme en objet javascript pour permettre l envoi de fichiers
	const sauceObject = JSON.parse(req.body.sauce);
	//Suppresion de l'id du corps de la requete car généré automatiquement par MongoDB
	delete sauceObject._id;
	//Creation d'une nouvelle instance de la methode Sauce comprenant un objet
	const sauce = new Sauce({
		//Utilisation de l'opérateur 'spread' pour venir copier de facon plus rapide les champs de la requete (title, manufacturer etc...)
		...sauceObject,
		//Enregistrement de l'image de la requete dans le dossier image du back end
		//On genère l'url de l'image de manière dynamique
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
	});

	//Enregistrement dans la base de donnée
	sauce
		.save()
		//Si ok on renvoit un code 200 OK avec un objet json comprenant un message
		.then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
		.catch((error) => res.status(400).json({ error }));
};

//GETALL
//On exporte notre fonction 'getAllSauces' à notre fichier "saucesRoute"
exports.getAllSauces = (req, res, next) => {
	//On utilise la methode "find" de notre modele pour permettre la recuperation de toutes les sauces
	Sauce.find()
		//Si ok, on récupère le tableau de toutes les sauces renvoyé par la base de donnée et on le renvoit en réponse avec un code 200 OK
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

//GETONE
//On exporte notre fonction 'getOneSauce' à notre fichier "saucesRoute"
exports.getOneSauce = (req, res, next) => {
	//Dans l'objet de la methode "findOne" on compare l'id de la sauce avec celui du parametre de requete
	Sauce.findOne({ _id: req.params.id })
		//Si les deux ID sont similaires on retourne une réponse serveur 200 avec la sauce correspondante dans la base de donnée
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

//PUT
//On exporte notre fonction 'modifySauce' à notre fichier "saucesRoute"
exports.modifySauce = (req, res, next) => {
	//Si on trouve un nouveau fichier image , on recupere la chaine de caractère et on la parse en objet et on modifie l'url de l'image
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`,
				//Sinon on prend le corps de la requete et on modifie l'identifiant de l'objet qu'on vient de créer pour correspondre à l'identifiant des parametres de requete
		  }
		: { ...req.body };
	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...sauceObject, _id: req.params.id }
	)
		.then(() => res.status(200).json({ message: 'Sauce Modifiée !' }))
		.catch((error) => res.status(400).json({ error }));
};

//DELETE
//On exporte notre fonction 'deleteSauce' à notre fichier "saucesRoute"
exports.deleteSauce = (req, res, next) => {
	//Vérification de concordance User/Sauce avant delete de la sauce
	//Récupération de l'id sauce
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
			const filename = sauce.imageUrl.split('/images/')[1];
			// Avec ce nom de fichier, on appelle unlink pour suppr le fichier
			fs.unlink(`images/${filename}`, () => {
				// On supprime le document correspondant de la base de données
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

//LIKE/DISLIKE
//On exporte notre fonction 'likeDislike' à notre fichier "saucesRoute"
exports.likeDislike = (req, res, next) => {
	// Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
	// Like présent dans le body
	let like = req.body.like;
	// On prend le userID
	let userId = req.body.userId;
	// On prend l'id de la sauce
	let sauceId = req.params.id;

	// Si il s'agit d'un like
	if (like === 1) {
		// On push l'utilisateur et on incrémente le compteur de 1
		Sauce.updateOne(
			{ _id: sauceId },
			{ $push: { usersLiked: userId }, $inc: { likes: +1 } }
		)
			.then(() => res.status(200).json({ message: "j'aime ajouté !" }))
			.catch((error) => res.status(400).json({ error }));
	}

	// S'il s'agit d'un dislike
	if (like === -1) {
		//On push l'utilisateur on incremente le compteur de 1
		Sauce.updateOne(
			{ _id: sauceId },
			{ $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
		)
			.then(() => {
				res.status(200).json({ message: 'Dislike ajouté !' });
			})
			.catch((error) => res.status(400).json({ error }));
	}

	// Si il s'agit d'annuler un like ou un dislike
	if (like === 0) {
		Sauce.findOne({ _id: sauceId })
			.then((sauce) => {
				// Si il s'agit d'annuler un like
				if (sauce.usersLiked.includes(userId)) {
					// On pull l'utilisateur on incrémente le compteur de -1
					Sauce.updateOne(
						{ _id: sauceId },
						{ $pull: { usersLiked: userId }, $inc: { likes: -1 } }
					)
						.then(() => res.status(200).json({ message: 'Like retiré !' }))
						.catch((error) => res.status(400).json({ error }));
				}

				// Si il s'agit d'annuler un dislike
				if (sauce.usersDisliked.includes(userId)) {
					// On pull l'utilisateur on incrémente le compteur de -1
					Sauce.updateOne(
						{ _id: sauceId },
						{ $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
					)
						.then(() => res.status(200).json({ message: 'Dislike retiré !' }))
						.catch((error) => res.status(400).json({ error }));
				}
			})
			.catch((error) => res.status(404).json({ error }));
	}
};
