import { gql } from '@apollo/client'

const REGISTER = gql`
    mutation Register($name: String!, $uname: String!, $email: String!, $pass: String!, $rePass: String, $show: Boolean!) {
        register(name: $name, uname: $uname, email: $email, pass: $pass, rePass: $rePass, show: $show)
    }
`
export default REGISTER