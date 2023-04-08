import http from "./httpService";

// Import Endpoints
import {userUrls,employeesUrl } from '../config/Endpoints';


const getUsers=async()=>{
    try{
     const {data}=await http.get(userUrls,http.tokenConfig())
     return data
    }
    catch(ex){
        console.log({ex})

    }

}

const getEmployees=async()=>{
    try{
     const {data}=await http.get(employeesUrl,http.tokenConfig())
     return data
    }
    catch(ex){
        console.log({employees:ex})
    }

}
const updatekanbanSettings=async(obj)=>{
    try{
     const {data}=await http.put(`/api/account/user-update/`,obj,http.tokenConfig())
     return data
    }
    catch(ex){
        console.log({ex})

    }

}
const getkanbanSettings=async(obj)=>{
    try{
     const {data}=await http.get(`/api/account/user-update/`,http.tokenConfig())
     return data
    }
    catch(ex){
        console.log({ex})

    }

}
export default {
    getUsers,
    getEmployees,
    updatekanbanSettings,
    getkanbanSettings
}