import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoints } from "../Component/Endpoints/endpoints";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});


export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        RegisterApi: builder.mutation({
            query: (userData) => ({
                url: endpoints.register,
                method: 'POST',
                body: userData,
            })
        }),
        LoginApi: builder.mutation({
            query: (credentials) => ({
                url: endpoints.login,
                method: 'POST',
                body: credentials,
            }),
        }),
        verifyNumber: builder.mutation({
            query: (number) => ({
                url: endpoints.verifyNumber,
                method: 'POST',
                body: number,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ _id, password }) => ({
                url: `${endpoints.resetPassword}/${_id}`,
                method: 'PUT',
                body: { password },
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