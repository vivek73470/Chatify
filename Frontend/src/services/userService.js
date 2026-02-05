import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints } from "../Component/Endpoints/endpoints";
import { baseQuery } from './baseQuery';
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes:['Users'],
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: (params) => ({
                url: endpoints.alluser.getAllUser,
                method: 'GET',
                params,
            }),
            providesTags: ["Users"],
        }),

    }),
});

export const {
    useGetAllUsersQuery
} = userApi;
