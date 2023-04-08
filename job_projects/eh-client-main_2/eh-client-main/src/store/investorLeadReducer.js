import {
    GET_INVESTORLEAD_LIST,
    UPDATE_INVESTORLEAD_LIST,
    ADD_INVESTORLEAD_LIST
 } from './actions';

export const initialState = {
investorLeadList:{},
};

const investorLeadReducer = (state = initialState, action) => {
switch (action.type) {
    case GET_INVESTORLEAD_LIST:
        return {
            ...state,
            investorLeadList: action.payload
        };
    case ADD_INVESTORLEAD_LIST:
        return {
            ...state,
            investorLeadList:{...state.investorLeadList,...action.payload}
        };
    case UPDATE_INVESTORLEAD_LIST:
            return {
                ...state,
                investorLeadList:{
                    ...state.investorLeadList,
                    ...action.payload}
            };
    default:
        return state;
}
}

export default investorLeadReducer;