import axios from "axios";
import {store} from '../store/index';
import { LOGOUT } from "../store/actions";
// Import API Server
import { API_SERVER } from '../config/constant';

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status <=500;

  if (!expectedError) {
    console.error("An unexpected error occurrred.");
  }
  console.error({error:error.request})
  if(error.response.status==401){
 store.dispatch({
   type:LOGOUT
 });
   }
  return Promise.reject(error);
});



const tokenConfig = () => {
  const token =  store.getState().account.user?.access_token
  console.log({token:token})
  console.log('account',store.getState().account)

  const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  }

  if(token){
      config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config
}


axios.defaults.headers.common['Content-Type']='application/json'
// axios.defaults.headers['Authorization']=tokenConfig().Authorization
axios.defaults.baseURL=API_SERVER
const getSource=()=>{
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source
}
const setTokenToAxios=(token)=>{
  console.log('settoken',token)
  if(!token) return
axios.defaults.headers['Authorization']= `Bearer ${token}`;
}
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  options:axios.options,
  getSource,
  tokenConfig,
  setTokenToAxios
};