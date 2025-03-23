import Redis from '../../../database/Redis.ts'
import got from 'got'

interface Books {
    author_key: string[]
    cover_edition_key: string
    cover_i: number
    title: string
    author_name: string[]
}
const Home = async (_: null, args: { search: string, page: number }) => {
    try {
        const { search, page } = args
        const redisKey = `book:${search}|${page}`
        const bookCache = await Redis.call('JSON.GET', redisKey) as string
        if (bookCache) return JSON.parse(bookCache)
        const type = /^\d{10}(\d{3})?$/.test(search) ? 'isbn' : 'title'
        const query = search.split(' ').join('+')
        const res = await got(`https://openlibrary.org/search.json?${type}=${query}&page=${page}`).json<{ numFound: number, docs: Books[] }>()
        const books = {
            numFound: res.numFound,
            docs: res.docs.map((book: Books) => ({
                author_key: book.author_key ?? [],
                cover_edition_key: book.cover_edition_key ?? '',
                cover_i: book.cover_i ?? 0,
                title: book.title ?? 'Unknown Title',
                author_name: book.author_name ?? ['Unknown Author']
            }))
        }
        await Redis.call('JSON.SET', redisKey, '$', JSON.stringify(books))
        await Redis.expire(redisKey, 86400)
        return books
    } catch (e) {
        throw e
    }
}
export default Home