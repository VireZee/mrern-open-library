import Redis from '@database/Redis.ts'
import collection from '@models/collection.ts'
import type { User } from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import formatBooksChild from '@utils/formatter/books.ts'

const addRemove = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number, title: string, author_name: string[] }, context: { user: User }) => {
    try {
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const { user } = context
        const key = sanitizeRedisKey('collection', user._id)
        await Redis.json.SET(key, '$', [], { NX: true })
        const bookCollection = await collection.findOne({
            user_id: user._id,
            author_key,
            cover_edition_key,
            cover_i
        })
        if (bookCollection) {
            await collection.findByIdAndDelete(bookCollection._id)
            const updatedBooks = await collection.find({ user_id: user._id })
            await Redis.json.SET(key, '$', formatBooksChild(updatedBooks))
            await Redis.EXPIRE(key, 86400)
        }
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
            const updatedBooks = await collection.find({ user_id: user._id })
            await Redis.json.SET(key, '$', formatBooksChild(updatedBooks))
            await Redis.EXPIRE(key, 86400)
        }
        return true
    } catch (e) {
        throw e
    }
}
export default addRemove