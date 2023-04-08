import http from "./httpService";

// Import Endpoints
import { contactImagesUrl,imagesUrl} from '../config/Endpoints';

const apiEndpoint=imagesUrl


const getImagesForContact=async(id)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?contact_id=${id}`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}
const getOptions = async() => {
    try {
        const {data}=await  http.options(`${apiEndpoint}`)
        return data
      } catch (error) {
          console.log(error)
      }
}


const updateImageForContact=async(id,formData)=>{
    try {
        const {data}=await http.put(`${apiEndpoint}${id}/`,formData,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const uploadImageForContact=async(formData)=>{
    try {
        const {data}=await http.post(`${apiEndpoint}`,formData,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const deleteImageForContact=async(id)=>{
    try {
        const {data}=await http.delete(`${apiEndpoint}${id}/`,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}


const getImagesForTrust=async(id)=>{
    if(!id) return []
    try {
        const {data}=await http.get(`${apiEndpoint}?trust_id=${id}`)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}



const updateImageForTrust=async(id,formData)=>{
    try {
        const {data}=await http.put(`${apiEndpoint}${id}/`,formData,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const uploadImageForTrust=async(formData)=>{
    try {
        const {data}=await http.post(`${apiEndpoint}`,formData,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const deleteImage=async(id)=>{
    try {
        const {data}=await http.delete(`${apiEndpoint}${id}/`,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const getImages=async()=>{
    try {
        const {data}=await http.get(`${apiEndpoint}`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}
export default {
    updateImageForTrust,
    uploadImageForTrust,
    getImagesForTrust,
    getImagesForContact,
    getOptions,
    updateImageForContact,
    uploadImageForContact,
    deleteImageForContact,
    deleteImage,
    getImages
}