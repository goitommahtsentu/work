import http from "./httpService";
import floatFormatter from '../components/Custom/floatFormatter.js'
import {fieldTypeContact} from "../config/contact/fieldTypeContact.js"
// Import Endpoints
import { ownershipUrl} from '../config/Endpoints';


const apiEndpoint=`${ownershipUrl}`

const createOwnerShip = async(body) => {
    try {
        const {data}=await  http.post(`${apiEndpoint}`, body)
        return data
      } catch (error) {
        console.log(error)
      }
 }


 const getOwnerShip = async(id) => {
    try {
        const {data}=await  http.get(`${apiEndpoint}?format=json&trust_id=${id}`)
        const parsedList = floatFormatter(data, fieldTypeContact)
        return parsedList
      } catch (error) {
        console.log(error)
      }
 }


 const deleteOwnerShip=async(id)=>{
    try {
        const {data}=await http.delete(`${apiEndpoint}${id}/`)
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
 export default {
    createOwnerShip,
    getOwnerShip,
    deleteOwnerShip,
    getOptions
}