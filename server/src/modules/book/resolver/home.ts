import Redis from '@database/Redis.ts'
import got from 'got'
import { formatBooksMap } from '@utils/formatter/books.ts'
import type Collection from '@type/models/collection.d.ts'

const home = async (_: null, args: { search: string, page: number }) => {
    try {
        const { search, page } = args
        const key = `book:${search}|${page}`
        const cache = await Redis.json.GET(key) as string
        if (cache) return {
            numFound: (JSON.parse(cache) as { numFound: number }).numFound,
            docs: formatBooksMap((JSON.parse(cache) as { docs: Collection[] }).docs)
        }
        const type = /^\d{10}(\d{3})?$/.test(search) ? 'isbn' : 'title'
        const formattedQuery = search.replace(/\s+/g, '+')
        const response = await got(`https://openlibrary.org/search.json?${type}=${formattedQuery}&page=${page}`).json<{ numFound: number, docs: Collection[] }>()
        const books = {
            numFound: response.numFound,
            docs: response.docs.map(book => ({
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
export default home