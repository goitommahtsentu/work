import http from "./httpService";
// Import Endpoints
import { todosUrl} from '../config/Endpoints';


const apiEndpoint=`${todosUrl}`

const getTodos=async(name,value,source)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?${name}=${value}&status!=4`,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
 const createTodo=async(body,source)=>{
    try {
        const {data}=await http.post(`${apiEndpoint}`,body,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return null
    }
 
 }

 const deleteTodos=async(id,source)=>{
    try {
        const {data}=await http.delete(`${apiEndpoint}${id}/`,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

 const updateTodo=async(id,body,source)=>{
    try {
        const {data}=await http.put(`${apiEndpoint}${id}/`,body,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return null
    }
 
 }
 export default {
    getTodos,
    deleteTodos,
    updateTodo,
    createTodo
}