import {
    GET_ADDRESS_OPTIONS,
    GET_ADDRESS,
    GET_ADDRESS_LIST,
    UPDATE_ADDRESS_LIST,
    ADD_ADDRESS_LIST
} from './actions';

export const initialState = {
addressList: {},
address: {},
addressOptions: {},
addressOwnership: {},
chatterList: [],
};

const addressReducer = (state = initialState, action) => {
switch (action.type) {
    case GET_ADDRESS_LIST:
        return {
            ...state,
            addressList: action.payload
        };
    case ADD_ADDRESS_LIST:
        return {
            ...state,
            addressList: {...state.addressList,...action.payload}
        };
    case UPDATE_ADDRESS_LIST:
            return {
                ...state,
                addressList:{
                    ...state.addressList,
                    ...action.payload}
            };

    case GET_ADDRESS:
        return {
            ...state,
            address: action.payload
        };
    case GET_ADDRESS_OPTIONS:
        return {
            ...state,
            addressOptions: action.payload
        };
    default:
        return state;
}
}

export default addressReducer;