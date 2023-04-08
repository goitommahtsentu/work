import http from "./httpService";
import floatFormatter from '../components/Custom/floatFormatter.js'
import {fieldTypeContact} from "../config/contact/fieldTypeContact.js"
// Import Endpoints
import { walletUrl,billsUrl} from '../config/Endpoints';

const apiEndpoint=billsUrl

const getBills=async(id)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?format=json&entity=${id}`)
        const parsedList = floatFormatter(data, fieldTypeContact)
        return parsedList
    } catch (error) {
        console.log(error)
        return
    }
}


const getBillsForTrust=async(id,lineChoice='misc')=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?format=json&trust_id=${id}&line_choice=${lineChoice}`)
        const parsedList = floatFormatter(data, fieldTypeContact)
        return parsedList
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


const updateBill=async(id,obj)=>{
    try {
        const {data}=await http.put(`${billsUrl}${id}/`, obj)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const createBill=async(obj)=>{
    try {
        const {data}=await http.post(`${billsUrl}`, obj)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const deleteBill=async(id)=>{
    try {
        const {data}=await http.delete(`${billsUrl}${id}/`)
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

export default {
    getBills,
    createBill,
    getOptions,
    updateBill,
    deleteBill,
    getBillsForTrust
}