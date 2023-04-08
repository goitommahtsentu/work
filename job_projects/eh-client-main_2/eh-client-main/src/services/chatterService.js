import http from "./httpService";

// Import Endpoints
import {chatterUrl } from '../config/Endpoints';

const apiEndpoint=chatterUrl

const getChattersForTrust=async(id)=>{
    if(!id) return []
    try {
        const {data}=await http.get(`${apiEndpoint}?trust_id=${id}`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const getChattersForSituations=async(id)=>{
    if(!id) return []
    try {
        const {data}=await http.get(`${apiEndpoint}?situation_id=${id}`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const getChatterQualForTrust=async(id)=>{
    if(!id) return []
    try {
        const {data}=await http.get(`${apiEndpoint}?trust_id=${id}&chatter_type=1`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const getChattersForContact=async(id)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?contact_id=${id}`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}
const updateAddress=async(id,body)=>{
    try {
        const {data}=await http.put(`${apiEndpoint}${id}/`, JSON.stringify(body))
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

const createChatter=async(formData)=>{
    try {
        const {data}=await http.post(`${apiEndpoint}`,formData,{ headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        console.log(error)
        return
    }
}
export default {
    getChattersForTrust,
    updateAddress,
    getOptions,
    createChatter,
    getChattersForContact,
    getChatterQualForTrust,
    getChattersForSituations
}