import Redis from '@database/Redis.ts'
import collectionModel from '@models/collection.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatBooksFind } from '@utils/formatter/books.ts'
import type Collection from '@type/models/collection.d.ts'
import type { User } from '@type/models/user.d.ts'

const fetch = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number }, context: { user: User }) => {
    try {
        const { author_key, cover_edition_key, cover_i } = args
        const { user } = context
        const key = sanitizeRedisKey('collection', user._id)
        const cache = await Redis.json.GET(key) as Collection[] | []
        let bookCollection: Collection | undefined
        if (Array.isArray(cache) && cache.length) bookCollection = formatBooksFind(cache, author_key, cover_edition_key, cover_i)
        else {
            const collection = await collectionModel.find({ user_id: user._id }).lean()
            const books = collection.map(({ author_key, cover_edition_key, cover_i, title, author_name }) => ({
                author_key,
                cover_edition_key,
                cover_i,
                title,
                author_name
            }))
            await Redis.json.SET(key, '$', books)
            await Redis.EXPIRE(key, 86400)
            bookCollection = books.find(book =>
                book.author_key.length === author_key.length &&
                book.author_key.every((val, i) => val === author_key[i]) &&
                book.cover_edition_key === cover_edition_key &&
                book.cover_i === cover_i
            )
            bookCollection = formatBooksFind(books, author_key, cover_edition_key, cover_i)
        }
        return {
            id: `${author_key.sort().join(',')}|${cover_edition_key}|${cover_i}`,
            added: !!bookCollection
        }
    } catch (e) {
        throw e
    }
}
export default fetch