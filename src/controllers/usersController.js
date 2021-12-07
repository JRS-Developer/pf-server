import User from '../models/User';
import Profile from '../models/Profile';




    //users

    //get para obtener datos de usuarios
   const get_user_info = async (req, res, next) => {
        try{
            const { id } = req.query

            // Buscamos usuarios por ID (pasado por query) para acceder al detalle de uno en particular 
            if(id){
                const user_found = await User.findByPk(id);
    
                if(!user_found) return res.status(400).json({error: "There isn't any user with that id"});
    
                return res.json(user_found);
            };
            
            //Buscamos todos los usuarios disponibles
            const users = await User.findAll({
                where: { 
                    school_id, 
                    role_id
                }
            });
    
            res.json(users);
            //manejo del error con try catch pasando mano con next.
        } catch(error){
            next(error)
        }
       
    },

    //get para obtener datos de usuarios por roles
    const user_info_by_role = async (req, res) => {
        res.send('se trae la info de usuarios por rol');
    },

    //post para añadir usuario
    const create_user = async (req, res, next) => {

        try{
            const {name, email, password, avatar} = req.body

         await User.create(
            name,
            email,
            password,
            avatar,
        );
            
        res.json({message: 'user successfully created'});

        } catch(error){
            next(error);
        };

        
    },

    //delete para eliminar usuario
    const user_delete = async (req, res) => {
        res.send('se elimina usuario de la BD');
    },

    //put para cambiar rol de usuario
    const user_role_set = async (req, res) => {
        res.send('PUT para cambiar el rol del usuario');
    }

    //roles

    //Post para modificar




module.exports= {
    
    get_user_info,
    user_info_by_role,
    create_user,
    user_delete,
    user_role_set,


}
