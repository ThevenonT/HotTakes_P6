const http = require('http');
const app = require('./app');
require('dotenv').config();

// initialize le port 
const normalizePort = val => {

    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
// verifie si un port est déclaré dans le fichier .env 
const port = normalizePort(process.env.PORT || '3000');
// ajoute le port a utilisé dans les paramètre 
app.set('port', port);
// si une erreur se produit
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();

    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
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
// initialize un nouveau serveur 
const server = http.createServer(app);
// démarre le server
server.on('error', errorHandler);
server.on('listening', () => {
    // récupère l'adresse du server
    const address = server.address();
    // retourne le port du serveur 
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
