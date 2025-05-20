import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { GlobalBookState } from '@type/redux/state'
import type Books from '@type/redux/book/book'

const initialState: GlobalBookState = {
    online: navigator.onLine,
    load: false,
    books: [],
    currentPage: 1,
    totalPages: 1
}
const collection = createSlice({
    name: 'collection',
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
        setCurrentPage: (state, { payload }: PayloadAction<number>) => {
            state['currentPage'] = payload
        },
        setTotalPages: (state, { payload }: PayloadAction<number>) => {
            state['totalPages'] = payload
        }
    }
})
export const { setOnline, setLoad, setBooks, setCurrentPage, setTotalPages } = collection.actions
export default collection.reducer