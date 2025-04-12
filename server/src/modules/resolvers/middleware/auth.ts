import type User from '@type/models/user.d.ts'

export default async (_: null, __: null, context: { user: User }) => {
    const { user } = context
    if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: 401 } })
    return user
}