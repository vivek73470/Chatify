import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoints } from "../Component/Endpoints/endpoints";
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        searchUserByNumber: builder.mutation({
            query: (number) => ({
                url: endpoints.chat.searchUserByNumber,
                method: 'GET',
                params: { number },
            }),
        }),
        createOrFetchChat: builder.mutation({
            query: ({ userId1, userId2 }) => ({
                url: endpoints.chat.createOrFetchChat,
                method: 'POST',
                body: { userId1, userId2 },
            }),
        }),
        sendMessage: builder.mutation({
            query: ({ chatId, senderId, content }) => ({
                url: endpoints.chat.sendMessage,
                method: 'POST',
                body: { chatId, senderId, content },
            }),
        }),
        getMessages: builder.query({
            query: (chatId) => ({
                url: `${endpoints.chat.getMessages}/${chatId}}`
            }),
        }),
    }),
});

export const {
    useSearchUserByNumberMutation,
    useCreateOrFetchChatMutation,
    useSendMessageMutation,
    useGetMessagesQuery
} = chatApi;
