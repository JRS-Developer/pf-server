const { ne } = require('sequelize/dist/lib/operators')
const Notes = require('../models/Notes')

const get_notes = async(req, res, next)=>{
    try{
       const { value } = req.body
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