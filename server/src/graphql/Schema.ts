const Schema = `#graphql
    type Auth {
        photo: String!
        name: String!
        uname: String!
        email: String!
    }
    type Book {
        author_key: [String!]!
        cover_edition_key: String!
        cover_i: Int!
        title: String!
        author_name: [String!]!
    }
    type Home {
        numFound: Int!
        docs: [Book!]!
    }
    type Fetch {
        key: String!
        added: Boolean!
    }
    type Collection {
        found: Int!
        collection: [Book!]!
        totalCollection: Int!
    }
    type Query {
        auth: Auth!
        home(
            search: String
            page: Int!
        ): Home!
        fetch(
            author_key: [String!]!
            cover_edition_key: String!
            cover_i: Int!
        ): Fetch!
        collection(
            search: String
            page: Int!
        ): Collection!
        check: String
    }
    type Mutation {
        register(
            name: String!
            uname: String!
            email: String!
            pass: String!
            rePass: String
            show: Boolean!
        ): Boolean!
        login(
            emailOrUname: String!
            pass: String!
        ): Boolean!
        add(
            author_key: [String!]!
            cover_edition_key: String!
            cover_i: Int!
            title: String!
            author_name: [String!]!
        ): Boolean!
        remove(
            author_key: [String!]!
            cover_edition_key: String!
            cover_i: Int!
        ): Boolean!
        generate: String!
        settings(
            photo: String!
            name: String!
            uname: String!
            email: String!
            oldPass: String
            newPass: String
            rePass: String
            show: Boolean!
        ): Boolean!
        logout: Boolean!
        delete: Boolean!
    }
`
export default Schema