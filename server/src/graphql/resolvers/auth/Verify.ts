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
        const user = await User.findById(id)
        if (user!.verificationCode !== code) throw new GraphQLError('Invalid verification code!', { extensions: { code: '400' } })
        else if (user!.codeExpiresAt! < new Date()) throw new GraphQLError('Verification code expired!', { extensions: { code: '400' } })
        const newCachedUser = await User.findByIdAndUpdate(id, {
            verified: true,
            verificationCode: null,
            codeExpiresAt: null
        }, { new: true })
        await Redis.call('JSON.SET', `user:${id}`, '$.verified', `${newCachedUser!.verified}`)
        return true
    } catch (e) {
        throw e
    }
}
export default Verify