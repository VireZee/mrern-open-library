import { gql } from '@apollo/client'

const REGISTER = gql`
    mutation Register($name: String!, $username: String!, $email: String!, $pass: String!, $rePass: String, $show: Boolean!) {
        register(name: $name, username: $username, email: $email, pass: $pass, rePass: $rePass, show: $show)
    }
`
export default REGISTER