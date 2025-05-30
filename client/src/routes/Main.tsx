import { Navigate, Outlet } from 'react-router-dom'
export default ({ user, verified }: { user: undefined | null, verified: boolean | null }) => {
    if (user === undefined && verified === null) return null
    if (verified === false) return <Navigate to='/verify' replace />
    return <Outlet />
}