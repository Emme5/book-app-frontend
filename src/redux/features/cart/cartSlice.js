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
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'เพิ่มลงตะกร้าสำเร็จ',
                    text: 'สินค้าถูกเพิ่มลงในตะกร้าแล้ว',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'colored-toast'
                    },
                    background: '#D4EDDA',
                    color: '#155724'
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'warning',
                    title: 'สินค้าอยู่ในตะกร้าแล้ว',
                    text: 'คุณได้เพิ่มสินค้านี้ในตะกร้าแล้ว',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'colored-toast'
                    },
                    background: '#FFF3CD',
                    color: '#856404'
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItem = state.cartItem.filter(item => item._id !== action.payload._id)
        },
        clearCart: (state) => {
            state.cartItem = []
        }
    }
})

// เพิ่ม CSS สำหรับ custom toast
const style = document.createElement('style');
style.textContent = `
    .colored-toast.swal2-icon-success {
        border-left: 4px solid #28A745 !important;
    }
    .colored-toast.swal2-icon-warning {
        border-left: 4px solid #FFC107 !important;
    }
    .colored-toast {
        padding: 1rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    }
    .colored-toast .swal2-title {
        margin: 0 0 0.5rem !important;
        font-size: 1rem !important;
    }
    .colored-toast .swal2-content {
        margin: 0 !important;
        font-size: 0.875rem !important;
    }
`;
document.head.appendChild(style);

//export the action
export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;