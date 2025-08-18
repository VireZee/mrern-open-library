import Redis from '@database/Redis.js'
import collectionModel from '@models/collection.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
import { formatBooksMap } from '@utils/formatter/books.js'
export default async (keyName: string, user: { _id: ObjectId | string }) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const cache = await Redis.json.GET(key)
    if (cache) return cache
    const collection = await collectionModel.find({ user_id: new TypesObjectId(user._id) }).lean()
    const books = formatBooksMap(collection)
    await Redis.json.SET(key, '$', books)
    await Redis.EXPIRE(key, 86400)
    return books
}