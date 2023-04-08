import {
    GET_INVESTOR_LIST,
    UPDATE_INVESTOR_LIST,
    GET_INVESTOR_ADDRESS,
    GET_INVESTOR,
    GET_INVESTOR_OPTIONS,
    ADD_INVESTOR_LIST
} from './actions';

export const initialState = {
investorList:{},
investor: {},
investorOptions: {},
addresses:[]
};

const investorReducer = (state = initialState, action) => {
switch (action.type) {
    case GET_INVESTOR_LIST:
        return {
            ...state,
            investorList: action.payload
        };
    case ADD_INVESTOR_LIST:
            return {
                ...state,
                investorList: {...state.investorList,...action.payload}
            };
    case UPDATE_INVESTOR_LIST:
            return {
                ...state,
                investorList:{
                    ...state.investorList,
                    ...action.payload}
            };
    case GET_INVESTOR:
        return {
            ...state,
            investor: action.payload
        };
    case GET_INVESTOR_ADDRESS:
            return { ...state, addresses: action.payload };
    case GET_INVESTOR_OPTIONS:
        return {
            ...state,
            investorOptions: action.payload
        };
    default:
        return state;
}
}

export default investorReducer;