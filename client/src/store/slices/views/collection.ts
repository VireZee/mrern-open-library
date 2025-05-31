import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { GlobalBookState } from '@type/redux/state'
import type Books from '@type/redux/book/books'

const initialState: GlobalBookState = {
    online: navigator.onLine,
    load: false,
    books: [],
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
        setTotalPages: (state, { payload }: PayloadAction<number>) => {
            state['totalPages'] = payload
        }
    }
})
export const { setOnline, setLoad, setBooks, setTotalPages } = collection.actions
export default collection.reducer