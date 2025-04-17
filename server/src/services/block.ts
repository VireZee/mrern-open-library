import Redis from '@database/Redis.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import formatTimeLeft from '@utils/formatter/timeLeft.ts'

export default async (keyName: string, user: { _id: string }, message: string) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const block = await Redis.HEXISTS(key, 'block')
    if (block) {
        const blockTTL = await Redis.HTTL(key, 'block')
        const timeLeft = formatTimeLeft(blockTTL![0]!)
        throw new GraphQLError(`${message} ${timeLeft}!`, { extensions: { code: 429 } })
    }
}