const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const {dbConnect} = require('./config/dbConexion');


const app = express();

//Configuracion del cors
var corsOptions = {
    origin: '*',
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


//capturar el body
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//import middleware
const verifyToken = require('./app/middleware/validate-token');
const uploadMiddleware = require('./app/middleware/img-upload');

//import routes
const authRoutes = require('./app/routes/auth');
const postRoutes = require('./app/routes/post');
const userRoutes = require('./app/routes/user');


app.use('/api/blog/auth', authRoutes);
app.use('/api/blog/posts', verifyToken, uploadMiddleware, postRoutes);
app.use('/api/blog/users', verifyToken , userRoutes);

//conexion con la base de datos
dbConnect();


//inicializacion del servidor
const port = 3000
app.listen(port,() =>{
    console.log(`Servidor corriendo en el puerto ${port}`);
})

