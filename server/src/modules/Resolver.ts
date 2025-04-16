import Schema from './Schema.ts'
import Home from './resolvers/book/Home.ts'
import Fetch from './resolvers/book/Fetch.ts'
import Collection from './resolvers/book/Collection.ts'
import AddRemove from './resolvers/book/AddRemove.ts'

export const typeDefs = Schema
export const resolvers = {
    Query: {
        // auth: Auth,
        home: Home,
        fetch: Fetch,
        collection: Collection,
        // check: Check
    },
    Mutation: {
        // register: Register,
        // verify: Verify,
        // resend: Resend,
        // login: Login,
        add: AddRemove,
        remove: AddRemove,
        // generate: Generate,
        // settings: Settings,
        // logout: Logout,
        // delete: Delete
    }
}