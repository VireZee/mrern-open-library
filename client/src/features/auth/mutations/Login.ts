import { gql } from '@apollo/client'

export default gql`
    mutation Login($emailOrUsername: String!, $pass: String!) {
        login(emailOrUsername: $emailOrUsername, pass: $pass)
    }
`