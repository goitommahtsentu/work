// import React from "react";
import {fieldTypeContact} from '../../config/contact/fieldTypeContact.js'

function floatFormatter(res, typeList) {
    // console.log("RES",res)
    // console.log("List", typeList)
    const newArr = []

    if (Array.isArray(res)) {
        res.forEach(element => {
            let newObj = {}
            for (let key in element) {
                let value = element[key]
                if (typeList[key] === "monetary") {
                    if (value === null) {
                        let newValue = 0
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    } else {
                        let newValue = parseFloat(value)
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    }
                } else {
                    newObj[key] = value
                }  
            }
            // console.log(newObj)
            newArr.push(newObj)
        })
        // console.log("new arr",newArr)
        return newArr
    } else {
        let newObj = {}
        for (let key in res) {
            let value = res[key]
            // console.log(typeList[key])
            if (typeList[key] === "monetary") {
                if (value === null) {
                    let newValue = 0
                    // console.log(key, newValue)
                    newObj[key] = newValue
                } else {
                    let newValue = parseFloat(value)
                    // console.log(key, newValue)
                    newObj[key] = newValue
                }
            } else {
                newObj[key] = value
            }  
        }
        return newObj
    }
}

export function floatFormatterForInvestor(res, typeList) {
    // console.log("RES",res)
    // console.log("List", typeList)
    const newArr = []
    typeList=typeList?typeList:fieldTypeContact

    if (Array.isArray(res)) {
        res.forEach(element => {
            let newObj = {}
            for (let key in element.contact) {
                let value = element.contact[key]

                if (typeList[key] === "monetary") {
                    if (value === null) {

                        let newValue = 0
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    } else {
                        let newValue = parseFloat(value)
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    }
                } else {

                    if(key==='id'){

                        newObj[key] =element[key]
                        newObj['contact_id']=element.contact[key]
                    }else{
                        newObj[key] = value
                    }
                }  
            }
            for (let key in element.investor_data) {
                let value = element.investor_data[key]

                if (typeList[key] === "monetary") {
                    if (value === null) {

                        let newValue = 0
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    } else {
                        let newValue = parseFloat(value)
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    }
                } else {

                    if(key==='id'){

                        newObj[key] =element[key]
                        newObj['contact_id']=element.contact[key]
                    }else{
                        newObj[key] = value
                    }
                }  
            }
            // console.log(newObj)
            newArr.push(newObj)
        })
        // console.log("new arr",newArr)
        return newArr
    } else {
        let newObj = {}
        for (let key in res.contact) {
            let value = res.contact[key]
            // console.log(typeList[key])

            if (typeList[key] === "monetary") {
                if (value === null) {

                    let newValue = 0
                    // console.log(key, newValue)
                    newObj[key] = newValue
                } else {
                    let newValue = parseFloat(value)
                    // console.log(key, newValue)
                    newObj[key] = newValue
                }
            } else {

                if(key==='id'){

                    newObj[key] =res[key]
                    newObj['contact_id']=res.contact[key]
                }else{
                    newObj[key] = value
                }
            }  
        }
        for (let key in res.investor_data) {
            let value = res.investor_data[key]
            // console.log(typeList[key])

            if (typeList[key] === "monetary") {
                if (value === null) {

                    let newValue = 0
                    // console.log(key, newValue)
                    newObj[key] = newValue
                } else {
                    let newValue = parseFloat(value)
                    // console.log(key, newValue)
                    newObj[key] = newValue
                }
            } else {

                if(key==='id'){

                    newObj[key] =res[key]
                    newObj['contact_id']=res.contact[key]
                }else{
                    newObj[key] = value
                }
            }  
        }
        return newObj
    }
}


export function floatFormatterForFamilyLead(res, typeList) {
    // console.log("RES",res)
    // console.log("List", typeList)
    const newArr = []

    if (Array.isArray(res)) {
        res.forEach(element => {
            let newObj = {}
            for (let key in element.contact) {
                let value = element.contact[key]

                if (typeList[key] === "monetary") {
                    if (value === null) {

                        let newValue = 0
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    } else {
                        let newValue = parseFloat(value)
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    }
                } else {

                    if(key==='id'){

                        newObj[key] =element[key]
                        newObj['contact_id']=element.contact[key]
                    }else{
                        newObj[key] = value
                    }
                }  
            }
            for (let key in element.investor_data) {
                let value = element.investor_data[key]

                if (typeList[key] === "monetary") {
                    if (value === null) {

                        let newValue = 0
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    } else {
                        let newValue = parseFloat(value)
                        // console.log(key, newValue)
                        newObj[key] = newValue
                    }
                } else {

                    if(key==='id'){

                        newObj[key] =element[key]
                        newObj['contact_id']=element.contact[key]
                    }else{
                        newObj[key] = value
                    }
                }  
            }
            newObj['lead_stage']=element.lead_stage
            // console.log(newObj)
            newArr.push(newObj)
        })
        // console.log("new arr",newArr)
        return newArr
    } else {
        let newObj = {}
        newObj['lead_stage']=res.lead_stage
        for (let key in res.contact) {
            let value = res.contact[key]
            // console.log(typeList[key])

            if (typeList[key] === "monetary") {
                if (value === null) {

                    let newValue = 0
                    // console.log(key, newValue)
                    newObj[key] = newValue
                } else {
                    let newValue = parseFloat(value)
                    // console.log(key, newValue)
                    newObj[key] = newValue
                }
            } else {

                if(key==='id'){

                    newObj[key] =res[key]
                    newObj['contact_id']=res.contact[key]
                }else{
                    newObj[key] = value
                }
            }  
        }
        for (let key in res.investor_data) {
            let value = res.investor_data[key]
            // console.log(typeList[key])

            if (typeList[key] === "monetary") {
                if (value === null) {

                    let newValue = 0
                    // console.log(key, newValue)
                    newObj[key] = newValue
                } else {
                    let newValue = parseFloat(value)
                    // console.log(key, newValue)
                    newObj[key] = newValue
                }
            } else {

                if(key==='id'){

                    newObj[key] =res[key]
                    newObj['contact_id']=res.contact[key]
                }else{
                    newObj[key] = value
                }
            }  
        }
        return newObj
    }
}

export default floatFormatter;