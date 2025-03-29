import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface UserData {
    photo: string
    name: string
    uname: string
    email: string
    verified: boolean
}
interface State {
    [key: string]: string | undefined | null | UserData | boolean
}
const initialState: State = {
    search: '',
    user: undefined,
    verified: undefined
}
const App = createSlice({
    name: 'APP',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<null | UserData>) => {
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
export const { setUser, setVerified, setSearch } = App.actions
export default App.reducer