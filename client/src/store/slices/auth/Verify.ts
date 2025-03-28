import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface State {
    [key: string]: string
}
const initialState: State = {
    code: '',
    error: ''
}
const Verify = createSlice({
    name: 'VER',
    initialState,
    reducers: {
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof State, value: string }>) => {
            state[name] = value
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state['error'] = payload
        }
    }
})
export const { change, setError } = Verify.actions
export default Verify.reducer