//Import du package Json Web Token pour l'attribut de token aux requêtes
const jwt = require('jsonwebtoken');
require('dotenv').config();

//On export le middleware d'authentification
module.exports = (req, res, next) => {
	console.log('Je passe par le middleware auth');
	try {
		//On récupère le token en le séparant du bearer dans authorization
		const token = req.headers.authorization.split(' ')[1];
		console.log('Test1');
		console.log(token);

		//On vérifie le token
		const decodedToken = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
		console.log('Test2');
		//Le token décodé devient un objet Javascript, on récupere donc le userId dedans
		const userId = decodedToken.userId;
		req.auth = { userId };
		//Si il y a un userId dans la requete, on verifie qu'il correspond bien à celui du token
		if (req.body.userId && req.body.userId !== userId) {
			throw 'Invalid UserID !';
		} else {
			//Si ok, on appelle 'next' car il s'agit d'un middleware donc on peut passer la requete au prochain middleware
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error | 'Requête non authentifiée !' });
	}
};
