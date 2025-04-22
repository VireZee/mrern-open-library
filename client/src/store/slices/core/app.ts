import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GlobalUserState } from '@type/redux/state'
import type User from '@type/redux/auth/user'

const initialState: GlobalUserState = {
    search: '',
    user: undefined,
    verified: null
}
const app = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<null | User>) => {
            state['user'] = payload
        },
        setVerified: (state, { payload }: PayloadAction<boolean>) => {
            state['verified'] = payload
        },
        setSearch: (state, { payload }: PayloadAction<string>) => {
            state['search'] = payload
        }
    }
})
export const { setUser, setVerified, setSearch } = app.actions
export default app.reducer