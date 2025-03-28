import type { Request } from 'express'
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
        user!.isVerified = true
        user!.verificationCode = null
        user!.codeExpiresAt = null
        await user!.save()
        return true
    } catch (e) {
        throw e
    }
}
export default Verify