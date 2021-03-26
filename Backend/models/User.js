const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = Schema({
    nombres: String,
    apellidos: String,
    email: String,
    password: String
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)