import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import {AuthApi} from '../services/loginService';
import {userApi} from '../services/userService';
import {chatApi} from '../services/chatService';

export const store = configureStore({
    reducer:{
        [AuthApi.reducerPath]:AuthApi.reducer,
        [userApi.reducerPath]:userApi.reducer,
        [chatApi.reducerPath]:chatApi.reducer,
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            AuthApi.middleware,
            userApi.middleware,
            chatApi.middleware,
        ),
});

setupListeners(store.dispatch)