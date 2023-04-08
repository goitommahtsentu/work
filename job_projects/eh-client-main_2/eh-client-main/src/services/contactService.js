import http from "./httpService";
import floatFormatter from '../components/Custom/floatFormatter.js'
import {fieldTypeContact} from "../config/contact/fieldTypeContact.js"
// Import Endpoints
import { contactUrl,contactDetail,contactForm ,contactKanbanUrl,tagsUrl,contactVendor,contactHistory } from '../config/Endpoints';


const apiEndpoint=`${contactUrl}`

const getVendors=async(source)=>{
    try {
        const {data}=await http.get(contactVendor,{ cancelToken: source.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
 const getVendor=async(id)=>{
    try {
        const {data}=await http.get(`${contactVendor}${id}`)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
const getContacts=async(query="",source)=>{
   try {
       const {data}=await http.get(apiEndpoint+query,{ cancelToken: source?.token })
       const parsedList = floatFormatter(data, fieldTypeContact)
       return parsedList
   } catch (error) {
       console.log(error)
       return
   }

}

const getContact=async(id,source)=>{
    if(!id) return {}
    try {
        const {data}=await http.get(`${contactDetail}${id}`,{ cancelToken: source?.token })
        const parsedList = floatFormatter(data, fieldTypeContact)
        return parsedList
    } catch (error) {
        console.log(error)
        return {}
    }
 
 }

const updateContact=async (id,contact)=>{
    try {
       const {data}= await http.put(`${contactForm}${id}/`,contact)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}


const getTags=async(source)=>{
    try {
        const {data}= await http.get(`${tagsUrl}`,{ cancelToken: source.token })
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
    
}

const getContactsKanban=async(source)=>{
    try {
        const {data}=await http.get(`${contactKanbanUrl}`,{ cancelToken: source.token })
        return data
    } catch (error) {
        console.error(error)
        return []
    }
}

const updateTags=async(id,body)=>{
    try {
        let {data}= await http.put(`${apiEndpoint}${id}/`,body)
        return data
    } catch (error) {
        console.log(error)
    }
    
}


const createContact = async(contact) => {
    try {
      const {data}=await  http.post(`${contactForm}`, contact)
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

const getOptions = async(source) => {
    try {
        const {data}=await  http.options(`${apiEndpoint}`,{ cancelToken: source.token,...http.tokenConfig() })
        return data
      } catch (error) {
          console.log(error)
      }
}


const getContactChanges=async(id,source)=>{
    if(!id) return {}
    try {
        const {data}=await http.get(`${contactHistory}${id}`,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return {}
    }
 
 }

export default {
    getContacts,
    getContact,
    updateContact,
    getContactsKanban,
    getTags,
    updateTags,
    createContact,
    getOptions,
    getVendors,
    getVendor,
    getContactChanges
}