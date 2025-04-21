import { configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import app from '@store/slices/core/app'
import Nav from '@store/slices/layouts/Navbar'
import Reg from '@store/slices/auth/registers'
import Ver from '@store/slices/auth/verify'
import Log from '@store/slices/auth/login'
import Home from '@store/slices/views/Home'
import Col from '@store/slices/views/Collection'
import API from '@store/slices/views/API'
import Set from '@store/slices/auth/settings'

const ReduxStore: Store = configureStore({
    reducer: {
        app,
        NAV: Nav,
        REG: Reg,
        VER: Ver,
        LOG: Log,
        HOME: Home,
        COL: Col,
        API: API,
        SET: Set
    }
})
export type RootState = ReturnType<typeof ReduxStore.getState>
export default ReduxStore