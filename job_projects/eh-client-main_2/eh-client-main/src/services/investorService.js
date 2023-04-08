import http from "./httpService";
import {floatFormatterForInvestor} from '../components/Custom/floatFormatter.js'
import {fieldTypeContact} from "../config/contact/fieldTypeContact.js"
// Import Endpoints
import { investorUrl} from '../config/Endpoints';


const apiEndpoint=`${investorUrl}`

const getInvestors=async(query="")=>{
   try {
       const {data}=await http.get(apiEndpoint+query)
       const parsedList = floatFormatterForInvestor(data.results, fieldTypeContact)
       return {...data,results:parsedList}
   } catch (error) {
       console.log(error)
       return
   }

}

const getInvestor=async(id)=>{
    if(!id) return {}
    try {
        const {data}=await http.get(`${apiEndpoint}${id}`)
        const parsedList = floatFormatterForInvestor(data, fieldTypeContact)
        return parsedList
    } catch (error) {
        console.log(error)
        return {}
    }
 
 }



const getOptions = async() => {
    try {
        const {data}=await  http.options(`${apiEndpoint}`)
        console.log(data,'optiond')
        return data.actions.POST.contact.children
      } catch (error) {
          console.log(error)
      }
}


export default {
    getInvestors,
    getInvestor,
    getOptions
}