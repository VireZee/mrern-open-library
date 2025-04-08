import { Id } from '@type/index..d.ts'

const Auth = async (_: null, __: null, context: { user: Id }) => {
    const { user } = context
    if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: 401 } })
    return formatUserResponse(user)
}
export default Auth
// const user = await userModel.findById(payload.id)
        // if (!user) return done(null, false)
        // await Redis.json.SET(key, '$', {
        //     photo: Buffer.from(user.photo).toString(),
        //     name: user.name,
        //     username: user.username,
        //     email: user.email,
        //     verified: user.verified
        // })
        // await Redis.expire(key, 86400)
        // return done(null, {
        //     ...user.toObject(),
        //     photo: Buffer.from(user.photo).toString()
        // })