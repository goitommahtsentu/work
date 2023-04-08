import floatFormatter from '../components/Custom/floatFormatter.js'
import {fieldTypeContact} from "../config/contact/fieldTypeContact.js"
import { fieldTypeTrust } from '../config/trust/fieldTypeTrust.js';

export function getParsedList(data){
    const parsedList = floatFormatter(data, fieldTypeContact)
    return parsedList
}

export function getParsedListForTrust(data){
    const parsedList = floatFormatter(data, fieldTypeTrust)
    return parsedList
}


export function getParsedData(data){
    const parsedList = floatFormatter(data)
    return parsedList
}

export function getInvestorsName(data=[]){
    let investors=[]
    for(let investor in data){
        investors.push(investor.full_name)
    }
    return investors
}

export function getNextItem(index,obj){
    const len=Object.values(obj).length
    const getLastItem=Object.keys(obj)[len-1]
    while(true){
        if(obj[parseInt(index)]){
            return index
        }
        index+=1
        if(index>getLastItem){
            return Object.keys(obj)[0]
        }
    }
}

export function getPrevItem(index,obj){
    while(true){
        if(obj[parseInt(index)]){
            return index
        }
        index-=1
        if(index<0){
            const len=Object.values(obj).length
            return Object.keys(obj)[len-1]
        }
    }
}