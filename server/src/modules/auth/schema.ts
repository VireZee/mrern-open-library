export default `#graphql
    extend type Mutation {
        register(
            name: String!
            username: String!
            email: String!
            pass: String!
            rePass: String
            show: Boolean!
        ): Boolean!
        verify(code: String!): Boolean!
        resend: Boolean!
        login(
            emailOrUsername: String!
            pass: String!
        ): Boolean!
        settings(
            photo: String!
            name: String!
            username: String!
            email: String!
            oldPass: String
            newPass: String
            rePass: String
            show: Boolean!
        ): Boolean!
        logout: Boolean!
        terminate: Boolean!
    }
`