import { Navigate, Outlet } from 'react-router-dom'
import NF from './components/common/NotFound'

const VerifyRoute = ({ verified }: { verified: boolean }) => {
    if (verified === undefined) return <NF />
    if (verified === true) return <Navigate to='/' replace />
    return <Outlet />
}
export default VerifyRoute