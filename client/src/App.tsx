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

function App(): JSX.Element {
    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <Routes>
                {/* Auth */}
                <Route path='/auth' element={<AuthLayout />}>
                    <Route path='login' element={<AuthLogin />}></Route>
                    <Route path='register' element={<AuthRegister />}></Route>
                </Route>

                {/* Admin */}
                <Route path='/admin' element={<AdminLayout />}>
                    <Route path='dashboard' element={<AdminDashboard />}></Route>
                    <Route path='features' element={<AdminFeatures />}></Route>
                    <Route path='orders' element={<AdminOrders />}></Route>
                    <Route path='products' element={<AdminProducts />}></Route>
                </Route>

                {/* Shopping */}
                <Route path='/shop' element={<ShoppingLayout />}></Route>

                {/* Not found page */}
                <Route path='*' element={<NotFound />}></Route>

            </Routes>
        </div>
    );
}

export default App;
