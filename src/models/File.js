const { DataTypes } = require('sequelize')
const { conn } = require('../db')

const File = conn.define('file', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
	name : {
		type: DataTypes.STRING,
		allowNull: false
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false
	}
})

module.exports = File
