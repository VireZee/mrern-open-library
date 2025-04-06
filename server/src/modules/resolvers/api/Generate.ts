import { User } from '@models/User.ts'

const Generate = async (_: null, __: null, context: { user: any }) => {
    try {
        const user = await User.findById(context.user.id)
        let apiKey: string
        let isDuplicate: boolean
        do {
            const randomString = nodeCrypto.randomBytes(64).toString('hex')
            apiKey = nodeCrypto.createHash('sha3-512').update(randomString).digest('hex')
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