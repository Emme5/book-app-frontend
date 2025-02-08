import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
	baseUrl: `${getBaseUrl()}/api/books`,
	credentials: "include",
	prepareHeaders: (Headers) => {
		const token = localStorage.getItem("token");
		if (token) {
			Headers.set("Authorization", `Bearer ${token}`);
		}
		return Headers;
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
			query: (formData) => {
				// Debug log

				for (let [key, value] of formData.entries()) {
				}
		
				return {
					url: `/create-book`,
					method: "POST",
					body: formData,
					formData: true,
				};
			},
			invalidatesTags: ["Books"],
		}),

		updateBook: builder.mutation({
			query: ({ id, formData }) => {
				// Debug log เพื่อตรวจสอบข้อมูลที่ส่ง
				console.log('Updating book:', id);
				for (let [key, value] of formData.entries()) {
					console.log(key, value);
				}

				return {
					url: `/edit/${id}`,
					method: "PUT",
					body: formData,
					formData: true,
				};
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: "Books", id },
				"Books"
			],
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
