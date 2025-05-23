import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { GlobalBookState } from '@type/redux/state'
import type Books from '@type/redux/book/books'

const initialState: GlobalBookState = {
    online: navigator.onLine,
    load: false,
    books: [],
    totalPages: 1,
    status: {}
}
const home = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setOnline: (state, { payload }: PayloadAction<boolean>) => {
            state['online'] = payload
        },
        setLoad: (state, { payload }: PayloadAction<boolean>) => {
            state['load'] = payload
        },
        setBooks: (state, { payload }: PayloadAction<Books[]>) => {
            state['books'] = payload
        },
        setTotalPages: (state, { payload }: PayloadAction<number>) => {
            state['totalPages'] = payload
        },
        setStatus: (state, { payload: { id, added } }: PayloadAction<{ id: string, added: boolean }>) => {
            state.status![id] = added
        }
    }
})
export const { setOnline, setLoad, setBooks, setTotalPages, setStatus } = home.actions
export default home.reducer