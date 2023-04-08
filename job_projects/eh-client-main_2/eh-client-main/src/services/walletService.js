import http from "./httpService";
import floatFormatter from '../components/Custom/floatFormatter.js'
import {fieldTypeContact} from "../config/contact/fieldTypeContact.js"
// Import Endpoints
import { walletUrl,billsUrl} from '../config/Endpoints';

const apiEndpoint=walletUrl

const getWallets=async(id)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?format=json&contact_id=${id}`)
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


export default {
    getWallets,
    getOptions
}