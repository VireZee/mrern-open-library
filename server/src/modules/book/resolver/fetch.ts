import Redis from '@database/Redis.ts'
import collection from '@models/collection.ts'
import type Collection from '@type/models/collection.d.ts'
import type { User } from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

const fetch = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number }, context: { user: User }) => {
    try {
        const { author_key, cover_edition_key, cover_i } = args
        const { user } = context
        const key = sanitizeRedisKey('collection', user._id)
        const sorted = `${author_key.sort().join(',')}|${cover_edition_key}|${cover_i}`
        const cache = await Redis.json.GET(key) as Collection[] | []
        let bookCollection
        if (cache) {
            bookCollection = cache.find(book =>
                book.cover_edition_key === cover_edition_key &&
                book.cover_i === cover_i &&
                book.author_key.some(key => author_key.includes(key))
            )
        }
        bookCollection = await collection.findOne({
            user_id: user._id,
            author_key: { $in: author_key },
            cover_edition_key,
            cover_i
        })
        return {
            key: sorted,
            added: !!bookCollection
        }
    } catch (e) {
        throw e
    }
}
export default fetch