import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface State {
    [key: string]: string | boolean
}
const initialState: State = {
    active: 'home',
    isDropdownOpen: false
}
const Navbar = createSlice({
    name: 'NAV',
    initialState,
    reducers: {
        setActive: (state, { payload }: PayloadAction<string>) => {
            state['active'] = payload
        },
        setIsDropdownOpen: (state, { payload }: PayloadAction<boolean>) => {
            state['isDropdownOpen'] = payload
        }
    }
})
export const { setActive, setIsDropdownOpen } = Navbar.actions
export default Navbar.reducer