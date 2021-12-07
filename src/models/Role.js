const { DataTypes } = require('sequelize');
import { conn } from '../db';

const Role = conn.define('roles', {
  id:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },

}, {
  timestamps: false
});

export default Role
