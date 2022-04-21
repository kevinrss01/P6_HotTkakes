//Installation du package "bcrypt" pour le hachage des mots de passe
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

//Lien vers les schemas de données user
const User = require('../models/user');

//Middleware Signup
//On exporte notre fonction signup à notre fichier user route
exports.signup = (req, res, next) => {
	//Hachage du mot de passe
	//On passe en argument le mot de passe du corps de la requete envoyée depuis le front en faisant 10 tours d'algorythme de hachage
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			//On enregistre le hash de mot de passe dans une nouvelle instance du model "User"
			const user = new User({
				//On utilise le mail du corps de la requete
				email: req.body.email,
				//On enregistre le hachage de mot de passe
				password: hash,
			});
			//Enregistrement du user dans la base de donnée
			user
				.save()
				.then(() => res.status(201).json({ message: 'User created !' }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

//Middleware Login
//On exporte notre fonction login à notre fichier user route
exports.login = (req, res, next) => {
	//On retrouve l'utilisateur dans la base de donnée qui correspond à l'adresse mail qui à été ajouté à l'application, sachant que l'adresse mail est unique
	User.findOne({ email: req.body.email })
		.then((user) => {
			//Si l'utilisateur n'existe pas dans la base de donnée, on retourne une erreur 401 avec un objet JSON
			if (!user) {
				return res.status(401).json({ error: 'User not found !' });
			}
			//Si on trouve l'utilisateur, on compare le mot de passe envoyé par l'utilisateur qui veut se connecter avec le hash enregistré
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					//Si la comparaison est fausse, on retourne une erreur 401 unauthorize
					if (!valid) {
						return res.status(401).json({ error: 'Incorrect Password !' });
					}
					//Sinon on renvoi un status 200 OK avec un objet JSON qui contient l'identifiant de l'utilisateur dans la base ainsi qu'un token
					res.status(200).json({
						userId: user.id,
						token: jwt.sign(
							{ userId: user._id },
							process.env.ACCES_TOKEN_SECRET,
							{
								expiresIn: '24h',
							}
						),
					});
				})
				//Si probleme de connection avec MongoDb, on renvoit une erreur serveur
				.catch((error) => res.status(500).json({ error }));
		})
		//Si probleme de connection avec MongoDb, on renvoit une erreur serveur
		.catch((error) => res.status(500).json({ error }));
};
