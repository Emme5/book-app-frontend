import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder
            }),
            invalidatesTags: ['Orders']
        }),
        getOrderByEmail: builder.query({
            query: (email) => `/email/${email}`,
            providesTags: ['Orders']
        }),
        getAllOrders: builder.query({
            query: () => '/all',
            providesTags: ['Orders']
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }) => ({
              url: `/status/${orderId}`,
              method: 'PATCH',
              body: { status }
            }),
            invalidatesTags: ['Orders']
          }),
        deleteOrder: builder.mutation({
            query: (orderId) => ({
                url: `/delete/${orderId}`,
                method: 'DELETE'
                // ลบ headers ออกเพราะมีใน baseQuery แล้ว
            }),
            invalidatesTags: ['Orders']
        }),
    })
});

export const { 
    useCreateOrderMutation, 
    useGetOrderByEmailQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation
} = ordersApi;

export default ordersApi;