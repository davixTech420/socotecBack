const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// registrar usuarios 
exports.registerUser = async (req, res) => {
  const { nombre, telefono, email, password } = req.body;
  try {
    const user = await User.create({
      nombre,
      telefono,
      email,
      password: await bcrypt.hash(password, 10),
      estado: true,
      role: 'employee',
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el empleado' });
  }
};

