import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getImgUrl } from '../../../utils/getImgUrl';
import { clearCart, removeFromCart } from '../../../redux/features/cart/cartSlice';
import Swal from 'sweetalert2';

const CartPage = () => {
    const cartItem = useSelector(state => state.cart.cartItem) || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const totalPrice = cartItem.reduce((acc, item) => {
      if (!item || typeof item.newPrice !== 'number') {
          return acc;
      }
      return acc + item.newPrice;
  }, 0).toFixed(2);
    
    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product))
    }

    const handleClearCart = () => {
        dispatch(clearCart())
    }

    const handleCheckout = () => {
      if (cartItem.length === 0) {
          // แสดง Sweetalert2 popup
          Swal.fire({
              title: "ไม่พบสินค้าในตะกร้า",
              text: "กรุณาเพิ่มสินค้าในตะกร้าก่อนดำเนินการต่อ",
              icon: "warning",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#4F46E5", // สีปุ่มตามสี indigo-600
          });
      } else {
          navigate('/checkout');
      }
  }

  return (
    <>
      <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between">
        <div className="text-lg font-extrabold text-gray-800">ตะกร้าสินค้า</div>
        <div className="ml-3 flex h-7 items-center ">
          <button
            type="button"
            onClick={handleClearCart}
            className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200"
          >
            <span className="">นำออกทั้งหมด</span>
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flow-root">
          {
            cartItem.length > 0 ? (
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                {
                    cartItem.map((product) => (
                        <li key={product._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      alt=""
                      src={`${getImgUrl(product?.coverImage)}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to='/'>{product?.title}</Link>
                        </h3>
                        <p className="sm:ml-4">${product?.newPrice}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 capitalize">
                        <strong>หมวดหมู่ : </strong>{product?.category}</p>
                    </div>
                    <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                      <p className="text-gray-500"><strong>จำนวน :</strong> 1</p>

                      <div className="flex">
                        <button
                        onClick={() =>
                        handleRemoveFromCart(product)}
                        type="button" 
                        className="font-medium text-indigo-600
                        hover:text-indigo-500">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
                ))}
            </ul>
            ) : (
            <p>ไม่พบสินค้าในขณะนี้</p>
          )}
        </div>
      </div>
    </div>

    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
      <div className="flex justify-between text-base font-medium text-gray-900">
        <p>ยอดรวมย่อย</p>
        <p>${totalPrice ? totalPrice : 0}</p>
      </div>
      <p className="mt-0.5 text-sm text-gray-500">ค่าขนส่งและภาษีจะคำนวณเมื่อชำระเงิน.</p>
      <div className="mt-6">
      <button
          onClick={handleCheckout}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
            Checkout
        </button>
      </div>
      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
        <Link to="/">
          or 
          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
              Continue Shopping / ช้อปปิ้งต่อ <span aria-hidden="true"> &rarr;</span>
          </button>
        </Link>
      </div>
    </div>
  </div>
    </>
  )
}

export default CartPage
