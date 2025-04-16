import Redis from '@database/Redis.ts'
import got from 'got'
import type Books from '@type/modules/collection.d.ts'

const Home = async (_: null, args: { search: string, page: number }) => {
    try {
        const { search, page } = args
        const key = `book:${search}|${page}`
        const cache = await Redis.json.GET(key)
        if (cache) return cache
        const type = /^\d{10}(\d{3})?$/.test(search) ? 'isbn' : 'title'
        const formattedQuery = search.replace(/\s+/g, '+')
        const response = await got(`https://openlibrary.org/search.json?${type}=${formattedQuery}&page=${page}`).json<{ numFound: number, docs: Books[] }>()
        const books = {
            numFound: response.numFound,
            docs: response.docs.map((book: Books) => ({
                author_key: book.author_key ?? [],
                cover_edition_key: book.cover_edition_key ?? '',
                cover_i: book.cover_i ?? 0,
                title: book.title ?? 'Unknown Title',
                author_name: book.author_name ?? ['Unknown Author']
            }))
        }
        await Redis.json.SET(key, '$', books)
        await Redis.EXPIRE(key, 86400)
        return books
    } catch (e) {
        throw e
    }
}
export default Home