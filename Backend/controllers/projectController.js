const mongoose = require('mongoose')
const Project = require('../models/Project')


async function addProject(req, res){
    try {
        const {
            nombreProject,
            personacargoProject
        } = req.body
        const project = Project({
            nombreProject,
            personacargoProject
        })
        await project.save()  
        res.status(201).send(project)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function getProjects(req, res){
    try {
        const projects = await Project.aggregate()
                                        .match({})
                                        .lookup({
                                            from: 'users',
                                            localField: 'personacargoProject',
                                            foreignField: '_id',
                                            as: 'detalles'
                                        })
                                        .replaceRoot({
                                            detalles: { $mergeObjects: [ { $arrayElemAt: [ "$detalles", 0]}, "$$ROOT"]}
                                        })
                                        .project({
                                            "_id":"$detalles._id",
                                            "nombreProject":"$detalles.nombreProject",
                                            "personacargoProject":"$detalles.personacargoProject",
                                            "nombreUser":"$detalles.nombres",
                                            "apellidoUser":"$detalles.apellidos",
                                            "emailUser":"$detalles.email",
                                            "imgUrlUser":"$detalles.imgUrl"
                                        })
        res.status(200).send(projects)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function updateProject(req, res){
    try {
        await Project.findByIdAndUpdate(req.body)
        res.status(200).send({ status: 'Project actualizado'})
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function deleteProject(req, res){
    try {
        await Project.findByIdAndDelete(req.params.id)
    } catch (e) {
        res.status(500).send({ message: e.message})
    }
}

async function getProject(req, res){
    try {
        const project = await Project.aggregate()
                                        .match({'_id':req.params.id})
                                        .lookup({
                                            from: 'users',
                                            localField: 'personacargoProject',
                                            foreignField: '_id',
                                            as: 'detalles'
                                        })
                                        .replaceRoot({
                                            detalles: { $mergeObjects: [ { $arrayElemAt: [ "$detalles", 0]}, "$$ROOT"]}
                                        })
                                        .project({
                                            "_id":"$detalles._id",
                                            "nombreProject":"$detalles.nombreProject",
                                            "nombreUser":"$detalles.nombres",
                                            "apellidoUser":"$detalles.apellidos",
                                            "emailUser":"$detalles.email",
                                            "imgUrlUser":"$detalles.imgUrl"
                                        })
        res.status(200).send(project[0])
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

module.exports = {
    addProject,
    getProjects,
    updateProject,
    deleteProject,
    getProject
}