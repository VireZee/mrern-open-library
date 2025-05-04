import { configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import app from '@store/slices/core/app'
import navbar from '@store/slices/layouts/navbar'
import register from '@store/slices/auth/register'
import verify from '@store/slices/auth/verify'
import login from '@store/slices/auth/login'
import home from '@store/slices/views/home'
import collection from '@store/slices/views/collection'
import api from '@store/slices/views/api'
import settings from '@store/slices/auth/settings'
import forget from '@store/slices/auth/forget'
import reset from '@store/slices/auth/reset'

const store: Store = configureStore({
    reducer: {
        app,
        navbar,
        register,
        verify,
        login,
        home,
        collection,
        api,
        settings,
        forget,
        reset
    }
})
export type RootState = ReturnType<typeof store.getState>
export default store