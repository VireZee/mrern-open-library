export default `#graphql
    type Auth {
        google: Boolean!
        photo: String!
        name: String!
        username: String!
        email: String!
        verified: Boolean!
    }
    extend type Query {
        auth: Auth!
    }
`