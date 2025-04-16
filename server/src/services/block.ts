import Redis from '@database/Redis.ts'
import formatTimeLeft from '@utils/formatter/timeLeft.ts'

export default async (key: string, message: string) => {
    const block = await Redis.HEXISTS(key, 'block')
    if (block) {
        const blockTTL = await Redis.HTTL(key, 'block')
        const timeLeft = formatTimeLeft(blockTTL![0]!)
        throw new GraphQLError(`${message} ${timeLeft}!`, { extensions: { code: 429 } })
    }
}