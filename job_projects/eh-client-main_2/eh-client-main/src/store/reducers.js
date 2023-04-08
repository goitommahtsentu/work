import { combineReducers } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './accountReducer';
import trustReducer from './trustReducer';
import contactReducer from './contactReducer';
import investorReducer from './investorReducer';
import addressReducer from './addressReducer'
import familyLeadReducer from './familyLeadReducer';
import investorLeadReducer from './investorLeadReducer';
import familyReducer from './familyReducer';
import situationsReducer from './situationsReducer'

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
    account: persistReducer(
        {
            key: 'account',
            storage,
            keyPrefix: 'datta-'
        },
        accountReducer,
    ),
    investorReducer,
    trustReducer,
    contactReducer,
    addressReducer,
    familyLeadReducer,
    investorLeadReducer,
    familyReducer,
    situationsReducer,
    form: formReducer
});

export default reducers;
