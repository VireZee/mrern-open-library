import Redis from '@database/Redis.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
import formatTimeLeft from '@utils/formatter/timeLeft.js'
import graphqlError from '@utils/misc/graphqlError.js'
export default async (keyName: string, user: { _id: ObjectId | string }, minutes: number, otherKeyName = keyName) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const otherKey = sanitizeRedisKey(otherKeyName, user._id)
    const increment = await Redis.HINCRBY(key, 'attempts', 1)
    if (increment % 3 === 0) {
        await Redis.HDEL(otherKey, 'code')
        await Redis.HSET(key, 'block', '')
        const blockDuration = 60 * minutes * (2 ** ((increment / 3) - 1))
        Redis.HEXPIRE(key, 'block', blockDuration)
        const timeLeft = formatTimeLeft(blockDuration)
        graphqlError(`Too many attempts! Try again in ${timeLeft}!`, 429)
    }
}