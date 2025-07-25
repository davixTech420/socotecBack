const express = require("express");
const sequelize = require("./config/bd");
const cors = require("cors");
const bodyParser = require("body-parser");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const app = express();
const User = require("./models/user");
const Proyect = require("./models/proyect");
const Employee = require("./models/employee");
const Inventory = require("./models/inventory");
const Group = require("./models/group");
const UsersGroup = require("./models/usersGroup");
const Permission = require("./models/permission");
const Account = require("./models/account");
const Motion = require("./models/motion");
const Portfolio = require("./models/portfolio");
const Task = require("./models/task");
const Ticket = require("./models/ticket");
const Hiring = require("./models/hiring");
const Apique = require("./models/apique");
const Environmental = require("./models/environmental");
const condicionsEnvironmental = require("./models/condicionsEnvironmental");
const SampleApique = require("./models/sampleApique");
const AssignmentPPE = require("./models/assignmentsPPE");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const port = 3000;
//configuracion de back
require("dotenv").config();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/images", express.static("public/images"));
app.use("/ppe", express.static("public/ppe"));
app.use("/apique", express.static("public/apique"));
//rutas del backend o endpoints rutas publicas
app.use("/api/public", publicRoutes);
//rutas para el empleado validando autenticacion con token y con roles
app.use("/api/admin",authMiddleware,roleMiddleware("admin"),adminRoutes);

app.use("/api/employee",authMiddleware,roleMiddleware("employee"),employeeRoutes);

//iniciso del servidor ojo el force en true elimina toda la base de datos
sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    app.listen(port, () => {
      console.log("Servidor corriendo en el puerto", port);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
