export default `#graphql
    extend type Book {
        author_key: [String!]!
        cover_edition_key: String!
        cover_i: Int!
        title: String!
        author_name: [String!]!
    }
    extend type Home {
        numFound: Int!
        docs: [Book!]!
    }
    extend type Fetch {
        key: String!
        added: Boolean!
    }
    extend type Collection {
        found: Int!
        collection: [Book!]!
        totalCollection: Int!
    }
    extend type Query {
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
    }
    extend type Mutation {
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
    }
`