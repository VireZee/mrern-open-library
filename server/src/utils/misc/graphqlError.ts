import { GraphQLError } from 'graphql'
export default (message: string, code: number, other?: Record<string, string>) => {
    throw new GraphQLError(message, { extensions: { other, code } })
}