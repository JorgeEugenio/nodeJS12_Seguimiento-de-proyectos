const User = require('../models/User.js')

async function addUser(req,res){
    try {
        const {
            nombres,
            apellidos,
            email,
            password

        } = req.body

        const usuario = User({
            nombres,
            apellidos,
            email,
            password
        })
        await usuario.save()
        res.status(201).json(usuario)
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

async function getUsers(req,res){
    try {
        const usuarios = await User.aggregate()
                                    .project({
                                        "nombres":"$nombres",
                                        "apellidos":"$apellidos",
                                        "email":"$email",        
                                        "createdAt":"$createdAt",
                                        "updatedAt":"$updatedAt",
                                    })
        res.status(200).json(usuarios)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function getUserxEmail(req,res){
    try {
        const usuario = await User.aggregate()
                            .match({
                                "email": req.params.email
                            })
                            .project({
                                "_id": "1",
                                "nombres":"$nombres",
                                "apellidos":"$apellidos",
                                "email":"$email"
                            })
        res.json(usuario)
    } catch (e) {
        res.status(500).json({ message: e. message})
    }
}

async function getUser(req,res){
    try {
        const usuario = await User.aggregate()
                            .match({
                                "email": req.params.email,
                                "password": req.params.password,
                            })
                            .project({
                                "_id": "1",
                                "nombres":"$nombres",
                                "apellidos":"$apellidos",
                                "email":"$email"
                            })
        res.json(usuario)
    } catch (e) {
        res.status(500).json({ message: e. message})
    }
}

async function updateUser(req,res){
    try {
        await usuario.findByIdAndUpdate(req.params.id)
        res.json({status: 'Usuario Actualizado'})
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
}

async function deleteUser(req,res){
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({status: 'Usuario Eliminado'})
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
}
module.exports = {
    addUser,
    getUsers,
    getUserxEmail,
    getUser,
    updateUser,
    deleteUser
}