import Redis from '@database/Redis.ts'
import collection from '@models/collection.ts'
import type Collection from '@type/models/collection.d.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import formatBooksChild from '@utils/formatter/books.ts'

const booksChild = async (parent: { id: ObjectId }) => {
    try {
        const { id } = parent
        const key = sanitizeRedisKey('collection', id.toString())
        const cache = await Redis.json.GET(key) as Collection[] | []
        if (cache) return formatBooksChild(cache)
        const books = await collection.find({ user_id: id })
        return formatBooksChild(books)
    } catch (e) {
        throw e
    }
}
export default booksChild