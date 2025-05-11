import { Outlet } from 'react-router-dom'
import NF from '@components/common/NotFound'
export default ({ verified }: { verified: boolean | null }) => {
    if (verified === null || verified === true) return <NF />
    return <Outlet />
}