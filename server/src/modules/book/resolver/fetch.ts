import Redis from '@database/Redis.ts'
import createCollection from '@services/redis/createCollection.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatBooksFind } from '@utils/formatter/books.ts'
import type Collection from '@type/models/collection.d.ts'
import type { User } from '@type/models/user.d.ts'

const fetch = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number }, context: { user: User }) => {
    try {
        const { author_key, cover_edition_key, cover_i } = args
        const { user } = context
        const key = sanitizeRedisKey('collection', user._id)
        const rawCache = await Redis.json.GET(key) as string
        const cache: Collection[] = JSON.parse(rawCache)
        let bookCollection: Collection | undefined
        if (Array.isArray(cache)) bookCollection = formatBooksFind(cache, author_key, cover_edition_key, cover_i)
        else {
            const books = await createCollection('collection', user) as Collection[]
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