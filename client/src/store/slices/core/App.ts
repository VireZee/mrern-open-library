import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserData {
    photo: string
    name: string
    uname: string
    email: string
}
interface State {
    [key: string]: string | undefined | null | UserData | boolean
}
const initialState: State = {
    search: '',
    user: undefined,
    loadUser: true
}
const App = createSlice({
    name: 'APP',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<null | UserData>) => {
            state['user'] = payload
            state['loadUser'] = false
        },
        setSearch: (state, { payload }: PayloadAction<string>) => {
            state['search'] = payload
        }
    }
})
export const { setUser, setSearch } = App.actions
export default App.reducer