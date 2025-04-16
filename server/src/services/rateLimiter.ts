import Redis from '@database/Redis.ts'
import formatTimeLeft from '@utils/formatter/timeLeft.ts'

export default async (key: string, minutes: number, verifyKey = key) => {
    const increment = await Redis.HINCRBY(key, 'attempts', 1)
    if (increment % 3 === 0) {
        await Redis.HDEL(verifyKey, 'code')
        await Redis.HSET(key, 'block', '')
        const blockDuration = 60 * minutes * (2 ** ((increment / 3) - 1))
        Redis.HEXPIRE(key, 'block', blockDuration)
        const timeLeft = formatTimeLeft(blockDuration)
        throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
    }
}