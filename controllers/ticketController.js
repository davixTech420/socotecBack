const Ticket = require("../models/ticket");

exports.getMyTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const tickets = await Ticket.findAll({ where: { userId: id } });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error Al Obtener Los Tickets", error });
  }
};
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findAll();
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error Al Obtener Los Tickets", error });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { userId, remoto, sitio, descripcion } = req.body;
    const ticket = await Ticket.create({
      userId,
      remoto,
      sitio,
      descripcion,
      estado: "En Proceso",
    });
    res.status(201).json({ ticket, message: "Ticket Creado Con Exito" });
  } catch (error) {
    res.status(500).json({ message: "HA ocurrido un error" });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { remoto, sitio, descripcion, estado } = req.body;
    const ticket = await Ticket.update(
      { remoto, sitio, descripcion, estado },
      { where: { id } }
    );
    res.status(200).json({ message: "Actualizado Con Exito", ticket});
  } catch (error) {
    res.status(500).json({ message: "Error Al Actulizar Ticket" });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.destroy({ where: { id } });
    res.status(200).json({ message: "Eliminado Con Exito" });
  } catch (error) {
    res.status(500).json({ message: "Error Al Eliminar El Ticket", error });
  }
};
