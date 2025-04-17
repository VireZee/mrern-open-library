import schema from '@modules/schema.ts'
import middlewareSchema from '@modules/middleware/schema.ts'
import authSchema from '@modules/auth/schema.ts'
import bookSchema from '@modules/book/schema.ts'
import apiSchema from '@modules/api/schema.ts'
import middlewareResolver from '@modules/middleware/resolver.ts'
import authResolver from '@modules/auth/resolver.ts'
import bookResolver from '@modules/book/resolver.ts'
import apiResolver from '@modules/api/resolver.ts'

export const typeDefs = [schema, middlewareSchema, authSchema, bookSchema, apiSchema].join('\n')
export const resolvers = {
    Query: {
        ...middlewareResolver.Query,
        ...bookResolver.Query,
        ...apiResolver.Query
    },
    Mutation: {
        ...authResolver.Mutation,
        ...bookResolver.Mutation,
        ...apiResolver.Mutation
    }
}