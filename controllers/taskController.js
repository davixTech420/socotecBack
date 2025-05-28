const { Op } = require('sequelize');
const Task = require('../models/task');
const User = require("../models/user");
const UsersGroup = require("../models/usersGroup");



exports.getTask = async (req, res) => {
    try {
        const task = await Task.findAll();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { asignadoId, titulo, descripcion } = req.body;
        if((await Task.findAll({where:{titulo}})).length > 0){
            return res.status(400).json({ message: "La tarea ya existe" });
        }

        


        const task = await Task.create({ asignadoId, titulo, descripcion, estado: true });
        res.status(200).json({  message: 'Tarea creada',task});
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea',error });
    }
};


exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { asignadoId, titulo, descripcion } = req.body;

        const taskExist = await Task.findOne({ where :{
            [Op.or] : [{ titulo}],
            id: { [Op.ne]: id },
        }})
        if(taskExist){
return res.status(400).json({ message: "La tarea ya existe" });
        }
        const task = await Task.update({ asignadoId, titulo, descripcion }, {where:{id}});
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea', error });  
    }
};



exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        if(await Task.findAll({where:{id,estado:true}}).lenght > 0){
            return res.status(400).json({ message: 'No se puede eliminar una tarea activa' });
        }
        const task = await Task.destroy({ where: { id } });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};

exports.inactiveTask = async (req,res) => {
    try {
        const id = req.params.id;
        const task = await Task.update({ estado: false }, { where: { id } });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al inactivar la tarea' });
    }
}


exports.activeTask = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.update({ estado: true }, { where: { id } });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al activar la tarea' });
    }
}



exports.getTaskMyGroup = async (req, res) => {
    try {
        const { id } = req.params; 
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const userGroup = await UsersGroup.findOne({ where: { userId: user.id } });
        if (!userGroup) {
            return res.status(404).json({ error: 'Usuario no pertenece a ningún grupo' });
        }
        const usersInGroup = await UsersGroup.findAll({ where: { groupId: userGroup.groupId } });
        const userIds = usersInGroup.map(userGroup => userGroup.userId);
        const users = await User.findAll({ where: { id: userIds } });
        const tasks = await Task.findAll({ where: { asignadoId: userIds } });
        res.status(200).json({tasks,users});
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};