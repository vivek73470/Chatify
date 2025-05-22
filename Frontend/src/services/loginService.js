import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoints } from "../Component/Endpoints/endpoints";

const BASE_URL = import.meta.env.VITE_SERVER_URL;


export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        RegisterApi: builder.mutation({
            query: (userData) => ({
                url: endpoints.register,
                method: 'POST',
                body: userData,
                headers: {
                    'Content-Type': 'application/json',
                },

            })
        }),
        LoginApi: builder.mutation({
            query: (credentials) => ({
                url: endpoints.login,
                method: 'POST',
                body: credentials,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        verifyNumber: builder.mutation({
            query: (number) => ({
                url: endpoints.verifyNumber,
                method: 'POST',
                body: number,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        resetPassword: builder.mutation({
            query: (_id, password) => ({
                url: `${endpoints.resetPassword}/${_id}`,
                method: 'PUT',
                body: password,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
    })
})

export const {
    useRegisterApiMutation,
    useLoginApiMutation,
    useVerifyNumberMutation,
    useResetPasswordMutation
} = AuthApi