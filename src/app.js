import express from "express"
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import mongoose from "mongoose"
import { Server } from 'socket.io';
import { ChatManager } from './dao/chat.manager.js';


const PORT = 8080
const app = express()

const URI = 'mongodb+srv://candeairaldi:c4740930@codercluster.hd6bor0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


const httpServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

mongoose.connect(URI)
    .then(() => console.log('Conexión a MongoDB establecida'))
    .catch((error) => console.log('Error de conexión a MongoDB', error));


const io = new Server(httpServer);

io.on('connection', (socket) => {
    let user;
    let messages;

    socket.on('user-connected', async (socketUser) => {
        user = socketUser;
        socket.broadcast.emit('user-connected', user);
        messages = await ChatManager.getInstance().getMessages();
        socket.emit('messageLogs', messages);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', user ?? 'Anónimo');
    });

    socket.on('message', async (message) => {
        await ChatManager.getInstance().addMessage(message);
        messages = await ChatManager.getInstance().getMessages();
        io.emit('messageLogs', messages);
    });
}); 