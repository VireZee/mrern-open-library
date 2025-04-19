import { Navigate, Outlet } from 'react-router-dom'

export default ({ verified }: { verified: boolean | null }) => {
    if (verified === false) return <Navigate to='/verify' replace />
    if (verified === true) return <Navigate to='/' replace />
    return <Outlet />
}