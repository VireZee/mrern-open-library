import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GlobalUserState } from '@type/redux/state'

const initialState: GlobalUserState = {
    isValidating: true,
    pass: '',
    rePass: '',
    show: false,
    error: ''
}
const reset = createSlice({
    name: 'reset',
    initialState,
    reducers: {
        setIsValidating: (state, { payload }: PayloadAction<boolean>) => {
            state['isValidating'] = payload
        },
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof GlobalUserState, value: string }>) => {
            state[name] = value
        },
        setShow: (state, { payload }: PayloadAction<boolean>) => {
            state['show'] = payload
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state['error'] = payload
        }
    }
})
export const { setIsValidating, change, setShow, setError } = reset.actions
export default reset.reducer