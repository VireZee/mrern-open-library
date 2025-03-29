import type { Store } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import App from './slices/core/App'
import Nav from './slices/layouts/Navbar'
import Reg from './slices/auth/Register'
import Ver from './slices/auth/Verify'
import Log from './slices/auth/Login'
import Home from './slices/views/Home'
import Col from './slices/views/Collection'
import API from './slices/views/API'
import Set from './slices/auth/Settings'

const ReduxStore: Store = configureStore({
    reducer: {
        APP: App,
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