import { Navigate, Outlet } from 'react-router-dom'
import NF from '@components/common/NotFound'

const VerifyRoute = ({ verified }: { verified: boolean | null }) => {
    if (verified === null) return <NF />
    if (verified === true) return <Navigate to='/' replace />
    return <Outlet />
}
export default VerifyRoute