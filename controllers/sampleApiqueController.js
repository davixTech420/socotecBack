const sampleApique = require("../models/sampleApique");

exports.getSampleApiqueById = async (req,res) => {
    try {
        const {apiqueId} = req.params;
        const muestras =await sampleApique.findAll({where:{apiqueId:apiqueId}});
        res.status(200).json(muestras);
    } catch (error) {
        res.status(500).json({error});
    }
}