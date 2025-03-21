import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import axios from 'axios'
import { verifyToken } from '../../../utils/Validation.ts'

const Fetch = async (_: null, args: { search: string, page: number }, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { search, page } = args
        const redisKey = `books:${search}|${page}`
        const bookCache = await Redis.get(redisKey)
        if (bookCache) return JSON.parse(bookCache)
        const type = /^\d{10}(\d{3})?$/.test(search) ? 'isbn' : 'title'
        const query = search ? search.split(' ').join('+') : 'harry+potter'
        const res = await axios.get(`https://openlibrary.org/search.json?${type}=${query}&page=${page}`)
        const books = res.data.docs.map(book => ({
            author_key: book.author_key,
            cover_edition_key: book.cover_edition_key,
            cover_i: book.cover_i,
            title: book.title,
            author_name: book.author_name
        }))
        await Redis.setex(redisKey, 86400, JSON.stringify(books))
    } catch (e) {
        throw e
    }
}
export default Fetch