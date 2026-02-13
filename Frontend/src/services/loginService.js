import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "../Component/Endpoints/endpoints";
import { baseQuery } from './baseQuery';
const BASE_URL = import.meta.env.VITE_SERVER_URL;

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
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${endpoints.deleteUser}/${id}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const {
    useRegisterApiMutation,
    useLoginApiMutation,
    useVerifyNumberMutation,
    useResetPasswordMutation,
    useDeleteUserMutation
} = AuthApi
