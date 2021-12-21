const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const User = require('./User')
const Like = require('./Like')
const Materia = require('./Materias')
const Class = require('./Classes')
const File = require('./File')

const Publication = conn.define('publication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
})

Publication.belongsTo(User, {
  foreignKey: 'publisher_id',
  allowNull: false,
  as: 'publisher',
})

User.hasMany(Publication, { foreignKey: 'publisher_id' })

// Esto es para contar los likes
Publication.hasMany(Like, { foreignKey: 'post_id' })
Like.belongsTo(Publication, { foreignKey: 'post_id' })

Class.hasMany(Publication)
Publication.belongsTo(Class)

Materia.hasMany(Publication)
Publication.belongsTo(Materia)

// INFO: El post_id y postID es adrede, sin esto no funciona la asociacion entre file como imagen y file como document, si no se hace asi, al colocar setImages() pondra las imagenes en images y documents.
Publication.hasMany(File, { as: 'images', foreignKey: 'postId' })
Publication.hasMany(File, { as: 'documents', foreignKey: 'post_Id' })
File.belongsTo(Publication, { foreignKey: 'postId' })
File.belongsTo(Publication, { foreignKey: 'post_Id' })

module.exports = Publication
