import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type GlobalState from '@type/redux/globalState'

const initialState: GlobalState = {
    active: 'home',
    isDropdownOpen: false
}
const navbar = createSlice({
    name: 'navbar',
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
export const { setActive, setIsDropdownOpen } = navbar.actions
export default navbar.reducer