import userModel from '@models/user.ts'
import generateCode from '@services/verification/generateCode.ts'

const forget = async (_: null, args: { email: string }) => {
    try {
        const { email } = args
        const user = await userModel.findOne({ email }).lean()
        if (user) await generateCode('forget', user, true)
        return 'A verification code has been sent to your email address, provided it is registered in our system.'
    } catch (e) {
        throw e
    }
}
export default forget