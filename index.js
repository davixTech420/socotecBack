const express = require('express');
const sequelize = require('./config/bd');
const cors = require('cors');
const bodyParser = require('body-parser');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require('./routes/employeeRoutes');
const app = express();
const User = require('./models/user');
const Proyect = require('./models/proyect');
const Employee = require('./models/employee');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require("./middleware/roleMiddleware");
const port = 3000;
//configuracion de back
require('dotenv').config();
app.use(cors({origin:"*"}));
app.use(bodyParser.json());

//rutas del backend o endpoints rutas publicas
app.use("/api/public", publicRoutes);
//rutas para el empleado validando autenticacion con token y con roles
app.use("/api/employee", authMiddleware);
app.use("/api/admin", authMiddleware,roleMiddleware("admin"),adminRoutes);



//iniciso del servidor ojo el force en true elimina toda la base de datos
sequelize.sync({ force:false,alter:false }).then(() => {
  app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ', port);
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
});
