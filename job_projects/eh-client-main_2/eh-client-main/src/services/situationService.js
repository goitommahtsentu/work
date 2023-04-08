import http from "./httpService";
// Import Endpoints
import { trustSituationUrl,trustSituationTagsUrl} from '../config/Endpoints';


const apiEndpoint=`${trustSituationUrl}`

const getSituations=async(id,source)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?format=json&trust_id=${id}`,
            { cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

 const getAllSituations=async(source)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}?format=json`,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

 const getSituation=async(id,source)=>{
    try {
        const {data}=await http.get(`${apiEndpoint}${id}/`,
            { cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
 const updateSituation = async(id, body) => {
    try {
        const {data}=await  http.put(`${apiEndpoint}${id}/`, body)
        return data
      } catch (error) {
        console.log(error)
      }
 }

 const getOptions=async()=>{
     try{
    const {data} =await http.options(`${apiEndpoint}`)
    console.log('options',data)
    return data.actions.POST.situation_type.choices
     }
     catch(error){
         console.log(error)
        return []
     }
 }

 const createSits = async(body) => {
    try {
     const {data}=await  http.post(`${apiEndpoint}`,body)
     return data
   } catch (error) {
           console.log(error)
   }
};

const handleDeleteSituation=async(id,source)=>{
    try {
        const {data}=await http.delete(`${apiEndpoint}${id}/`,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
 const getSituationTags=async()=>{
    try {
        const {data}=await http.get(`${trustSituationTagsUrl}`)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 }
 const addSituationTag=async(tag)=>{
    try {
        const {data}=await  http.post(`${trustSituationTagsUrl}`,tag)
        return data
      } catch (error) {
              console.log(error)
      }
 }
export default {
    createSits,
   getOptions,
   getSituations,
   updateSituation,
   getAllSituations,
   getSituation,
   handleDeleteSituation,
   getSituationTags,
   addSituationTag
}