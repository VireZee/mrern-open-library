import Redis from '@database/Redis.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
import formatTimeLeft from '@utils/formatter/timeLeft.js'
import graphqlError from '@utils/misc/graphqlError.js'
export default async (keyName: string, user: { _id: ObjectId | string }, message: string) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const block = await Redis.HEXISTS(key, 'block')
    if (block) {
        const blockTTL = await Redis.HTTL(key, 'block')
        const timeLeft = formatTimeLeft(blockTTL![0]!)
        graphqlError(`${message} ${timeLeft}!`, 429)
    }
}