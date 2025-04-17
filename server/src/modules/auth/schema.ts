export default `#graphql
    extend type Mutation {
        register(
            name: String!
            uname: String!
            email: String!
            pass: String!
            rePass: String
            show: Boolean!
        ): Boolean!
        verify(code: String!): Boolean!
        resend: Boolean!
        login(
            emailOrUname: String!
            pass: String!
        ): Boolean!
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
        terminate: Boolean!
    }
`