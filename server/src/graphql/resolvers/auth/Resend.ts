import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Resend = async (_: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const blockTTL = await Redis.ttl(`block:${id}`)
        if (blockTTL > 0) {
            const hours = Math.floor(blockTTL / 3600)
            const minutes = Math.floor(blockTTL / 60)
            const seconds = blockTTL % 60
            const timeLeft = hours > 0
                ? `${hours}h ${minutes}m ${seconds}s`
                : minutes > 0
                    ? `${minutes}m ${seconds}s`
                    : `${seconds}s`
            throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        }
        const resendTTL = await Redis.ttl(`resend:${id}`)
        if (resendTTL > 0) {
            const minutes = Math.floor(resendTTL / 60)
            const seconds = resendTTL % 60
            const timeLeft = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
            throw new GraphQLError(`Please wait ${timeLeft} before requesting a new code!`, { extensions: { code: 429 } })
        }
        const attempts = await Redis.hincrby(`verify:${id}`, 'attempts', 1)
        if (attempts >= 3) {
            await Redis.set(`block:${id}`, "1", "EX", 30 * 60)
            await Redis.hset(`verify:${id}`, "attempts", "0")
            throw new GraphQLError(
                `Too many attempts! Try again in 30 minutes.`,
                { extensions: { code: 429 } }
            );
        }
        return true
    } catch (e) {
        throw e
    }
}
export default Resend