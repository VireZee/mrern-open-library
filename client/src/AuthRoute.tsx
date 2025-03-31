import { Navigate, Outlet } from 'react-router-dom'

const AuthRoute = ({ verified }: { verified: boolean }) => {
    if (verified === false) return <Navigate to='/verify' replace />
    if (verified === true) return <Navigate to='/' replace />
    return <Outlet />
}
export default AuthRoute