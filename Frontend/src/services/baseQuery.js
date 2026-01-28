
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
