import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'

function App(): JSX.Element {
    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <h1>Header</h1>

            <Routes>
                <Route path='/auth' element={<AuthLayout />}>
                    <Route path='login' element={<AuthLogin />}></Route>
                    <Route path='register' element={<AuthRegister />}></Route>
                </Route>
            </Routes>

        </div>
    )
}

export default App
