import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints } from "../Component/Endpoints/endpoints";
import { baseQuery } from './baseQuery';
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (data) => ({
                url: endpoints.message.sendMessage,
                method: 'POST',
                body: data
            })
        })
    })
})
export const {
    useSendMessageMutation
} = chatApi