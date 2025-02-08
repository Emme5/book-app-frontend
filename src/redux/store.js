import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import booksApi from './features/books/booksApi';
import ordersApi from './features/order/ordersApi';
import booksReducer from "./slices/booksSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    books: booksReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware, ordersApi.middleware),
});

