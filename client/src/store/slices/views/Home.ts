import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Books {
    author_key: string[]
    cover_edition_key: string
    cover_i: number
    title: string
    author_name: string[] | string
}
interface State {
    [key: string]: boolean | Books[] | number | Record<string, boolean>
    books: Books[]
    status: Record<string, boolean>
}
const initialState: State = {
    online: navigator.onLine,
    load: false,
    books: [],
    currentPage: 1,
    totalPages: 1,
    status: {}
}
const Home = createSlice({
    name: 'HOME',
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
        },
        setStatus: (state, { payload: { key, added } }: PayloadAction<{ key: string, added: boolean }>) => {
            state.status[key] = added
        }
    }
})
export const { setOnline, setLoad, setBooks, setCurrentPage, setTotalPages, setStatus } = Home.actions
export default Home.reducer