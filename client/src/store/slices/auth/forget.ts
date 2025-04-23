import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GlobalUserState } from '@type/redux/state'

const initialState: GlobalUserState = {
    email: '',
    error: ''
}
const forget = createSlice({
    name: 'forget',
    initialState,
    reducers: {
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof GlobalUserState, value: string }>) => {
            state[name] = value
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state['error'] = payload
        }
    }
})
export const { change, setError } = forget.actions
export default forget.reducer