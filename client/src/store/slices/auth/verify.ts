import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type State from '@type/redux/auth/verify'

const initialState: State = {
    code: '',
    error: ''
}
const verify = createSlice({
    name: 'verify',
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
export const { change, setError } = verify.actions
export default verify.reducer