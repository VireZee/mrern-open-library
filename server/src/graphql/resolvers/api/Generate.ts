import crypto from 'crypto'
import type { Request } from 'express'
import { User } from '../../../models/User.ts'
import { verifyToken } from '../../../utils/Validation.ts'

const Generate = async (_: null, __: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const user = await User.findById({ id })
        const randomString = crypto.randomBytes(64).toString('hex')
        const apiKey = crypto.createHash('sha3-512').update(randomString).digest('hex')
        user!.api_key = Buffer.from(apiKey, 'hex')
        await user!.save()
        return apiKey
    } catch (e) {
        throw e
    }
}
export default Generate