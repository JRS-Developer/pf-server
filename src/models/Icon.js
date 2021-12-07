const { DataTypes } = require('sequelize');
import { conn } from '../db';
import Module from './Module';
import Action from "./Action";

const Icon = conn.define('icons', {
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

//Module
Icon.belongsTo(Module) // belongsTo = Tiene muchos
Module.hasOne(Icon) // hasOne = Tiene uno

//Action
Icon.belongsTo(Action) // belongsTo = Tiene muchos
Action.hasOne(Icon) // hasOne = Tiene uno

export default Icon
