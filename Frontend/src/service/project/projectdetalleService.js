import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'projectsdetalle'
export default class Projectdetalle{
    create(project){
        return axios.post( urlBase, project )
    }
    read(){
        return axios.get( urlBase )
    }

    update(projectId, project){
        return axios.put( urlBase + '/'+projectId, project)
    }

    delete(projectId){
        return axios.delete(urlBase + '/' + projectId)
    }
    readProjectxId(projectId){
        return axios.get( ENDPOINT_PATH + 'projectsdetallexid/' + projectId)
    }
}