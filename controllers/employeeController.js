const { beyondcorp } = require("googleapis/build/src/apis/beyondcorp");
const Employee = require("../models/employee");
const User = require("../models/user");
const bcrypt = require('bcryptjs');


//actualizar empleado
exports.updateEmployee = async (req, res) => {
  try {
    const { id, cargo } = req.body; 
    const employee = await Employee.findByPk(id);
    if (!employee) {
      res.status(404).json({ message: "No se encontro empleado" });
    }
    employee.cargo = cargo;
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar empleado" });
  }
}








exports.createEmployee = async (req, res) => {
  try {
    const { nombre, telefono, email, password,cargo } = req.body;
    const user = await User.create({
      nombre,
      telefono,
      email,
      password: await bcrypt.hash(password, 10),
      estado: true,
      role: "employee",
    });
    await Employee.create({
        userId: user.id,
        cargo
    });
    const response = {
        id: user.id,
        nombre: user.nombre,
        telefono: user.telefono,
        email: user.email,
        estado: user.estado,
        role: user.role,
        password:user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        cargo: cargo,
    }
console.log(response);
    res.status(201).json({ message: "Empleado creado",user:response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear empleado" });
  }
};

//obtener empleado
exports.getEmployee = async (req, res) => {
    try {
      
      const users = await User.findAll({
        where: { role: "employee" },
      });
      const employees = await Employee.findAll();
      const response = users.map(user => {
        const employee = employees.find(emp => emp.userId === user.id);
        return {
          id: user.id,
          nombre: user.nombre,
          telefono: user.telefono,
          email: user.email,
          estado: user.estado,
          role: user.role,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          cargo: employee ? employee.cargo : null, 
        };
      });
  
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener empleados" });
    }
  };