import http from "./httpService";

// Import Endpoints
import {documentsTypeUrl, documentsUrl} from '../config/Endpoints';

const apiEndpoint=documentsUrl

const getDocumentsForContacts=async(id,name)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?${name}=${id}`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const getDocumentsForTrust=async(id)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?trust_id=${id}`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}
const getOptions = async() => {
    try {
        const {data}=await  http.get(`${documentsTypeUrl}`)
        return data
      } catch (error) {
          console.log(error)
      }
}

const deleteDocument=async(id)=>{
    try {
        const {data}=await http.delete(`${apiEndpoint}${id}/`,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const updateDocument=async(id,formData)=>{
    try {
        const {data}=await http.put(`${apiEndpoint}${id}/`,formData,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const uploadDocument=async(formData)=>{
    try {
        const {data}=await http.post(`${apiEndpoint}`,formData,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

export default {
    getOptions,
    updateDocument,
    uploadDocument,
    deleteDocument,
    getDocumentsForTrust,
    getDocumentsForContacts
}