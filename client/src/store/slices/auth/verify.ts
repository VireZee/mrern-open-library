import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type GlobalState from '@type/redux/globalState'

const initialState: GlobalState = {
    code: '',
    error: ''
}
const verify = createSlice({
    name: 'verify',
    initialState,
    reducers: {
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof GlobalState, value: string }>) => {
            state[name] = value
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state['error'] = payload
        }
    }
})
export const { change, setError } = verify.actions
export default verify.reducer