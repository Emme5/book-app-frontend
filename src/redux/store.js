import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import booksApi from './features/books/booksApi';
import ordersApi from './features/order/ordersApi';
import booksReducer from "./slices/booksSlice";
import favoritesReducer from './features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    books: booksReducer,
    favorites: favoritesReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // เพิ่มตัวเลือกนี้
    }).concat(booksApi.middleware, ordersApi.middleware),
});

