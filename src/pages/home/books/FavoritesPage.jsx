import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdFavorite, MdDelete } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromFavorites, fetchUserFavorites } from '../../../redux/features/favorites/favoritesSlice';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import Swal from 'sweetalert2';
import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const FavoritesPage = () => {
    const dispatch = useDispatch();
    const { favoriteItems, loading, error } = useSelector((state) => state.favorites);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchUserFavorites(currentUser.uid));
        }
    }, [dispatch, currentUser]);

    if (loading) return <div>กำลังโหลด...</div>;
    if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const handleRemove = (id) => {
        Swal.fire({
            title: 'ยืนยันการลบ',
            text: "คุณต้องการลบหนังสือเล่มนี้ออกจากรายการโปรดหรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            background: '#fff',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeFromFavorites(id));
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'ลบหนังสือออกจากรายการโปรดแล้ว',
                    showConfirmButton: false,
                    timer: 1500,
                    toast: true,
                    background: '#4CAF50',
                    color: '#fff',
                    customClass: {
                        popup: 'colored-toast'
                    }
                });
            }
        });
    };

    const handleAddToCart = (book) => {
        dispatch(addToCart(book));
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'เพิ่มลงตะกร้าแล้ว',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            background: '#4CAF50',
            color: '#fff',
            customClass: {
                popup: 'colored-toast'
            }
        });
    };

    const style = document.createElement('style');
style.textContent = `
    .colored-toast.swal2-icon-success {
        background: #4CAF50 !important;
    }
    .colored-toast {
        padding: 0.5rem 1rem;
    }
    .colored-toast .swal2-title {
        color: white;
        font-size: 1rem;
    }
    .colored-toast .swal2-close {
        color: white;
    }
    .colored-toast .swal2-html-container {
        color: white;
    }
`;
document.head.appendChild(style);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-semibold mb-8 text-center">
                หนังสือที่คุณชื่นชอบ <span role="img" aria-label="heart">❤️</span>
            </h1>

            {favoriteItems.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <MdFavorite className="text-6xl text-red-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-xl">ยังไม่มีหนังสือที่ชื่นชอบ</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                    {favoriteItems.map((book) => (
                    <motion.div
                        key={book._id}
                        variants={itemVariants}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-500"
                    >
                        <div className="cursor-pointer">
                            <div className="relative">
                                {book.oldPrice > book.newPrice && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                                        ลด {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
                                    </div>
                                )}
                                <Link to={`/book/${book._id}`}>
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="w-full h-48 sm:h-56 md:h-64 object-contain rounded-t-lg"
                                    />
                                </Link>
                                <button
                                    onClick={() => handleRemove(book._id)}
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                >
                                    <MdDelete className="text-red-500 text-xl" />
                                </button>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-600">โดย {book.author}</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-500 line-through">฿{book.oldPrice.toFixed(2)}</p>
                                    <p className="text-lg font-bold text-green-500">฿{book.newPrice.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 pt-0">
                            <button
                                onClick={() => handleAddToCart(book)}
                                className="w-full px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center justify-center gap-2"
                            >
                                <FiShoppingCart size={20} />
                                เพิ่มลงตะกร้า
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            )}
        </div>
    );
}

export default FavoritesPage;