//Imports
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//Import des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/Sauce');

//Connection à la base de donnée MongoDB Atlas
mongoose
	.connect(
		'mongodb+srv://kevinrss01:vYXSGYcxx3Qis77@cluster0.evms6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

//Déclaration de l'app
const app = express();

// Creation du middleware pour accèder au corps de la requête
app.use(express.json());

//CORS Header
app.use((req, res, next) => {
	//L'accès à l'API peut s'effectuer depuis n'importe quelle origine pour permettre les test
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});

//Enregistrement des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//Exports
module.exports = app;
