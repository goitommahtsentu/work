import http from "./httpService";

const getResposeWithCustomeLink=async(link)=>{
    try{
        const {data}=await http.get(link)
        return data
    }
    catch(ex){
        return null
    }
}

export default{
    getResposeWithCustomeLink
}