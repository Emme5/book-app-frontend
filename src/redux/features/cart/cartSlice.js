import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';

const initialState = {
    cartItem: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        addToCart: (state, action) => {
            const existingItem = state.cartItem.find(item => item._id === action.payload._id);
            if(!existingItem) {
                state.cartItem.push(action.payload)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "สินค้าของคุณอยู่ในตะกร้าเรียบร้อยแล้ว",
                    showConfirmButton: false,
                    timer: 1000
                  });
            } else (
                Swal.fire({
                    title: "This Item is Already To Cart!",
                    text: "Press OK To Continue",
                    imageUrl: "https://unsplash.it/400/200",
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: "Custom image"
                  })
            )
        },
        removeFromCart: (state, action) => {
            state.cartItem = state.cartItem.filter(item => item._id !== action.payload._id)
        },
        clearCart: (state) => {
            state.cartItem = []
        }
    }
})

//export the action
export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;