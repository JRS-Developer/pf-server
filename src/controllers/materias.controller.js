const Materias = require('../models/Materias')
const Joi = require('joi')

const getMateriaSchema = Joi.object({
    name: Joi.string().allow(''),
  })
  
  const createMateriaSchema = Joi.object({
    name: Joi.string().required(),
  })


  const get_materias = async (req, res, next) => {
    try {
      const materias = await Materias.findAll()
  
      //se envia la respuesta como un arreglo de objetos
      res.json(materias)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }


//get para obtener la materia
const get_one_materia = async (req, res, next)=>{
    try{
        const { id } = req.params
        
        const materia_found = await Materias.findByPk(id)
      
      
          //se verifica si se encontró coincidencia y se retorna el objeto sino se envia error
          if (!materia_found) return res.status(400).json({ error: "No encontramos la materia" })
      
          return res.json(materia_found)
        } catch (error) {
          console.error(error)
          next(error)
        }
}

//post para crear la materia
const create_materia = async (req, res, next)=>{
    try{
    const { name } = req.body
    
    const { error } = createMateriaSchema.validate({ name })
    if (error) return res.status(400).json({ error: error.details[0].message })
    
    
    const [nuevaMateria, created] = await Materias.findOrCreate({
        where: {name, status:true},
    })
    if (!created)return res.status(400).json({ error: 'Ya hay una materia con ese nombre' })
    

    res.json({ message: 'materia successfully created' })
    }catch(error){
        next(error)
    }
}

//delete para eliminar materia
const delete_materia = async (req, res, next)=>{
    try{
        const { id } = req.params
        await Materias.update({status: false}, {where: {id}})
        res.json({message: 'materia was deleted'})
    }catch(error) {
        next(error)
    }
}

module.exports = {
    get_materias,
    get_one_materia,
    create_materia,
    delete_materia
}