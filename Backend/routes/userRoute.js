const express = require('express')
 const {
    addUser,
    getUsers,
    getUserxEmail,
    getUser,
    updateUser,
    deleteUser
 } = require('../controllers/userController')

 const api = express.Router()
    api.post('/user',addUser)
    api.get('/user',getUsers)
    api.get('/user/:email',getUserxEmail)
    api.get('/user/:email/:password',getUser)
    api.put('/user/',updateUser)
    api.delete('/user/:id',deleteUser)

 module.exports = api