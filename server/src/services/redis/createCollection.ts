import Redis from '@database/Redis.ts'
import collectionModel from '@models/collection.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatBooksMap } from '@utils/formatter/books.ts'
export default async (keyName: string, user: { _id: ObjectId | string }) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const cache = await Redis.json.GET(key) as string
    if (cache) return JSON.parse(cache)
    const collection = await collectionModel.find({ user_id: new TypesObjectId(user._id) }).lean()
    const books = formatBooksMap(collection)
    await Redis.json.SET(key, '$', books)
    await Redis.EXPIRE(key, 86400)
    return books
}