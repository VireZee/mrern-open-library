import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface Books {
    author_key: string[]
    cover_edition_key: string
    cover_i: number
    title: string
    author_name: string[]
}
interface State {
    [key: string]: boolean | Books[] | number
    books: Books[]
}
const initialState: State = {
    online: navigator.onLine,
    load: false,
    books: [],
    currentPage: 1,
    totalPages: 1
}
const Collection = createSlice({
    name: 'COL',
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
export const { setOnline, setLoad, setBooks, setCurrentPage, setTotalPages } = Collection.actions
export default Collection.reducer