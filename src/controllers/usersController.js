import User from '../models/User';
import Profile from '../models/Profile';




    //**users**

    //get para obtener datos de usuarios
   const get_user_info = async (req, res, next) => {
        try{
            const { id } = req.query
            const { role_id, school_id } = req.params
            // Buscamos usuarios por ID (pasado por query) para acceder al detalle de uno en particular 
            if(id){
                const user_found = await User.findByPk(id);
    
                if(!user_found) return res.status(400).json({error: "There isn't any user with that id"});
    
                return res.json(user_found);
            };
            
            //Buscamos todos los usuarios disponibles
            const users = await User.findAll({
                where: { 
                    role_id,
                    school_id
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

    //put para modificar user
    const upDate_user = (req, res, next) => {

        try{
            const { id } = req.params;

            //Manejo de contraseña aparte para validaciones
            const { password } = req.query;

            const { name, email, avatar} = req.body;

            //la password se modifica de forma individual
            if(password){

                await User.update(
                    {password},
                    {
                        where: { 
                            id: id
                        }
                    }
                );

                return res.json({message: 'password succesfully modified'});
            };

            //aca se modifican los demaás datos cuando no sea solicitada la modificación de la password

            await User.update(
                {name, email, avatar},
                {
                    where: {
                        id: id
                    }
                }
            );

            res.json({message: 'user data modified'});

        } catch (error){
            next(error);
        };

  
    },

    //delete para eliminar usuario
    const user_delete = async (req, res, next) => {
        try{
            const { id } = req.params;

            await User.destroy({ where: {id: id}});

            res.json({message: 'user was deleted'});
        } catch (error){
            next(error);
        };
       
    },

    //put para cambiar rol de usuario
    const user_role_set = async (req, res, next) => {
        try{
            const { role_id } = req.body
            const { id } = req.params

            await User.update(
                { role_id }, 
                {
                    where: {
                        id: id,
                    }
                }
            );

            res.json({message: 'user role changed'});
        } catch (error){
            next(error);
        };
        
    };



    //**roles**

    //get para obtener roles
    const get_roles = (req, res, next) => {

    }

    //Post para crear roles
    const create_roles = (req, res, next) => {

    }

    //Put paramodificar roles
    const upDate_roles = (req, res, next) => {

    }

module.exports= {
    
    get_user_info,
    user_info_by_role,
    create_user,
    upDate_user,
    user_delete,
    user_role_set,


}
