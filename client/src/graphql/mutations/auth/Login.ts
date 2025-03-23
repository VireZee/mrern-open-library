import { gql } from '@apollo/client'

const LOGIN = gql`
    mutation Login($emailOrUname: String!, $pass: String!) {
        login(emailOrUname: $emailOrUname, pass: $pass)
    }
`
export default LOGIN