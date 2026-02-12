import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints } from "../Component/Endpoints/endpoints";
import { baseQuery } from './baseQuery';
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const chatApi = createApi({
    tagTypes: ['UnreadCount'],
    reducerPath: 'chatApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (data) => ({
                url: endpoints.message.sendMessage,
                method: 'POST',
                body: data
            }),
        }),
        sendGroupMessage: builder.mutation({
            query: (data) => ({
                url: endpoints.message.sendGroupMessage,
                method: "POST",
                body: data,
            }),
        }),
        getMessage: builder.query({
            query: (id) => ({
                url: `${endpoints.message.getMessage}/${id}`,
                method: 'GET',
            })
        }),
        getGroupMessage: builder.query({
            query: (id) => ({
                url: `${endpoints.message.getGroupMessage}/${id}`,
                method: "GET",
            }),
        }),
        deleteConversation: builder.mutation({
            query: (id) => ({
                url: `${endpoints.message.deleteConversation}/${id}`,
                method: "DELETE",
            }),
        }),
        deleteGroupConversation: builder.mutation({
            query: (id) => ({
                url: `${endpoints.message.deleteGroupConversation}/${id}`,
                method: "DELETE",
            }),
        }),
        markMessageAsRead: builder.mutation({
            query: (id) => ({
                url: `${endpoints.message.markMessageRead}/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'UnreadCount', id }
            ],
        }),
        unReadMessageCount: builder.query({
            query: (id) => ({
                url: `${endpoints.message.unReadMessageCount}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [
                { type: 'UnreadCount', id }
            ],
        }),

    })
})
export const {
    useSendMessageMutation,
    useSendGroupMessageMutation,
    useGetMessageQuery,
    useGetGroupMessageQuery,
    useDeleteConversationMutation,
    useDeleteGroupConversationMutation,
    useMarkMessageAsReadMutation,
    useUnReadMessageCountQuery

} = chatApi
