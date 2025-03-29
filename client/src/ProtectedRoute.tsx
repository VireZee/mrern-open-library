import { Navigate, Outlet } from 'react-router-dom'
import type { UserData } from './store/slices/core/App'

const ProtectedRoute = ({ user, verified }: { user: null | UserData, verified: null | boolean }) => {
    if (user === null || verified === null) return null
    if (!user) return <Navigate to='/' />
    if (!verified) return <Navigate to='verify' />
    return <Outlet />
}
export default ProtectedRoute