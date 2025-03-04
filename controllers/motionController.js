const Motion = require('../models/motion');




exports.getMotions = async (req, res) => {
  try {
    const motions = await Motion.findAll();
    res.status(200).json(motions);
  } catch (error) {
    res.status(500).json(error);
  }
}

//endpoint para crear un movimiento
exports.createMotion = async (req, res) => {
  try {
    const {tipoMovimiento, fecha, monto, descripcion, cuentaEmisoraId, cuentaReceptoraId } = req.body;
    const motion = await Motion.create({
      tipoMovimiento,
      fecha,
      monto,
      descripcion,
      cuentaEmisoraId,
      cuentaReceptoraId,
      estado : true,
    });
    res.status(201).json({ message: "Movimiento creado", motion });
  } catch (error) {
    res.status(500).json(error);
  }
}

// endpoint para actualizar un movimiento
exports.updateMotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, monto, descripcion, cuentaEmisoraId, cuentaReceptoraId, estado } = req.body;
    const motion = await Motion.findByPk(id);
    if (!motion) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    motion.fecha = fecha;
    motion.monto = monto;
    motion.descripcion = descripcion;
    motion.cuentaEmisoraId = cuentaEmisoraId;
    motion.cuentaReceptoraId = cuentaReceptoraId;
    motion.estado = estado;
    await motion.save();
    res.status(200).json({ message: "Movimiento actualizado" });
  } catch (error) {
    res.status(500).json(error);
  }
}


exports.deleteMotion = async (req, res) => {
  try {
    const { id } = req.params;
    const motion = await Motion.findByPk(id);
    if (!motion) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    await motion.destroy();
    res.status(200).json({ message: "Movimiento eliminado" });
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.inactiveMotion = async (req,res) => {
  try{
    const {id} = req.params;
    const motion = await Motion.findByPk(id);
    if(!motion){
      return res.status(404).json({message:"Movimiento no encontrado"});
    }
    motion.estado = false;
    await motion.save();
    res.status(200).json({message:"Movimiento desactivado"});
  }catch(error){
    res.status(500).json({message:"Error interno del servidor",error});
  }
}



exports.activeMotion = async (req,res) => {
  try{
    const {id} = req.params;
    const motion = await Motion.findByPk(id);
    if(!motion){
      return res.status(404).json({message:"Movimiento no encontrado"});
    }
    motion.estado = true;
    await motion.save();
    res.status(200).json({message:"Movimiento activado"});
  }
  catch(error){
    res.status(500).json({message:"Error interno del servidor",error});
  }
}