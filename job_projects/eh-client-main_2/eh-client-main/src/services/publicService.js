import http from "./httpService";
// Import Endpoints
import { publicUrl} from '../config/Endpoints';

const apiEndpoint=`${publicUrl}`

const getProperties=async(source)=>{
    try {
        const {data}=await http.get(apiEndpoint,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
 const getProperty=async(id,source)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}${id}`,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
 export default {
    getProperties,
    getProperty
}