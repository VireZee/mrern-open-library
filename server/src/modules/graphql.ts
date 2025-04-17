import middlewareSchema from '@modules/middleware/schema.ts'
import authSchema from '@modules/auth/schema.ts'
import bookSchema from '@modules/book/schema.ts'
import apiSchema from '@modules/api/schema.ts'
import middlewareResolver from '@modules/middleware/resolver.ts'
import authResolver from '@modules/auth/resolver.ts'
import bookResolver from '@modules/book/resolver.ts'
import apiResolver from '@modules/api/resolver.ts'

export const typeDefs = [middlewareSchema, authSchema, bookSchema, apiSchema].join('\n')
export const resolvers = {}
//     Query: {
//         // auth: Auth,
//         home: Home,
//         fetch: Fetch,
//         collection: Collection,
//         // check: Check
//     },
//     Mutation: {
//         // register: Register,
//         // verify: Verify,
//         // resend: Resend,
//         // login: Login,
//         add: AddRemove,
//         remove: AddRemove,
//         // generate: Generate,
//         // settings: Settings,
//         // logout: Logout,
//         // delete: Delete
//     }
// }