import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import {AuthApi} from '../services/loginService';
import {userApi} from '../services/userApi';

export const store = configureStore({
    reducer:{
        [AuthApi.reducerPath]:AuthApi.reducer,
        [userApi.reducerPath]:userApi.reducer,
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            AuthApi.middleware,
            userApi.middleware,
        ),
});

setupListeners(store.dispatch)