// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
 const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Falló la autenticación del token' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

module.exports = authMiddleware;