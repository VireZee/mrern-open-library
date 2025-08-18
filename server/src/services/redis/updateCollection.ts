import Redis from '@database/Redis.js'
import collection from '@models/collection.js'
import scanAndDelete from '@services/redis/scanAndDelete.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
import { formatBooksMap } from '@utils/formatter/books.js'
export default async (keyName: string, user: { _id: string }) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const keysToDelete = `${key}|*`
    const updatedBooks = await collection.find({ user_id: new TypesObjectId(user._id) }).lean()
    await Redis.json.SET(key, '$', formatBooksMap(updatedBooks))
    await Redis.EXPIRE(key, 86400, 'NX')
    await scanAndDelete(keysToDelete)
}