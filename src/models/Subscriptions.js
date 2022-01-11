const { conn } = require('../db')
const User = require('./User')

// const Subscription = conn.define('subscriptions', {
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//         allowNull: false,
//     },
//     endpoint: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     keys
