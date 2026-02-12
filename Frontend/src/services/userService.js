import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints } from "../Component/Endpoints/endpoints";
import { baseQuery } from './baseQuery';
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes:['Users', 'Groups'],
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
        getMyGroups: builder.query({
            query: () => ({
                url: endpoints.group.myGroups,
                method: "GET",
            }),
            providesTags: ["Groups"],
        }),
        createGroup: builder.mutation({
            query: (data) => ({
                url: endpoints.group.createGroup,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Groups"],
        }),
        deleteGroup: builder.mutation({
            query: (id) => ({
                url: `${endpoints.group.deleteGroup}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Groups"],
        }),

    }),
});

export const {
    useGetAllUsersQuery,
    useGetMyGroupsQuery,
    useCreateGroupMutation,
    useDeleteGroupMutation
} = userApi;
