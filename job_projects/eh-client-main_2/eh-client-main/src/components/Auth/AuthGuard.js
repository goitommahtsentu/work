import React,{useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector,connect } from 'react-redux';
import {getContacts,getTrusts,getAddresses,getInvestors,getFamilyLeads,getInvestorLeads,getFamilies,getSituations} from '../../store/action_calls'
import Login from '../../views/auth/signin/SignIn'
import httpService from '../../services/httpService';
const AuthGuard = (props) => {
   const account = useSelector(state => state.account);
   const { isLoggedIn,user } = account;
   console.log( { isLoggedIn,user })
   useEffect(()=>{
      httpService.setTokenToAxios(user?.access_token)
   },[user?.access_token])
   useEffect(() => {
      if (!isLoggedIn) return
      props.getContacts()
      props.getTrusts()
      props.getAddresses()
      props.getInvestors()
      props.getFamilyLeads()
      props.getInvestorLeads()
      props.getFamilies()
      props.getSituations()
      }, [])
   if (!isLoggedIn) return <Redirect to='/auth/signin' />;
   
   return props.children;
};

export default connect(null, {getFamilies, getContacts,getTrusts,getAddresses,getInvestors,getFamilyLeads,getInvestorLeads,getSituations })(AuthGuard);
