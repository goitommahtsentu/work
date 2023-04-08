import http from "./httpService";
// Import Endpoints
import {subcontactUrl,subcontactDetailUrl,subcontactFormUrl } from '../config/Endpoints';

const apiEndpoint=subcontactUrl

const getSubContacts=async(contactId)=>{
    try {
        let {data}= await http.get(`${apiEndpoint}?contact_id=${contactId}`)
        return data
    } catch (error) {
        console.log('subcontact',error)
        return []
    }
}

const deleteSubContact=async(id)=>{
    try {
        let {data}= await http.delete(`${subcontactFormUrl}${id}/`)
        return data
    } catch (error) {
        console.log(error)
    }
}

const updateSubcontact=async(id,subcontact)=>{
    try {
        let {data}=await http.put(`${subcontactFormUrl}${id}/`,subcontact)
        return data
    } catch (error) {
        console.log(error)
    }
}

const createSubContact = async(subcontact) => {
try {
  const {data}=await  http.post(`${subcontactFormUrl}`, subcontact)
  console.log(data)
   return data
} catch (error) {
    const errorMessage=error.response?.data
    // console.log({errorMessage})
    if(!errorMessage) return ''
    let errorMessages=''
    for (const value of Object.values(errorMessage)) {
        errorMessages+=value
        errorMessages+='\n'
      }
    // console.log({errorMessages})
    return errorMessages
}
}

const getSubContact=async(subContactId)=>{
      try {
        const {data}= await http.get(`${subcontactDetailUrl}${subContactId}/`)
        return data
      } catch (error) {
          console.log(error)
      }
}

export default {
    deleteSubContact,
    updateSubcontact,
    getSubContacts,
    getSubContact,
    createSubContact
}