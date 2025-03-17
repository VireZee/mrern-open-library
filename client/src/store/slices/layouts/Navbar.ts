import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface State {
    [key: string]: string | undefined | boolean
}
const initialState: State = {
    active: 'home',
    search: undefined,
    isDropdownOpen: false
}
const Navbar = createSlice({
    name: 'NAV',
    initialState,
    reducers: {
        setActive: (state, { payload }: PayloadAction<string>) => {
            state['active'] = payload
        },
        setSearch: (state, { payload }: PayloadAction<undefined | string>) => {
            state['search'] = payload
        },
        setIsDropdownOpen: (state, { payload }: PayloadAction<boolean>) => {
            state['isDropdownOpen'] = payload
        }
    }
})
export const { setActive, setSearch, setIsDropdownOpen } = Navbar.actions
export default Navbar.reducer