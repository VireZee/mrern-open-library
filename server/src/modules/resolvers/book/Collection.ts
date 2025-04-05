import type { Request } from 'express'
import { Types } from 'mongoose'
import Redis from '../../../database/Redis.ts'
import CollectionModel from '../../../models/Collection.ts'
import { verifyToken } from '../../../utils/security/jwt.ts'

interface Query {
    user_id: Types.ObjectId
    title?: {
        $regex: string
        $options: 'i'
    }
}
const Collection = async (_: null, args: { search: string, page: number }, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { search, page } = args
        const redisKey = `collection:${id}|${search}|${page}`
        const cachedCollection = await Redis.call('JSON.GET', redisKey) as string
        if (cachedCollection) return JSON.parse(cachedCollection)
        const limit = 9
        const query: Query = { user_id: id }
        if (search) query.title = { $regex: search, $options: 'i' }
        const [bookCollection, totalCollection] = await Promise.all([
            CollectionModel.find(query).sort({ created: -1 }).skip((page - 1) * limit).limit(limit),
            CollectionModel.countDocuments(query)
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
        await Redis.call('JSON.SET', redisKey, '$', JSON.stringify(collection))
        await Redis.expire(redisKey, 86400)
        return collection
    } catch (e) {
        throw e
    }
}
export default Collection