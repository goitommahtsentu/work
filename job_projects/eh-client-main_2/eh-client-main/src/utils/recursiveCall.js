import { CustomLinkCall } from "../services";

export const fetchNextData=async(nextUrl,callback)=>{
    while(nextUrl){
        const newData=await CustomLinkCall.getResposeWithCustomeLink(nextUrl)
        if(!newData) continue
        nextUrl=newData.next
        callback(newData.results)
    }
}