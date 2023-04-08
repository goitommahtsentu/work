import axios from 'axios';
import {
    GET_FAMILY_LIST,
    UPDATE_FAMILY_LIST,
    GET_INVESTOR_LIST,
    UPDATE_INVESTOR_LIST,
    GET_ADDRESS_LIST,
    UPDATE_ADDRESS_LIST,
    UPDATE_TRUST_LIST,
    GET_TRUST_LIST,
    GET_FAMILYLEAD_LIST,
    UPDATE_FAMILYLEAD_LIST,
    GET_INVESTORLEAD_LIST,
    UPDATE_INVESTORLEAD_LIST,
    UPDATE_CONTACT_LIST,
    GET_CONTACT_LIST,
    GET_INVESTOR_ADDRESS,
    GET_TRUST_ADDRESS,
    GET_INVESTOR_OPTIONS,
    GET_INVESTOR,GET_TRUST, 
    GET_TRUST_OPTIONS, GET_ADDRESS , 
    GET_CONTACT, GET_CONTACT_OPTIONS, 
    ADD_TRUST_LIST,
    ADD_CONTACT_LIST,
    ADD_ADDRESS_LIST,
    ADD_INVESTOR_LIST,
    ADD_FAMILY_LIST,
    ADD_FAMILYLEAD_LIST,
    ADD_INVESTORLEAD_LIST,

    ADD_SITUATIONS_LIST,
    GET_SITUATIONS_LIST,
    UPDATE_SITUATIONS_LIST,

} from './actions';
import { API_SERVER } from '../config/constant';
import {contactUrl, investorUrl, trustUrl} from "../config/Endpoints";
import {Contacts,Trusts,Addresses,Investors,FamilyLeads,InvestorLeads,Families,CustomLinkCall, Situations } from '../services'
import { floatFormatterForFamilyLead, floatFormatterForInvestor } from '../components/Custom/floatFormatter';
import situations from "../services/situationService";
// import { store } from './index';


const tokenConfig = () => {
   // const token = store.getState().account.token;

   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
   };

   return config;
};

export const getTrust = (id) => (dispatch) =>  {
     if(!id) return
    axios.options(`${API_SERVER}${trustUrl}`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_TRUST_OPTIONS,
                payload: res.data.actions.POST
            });
        }).catch(err => {
            console.log(err)
        }
        )

    axios.get(`${API_SERVER}${trustUrl}${id}/`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_TRUST,
                payload: res.data
            });
        }).catch(err => {
            console.log(err)
        }
        )
}

export const getAddress = () => async(dispatch) =>  {
    const data=await Addresses.getAddresses()
    dispatch({ type: GET_ADDRESS,
                payload: data.results
            });
    
    
}

export const getAddressForTrust = () => (dispatch) =>  {
    
    axios.get(`${API_SERVER}api/address/address/`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_TRUST_ADDRESS,
                payload: res.data
            });
        }).catch(err => {
            console.log(err)
        }
        )
}


const getContactList=(contactList)=>{
    const newContacts = {}
    contactList.forEach(contact=>{newContacts[contact.id]=contact})
    return {
        type:GET_CONTACT_LIST,
        payload:newContacts
    }
}

const addContactList=(contactList)=>{
    const newContacts = {}
    contactList.forEach(contact=>{newContacts[contact.id]=contact})
    return {
        type:ADD_CONTACT_LIST,
        payload:newContacts
    }
}

export const updateContactList=(contact)=>{
    return {
        type:UPDATE_CONTACT_LIST,
        payload:{[contact.id]:contact}
    }
}

export const getContacts = () => async(dispatch,getState) =>  {
    const data=await Contacts.getContacts()
    if(!data) return
    dispatch(getContactList(data.results))
    fetchNextData(dispatch,data.next,addContactList)
}



const getTrustList=(contactList)=>{
    const newTrusts = [];
    contactList.forEach(trust=>{newTrusts[trust.id]=trust})

    return {
        type:GET_TRUST_LIST,
        payload:newTrusts
    }
}

const addTrustList=(trustList)=>{
    const newTrusts = {}
    trustList.forEach(trust=>{newTrusts[trust.id]=trust})
    return {
        type:ADD_TRUST_LIST,
        payload:newTrusts
    }
}

export const updateTrustList=(contact)=>{
    return {
        type:UPDATE_TRUST_LIST,
        payload:{[contact.id]:contact}
    }
}

export const getTrusts = () => async(dispatch,getState) =>  {
    const data=await Trusts.getTrusts()
    if(!data) return
    dispatch(getTrustList(data.results))
    fetchNextData(dispatch,data.next,addTrustList)

}

// Situations 
const getSituationsList=(situations)=>{
    const newSituations = {};
    situations?.forEach(situation=>{newSituations[situation.id]=situation})
    return {
        type:GET_SITUATIONS_LIST,
        payload:newSituations
    }
}

const addSituationList=(situationList)=>{
    const newSituations = {}
    situationList.forEach(situation=>{newSituations[situation.id]=situation})
    return {
        type:ADD_SITUATIONS_LIST,
        payload:newSituations
    }
}

export const updateSituationList=(situation)=>{
    return {
        type:UPDATE_SITUATIONS_LIST,
        payload:{[situation.id]:situation}
    }
}

export const getSituations = () => async(dispatch,getState) =>  {
    const data=await Situations.getAllSituations()
    if(!data) return
    dispatch(getSituationsList(data.results))
    fetchNextData(dispatch,data.next,addSituationList)

}

const fetchNextData=async(dispatch,nextUrl,callback)=>{
    while(nextUrl){
        const newData=await CustomLinkCall.getResposeWithCustomeLink(nextUrl)
        if(!newData) continue
        nextUrl=newData.next
        dispatch(callback(newData.results))
    }
}

export const getAddressForInvestor = () => (dispatch) =>  {
    
    axios.get(`${API_SERVER}api/address/address/`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_INVESTOR_ADDRESS,
                payload: res.data
            });
        }).catch(err => {
            console.log(err)
        }
        )
}




export const getContact = (id) => (dispatch) =>  {
    if(!id) return
    axios.options(`${API_SERVER}${contactUrl}`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_CONTACT_OPTIONS,
                payload: res.data.actions.POST
            });
        }).catch(err => {
            console.log(err)
        }
        )

    axios.get(`${API_SERVER}${contactUrl}${id}/`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_CONTACT,
                payload: res.data
            });
        }).catch(err => {
            console.log(err)
        }
        )
}

export const getInvestor = (id) => (dispatch) =>  {
    if(!id) return
    axios.options(`${API_SERVER}${investorUrl}`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_INVESTOR_OPTIONS,
                payload: res.data.actions.POST.contact
            });
        }).catch(err => {
            console.log(err)
        }
        )

    axios.get(`${API_SERVER}${investorUrl}${id}/`, tokenConfig())
        .then(res => {
            dispatch({
                type: GET_INVESTOR,
                payload: res.data.contact
            });
        }).catch(err => {
            console.log(err)
        }
        )
}


// address actions
const getAddressList=(addressList)=>{
    const newAddresses = {}
    addressList.forEach(address=>{newAddresses[address.id]=address})
    return {
        type:GET_ADDRESS_LIST,
        payload:newAddresses
    }
}

const addAddressList=(addressList)=>{
    const newAddresses = {}
    addressList.forEach(address=>{newAddresses[address.id]=address})
    return {
        type:ADD_ADDRESS_LIST,
        payload:newAddresses
    }
}
export const updateAddressList=(address)=>{
    return {
        type:UPDATE_ADDRESS_LIST,
        payload:{[address.id]:address}
    }
}

export const getAddresses = () => async(dispatch,getState) =>  {
    const data=await Addresses.getAddresses()
    if(!data) return
    dispatch(getAddressList(data.results))
    fetchNextData(dispatch,data.next,addAddressList)
}


// investor actions
const getInvestorList=(investorList)=>{
    const newInvestors = {}
    investorList.forEach(investor=>{newInvestors[investor.id]= investor})
    return {
        type:GET_INVESTOR_LIST,
        payload:newInvestors
    }
}

const addInvestorList=(investorList)=>{
    const newInvestors = {}
    investorList.forEach(investor=>{newInvestors[investor.id]= floatFormatterForInvestor(investor)})
    return {
        type:ADD_INVESTOR_LIST,
        payload:newInvestors
    }
}

export const updateInvestorList=(investor)=>{
    return {
        type:UPDATE_INVESTOR_LIST,
        payload:{[investor.id]:investor}
    }
}

export const getInvestors = () => async(dispatch,getState) =>  {
    const data=await Investors.getInvestors()
    if(!data) return
    dispatch(getInvestorList(data.results))
    fetchNextData(dispatch,data.next,addInvestorList)
    
}


// family lead actions
const getFamilyLeadList=(familyLeadList)=>{
    const newFamilyLeads = {}
    familyLeadList.forEach(familyLead=>{newFamilyLeads[familyLead.id]=familyLead})
    return {
        type:GET_FAMILYLEAD_LIST,
        payload:newFamilyLeads
    }
}

const addFamilyLeadList=(familyLeadList)=>{
    const newFamilyLeads = {}
    familyLeadList.forEach(familyLead=>{newFamilyLeads[familyLead.id]=floatFormatterForFamilyLead(familyLead)})
    return {
        type:ADD_FAMILYLEAD_LIST,
        payload:newFamilyLeads
    }
}

export const updateFamilyLeadList=(familyLead)=>{
    return {
        type:UPDATE_FAMILYLEAD_LIST,
        payload:{[familyLead.id]:familyLead}
    }
}

export const getFamilyLeads = () => async(dispatch,getState) =>  {
    const data=await FamilyLeads.getFamilyLeads()
    if(!data) return
    dispatch(getFamilyLeadList(data.results))
    fetchNextData(dispatch,data.next,addFamilyLeadList)
}



// investor lead actions
const getInvestorLeadList=(investorLeadList)=>{
    const newInvestorLeads = {}
    investorLeadList.forEach(investorLead=>{newInvestorLeads[investorLead.id]=investorLead})
    return {
        type:GET_INVESTORLEAD_LIST,
        payload:newInvestorLeads
    }
}

const addInvestorLeadList=(investorLeadList)=>{
    const newInvestorLeads = {}
    investorLeadList.forEach(investorLead=>{newInvestorLeads[investorLead.id]=floatFormatterForFamilyLead(investorLead)})
    return {
        type:ADD_INVESTORLEAD_LIST,
        payload:newInvestorLeads
    }
}

export const updateInvestorLeadList=(investorLead)=>{
    return {
        type:UPDATE_INVESTORLEAD_LIST,
        payload:{[investorLead.id]:investorLead}
    }
}

export const getInvestorLeads = () => async(dispatch,getState) =>  {
    const data=await InvestorLeads.getInvestorLeads()
    if(!data) return
    dispatch(getInvestorLeadList(data.results))
    fetchNextData(dispatch,data.next,addInvestorLeadList)
}

// family actions
const getFamilyList=(familyList)=>{
    const newFamilies = {}
    familyList.forEach(family=>{newFamilies[family.id]= family})
    return {
        type:GET_FAMILY_LIST,
        payload:newFamilies
    }
}


const addFamilyList=(familyList)=>{
    const newFamilies = {}
    familyList.forEach(family=>{newFamilies[family.id]= floatFormatterForInvestor(family)})
    return {
        type:ADD_FAMILY_LIST,
        payload:newFamilies
    }
}

export const updateFamilyList=(investorLead)=>{
    return {
        type:UPDATE_FAMILY_LIST,
        payload:{[investorLead.id]:investorLead}
    }
}

export const getFamilies = () => async(dispatch,getState) =>  {
    const data=await Families.getFamilies()
    if(!data) return
    dispatch(getFamilyList(data.results))
    fetchNextData(dispatch,data.next,addFamilyList)
}