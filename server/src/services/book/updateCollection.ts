import Redis from '@database/Redis.ts'
import collection from '@models/collection.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatBooksMap } from '@utils/formatter/books.ts'

export default async (keyName: string, user: { _id: string }) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const keysToDelete = sanitizeRedisKey(keyName, `${user._id}|*`)
    const updatedBooks = await collection.find({ user_id: new TypesObjectId(user._id) })
    await Redis.json.SET(key, '$', formatBooksMap(updatedBooks))
    await Redis.EXPIRE(key, 86400)
    const keys = await Redis.KEYS(keysToDelete)
    await Redis.DEL(keys)
}