import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GlobalUserState } from '@type/redux/state'
import type ExtendedError from '@type/redux/auth/extendedError'

const initialState: GlobalUserState = {
    isDropdownOpen: false,
    photo: '',
    name: '',
    username: '',
    email: '',
    oldPass: '',
    newPass: '',
    rePass: '',
    show: { old: false, new: false },
    errors: {}
}
const settings = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setIsDropdownOpen: (state, { payload }: PayloadAction<boolean>) => {
            state['isDropdownOpen'] = payload
        },
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof GlobalUserState, value: string }>) => {
            state[name] = value
        },
        setShow: (state, { payload }: PayloadAction<{ old: boolean, new: boolean }>) => {
            state['show'] = payload
        },
        setErrors: (state, { payload }: PayloadAction<ExtendedError>) => {
            state['errors'] = payload
        }
    }
})
export const { setIsDropdownOpen, change, setShow, setErrors } = settings.actions
export default settings.reducer