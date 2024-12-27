const express = require('express');
const sequelize = require('./config/bd');
const cors = require('cors');
const bodyParser = require('body-parser');
const publicRoutes = require('./routes/publicRoutes');
const app = express();
const User = require('./models/user');
const port = 3000;
//configuracion de back
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());

//rutas del backend o endpoints
app.use("/api/public", publicRoutes);


//iniciso del servidor ojo el force en true elimina toda la base de datos
sequelize.sync({ force:false,alter:false }).then(() => {
  app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ', port);
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
});
