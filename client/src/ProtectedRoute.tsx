import { Navigate, Outlet } from 'react-router-dom'
import type { UserData } from './store/slices/core/App'

const ProtectedRoute = ({ user, verified }: { user: undefined | null | UserData, verified: undefined| null | boolean }) => {
    if (user === undefined && verified === undefined) return null
    else if (!user) return <Navigate to='/' />
    else if (verified === false) return <Navigate to='verify' />
    return <Outlet />
}
export default ProtectedRoute