export default `#graphql
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
        id: String!
        added: Boolean!
    }
    type Collection {
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