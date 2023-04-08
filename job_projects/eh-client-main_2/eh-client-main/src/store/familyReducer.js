import {
    GET_FAMILY_LIST,
    UPDATE_FAMILY_LIST,
    ADD_FAMILY_LIST
} from './actions';

export const initialState = {
familyList:{}
};

const familyReducer = (state = initialState, action) => {
switch (action.type) {
    case GET_FAMILY_LIST:
        return {
            ...state,
            familyList: action.payload
        };

    case ADD_FAMILY_LIST:
        return {
            ...state,
            familyList: {...state.familyList,...action.payload}
        };
    case UPDATE_FAMILY_LIST:
            return {
                ...state,
                familyList:{
                    ...state.familyList,
                    ...action.payload}
            };
    default:
        return state;
}
}

export default familyReducer;