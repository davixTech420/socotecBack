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
        res.status(500).json({ error: 'Error al crear registro de inventario' });
    }
};


