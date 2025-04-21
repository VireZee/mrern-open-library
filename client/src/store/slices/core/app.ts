import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type GlobalState from '@type/redux/globalState'
import type User from '@type/redux/user/user'

const initialState: GlobalState = {
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