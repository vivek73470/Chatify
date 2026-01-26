import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import {AuthApi} from '../services/loginService';
import {chatApi} from '../services/chatApi';

export const store = configureStore({
    reducer:{
        [AuthApi.reducerPath]:AuthApi.reducer,
        [chatApi.reducerPath]:chatApi.reducer,
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(AuthApi.middleware)
})

setupListeners(store.dispatch)