import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin/layout'
import AdminDashboard from './pages/admin/dashboard'
import AdminFeatures from './pages/admin/features'
import AdminOrders from './pages/admin/orders'
import AdminProducts from './pages/admin/products'
import ShoppingLayout from './components/shopping/layout'
import NotFound from './pages/not-found'
import ShoppingAccount from './pages/shopping/account'
import ShoppingCheckout from './pages/shopping/checkout'
import ShoppingHome from './pages/shopping/home'
import ShoppingListing from './pages/shopping/listing'
import CheckAuth from './components/common/checkAuth'
import UnAuthPage from './pages/unauth-page'
import EmailVerify from './pages/auth/emailVerify'
import ForgotPassword from './pages/auth/forgotPassword'
import ResetPassword from './pages/auth/resetPassword'
import ForgotPasswordVerify from './pages/auth/forgotPasswrodVerify'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store/store'
import { CheckAuthUser } from './store/auth'
import ShoppingAbout from './pages/shopping/about'

function App(): JSX.Element {
    const dispath = useDispatch<AppDispatch>();

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispath(CheckAuthUser());
    }, [dispath])


    return (
        <div className="flex flex-col dark">
            <Routes>
                {/* Auth */}
                <Route path='/auth' element={
                    //
                    <CheckAuth
                        isAuthenticated={isAuthenticated}
                        user={user}
                    >
                        <AuthLayout />
                    </CheckAuth>
                }>
                    <Route path='login' element={<AuthLogin />} />
                    <Route path='register' element={<AuthRegister />} />
                    <Route path='verify-email' element={<EmailVerify />} />
                    <Route path='forgot-password' element={<ForgotPassword />} />
                    <Route path='forgot-password/verify' element={<ForgotPasswordVerify />} />
                    <Route path='reset-password' element={<ResetPassword />} />
                </Route>

                {/* Admin */}
                <Route path='/admin' element={
                    <CheckAuth
                        isAuthenticated={isAuthenticated}
                        user={user}
                    >
                        <AdminLayout />
                    </CheckAuth>
                }>
                    <Route path='dashboard' element={<AdminDashboard />} />
                    <Route path='features' element={<AdminFeatures />} />
                    <Route path='orders' element={<AdminOrders />} />
                    <Route path='products' element={<AdminProducts />} />
                </Route>

                {/* Shopping */}
                <Route path='/shop' element={
                    <CheckAuth
                        isAuthenticated={isAuthenticated}
                        user={user}
                    >
                        <ShoppingLayout />
                    </CheckAuth>
                }>
                    <Route path='account' element={<ShoppingAccount />} />
                    <Route path='checkout' element={<ShoppingCheckout />} />
                    <Route path='home' element={<ShoppingHome />} />
                    <Route path='listing' element={<ShoppingListing />} />
                    <Route path='about' element={<ShoppingAbout />} />
                </Route>

                {/* Not found page */}
                <Route path='*' element={<NotFound />} />
                <Route path='/unauth-page' element={< UnAuthPage />} />
                <Route path='/' element={<Navigate to='/shop/home' />} />
            </Routes>
        </div >
    );
}

export default App;
