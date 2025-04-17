export default `#graphql
    type Auth {
        photo: String!
        name: String!
        uname: String!
        email: String!
        verified: Boolean!
    }
    extend type Query {
        auth: Auth!
    }
`