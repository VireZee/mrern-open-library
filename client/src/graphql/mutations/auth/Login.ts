import { gql } from '@apollo/client'

const LOGIN = gql`
    mutation Login($emailOrUsername: String!, $pass: String!) {
        login(emailOrUsername: $emailOrUsername, pass: $pass)
    }
`
export default LOGIN