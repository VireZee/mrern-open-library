import { configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import app from '@store/slices/core/app'
import Nav from '@store/slices/layouts/Navbar'
import Reg from '@store/slices/auth/Register'
import Ver from '@store/slices/auth/Verify'
import Log from '@store/slices/auth/Login'
import Home from '@store/slices/views/Home'
import Col from '@store/slices/views/Collection'
import API from '@store/slices/views/API'
import Set from '@store/slices/auth/Settings'

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