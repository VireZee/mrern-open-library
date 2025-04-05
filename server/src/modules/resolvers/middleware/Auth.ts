const Auth = async (_: null, __: null, context: { user: any }) => {
    const { user } = context
    const formatUserResponse = (userData: { photo: Buffer, name: string, username: string, email: string, verified: boolean }) => ({
        photo: Buffer.from(userData.photo).toString('base64'),
        name: userData.name,
        uname: userData.username,
        email: userData.email,
        verified: userData.verified
    })
    if (!context.user) throw new GraphQLError('Unauthorized', { extensions: { code: 401 } })
    return formatUserResponse(user)
}
export default Auth

Redis.