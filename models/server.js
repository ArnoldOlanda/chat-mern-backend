const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');
const routerAuth = require('../routes/auth');
const routerUser = require('../routes/users');
const routerConversation = require('../routes/conversations');
const routerMensajes = require('../routes/mensajes');
const { socketController } = require('../sockets/controller');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server, { cors: { origin: '*' } });

        this.userPaths = '/api/usuarios';
        this.authPath = '/api/auth';
        this.conversationPath = '/api/conversation';
        this.mensajesPath = '/api/mensajes';



        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.authPath, routerAuth);
        this.app.use(this.userPaths, routerUser);
        this.app.use(this.conversationPath, routerConversation);
        this.app.use(this.mensajesPath, routerMensajes);
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}




module.exports = Server;
