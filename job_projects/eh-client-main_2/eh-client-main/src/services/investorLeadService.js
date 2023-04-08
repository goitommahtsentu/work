import http from "./httpService";
import {floatFormatterForFamilyLead} from '../components/Custom/floatFormatter.js'
import {fieldTypeContact} from "../config/contact/fieldTypeContact.js"
// Import Endpoints
import { investorLeadUrl,investorLeadSetupUrl,furtherRepairUrl} from '../config/Endpoints';


const apiEndpoint=`${investorLeadUrl}`

const getInvestorLeads=async(query="")=>{
   try {
       const {data}=await http.get(apiEndpoint+query)
       const parsedList = floatFormatterForFamilyLead(data.results, fieldTypeContact)
       return {...data,results:parsedList}
   } catch (error) {
       console.log(error)
       return []
   }

}

const getInvestorLead=async(id)=>{
    if(!id) return {}
    try {
        const {data}=await http.get(`${apiEndpoint}${id}`)
        const parsedList = floatFormatterForFamilyLead(data, fieldTypeContact)
        return parsedList
    } catch (error) {
        console.log(error)
        return {}
    }
 
 }


 const updateInvestorLead=async(id,investorLead)=>{
    try {
       const {data}= await http.put(`${apiEndpoint}${id}/`,investorLead)
       const parsedList = floatFormatterForFamilyLead(data, fieldTypeContact)
       return parsedList
    } catch (error) {
        console.log(error)
        return
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


const getSetups=async(source)=>{
    try {
        const {data}=await http.get(investorLeadSetupUrl,{ cancelToken: source.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

 const getRepairStages=async(source)=>{
    try {
        const {data}=await http.get(furtherRepairUrl,{ cancelToken: source.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

export default {
    getInvestorLeads,
    getInvestorLead,
    getOptions,
    getSetups,
    getRepairStages,
    updateInvestorLead
}