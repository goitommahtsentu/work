import http from "./httpService";

// Import Endpoints
import {addressUrl } from '../config/Endpoints';

const apiEndpoint=addressUrl

const getAddresses=async(source)=>{
    try {
        const {data}=await http.get(apiEndpoint,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const updateAddress=async(id,body,source)=>{
    try {
        const {data}=await http.put(`${apiEndpoint}${id}/`,body,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return
    }
}


const getOptions = async(source) => {
    try {
        const {data}=await  http.options(`${apiEndpoint}`,{ cancelToken: source.token })
        return data
      } catch (error) {
          console.log(error)
      }
}

const createAddress = async(address,source) => {
    try {
      const {data}=await  http.post(`${apiEndpoint}`, address,{ cancelToken: source?.token })
       return data
    } catch (error) {
        console.log(error)
    }
    }

export default {
    getAddresses,
    updateAddress,
    getOptions,
    createAddress
}