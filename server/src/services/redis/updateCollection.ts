import Redis from '@database/Redis.ts'
import collection from '@models/collection.ts'
import scanAndDelete from '@services/redis/scanAndDelete.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { formatBooksMap } from '@utils/formatter/books.ts'
export default async (keyName: string, user: { _id: string }) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const keysToDelete = `${key}|*`
    const updatedBooks = await collection.find({ user_id: new TypesObjectId(user._id) }).lean()
    await Redis.json.SET(key, '$', formatBooksMap(updatedBooks))
    await Redis.EXPIRE(key, 86400, 'NX')
    await scanAndDelete(keysToDelete)
}