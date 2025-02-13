const User = require('../models/user');
const UsersGroup = require("../models/usersGroup");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

//confirmacion al email para crear el usuario 
//se envia un email con un token y al confirmar el correo
//se debe de crear el usuario

exports.validarUser = async (req, res) => {
  const { nombre, telefono, email, password } = req.body;
  try {

    // Generar un token con expiración
    const token = jwt.sign({ nombre, telefono, email, password }, process.env.JWT_SECRET, { expiresIn: '5h' });

    // este es el link donde si el token coincide con el que se envio en el email se crea el usuario
    const resetLink = `http://localhost:3000/api/public/register/${token}`;

    //autenticacion para enviar los gmails/
    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();


    // Configurar nodemailer con OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'cristhiandavidamaya93@gmail.com', // El correo electrónico que envía
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Enviar el correo al usuario
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Crear Cuenta En Socotec Colombia',
      html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
    }
    .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        font-size: 24px;
        color: #333;
    }
    p {
        font-size: 16px;
        color: #666;
        line-height: 1.6;
    }
    .button {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #007BFF;
        color: white;
        text-decoration: none;
        font-size: 16px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    }
    .button:hover {
        background-color: #0056b3;
    }
    .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 12px;
        color: #999;
    }
    .footer p {
        margin: 0;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Crear Cuenta</h1>
    <p>Hola,</p>
    <p>Recibimos una solicitud para crear una nueva cuenta en Socotec colombia. Haz clic en el botón de abajo para crear la cuenta:</p>
    <a href="${resetLink}" class="button">Crear Usuario</a>
    <p>Este enlace expirará en 5 minutos. Si no solicitaste esto, puedes ignorar este correo.</p>
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
    </div>
</div>
</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo Enviado Con Exito', status: 200, nombre, telefono, email, password });
  } catch (error) {
    res.status(500).json(error);
  }
}
/**/

// registrar usuarios 
exports.registerUser = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { nombre, telefono, email, password } = decoded;
    if (!nombre || !telefono || !email || !password) {
      return res.status(400).json({ message: 'Datos incompletos en el token' });
    }

    try {
      const user = await User.create({
        nombre,
        telefono,
        email,
        password: await bcrypt.hash(password, 10),
        estado: true,
        role: "employee",
      });
      /*  res.status(200).json({ message: 'Usuario creado exitosamente' }); */
      res.redirect("http://10.48.5.155:8081/singIn");
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el empleado' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token ha expirado' });
    } else {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};



exports.createUser = async (req, res) => {
  try {
    const { nombre, telefono, email, password } = req.body;
    const validateEmail = await User.findOne({ where: { email, telefono } });
    if (validateEmail) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
      nombre,
      telefono,
      email,
      password: await bcrypt.hash(password, 10),
      estado: true,
      role: "employee",
    });
    return res.status(201).json({ message: "Usuario creado", user });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear usuario", error });

  }
}



exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    if (user.estado === false) {
      return res.status(401).json({ message: "Usuario inactivo" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, nombre: user.nombre, telefono: user.telefono },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    return res.json({ token, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: "Error en el login", error });
  }
};


exports.emailPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const resetLink = `http://10.48.5.155:8081/forgotPass/${token}`;
    //autenticacion para enviar los gmails/
    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();


    // Configurar nodemailer con OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'cristhiandavidamaya93@gmail.com', // El correo electrónico que envía
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Enviar el correo al usuario
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperar Contraseña En Socotec Colombia',
      html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
    }
    .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        font-size: 24px;
        color: #333;
    }
    p {
        font-size: 16px;
        color: #666;
        line-height: 1.6;
    }
    .button {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #007BFF;
        color: white;
        text-decoration: none;
        font-size: 16px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    }
    .button:hover {
        background-color: #0056b3;
    }
    .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 12px;
        color: #999;
    }
    .footer p {
        margin: 0;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Recuperar Constraseña</h1>
    <p>Hola,</p>
    <p>Recibimos una solicitud para recuperar la contraseña de tu cuenta en Socotec colombia. Haz clic en el botón de abajo para restablecer la contraseña:</p>
    <a href="${resetLink}" class="button">Restablecer contraseña</a>
    <p>Este enlace expirará en 10 minutos. Si no solicitaste esto, puedes ignorar este correo.</p>
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
    </div>
</div>
</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo Enviado Con Exito', email });

  } catch (error) {

    return res.status(500).json({ message: 'Error interno del servidor' });

  }
}



exports.forgotPassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario por ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar la contraseña del usuario
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la nueva contraseña
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token ha expirado' });
    } else {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}



exports.validarToken = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;
    if (!id || !role) {
      return res.status(400).json({ message: 'Datos incompletos en el token' });
    }
    res.status(200).json({ message: 'Token validado', id, role });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token ha expirado' });
    } else {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}



//endpoint para obtener los usuario
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
}



//endpoint para eliminar un  usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json(error);
  }
}


// endpoint para actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    user.nombre = nombre;
    user.telefono = telefono;
    user.email = email;
    user.role = role;
    await user.save();
    res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json(error);
  }
}

//endpoint para inactivar usuarios
exports.inactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    user.estado = false;
    await user.save();
    res.status(200).json({ message: "Usuario inactivado" });

  } catch (error) {
    res.status(500).json(error);

  }
}

//endpoint para activar usuarios
exports.activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    user.estado = true;
    await user.save();
    res.status(200).json({ message: "Usuario activado" });

  } catch (error) {
    res.status(500).json(error);

  }
}

