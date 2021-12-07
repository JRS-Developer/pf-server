const { Users } = require('../models')

const addUsers= async(req, res)=>{
    try{
        const { users_id, users_name } = req.body
        if(!users_name){
        const userFind = await Users.findAll({where:{users_id, users_name}})
        return res.json(userFind)
        }else{
            return res.json({message: 'este usuario ya se encuentra aqui'})
        }
    
    }catch (error){
        console.log(error)
    }
}


const deleteUsers= async(req, res)=>{
    try{
        const {id} = req.params

        const deleted = await Users.destroy({where:{id}})
        if (deleted) return res.json({message: 'User deleted successfully'})
        return res.status(400).json({message: 'There is not any user with that ID'})
    }catch(error){
        console.error(error);
    }
}

module.exports = {
    addUsers,
    deleteUsers
}