import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ user, verified }: { user: undefined | null , verified: null  | boolean }) => {
    if (user === undefined && verified === null) return null
    if (user === null) return <Navigate to='/' replace />
    if (verified === false) return <Navigate to='/verify' replace />
    return <Outlet />
}
export default ProtectedRoute