import Redis from '@database/Redis.ts'
import collection from '@models/collection.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatBooksMap } from '@utils/formatter/books.ts'
import type Collection from '@type/models/collection.d.ts'

const booksChild = async (parent: { id: ObjectId }) => {
    try {
        const { id } = parent
        const key = sanitizeRedisKey('collection', id.toString())
        const cache = await Redis.json.GET(key) as Collection[] | []
        if (cache) return formatBooksMap(cache)
        const books = await collection.find({ user_id: id })
        return formatBooksMap(books)
    } catch (e) {
        throw e
    }
}
export default booksChild