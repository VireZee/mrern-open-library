import schema from '@modules/schema.js'
import middlewareSchema from '@modules/middleware/schema.js'
import authSchema from '@modules/auth/schema.js'
import bookSchema from '@modules/book/schema.js'
import apiSchema from '@modules/api/schema.js'
import middlewareResolver from '@modules/middleware/resolver.js'
import authResolver from '@modules/auth/resolver.js'
import bookResolver from '@modules/book/resolver.js'
import apiResolver from '@modules/api/resolver.js'
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