import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignIn from "../pages/SignIn/SignIn";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import SignUp from "../pages/SignUp/SignUp";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/Payment/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrder from "../pages/MyOrder/MyOrder";
import DetailOrder from "../pages/DetailOrder/DetailOrder";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import ContactPage from "../pages/ContactPage/ContactPage";

export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/detail-order/:id",
        page: DetailOrder,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/my-order",
        page: MyOrder,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/ordersuccess",
        page: OrderSuccess,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/contact",
        page: ContactPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/profile",
        page: ProfilePage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/products",
        page: ProductPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/payment",
        page: PaymentPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/sign-in",
        page: SignIn,
        isShowHeader: false,
        isPrivate: false
    },
    {
        path: "/forget-password",
        page: ForgetPassword,
        isShowHeader: false,
        isPrivate: false
    },
    {
        path: "/reset-password",
        page: ResetPassword,
        isShowHeader: false,
        isPrivate: false
    },
    {
        path: "/sign-up",
        page: SignUp,
        isShowHeader: false,
        isPrivate: false
    },
    {
        path: "/detail/:id",
        page: ProductDetail,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: "/system/admin",
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: "*",
        page: NotFoundPage,
        isShowHeader: false,
        isPrivate: false
    },
]