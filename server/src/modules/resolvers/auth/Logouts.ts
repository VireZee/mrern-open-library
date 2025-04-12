import Redis from '@database/Redis.ts'

const Logout = async (_: null, __: null, context: { res: Res, user: any }) => {
    try {
        await Redis.del(`user:${context.user.id}`)
        context.res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default Logout