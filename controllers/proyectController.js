const Proyect = require('../models/proyect');
const User = require('../models/user');

exports.getProyect = async (req, res) => {
    try {
        const proyect = await Proyect.findAll();
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};

exports.createProyect = async (req, res) => {
    try {
        const { nombre, presupuesto, fechaEntrega } = req.body;
        const proyect = await Proyect.create({ nombre, presupuesto, fechaEntrega, estado: true });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};


exports.updateProyect = async (req, res) => {
    try {
        const { nombre, presupuesto, fechaEntrega, estado } = req.body;
        const proyect = await Proyect.update({ nombre, presupuesto, fechaEntrega, estado });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};



exports.deleteProyect = async (req, res) => {
    try {
        const id = req.params.id;
        const proyect = await Proyect.destroy({ where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};