import type { Request } from 'express'
import { User } from '../../../models/User.ts'
import { verifyToken } from '../../../utils/security/jwt.ts'
import crypto from 'crypto'

const Generate = async (_: null, __: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const user = await User.findById(id)
        let apiKey: string
        let isDuplicate: boolean
        do {
            const randomString = crypto.randomBytes(64).toString('hex')
            apiKey = crypto.createHash('sha3-512').update(randomString).digest('hex')
            isDuplicate = !!(await User.exists({ api_key: Buffer.from(apiKey, 'hex') }))
        } while (isDuplicate)
        user!.api_key = Buffer.from(apiKey, 'hex')
        await user!.save()
        return apiKey
    } catch (e) {
        throw e
    }
}
export default Generate