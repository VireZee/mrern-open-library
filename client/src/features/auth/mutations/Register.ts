import { gql } from '@apollo/client'
export default gql`
    mutation Register($name: String!, $username: String!, $email: String!, $pass: String!, $rePass: String, $show: Boolean!) {
        register(name: $name, username: $username, email: $email, pass: $pass, rePass: $rePass, show: $show)
    }
`