import {
    GET_FAMILYLEAD_LIST,
    UPDATE_FAMILYLEAD_LIST,
    ADD_FAMILYLEAD_LIST
 } from './actions';

export const initialState = {
familyLeadList:{},
};

const familyLeadReducer = (state = initialState, action) => {
switch (action.type) {
    case GET_FAMILYLEAD_LIST:
        return {
            ...state,
            familyLeadList: action.payload
        };
    case ADD_FAMILYLEAD_LIST:
        return {
            ...state,
            familyLeadList: {...state.results,...action.payload}
        };
    case UPDATE_FAMILYLEAD_LIST:
            return {
                ...state,
                familyLeadList:{
                    ...state.familyLeadList,
                    ...action.payload}
            };
    default:
        return state;
}
}

export default familyLeadReducer;