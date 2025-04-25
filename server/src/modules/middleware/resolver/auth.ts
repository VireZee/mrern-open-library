import graphqlError from '@utils/misc/graphqlError.ts'
import type { User } from '@type/models/user.d.ts'
export default async (_: null, __: null, context: { user: User }) => {
    const { user } = context
    if (!user) graphqlError('Unauthorized', 401)
    return user
}