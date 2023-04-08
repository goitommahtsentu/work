import React,{useEffect,useState} from 'react'
import { usePlaidLink } from 'react-plaid-link';
import { Accounts } from '../../services';
export default function Accounting() {
  const [tokenData,setTokenData]=useState({})
  useEffect(()=>{
    (
      async()=>{
        const data =await Accounts.getToken({"entity_id": 1, "entity_type": "user", "products": ["auth"]})
        data&&setTokenData(data)
      }
    )()
  },[])
  const { open, ready } = usePlaidLink({
    token: tokenData.link_token,
    onSuccess: (public_token, metadata) => {
      (
        async()=>{
          const data =await Accounts.storeToken({public_token})
         console.log({data})
        }
      )()
    },
  });
  
  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}
