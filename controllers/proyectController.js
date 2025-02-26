const { Op } = require('sequelize');
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
        const { nombre,descripcion, presupuesto,cliente,fechaInicio, fechaEntrega,grupo } = req.body;

        if((await Proyect.findAll({where:{nombre}})).length > 0){
            return res.status(400).json({ message: "El nombre del proyecto ya existe" });
        }

        const proyect = await Proyect.create({ nombre,descripcion, presupuesto,cliente,fechaInicio, fechaEntrega, estado: true });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
};


exports.updateProyect = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion,presupuesto,cliente, fechaInicio,fechaEntrega } = req.body;


        const proyectExist = await Proyect.findOne({ where :{
            [Op.or] : [{ nombre}],
            id: { [Op.ne]: id },
        }})
        if(proyectExist){
return res.status(400).json({ message: "El nombre del proyecto ya existe" });
        }
        const proyect = await Proyect.update({ nombre, descripcion,presupuesto,cliente, fechaInicio, fechaEntrega }, {where:{id}});
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proyecto', error });  
    }
};



exports.deleteProyect = async (req, res) => {
    try {
        const id = req.params.id;

        if(await Proyect.findAll({where:{id,estado:true}})){
            return res.status(400).json({ message: 'No se puede eliminar un proyecto activo' });
        }
        const proyect = await Proyect.destroy({ where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
};



exports.activeProyect = async (req, res) => {
    try {
        const id = req.params.id;
        const proyect = await Proyect.update({ estado: true }, { where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al activar el proyecto' });
    }
};



exports.inactiveProyect = async (req,res) => {
    try {
        const id = req.params.id;
        const proyect = await Proyect.update({ estado: false }, { where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al inactivar el proyecto' });
    }
}

exports.modifyGroupProyect = async (req, res) => {
    try {
        const { groupId } = req.params;


        const proyect = await Proyect.update({ groupId }, { where: { id } });

        
        
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar el grupo del proyecto' });
    }
}