import Redis from '@database/Redis.ts'
import collectionModel from '@models/collection.ts'
import type { User } from '@type/models/user.d.ts'
import type { Query } from '@type/modules/collection.d.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

const Collection = async (_: null, args: { search: string, page: number }, context: { user: User }) => {
    try {
        const { search, page } = args
        const { user } = context
        const collectionKey = sanitizeRedisKey('collection', `${user._id}|${search}|${page}`)
        const collectionApiKey = sanitizeRedisKey('collection', user._id)
        await Redis.json.SET(collectionApiKey, '$', [], { NX: true })
        const cache = await Redis.json.GET(collectionKey)
        if (cache) return cache
        const limit = 9
        const query: Query = { user_id: user._id }
        if (search) query.title = { $regex: search, $options: 'i' }
        const [bookCollection, totalCollection] = await Promise.all([
            collectionModel.find(query).sort({ created: -1 }).skip((page - 1) * limit).limit(limit),
            collectionModel.countDocuments(query)
        ])
        const collection = {
            found: bookCollection.length,
            collection: bookCollection.map(book => ({
                author_key: book.author_key,
                cover_edition_key: book.cover_edition_key,
                cover_i: book.cover_i,
                title: book.title,
                author_name: book.author_name
            })),
            totalCollection
        }
        await Redis.json.SET(collectionKey, '$', collection)
        await Redis.EXPIRE(collectionKey, 86400)
        return collection
    } catch (e) {
        throw e
    }
}
export default Collection