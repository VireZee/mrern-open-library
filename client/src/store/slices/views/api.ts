import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { GlobalBookState } from '@type/redux/state'

const initialState: GlobalBookState = {
    online: navigator.onLine,
    apiKey: undefined
}
const api = createSlice({
    name: 'api',
    initialState,
    reducers: {
        setOnline: (state, { payload }: PayloadAction<boolean>) => {
            state['online'] = payload
        },
        setApiKey: (state, { payload }: PayloadAction<string | null>) => {
            state['apiKey'] = payload
        }
    }
})
export const { setOnline, setApiKey } = api.actions
export default api.reducer