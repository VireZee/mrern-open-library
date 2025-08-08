import userModel from '@models/user.ts'
import block from '@services/account/block.ts'
import rateLimiter from '@services/verification/rateLimiter.ts'
import generateCode from '@services/verification/generateCode.ts'

const forget = async (_: null, args: { email: string }) => {
    try {
        const { email } = args
        const user = await userModel.findOne({ email }).lean()
        if (user) {
            await block('forget', user, 'Too many reset requests! Try again in')
            await rateLimiter('forget', user, 60, 'verify')
            await generateCode('verify', user, true)
        }
        return 'A verification code has been sent to your email address, provided it is registered in our system.'
    } catch (e) {
        throw e
    }
}
export default forget