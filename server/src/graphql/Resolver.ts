import Schema from './Schema.ts'
import Auth from './resolvers/middleware/Auth.ts'
import Home from './resolvers/book/Home.ts'
import Register from './resolvers/auth/Register.ts'
import Verify from './resolvers/auth/Verify.ts'
import Login from './resolvers/auth/Login.ts'
import Fetch from './resolvers/book/Fetch.ts'
import Collection from './resolvers/book/Collection.ts'
import AddRemove from './resolvers/book/AddRemove.ts'
import Check from './resolvers/api/Check.ts'
import Generate from './resolvers/api/Generate.ts'
import Settings from './resolvers/auth/Settings.ts'
import Logout from './resolvers/auth/Logout.ts'
import Delete from './resolvers/auth/Delete.ts'

export const typeDefs = Schema
export const resolvers = {
    Query: {
        auth: Auth,
        home: Home,
        fetch: Fetch,
        collection: Collection,
        check: Check
    },
    Mutation: {
        register: Register,
        verify: Verify,
        login: Login,
        add: AddRemove,
        remove: AddRemove,
        generate: Generate,
        settings: Settings,
        logout: Logout,
        delete: Delete
    }
}