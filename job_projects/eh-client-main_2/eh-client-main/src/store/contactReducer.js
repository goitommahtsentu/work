import {GET_CHATTER,
        GET_CONTACT_OPTIONS,
        GET_CONTACT,
        GET_CONTACT_LIST,
        UPDATE_CONTACT_LIST,
        ADD_CONTACT_LIST} from './actions';

export const initialState = {
    contactList: {},
    contact: {},
    contactOptions: {},
    contactOwnership: {},
    chatterList: [],
};

const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONTACT_LIST:
            return {
                ...state,
                contactList: action.payload
            };
       case ADD_CONTACT_LIST:
                return {
                    ...state,
                    contactList:{...state.contactList,... action.payload}
                };
        case UPDATE_CONTACT_LIST:
                return {
                    ...state,
                    contactList:{
                        ...state.contactList,
                        ...action.payload}
                };

        case GET_CONTACT:
            return {
                ...state,
                contact: action.payload
            };
       case GET_CONTACT_OPTIONS:
            return {
                ...state,
                contactOptions: action.payload
            };

        case GET_CHATTER:
            return {
                ...state,
                chatterList: action.payload
            };

        default:
            return state;
    }
}

export default contactReducer;