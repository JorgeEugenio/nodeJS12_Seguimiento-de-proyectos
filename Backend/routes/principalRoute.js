const express = require('express')
 const {
    getPrincipal
 } = require('../controllers/principalController')

 const api = express.Router()

 api.get('/principal', getPrincipal)

 module.exports = api