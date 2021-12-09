const Materias = require('../models/Materias')
const Joi = require('joi')

const getMateriaSchema = Joi.object({
    id: Joi.string().guid().required(),
    name: Joi.string().allow(''),
  })
  
  const createMateriaSchema = Joi.object({
    id: Joi.string().guid().required(),
    name: Joi.string().required(),
  })

//get para obtener la materia
const get_materia = async (req, res, next)=>{
    try{
        const {id, name} = req.body
        
        const { error } = getMateriaSchema.validate({ id, name })
        if (error) return res.status(400).json({ error: error.details[0].message })
        
        if(id){
            const findMateria = await Materias.findAll({
                where:{id, name}
            })
            return res.json(findMateria)
        }else{
            return res.status(400).json({message: 'This materia do not exist'})
        }
    }catch(error) {
        next(error)
    }
}

//post para crear la materia
const create_materia = async (req, res, next)=>{
    try{
    const { name } = req.body
    
    const { error } = createMateriaSchema.validate({ id, name })
    if (error) return res.status(400).json({ error: error.details[0].message })
    
    const materiaFound = await Materias.findByPk(id)
    if (!materiaFound)return res.status(400).json({ error: 'There is not any materia with that ID' })

    await Materias.create({name})
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