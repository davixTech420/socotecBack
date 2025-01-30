const Inventory = require('../models/inventory');
const User = require('../models/user');


exports.getInventory = async (req, res) => {
    try {
        const proyect = await Inventory.findAll();
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el inventario' });
    }
};

exports.createInventory = async (req, res) => {
    try {
        const { nombreMaterial, descripcion,cantidad, unidadMedida,precioUnidad } = req.body;
        const inventory = await Inventory.create({ nombreMaterial, descripcion, cantidad,unidadMedida,precioUnidad,estado:true });
        res.status(200).json(inventory); 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear registro de inventario' + error });
    }
};


exports.updateInventory = async (req,res) => {
try{
    const { nombreMaterial, descripcion,cantidad, unidadMedida,precioUnidad } = req.body;
    const inventory = await Inventory.findByPk(req.params.id);
    if(!inventory){
        res.status(404).json({ error: 'No se encontro el registro' });
    }
    inventory.update({ nombreMaterial, descripcion, cantidad,unidadMedida,precioUnidad });
    res.status(200).json({ message: 'Registro actualizado' });

}catch(error){
    res.status(500).json({ error: 'Error al actualizar el registro de inventario' + error });
}

}
exports.deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const proyect = await Inventory.findByPk(id);
        if (!proyect) {
            res.status(404).json({ error: 'No se encontro el registro' });
        }
        await proyect.destroy();
        res.status(200).json({ message: 'Registro eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' + error });
    }
};


exports.activeInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const proyect = await Inventory.findByPk(id);
        if (!proyect) {
            res.status(404).json({ error: 'No se encontro el registro' });
        }
        proyect.update({ estado: true });
        res.status(200).json({ message: 'Registro activado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al activar el registro' + error });
    }
};

exports.inactiveInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const proyect = await Inventory.findByPk(id);
        if (!proyect) {
            res.status(404).json({ error: 'No se encontro el registro' });
        }
        proyect.update({ estado: false });
        res.status(200).json({ message: 'Registro desactivado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al desactivar el registro' + error });
    }
};


