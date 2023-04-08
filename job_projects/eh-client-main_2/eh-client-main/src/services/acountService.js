import http from "./httpService";

// Import Endpoints
import {accountingUrl,accountingPublicApi } from '../config/Endpoints';
const getToken=async(obj)=>{
    try{
     const {data}=await http.post(accountingUrl,obj)
     return data
    }
    catch(ex){
        console.log({ex})

    }

}

const storeToken=async(obj)=>{
    try{
     const {data}=await http.post(accountingPublicApi,obj)
     return data
    }
    catch(ex){
        console.log({ex})

    }

}

export default {
    getToken,
    storeToken
}