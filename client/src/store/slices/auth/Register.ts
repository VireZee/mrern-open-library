import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface Errors {
    name?: string
    uname?: string
    email?: string
    pass?: string
    rePass?: string
}
interface State {
    [key: string]: string | boolean | Errors
}
const initialState: State = {
    name: '',
    uname: '',
    email: '',
    pass: '',
    rePass: '',
    show: false,
    errors: {}
}
const Register = createSlice({
    name: 'REG',
    initialState,
    reducers: {
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof State, value: string }>) => {
            state[name] = value
        },
        setShow: (state, { payload }: PayloadAction<boolean>) => {
            state['show'] = payload
        },
        setErrors: (state, { payload }: PayloadAction<Errors>) => {
            state['errors'] = payload
        }
    }
})
export const { change, setShow, setErrors } = Register.actions
export default Register.reducer