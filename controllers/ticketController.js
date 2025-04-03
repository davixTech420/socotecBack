const Ticket = require("../models/ticket");






exports.createTicket = async (req,res) => {
    try {
        const {userId,remoto,descripcion} = req.body;
        const ticket = 



        
    } catch (error) {
        res.status(500).json({message:"HA ocurrido un error"})
    }

}