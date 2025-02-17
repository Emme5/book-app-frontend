import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import Swal from "sweetalert2";

const avatarIcons = [
  "👤", "😊", "🎮", "📚", "🎵", "🎨", "🏃", "🌟",
  ":D", "ὥ", "🤖", "🐷"
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleLogout = async () => {
		const cfResult = await Swal.fire({
		title: "คุณต้องการออกจากระบบใช่หรือไม่?",
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "ใช่",
		cancelButtonText: "ไม่ใช่",
		confirmButtonColor: "#4caf50",
		cancelButtonColor: "#d33",
		}).then((x) => x.isConfirmed);
		if (cfResult) {
		localStorage.removeItem("token");
		navigate("/");
		}
	};

	const isActivePath = (path) => {
		return location.pathname === path;
	};

	return (
		<section className="flex md:bg-gray-50 min-h-screen overflow-hidden">
      <aside className="hidden sm:flex sm:flex-col">
        <Link
          to="/"
          className="inline-flex items-center justify-center h-20 w-20 bg-indigo-600"
        >
          <img
            src="/Logo_ecom.png"
            alt=""
            className="h-12 w-12"
          />
        </Link>
        <div className="flex-grow flex flex-col justify-between text-gray-200 bg-gradient-to-b from-indigo-800 to-indigo-900">
          <nav className="flex flex-col mx-4 my-6 space-y-4">
            <Link
              to="/dashboard"
              className={`inline-flex items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 ${
                isActivePath("/dashboard")
                  ? "bg-indigo-700 text-white shadow-lg transform scale-105"
                  : "text-gray-300 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              <span className="sr-only">Dashboard</span>
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </Link>
            <Link
              to="/dashboard/add-new-book"
              className={`inline-flex items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 ${
                isActivePath("/dashboard/add-new-book")
                  ? "bg-indigo-700 text-white shadow-lg transform scale-105"
                  : "text-gray-300 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              <span className="sr-only">เพิ่มหนังสือ</span>
              <HiViewGridAdd className="h-6 w-6" />
            </Link>
            <Link
              to="/dashboard/manage-books"
              className={`inline-flex items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 ${
                isActivePath("/dashboard/manage-books")
                  ? "bg-indigo-700 text-white shadow-lg transform scale-105"
                  : "text-gray-300 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              <span className="sr-only">แก้ไขหนังสือ</span>
              <MdOutlineManageHistory className="h-6 w-6" />
            </Link>
            <Link
              to="/dashboard/delivery-status"
              className={`inline-flex items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 ${
                isActivePath("/dashboard/delivery-status")
                  ? "bg-indigo-700 text-white shadow-lg transform scale-105"
                  : "text-gray-300 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              <span className="sr-only">จัดการสถานะการจัดส่ง</span>
              <TbTruckDelivery className="h-6 w-6" />
            </Link>
          </nav>
        </div>
      </aside>
      <div className="flex-grow text-gray-800">
        <header className="flex items-center h-20 px-6 sm:px-10 bg-white shadow-sm">
          <button className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 rounded-full">
            <span className="sr-only">Menu</span>
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          <div className="flex flex-shrink-0 items-center ml-auto">
          <button className="inline-flex items-center p-2 hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors duration-200"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="sr-only">User Menu</span>
            <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
              <span className="font-semibold text-gray-900">Mongkol Suphamanee</span>
              <span className="text-sm text-indigo-600">สถานะ : แอดมิน</span>
            </div>
            {/* แก้ไขส่วนนี้ */}
            <div 
              className="h-12 w-12 ml-2 sm:ml-3 mr-2 rounded-full overflow-hidden ring-2 ring-indigo-500 ring-offset-2 relative"
            >
              {selectedIcon ? (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {selectedIcon}
                </div>
              ) : (
                <img
                  src="https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg"
                  alt="user profile photo"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-600 mb-2">เลือกไอคอนโปรไฟล์</div>
                <div className="grid grid-cols-4 gap-2">
                  {avatarIcons.map((icon, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedIcon(icon);
                        setIsDropdownOpen(false); // ปิด dropdown หลังเลือก
                      }}
                      className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-xl"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

            <div className="border-l pl-3 ml-3 space-x-1">
              <button
                onClick={handleLogout}
                className="relative p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors duration-200"
              >
                <span className="sr-only">Log out</span>
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <main className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
            <div className="mr-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <h2 className="text-gray-600 ml-0.5">หน้า Dashboard ยังไม่สมบูรณ์ยังต้องตรวจสอบอีกครั้ง XD</h2>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-end gap-4">
              <Link
                to="/dashboard/manage-books"
                className="inline-flex px-5 py-3 text-indigo-600 hover:text-indigo-700 focus:text-indigo-700 hover:bg-indigo-50 focus:bg-indigo-50 border-2 border-indigo-600 rounded-lg transition-colors duration-200"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                จัดการหนังสือ
              </Link>
              <Link
                to="/dashboard/add-new-book"
                className="inline-flex px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                เพิ่มหนังสือ
              </Link>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
	);
};

export default DashboardLayout;
