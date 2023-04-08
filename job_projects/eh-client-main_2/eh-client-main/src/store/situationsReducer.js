import {
    GET_SITUATIONS_LIST,
    UPDATE_SITUATIONS_LIST,
    ADD_SITUATIONS_LIST
 } from './actions';
 
 export const initialState = {
    situationsList: {}
 };
 
 const trustReducer = (state = initialState, action) => {
    switch (action.type) {
       case GET_SITUATIONS_LIST:
          return {
             ...state,
             situationsList: action.payload,
          };
        case ADD_SITUATIONS_LIST:
           return {
             ...state,
             situationsList:{...state.situationsList,...action.payload}
           }
          case UPDATE_SITUATIONS_LIST:
             return {
                 ...state,
                 situationsList:{
                     ...state.situationsList,
                     ...action.payload
                    }
             };
       default:
          return state;
    }
 };
 
 export default trustReducer;
 