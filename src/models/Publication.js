const { DataTypes } = require('sequelize')
const { conn } = require('../db')
const User = require('./User')

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
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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

Publication.belongsTo(User, { foreignKey: 'publisher_id', allowNull: false, as: 'publisher' })
User.hasMany(Publication, { foreignKey: 'publisher_id',  })

module.exports = Publication
