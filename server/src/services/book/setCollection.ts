import Redis from '@database/Redis.ts'
import collectionModel from '@models/collection.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type Collection from '@type/models/collection.d.ts'

export default async (keyName: string, user: { _id: string }, isReturn: boolean ): Promise<void | Collection[]> => {
    const key = sanitizeRedisKey(keyName, user._id)
    const collection = await collectionModel.find({ user_id: new TypesObjectId(user._id) }).lean()
    const books = collection.map(({ author_key, cover_edition_key, cover_i, title, author_name }) => ({
        author_key,
        cover_edition_key,
        cover_i,
        title,
        author_name
    }))
    await Redis.json.SET(key, '$', books)
    await Redis.EXPIRE(key, 86400, 'NX')
    if (isReturn) return books
}