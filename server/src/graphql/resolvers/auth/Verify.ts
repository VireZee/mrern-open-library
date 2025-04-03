import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Verify = async (_: null, args: { code: string }, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { code } = args
        const verifyKey = `verify:${id}`
        const getVerify = await Redis.hgetall(verifyKey)
        const formatTimeLeft = (seconds: number) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
        }
        if (!getVerify['code']) throw new GraphQLError('Verification code expired!', { extensions: { code: 400 } })
        const block = await Redis.hexists(verifyKey, 'block')
        if (block) {
            const blockTTL = await Redis.call('HTTL', verifyKey, 'FIELDS', 1, 'block') as number
            const timeLeft = formatTimeLeft(blockTTL)
            throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        } if (code !== getVerify['code']) {
            const increment = await Redis.hincrby(verifyKey, 'attempts', 1)
            if (increment % 3 === 0) {
                await Redis.hset(verifyKey, 'block', '')
                const blockDuration = 60 * 30 * (2 ** ((increment / 3) - 1))
                await Redis.call('HEXPIRE', verifyKey, blockDuration, 'FIELDS', 1, 'block')
                const timeLeft = formatTimeLeft(blockDuration)
                throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            throw new GraphQLError('Invalid verification code!', { extensions: { code: '400' } })
        }
        const verifiedUser = await User.findByIdAndUpdate(id, { verified: true }, { new: true })
        await Redis.call('JSON.SET', `user:${id}`, '$.verified', `${verifiedUser!.verified}`)
        await Redis.del(verifyKey, `resend:${id}`)
        return true
    } catch (e) {
        throw e
    }
}
export default Verify