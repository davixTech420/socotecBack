const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      if (req.userRole !== requiredRole) {
        return res.status(403).json({ message: 'No autorizado' });
      }
      next();
    };
  };
  module.exports = roleMiddleware;