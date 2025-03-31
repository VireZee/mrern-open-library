import { Navigate, Outlet } from 'react-router-dom'

const HomeRoute = ({ user, verified }: { user: undefined | null, verified: boolean }) => {
    if (user === undefined && verified === undefined) return null
    if (verified === false) return <Navigate to='/verify' replace />
    return <Outlet />
}
export default HomeRoute