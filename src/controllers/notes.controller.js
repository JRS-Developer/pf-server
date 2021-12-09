const { ne } = require('sequelize/dist/lib/operators')
const Notes = require('../models/Notes')
const Joi = require('joi')

const getNotesSchema = Joi.object({
    notes_id: Joi.string().guid().required(),
    value: Joi.string().allow(''),
})

const createNotesSchema = Joi.object({
    notes_id: Joi.string().guid().required(),
    value: Joi.string().allow(''),
})

const updateNotesSchema = Joi.object({
    id: Joi.string().guid().required(),
    value: Joi.string().allow(''),
})


const get_notes = async(req, res, next)=>{
    try{
        const { value } = req.body
       
        const { error } = getNotesSchema.validate(notes_id, value)
        if (error) return res.status(400).json({ error: error.details[0].message })

        if(value){
           const findNote = await Notes.findAll({
               where:{value}
           })
           return res.json(findNote)
        }
    }catch(error){
        next(error)
    }
}

const create_note = async(req, res, next)=>{
    try{
        const { value } = req.body
        
        const { error } = createNotesSchema.validate({ value, notes_id  })
        if (error) return res.status(400).json({ error: error.details[0].message })
        
        const notesFound = await Notes.findByPk(notes_id)
        if (!notesFound)return res.status(400).json({ error: 'There is not any note' })


        await Notes.create(value)
        res.json({message:'create!'})
    }catch(error) {
        next(error)
    }
}

const delete_note = async(req, res, next)=>{
    try{
        const {value} = req.params
        await Notes.destroy({where:{value:value}})
        res.json({message: 'note deleted'})
    }catch(error){
        next(error)
    }
}

const upDate_note = async(req, res, next)=>{
    try{
        const { id } = req.params
        
        const { error } = updateNotesSchema.validate({ id, value })
        if (error) return res.status(400).json({ error: error.details[0].message })
        
        if(id){
            await Notes.update({where:{id:id}})
            return res.json({message: 'note succesfully modified'})
        }
    }catch(error){
        next(error)
    }
}

module.exports = {
    get_notes,
    create_note,
    delete_note,
    upDate_note
}