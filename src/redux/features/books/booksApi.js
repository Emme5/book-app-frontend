import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        // ลบ Content-Type สำหรับ FormData
        return headers;
    },
});

const booksApi = createApi({
	reducerPath: "booksApi",
	baseQuery,
	tagTypes: ["Books"],
	endpoints: (builder) => ({
		fetchAllBooks: builder.query({
			query: () => "/",
			providesTags: ["Books"],
		}),
		fetchBookById: builder.query({
			query: (id) => `/${id}`,
			providesTags: (result, error, id) => [{ type: "Books", id }],
		}),
		// เพิ่ม endpoint ใหม่สำหรับดึงข้อมูลหนังสือหลายเล่ม
        fetchBooksByIds: builder.query({
            query: (ids) => ({
                url: `/batch`,
                method: 'POST',
                body: { ids }
            }),
            // แปลง response เป็น array เสมอ
            transformResponse: (response) => {
                return Array.isArray(response) ? response : [];
            },
            // จัดการ cache tags สำหรับแต่ละหนังสือ
            providesTags: (result = []) =>
                result.map(({ _id }) => ({ type: 'Books', id: _id })),
        }),

		addBook: builder.mutation({
			query: (formData) => ({
				url: '/create-book',
				method: 'POST',
				body: formData,
				// ไม่ใส่ headers เพื่อให้ browser จัดการ
			}),
			invalidatesTags: ['Books']
		}),

		updateBook: builder.mutation({
			query: ({ id, data }) => ({
				url: `/edit/${id}`, // เปลี่ยนเป็น /edit และตรงกับ route ใน backend
				method: 'PUT', // เปลี่ยนเป็น PUT
				body: data,
			}),
			invalidatesTags: ['Books']
		}),
		
		deleteBook: builder.mutation({
			query: (id) => ({
				url: `/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Books"],
		}),
	}),
});

export const {
	useFetchAllBooksQuery,
	useFetchBookByIdQuery,
	useFetchBooksByIdsQuery,
	useAddBookMutation,
	useUpdateBookMutation,
	useDeleteBookMutation,
} = booksApi;

export default booksApi;
