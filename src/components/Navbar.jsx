import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBagShopping, FaBars } from "react-icons/fa6";
import { MdCheckCircle, MdDashboard, MdReceipt, MdShoppingCart, MdFavorite } from "react-icons/md";
import { FaHome, FaRegUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import Swal from 'sweetalert2';
import SearchWithSuggestions from './SearchWithSuggestions';
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import UserAvatar from './UserAvatar';
import { clearFavorites } from '../redux/features/favorites/favoritesSlice';

const avatarIcons = [
    "👤", "😊", "🎮", "📚", "🎵", "🎨", "🏃", "🌟",
    ":D", "ὥ", "🤖", "🐷"
];

const gradientAnimation = `
  @keyframes gradientBg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Navbar = () => {
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const cartItem = useSelector((state) => state.cart.cartItem);
    const { data, isLoading } = useFetchAllBooksQuery();
    const books = data?.books || [];
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [selectedIcon, setSelectedIcon] = useState(() => {
        // โหลดค่าจาก localStorage เมื่อ component mount
        return localStorage.getItem('userAvatar') || null;
    });

    const handleIconSelect = (icon) => {
        setSelectedIcon(icon);
        localStorage.setItem('userAvatar', icon); // บันทึกลง localStorage
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = gradientAnimation;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const getNavigation = () => {
        const baseNavigation = [
            { name: "เลือกซื้อ", href: "/book", icon: <FaBagShopping className="inline-block mr-2 text-2xl text-amber-500"/> },
            { name: "หนังสือที่ชื่นชอบ", href: "/favorites", icon: <MdFavorite className="inline-block mr-2 text-2xl text-red-500"/> },
            { name: "ประว้ติการสั่งซื้อ", href: "/orders", icon: <MdReceipt className="inline-block mr-2 text-2xl text-stone-500"/> },
            { name: "ตะกร้าสินค้า", href: "/cart", icon: <MdShoppingCart className="inline-block mr-2 text-2xl text-emerald-500"/> },
            { name: "ชำระเงิน", href: "/checkout", icon: <MdCheckCircle className="inline-block mr-2 text-2xl text-fuchsia-500"/> },
        ];

        if (currentUser?.role === 'admin') {
            baseNavigation.splice(1, 0, { 
                name: "Dashboard", 
                href: "/dashboard", 
                icon: <MdDashboard className="inline-block mr-2 text-2xl text-sky-500"/> 
            });
        }

        return baseNavigation;
    };

    const navigation = getNavigation();

    const handleLogOut = () => {
        Swal.fire({
            title: 'ยืนยันการออกจากระบบ',
            text: 'คุณแน่ใจหรือไม่ที่จะออกจากระบบ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                dispatch(clearFavorites()); // เพิ่มบรรทัดนี้
                localStorage.removeItem('userAvatar');
                setSelectedIcon(null);
                setIsDropdownOpen(false);
                setIsDrawerOpen(false);
                Swal.fire(
                    'ออกจากระบบสำเร็จ!',
                    'คุณได้ออกจากระบบเรียบร้อยแล้ว',
                    'success'
                );
            }
        });
    };

    useEffect(() => {
        const closeDropdown = (e) => {
            if (isDropdownOpen && !e.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, [isDropdownOpen]);
    
	return (
		<header className="sticky top-0 z-50">
            {/* Animated gradient background */}
            <div className="relative w-full h-full bg-gradient-to-b from-green-600 via-green-500 to-green-400 bg-[length:200%_200%]"
                 style={{
                    animation: 'gradientBg 15s ease infinite',
                 }}>
                <nav className="container mx-auto px-8 py-4 font-primary flex justify-between items-center">
                    <div className="flex items-center md:gap-8 gap-4">
                        <FaBars
                        className="text-secondary text-xl cursor-pointer hover:text-gray-500 transition-colors"
                        onClick={() => setIsDrawerOpen(true)}
                    />

                    {!isLoading && books && books.length > 0 && (
                        <SearchWithSuggestions books={books} />
                    )}
                </div>

                    {/* Right Side */}
                    <div className="flex items-center md:gap-6 gap-4 mx-8">
                    {/* Favorites */}
                        <Link
                            to="/favorites"
                            className="bg-green-700 hover:bg-green-800 text-white flex items-center px-4 py-2 rounded-lg transition backdrop-blur-sm"
                        >
                            <MdFavorite className="text-2xl" />
                        </Link>
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="bg-green-700 hover:bg-green-800 text-white flex items-center px-4 py-2 rounded-lg transition backdrop-blur-sm"
                        >
                            <IoCartOutline className="text-2xl" />
                            <span className="ml-2 text-sm font-medium">
                                {cartItem.length > 0 ? cartItem.length : 0}
                            </span>
                        </Link>

                        {/* User Avatar or Login */}
                        <div className="relative dropdown-container">
                            {currentUser ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDropdownOpen(!isDropdownOpen);
                                        }}
                                        className="focus:outline-none transform transition-transform duration-200 hover:scale-105"
                                    >
                                        <UserAvatar 
                                            email={currentUser.email}
                                            size="small"
                                            selectedIcon={selectedIcon}
                                            onIconSelect={setSelectedIcon}
                                        />
                                    </button>

                                    {/* Dropdown */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 ease-out scale-100 opacity-100 backdrop-blur-lg">
                                        {/* User Info Section */}
                                        <div className="px-4 py-3 bg-gradient-to-r from-green-100 to-green-50 border-b border-green-100">
                                            <p className="text-sm font-medium text-gray-800">
                                                {currentUser.email}
                                            </p>
                                        </div>

                                        {/* Icon Selector Section */}
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <div className="text-sm font-medium text-gray-600 mb-2">เลือกไอคอนโปรไฟล์</div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {avatarIcons.map((icon, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleIconSelect(icon)}
                                                        className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-xl"
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                            
                                            {/* Logout Button */}
                                            <div className="py-2">
                                                <button
                                                    onClick={handleLogOut}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-150"
                                                >
                                                <FiLogOut className="mr-2 text-orange-500" />
                                                <span>ออกจากระบบ</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                </>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg items-center justify-center gap-2 transition-colors md:flex hidden"
                                >
                                    <FaRegUserCircle className="text-xl" />
                                    <span>สมัครสมาชิก / ลงชื่อเข้าใช้</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Drawer */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}
            
            <div
                className={`p-4 pt-6 fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-green-100 via-white to-green-50 shadow-lg z-50 transform ${
                    isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300`}
            >
                <button
                    className="absolute top-4 right-4 text-orange-600 hover:text-orange-800 text-2xl font-bold transition-colors"
                    onClick={() => setIsDrawerOpen(false)}
                >
                    &times;
                </button>
                <div className="mb-6 text-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                        BooksMark
                    </span>
                </div>
                
                {/* User Section at the top of drawer */}
                <div className="mb-6 flex flex-col items-center justify-center w-full">
                    {currentUser ? (
                        <div className="text-center w-full">
                            <div className="flex justify-center mb-2">
                                <UserAvatar 
                                    email={currentUser.email}
                                    size="normal"
                                    selectedIcon={selectedIcon}
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                                {currentUser.email}
                            </p>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <FaRegUserCircle className="text-xl" />
                            <span>สมัครสมาชิก</span>
                        </Link>
                    )}
                </div>

                <ul className="mt-6 space-y-2">
                    <li>
                        <Link
                            to={"/"}
                            onClick={() => setIsDrawerOpen(false)}
                            className={`block py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-700 p-2 rounded-lg transition-all duration-200 ${
                                location.pathname === "/" ? "bg-orange-200 text-orange-800" : ""
                            }`}
                        >
                            <div className="flex items-center">
                                <FaHome className="inline-block mr-2 text-2xl text-slate-950" />
                                หน้าหลัก
                            </div>
                        </Link>
                    </li>
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.href}
                                onClick={() => setIsDrawerOpen(false)}
                                {...(item.name === "Dashboard" ? {
                                    target: "_blank",
                                    rel: "noopener noreferrer"
                                } : {})}
                                className={`block py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-700 p-2 rounded-lg transition-all duration-200 ${
                                    location.pathname === item.href ? "bg-orange-200 text-orange-800" : ""
                                }`}
                            >
                                {item.icon && item.icon}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                {currentUser && (
                <button
                    onClick={() => {
                    handleLogOut();
                    setIsDrawerOpen(false);
                    }}
                    className="flex items-center justify-center px-5 py-5 text-sm hover:bg-orange-100 rounded-md transition-colors duration-150 w-full border-b border-gray-300"
                >
                    <FiLogOut className="mr-2 text-orange-500 " />
                    <span>ออกจากระบบ</span>
                </button>
            )}
            </div>
        </header>
    );
};

export default Navbar;
