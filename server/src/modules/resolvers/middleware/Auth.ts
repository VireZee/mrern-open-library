const Auth = async (_: null, __: null, context: { user: any }) => {
    const { user } = context
    if (!context.user) throw new GraphQLError('Unauthorized', { extensions: { code: 401 } })
    return formatUserResponse(user)
}
export default Auth