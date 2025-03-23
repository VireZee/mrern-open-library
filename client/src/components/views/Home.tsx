import React, { useEffect } from 'react'
import { useQuery, useMutation, ApolloError } from '@apollo/client'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store/index'
import type { Books } from '../../store/slices/views/Home'
import { setOnline, setLoad, setBooks, setCurrentPage, setTotalPages, setStatus } from '../../store/slices/views/Home'
import { HOME as HomeGQL } from '../../graphql/queries/book/Home'
import { FETCH as FetchGQL } from '../../graphql/queries/book/Home'
import AddGQL from '../../graphql/mutations/book/Home'
import Load from '../common/Load'
import Net from '../common/Internet'
import NB from '../common/NoBooks'

interface Props {
    search: string
    isUser: Record<string, string> | null
}
interface BooksData {
    numFound: number
    docs: Books[]
}
const Home: React.FC<Props> = ({ isUser, search }) => {
    const { refetch: homeRefetch } = useQuery(HomeGQL, { skip: true })
    const { refetch: fetRefetch } = useQuery(FetchGQL, { skip: true })
    const [add] = useMutation(AddGQL)
    const dispatch = useDispatch()
    const homeState = useSelector((state: RootState) => state.HOME)
    const { page } = Object.fromEntries(new URLSearchParams(window.location.search))
    const pg = Number(page) || 1
    useEffect(() => {
        const handleOnline = () => dispatch(setOnline(navigator.onLine))
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOnline);
        (async () => {
            const fetchBooks = async () => {
                const { data } = await homeRefetch({ search: search || 'harry potter', page: homeState.currentPage })
                if (data.home) booksData(data.home)
                else dispatch(setBooks([]))
                dispatch(setLoad(false))
            }
            const booksData = (data: BooksData) => {
                const { numFound, docs } = data
                if (numFound === 0) dispatch(setBooks([]))
                else {
                    dispatch(setBooks(docs))
                    dispatch(setTotalPages(Math.ceil(numFound / 100)))
                }
            }
            if (homeState.online) {
                dispatch(setLoad(true))
                dispatch(setCurrentPage(1))
                fetchBooks()
            }
        })()
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOnline)
        }
    }, [homeState.online, search])
    useEffect(() => {
        if (isUser) {
            homeState.books.forEach((book: Books) => {
                if (book.author_key && book.cover_edition_key && book.cover_i) fetchStatus(book.author_key, book.cover_edition_key, book.cover_i)
            })
        }
    }, [isUser, homeState.books])
    const fetchStatus = async (author_key: string[], cover_edition_key: string, cover_i: number) => {
        try {
            const { data } = await fetRefetch({ author_key, cover_edition_key, cover_i })
            dispatch(setStatus(data.fetch))
        } catch (err) {
            if (err instanceof ApolloError) alert('Fetch Error: ' + err.message)
            else alert('Fetch Error: An unexpected error occurred.')
        }
    }
    const getValidKey = (author_key: string[], cover_edition_key: string, cover_i: number): string => `${[...author_key].sort().join(',')}|${cover_edition_key}|${cover_i}`
    const addToCollection = async (author_key: string[], cover_edition_key: string, cover_i: number, title: string, author_name: string[]) => {
        if (!isUser) location.href = '/login'
        else if (isUser) {
            try {
                const { data } = await add({
                    variables: {
                        author_key,
                        cover_edition_key,
                        cover_i,
                        title,
                        author_name
                    }
                })
                if (data.add) fetchStatus(author_key, cover_edition_key, cover_i)
            } catch (err) {
                if (err instanceof ApolloError) alert(err.message)
                else alert('An unexpected error occurred.')
            }
        }
    }
    const pageNumbers = () => {
        const pages = []
        const addPages = (s: number, e: number) => {
            for (let i = s; i <= e; i++) pages.push(i)
        }
        const { currentPage, totalPages } = homeState
        if (totalPages <= 9) addPages(1, totalPages)
        else if (search || pg <= 6) {
            addPages(1, 7)
            pages.push('...', totalPages)
        } else if (pg <= totalPages - 4) {
            pages.push(1, '...')
            addPages(pg - 3, pg + 1)
            pages.push('...', totalPages)
        } else if (pg <= totalPages - 3) {
            pages.push(1, '...')
            addPages(pg - 3, pg + 1)
            pages.push(totalPages - 1, totalPages)
        } else if (pg <= totalPages - 2) {
            pages.push(1, '...')
            addPages(pg - 4, pg + 1)
            pages.push(totalPages)
        } else if (pg <= totalPages - 1) {
            pages.push(1, '...')
            addPages(pg - 5, pg + 1)
        } else {
            pages.push(1, '...')
            addPages(pg - 6, pg)
        }
        const handleClick = (page: number) => {
            if (typeof page === 'number') dispatch(setCurrentPage(page))
        }
        return (
            <>
                {pages.map((page, idx) => (
                    <span
                        key={idx}
                        onClick={() => handleClick(page)}
                        className={`cursor-pointer my-10 px-3 py-1 rounded-full ${page === (search ? 1 : pg) ? 'bg-blue-500 text-white' : ''}`}
                    >
                        <a href={`s?${/^\d{10}(\d{3})?$/.test(search ?? '') ? 'isbn' : 'title'}=${search ? search.split(' ').join('+') : 'harry+potter'}&page=${currentPage}`}>
                            {page}
                        </a>
                    </span>
                ))}
            </>
        )
    }
    return (
        <>
            {homeState.load ? (
                <Load />
            ) : (
                <>
                    {homeState.online ? (
                        <>
                            {homeState.books.length === 0 ? (
                                <NB />
                            ) : (
                                <>
                                    <div className="mt-[12rem] sm:mt-[6rem] md:mt-[7rem] lg:mt-[8rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
                                        {homeState.books.map((book: Books, idx: number) => (
                                            <div key={idx} className="flex flex-col sm:flex-row max-w-sm sm:max-w-md lg:max-w-lg mx-auto p-6 border border-gray-400 shadow-[0px_4px_20px_rgba(0,0,0,0.6)] rounded-lg bg-white text-black">
                                                <img src={`http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                                                    alt={book.title}
                                                    className="w-full sm:w-[210px] h-[300px] object-cover border-2 border-gray-400" />
                                                <div className="ml-4">
                                                    <h1 className="text-center font-black text-xl mb-5">{book.title}</h1>
                                                    <h2 className="text-sm mb-2">Author(s): {book.author_name.join(', ')}</h2>
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={(book.author_key && book.cover_edition_key && book.cover_i) ? homeState.status[getValidKey(book.author_key, book.cover_edition_key, book.cover_i)] || false : false}
                                                            onChange={() => { if (book.author_key && book.cover_edition_key && book.cover_i) addToCollection(book.author_key, book.cover_edition_key, book.cover_i, book.title, book.author_name) }}
                                                            disabled={!(book.author_key && book.cover_edition_key && book.cover_i)}
                                                        />
                                                        <span>Add to Collection</span>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center">
                                        {pageNumbers()}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <Net />
                    )}
                </>
            )}
        </>
    )
}
export default Home