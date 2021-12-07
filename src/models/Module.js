const { DataTypes } = require('sequelize');
import { conn } from '../db';
import Action from "./Action";

const Module = conn.define('modules', {
  id:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  url:{
    type: DataTypes.STRING,
    allowNull: false
  },
  module_id:{
    type: DataTypes.UUID,
    allowNull: false
  },
}, {
  timestamps: false
});

Action.belongsToMany(Module, {through : 'actions_modules'})
Module.belongsToMany(Action, {through : 'actions_modules'})

export default Module
