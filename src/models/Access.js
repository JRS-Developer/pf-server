const { DataTypes } = require('sequelize');
import { conn } from '../db';

const Access = conn.define('access', {
  id:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id:{
    type: DataTypes.UUID,
    allowNull: false
  },
  module_id:{
    type: DataTypes.UUID,
    allowNull: false
  },
  action_id:{
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  timestamps: false
});

export default Access
