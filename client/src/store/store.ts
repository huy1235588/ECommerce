import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'

// https://redux-toolkit.js.org/api/configureStore
const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;