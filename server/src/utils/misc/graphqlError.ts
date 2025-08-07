import { GraphQLError } from 'graphql'
export default (message: string, code: number, errors?: Record<string, string>) => {
    throw new GraphQLError(message, { extensions: { errors, code } })
}