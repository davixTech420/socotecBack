const express = require('express');
const sequelize = require('./config/bd');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const User = require('./models/user');
const port = 3000;

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World!');
});

sequelize.sync({ force:true,alter:false }).then(() => {
  app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ', port);
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
});
