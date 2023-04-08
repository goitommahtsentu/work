import http from "./httpService";
// Import Endpoints
import { 
    trustUrl,
    trustImportUrl,
    trustDetailUrl,
    trustFormUrl,
    trustRtpUrl,
    trustTabUrl,
    furtherRepairUrl, 
    setUpUrl 
    ,trustKanbanUrl,
    marketingHistoryUrl,
    ownershipUrl,
    familyHistoryUrl,
    marketingReportUrl
} from '../config/Endpoints';


const apiEndpoint=`${trustUrl}`

const getTrusts=async(source)=>{
    try {
        const {data}=await http.get(apiEndpoint,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

 const getRtpTrusts=async(source)=>{
    try {
        const {data}=await http.get(trustRtpUrl,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

 const getTrustTabs=async(id,source)=>{
    if(!id) return {}
   try {
       const {data}=await http.get(`${trustTabUrl}${id}/`,{ cancelToken: source.token })
       return data
   } catch (error) {
       console.log(error)
       return false
   }

}

 const getTrust=async(id,source)=>{
    if(!id) return {}
   try {
       const {data}=await http.get(`${trustDetailUrl}${id}/`,{ cancelToken: source?.token })
       return data
   } catch (error) {
       console.log(error)
       return {}
   }

}


const createTrust=async(trust)=>{
    try {
       const {data}= await http.post(`${trustFormUrl}`, trust)
       console.log('create trust',data)
        return data
    } catch (error) {
        console.log(error)
        return {}
    }
}

const createTrustImport=async(trust)=>{
    try {
       const {data}= await http.post(`${trustImportUrl}`, trust)
       console.log('create trust',data)
        return data
    } catch (error) {
        console.log(error)
        return {}
    }
}

 const getSetups=async(source)=>{
    try {
        const {data}=await http.get(setUpUrl,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }

 const getRepairStages=async(source)=>{
    try {
        const {data}=await http.get(furtherRepairUrl,{ cancelToken: source?.token })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
 
 }
 const updateTrust=async(id,trust)=>{
    try {
       const {data}= await http.put(`${trustFormUrl}${id}/`,trust)
        return data
    } catch (error) {
        console.log(error)


      
    }
}

const getTrustsKanban=async(source)=>{
    try {
        const {data}=await http.get(`${trustKanbanUrl}`,{ cancelToken: source.token })
        return data
    } catch (error) {
        console.log(error)
        return
    }
}

const getMarketingHistory = async(id) => {
try {
    const {data}=  await http.get(`${marketingHistoryUrl}?format=json&trust_id=${id}`)
    return data
} catch (error) {
    console.log(error)
}
 };

 const deleteMarketingHistory = async(id) => {
    try {
        const {data}=  await http.delete(`${marketingHistoryUrl}${id}/`)
        return data
    } catch (error) {
        console.log(error)
    }
     };

 const postMarketingHistory = async(body) => {
     try {
      const {data}=await  http.post(`${marketingHistoryUrl}`, body)
      return data
    } catch (error) {
            console.log(error)
    }
 };


 const editMarketingHistory = async(id, body) => {
    try {
        const {data}=await  http.put(`${marketingHistoryUrl}${id}/`, body)
        return data
      } catch (error) {
        console.log(error)
      }
 }


 const getMarketingReport = async(id,source) => {
    try {
        const {data}=  await http.get(`${marketingReportUrl}?format=json&trust_id=${id}`,{ cancelToken: source.token })
        return data
    } catch (error) {
        console.log(error)
    }
     };

 const deleteMarketingReport = async(id) => {
    try {
        const {data}=  await http.delete(`${marketingReportUrl}${id}/`)
        return data
    } catch (error) {
        console.log(error)
    }
     };
const editMarketingReport = async(id, body) => {
        try {
            const {data}=await  http.put(`${marketingReportUrl}${id}/`, body)
            return data
          } catch (error) {
            console.log(error)
          }
     }
const postMarketingReport = async(body) => {
        try {
         const {data}=await  http.post(`${marketingReportUrl}`,body)
         return data
       } catch (error) {
               console.log(error)
       }
    };
   
 const getOwnerShip = async(id) => {
    try {
        const {data}=await  http.get(`${ownershipUrl}?format=json&trust_id=${id}`)
        return data
      } catch (error) {
        console.log(error)
      }
 }


 const deleteOwnerShip=async(id)=>{
    try {
        const {data}=await http.delete(`${ownershipUrl}${id}/`)
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

const getFamilyHistory = async(id) => {
    try {
        const {data}=  await http.get(`${familyHistoryUrl}?format=json&trust_id=${id}`)
        return data
    } catch (error) {
        console.log(error)
    }
     };
 export default {
    getTrusts,
    getRtpTrusts,
    getTrustTabs,
    createTrust,
    updateTrust,
    getTrustsKanban,
    getMarketingHistory,
    postMarketingHistory,
    editMarketingHistory,
    editMarketingReport,
    getOwnerShip,
    deleteOwnerShip,
    getOptions,
    getFamilyHistory,
    getTrust,
    deleteMarketingHistory,
    deleteMarketingReport,
    postMarketingReport,
    getMarketingReport,
    getSetups,
    getRepairStages,
    createTrustImport
}