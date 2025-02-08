import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";


const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include'
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation ({
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder,
                credentials: 'include',
            }),
            invalidatesTags: ['Orders']
        }),
        getOrderByEmail: builder.query ({
            query: (email) => ({
                url: `/email/${email}`
            }),
            providesTags: ['Orders']
        }),
        // เพิ่ม endpoints ใหม่สำหรับ DeliveryStatus
        getAllOrders: builder.query({
            query: () => ({
                url: '/all',
                credentials: 'include'
            }),
            providesTags: ['Orders']
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `/status/${orderId}`,  // endpoint สำหรับอัพเดทสถานะ
                method: 'PATCH',
                body: { status },
                credentials: 'include'
            }),
            invalidatesTags: (result, error, { orderId }) => [
                'Orders',
                { type: 'Orders', id: orderId },
                { type: 'Orders', id: 'LIST' }
            ]
        })
    })
});

export const { 
    useCreateOrderMutation, 
    useGetOrderByEmailQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation 
} = ordersApi;

export default ordersApi;