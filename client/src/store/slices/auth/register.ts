import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Errors, State } from '@type/redux/auth/register'

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