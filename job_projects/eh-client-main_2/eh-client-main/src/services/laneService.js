import http from "./httpService";
import { setUpUrl } from '../config/Endpoints';


const addLane=async(lane)=>{
    try {
        const {data}= await http.post(`${setUpUrl}`, JSON.stringify(lane))
        console.log("Response", data)
    } catch (error) {
        console.log(error)
        return 
    }
}
const updateLane=async(id,lane)=>{

    try {
        const {data}=await http.put(`${setUpUrl}${id}/`, JSON.stringify(lane))
        console.log("Response", data)
    } catch (error) {
        console.log(error)
        return 
    }

    
}

const getStage = async() => {
   try {
    const {data}=await http.get(`${setUpUrl}`)
    return data
} catch (error) {
    console.log(error)
    return 
}
 };

export default {
    addLane,
    updateLane,
    getStage
}