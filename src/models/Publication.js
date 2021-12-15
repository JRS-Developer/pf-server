const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const User = require('./User')
const Like = require('./Like')

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
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  files: {
    type: DataTypes.ARRAY(DataTypes.STRING),
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

module.exports = Publication
