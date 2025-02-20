import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/home/books/CartPage";
import CheckoutPage from "../pages/home/books/CheckoutPage";
import BookDetail from "../pages/home/books/BookDetail";
import ErrorBoundary from "../components/ErrorBoundary";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/home/books/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import Book from "../pages/home/books/Book";
import DeliveryStatus from "../pages/dashboard/Status/DeliveryStatus";
import SuccessPage from "../pages/home/books/SuccessPage";
import CancelPage from "../pages/home/books/CancelPage";
import FavoritesPage from "../pages/home/books/FavoritesPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorBoundary />, // ตัวแจ้ง ERROR ในหน้าเว็บ
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/orders",
				element: (
					<PrivateRoute>
						<OrderPage />
					</PrivateRoute>
				),
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/cart",
				element: <CartPage />,
			},
			{
				path: "/checkout",
				element: (
					<PrivateRoute>
						<CheckoutPage />
					</PrivateRoute>
				),
			},
			{
				path: "/success",
				element: (
				  <PrivateRoute>
					<SuccessPage />
				  </PrivateRoute>
				),
			  },
			  {
				path: "/cancel",
				element: (
					<PrivateRoute>
						<CancelPage />
					</PrivateRoute>
				),
			},
			{
				path: "/favorites",
				element: (
					<PrivateRoute>
						<FavoritesPage />
					</PrivateRoute>
				),
			},
			{
				path: "/book/:id",
				element: <BookDetail />,
				errorElement: <ErrorBoundary />, // ตัวแจ้ง ERROR ในหน้าเว็บ
			},
			{
				path: "/book",
				element: <Book />,
				errorElement: <ErrorBoundary />,
			},
			{
				path: "/search",
				element: <Book />
			},
		],
	},
	{
		path: "/admin",
		element: <AdminLogin />,
	},
	{
		path: "/dashboard",
		element: (
			<AdminRoute>
				<DashboardLayout />
			</AdminRoute>
		),
		children: [
			{
				path: "",
				element: <Dashboard />,
			},
			{
				path: "add-new-book",
				element: <AddBook />,
			},
			{
				path: "edit-book/:id",
				element: <UpdateBook />,
			},
			{
				path: "manage-books",
				element: <ManageBooks />,
			},
			{
				path: "delivery-status",
				element: <DeliveryStatus />,
			},
		],
	},
]);

export default router;
