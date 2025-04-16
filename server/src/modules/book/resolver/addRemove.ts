import Redis from '@database/Redis.ts'
import collection from '@models/collection.ts'
import type Collection from '@type/models/collection.d.ts'
import type { User } from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import formatBooksChild from '@utils/formatter/books.ts'

const addRemove = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number, title: string, author_name: string[] }, context: { user: User }) => {
    try {
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const { user } = context
        const key = sanitizeRedisKey('collection', user._id)
        const cache = await Redis.json.GET(key) as Collection[] | []
        if (cache) return formatBooksChild(cache)
        const bookCollection = await collection.findOne({
            user_id: user._id,
            author_key,
            cover_edition_key,
            cover_i
        })
        if (bookCollection) await collection.deleteOne({ _id: bookCollection._id })
        else {
            await collection.create({
                user_id: user._id,
                author_key,
                cover_edition_key,
                cover_i,
                title,
                author_name,
                created: new Date()
            })
        }
        return true
    } catch (e) {
        throw e
    }
}
export default addRemove