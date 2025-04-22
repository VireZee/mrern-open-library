import userModel from '@models/user.ts'
import validateEmail from '@utils/validators/email.ts'

const forget = async (_: null, args: { email: string }) => {
    try {
        const { email } = args
        const emailErr = await validateEmail(email)
        if (emailErr) throw new GraphQLError(emailErr, { extensions: { code: 422 } })
        const user = await userModel.findOne({ email })
        if (user) await 'hehehe?'
        return 'A verification code has been sent to your email address, provided it is registered in our system.'
    } catch (e) {
        throw e
    }
}
export default forget