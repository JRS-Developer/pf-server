const { DataTypes } = require('sequelize');
import { conn } from '../db';

const Action = conn.define('actions', {
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

export default Action
