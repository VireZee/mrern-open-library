import { configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import app from '@store/slices/core/app'
import navbar from '@store/slices/layouts/navbar'
import register from '@store/slices/auth/register'
import verify from '@store/slices/auth/verify'
import login from '@store/slices/auth/login'
import Home from '@store/slices/views/Home'
import Col from '@store/slices/views/Collection'
import API from '@store/slices/views/API'
import settings from '@store/slices/auth/settings'

const store: Store = configureStore({
    reducer: {
        app,
        navbar,
        register,
        verify,
        login,
        HOME: Home,
        COL: Col,
        API: API,
        settings
    }
})
export type RootState = ReturnType<typeof store.getState>
export default store