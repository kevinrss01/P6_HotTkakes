// Importation du package "http" de Node
// Importation et liaison avec l'api
const http = require('http');
const app = require('./app');

//La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
	//On convertie la valeur (string) en entier
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

//On utilise le port 3000 par défaut sinon on fait appel à une variable d'environnement qui nous fourni un port à utiliser
const port = normalizePort(process.env.PORT || '3000');
//Choix du port sur lequel l'application express va tournée
app.set('port', port);

//La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

//Création du serveur qui fera appel à l'api à chaque requête recue
const server = http.createServer(app);

//On implémente un gestionnaire d'événement avec lequel on va écouter sur le port correspondant du serveur
server.on('error', errorHandler);
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

server.listen(port);
//
