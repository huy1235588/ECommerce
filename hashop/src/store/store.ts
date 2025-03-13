import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/index';
import productReducer from './product/index';

// https://redux-toolkit.js.org/api/configureStore
const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;