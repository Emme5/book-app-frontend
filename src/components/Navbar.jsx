import { Link, useLocation } from "react-router-dom";
import { FaBagShopping, FaBars } from "react-icons/fa6";
import { MdCheckCircle, MdDashboard, MdReceipt, MdShoppingCart } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import { FaHome, FaRegUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import Swal from 'sweetalert2';

const gradientAnimation = `
  @keyframes gradientBg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const cartItem = useSelector((state) => state.cart.cartItem);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = gradientAnimation;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const getNavigation = () => {
        const baseNavigation = [
            { name: "เลือกซื้อ", href: "/book", icon: <FaBagShopping className="inline-block mr-2 text-2xl"/> },
            { name: "Orders", href: "/orders", icon: <MdReceipt className="inline-block mr-2 text-2xl"/> },
            { name: "Cart Page", href: "/cart", icon: <MdShoppingCart className="inline-block mr-2 text-2xl"/> },
            { name: "Check Out", href: "/checkout", icon: <MdCheckCircle className="inline-block mr-2 text-2xl"/> },
        ];

        if (currentUser?.role === 'admin') {
            baseNavigation.splice(1, 0, { 
                name: "Dashboard", 
                href: "/dashboard", 
                icon: <MdDashboard className="inline-block mr-2 text-2xl"/> 
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
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
            <div className="relative w-full h-full bg-gradient-to-r from-red-100 via-orange-100 to-red-100 bg-[length:200%_200%]"
                 style={{
                     animation: 'gradientBg 15s ease infinite',
                 }}>
                <nav className="container mx-auto px-8 py-4 font-primary flex justify-between items-center">
                    {/* Left Side */}
                    <div className="flex items-center md:gap-8 gap-4">
                        <FaBars
                            className="text-secondary text-xl cursor-pointer hover:text-gray-500 transition-colors"
                            onClick={() => setIsDrawerOpen(true)}
                        />

                        <form onSubmit={handleSearch} className="relative sm:w-72 w-40">
                            <ImSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 text-lg hover:text-orange-600 transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ค้นหาที่นี่"
                                className="bg-white/90 backdrop-blur-sm w-full py-2 pl-10 pr-4 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </form>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center md:gap-6 gap-4 mx-8">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="bg-orange-400 hover:bg-orange-600 text-white flex items-center px-4 py-2 rounded-lg transition backdrop-blur-sm"
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
                                        <img
                                            src={avatar}
                                            alt="avatar"
                                            className="w-9 h-9 rounded-full ring-4 ring-green-500 hover:ring-green-600 transition-all"
                                        />
                                    </button>

                                    {/* Dropdown */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 ease-out scale-100 opacity-100 backdrop-blur-lg">
                                            {/* User Info Section */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-100">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {currentUser.email}
                                                </p>
                                            </div>
                                            
                                            {/* Menu Items */}
                                            <div className="py-2">
                                            <button
                                                onClick={handleLogOut}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors duration-150"
                                            >
                                                <FiLogOut className="mr-2 text-orange-500" />
                                                <span>ออกจากระบบ</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                </>
                            ) : (
                                <Link to="/login">
                                    <FaRegUserCircle className="text-black text-4xl cursor-pointer hover:text-zinc-500 transition-colors" />
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
                className={`p-4 pt-6 fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-orange-100 via-white to-orange-50 shadow-lg z-50 transform ${
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
                <div className="mb-6 flex items-center justify-center">
                    {currentUser ? (
                        <div className="text-center">
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-16 h-16 rounded-full ring-4 ring-green-500 mx-auto mb-2"
                            />
                            <p className="text-sm font-medium text-gray-800 mb-2">
                                {currentUser.email}
                            </p>
                            
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex items-center justify-center gap-2 px-14 py-2 text-gray-700 hover:bg-orange-100 rounded-lg transition-colors duration-150"
                        >
                            <FaRegUserCircle className="text-2xl" />
                            <span>เข้าสู่ระบบ</span>
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
                                <FaHome className="inline-block mr-2 text-2xl" />
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
            </div>
        </header>
    );
};

export default Navbar;
