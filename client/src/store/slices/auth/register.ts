import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type GlobalState from '@type/redux/globalState'
import type BaseError from '@type/redux/user/baseError'

const initialState: GlobalState = {
    name: '',
    uname: '',
    email: '',
    pass: '',
    rePass: '',
    show: false,
    errors: {}
}
const register = createSlice({
    name: 'register',
    initialState,
    reducers: {
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof GlobalState, value: string }>) => {
            state[name] = value
        },
        setShow: (state, { payload }: PayloadAction<boolean>) => {
            state['show'] = payload
        },
        setErrors: (state, { payload }: PayloadAction<BaseError>) => {
            state['errors'] = payload
        }
    }
})
export const { change, setShow, setErrors } = register.actions
export default register.reducer