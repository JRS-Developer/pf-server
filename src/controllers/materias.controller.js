const Materias = require('../models/Materias')

//get para obtener la materia
const get_materia = async (req, res, next)=>{
    try{
        const {id, name} = req.body
        if(id){
            const findMateria = await Materias.findAll({
                where:{id, name}
            })
            return res.json(findMateria)
        }else{
            return res.json({message: 'This materia do not exist'})
        }
    }catch(error) {
        next(error)
    }
}

//post para crear la materia
const create_materia = async (req, res, next)=>{
    try{
    const { name } = req.body
    await Materias.create(name)
    res.json({ message: 'materia successfully created' })
    }catch(error){
        next(error)
    }
}

//delete para eliminar materia
const delete_materia = async (req, res, next)=>{
    try{
        const { id } = req.params
        await Materias.destroy({where: {id: id}})
        res.json({message: 'materia was deleted'})
    }catch(error) {
        next(error)
    }
}

module.exports = {
    get_materia,
    create_materia,
    delete_materia
}