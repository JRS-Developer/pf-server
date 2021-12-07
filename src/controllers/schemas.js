const Joi = require('joi');

//USER SCHEMAS
const password = /(?=\w*\d)(?=\w*?[A-Z]?)(?=\w*[a-z]?)\S{8,16}$/
const username = /(^([A-Z]|[a-z]))(?=\w\d)(?=\w[A-Z]?)(?=\w*[a-z]?)\S{8,12}$/

const create_user_sch = Joi.object({

    username: Joi.string().regex(username).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    identification: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(password).required(),
    avatar: Joi.string().uri(),

});

const upDate_user_sch = Joi.object({

    username: Joi.string().regex(username),
    first_name: Joi.string(),
    last_name: Joi.string(),
    identification: Joi.number(),
    email: Joi.string().email(),
    password: Joi.string().regex(password),
    avatar: Joi.string().uri(),

});


module.exports = {
    create_user_sch,
    upDate_user_sch
}