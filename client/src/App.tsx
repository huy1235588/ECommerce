import { Route, Routes } from 'react-router-dom'
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

function App(): JSX.Element {
    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <Routes>
                {/* Auth */}
                <Route path='/auth' element={<AuthLayout />}>
                    <Route path='login' element={<AuthLogin />} />
                    <Route path='register' element={<AuthRegister />} />
                </Route>

                {/* Admin */}
                <Route path='/admin' element={<AdminLayout />}>
                    <Route path='dashboard' element={<AdminDashboard />} />
                    <Route path='features' element={<AdminFeatures />} />
                    <Route path='orders' element={<AdminOrders />} />
                    <Route path='products' element={<AdminProducts />} />
                </Route>

                {/* Shopping */}
                <Route path='/shop' element={<ShoppingLayout />}>
                    <Route path='account' element={<ShoppingAccount />} />
                    <Route path='checkout' element={<ShoppingCheckout />} />
                    <Route path='home' element={<ShoppingHome />} />
                    <Route path='listing' element={<ShoppingListing />} />
                </Route>

                {/* Not found page */}
                <Route path='*' element={<NotFound />} />

            </Routes>
        </div>
    );
}

export default App;
