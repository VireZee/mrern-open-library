import { gql } from '@apollo/client'

export default gql`
    mutation Password($id: String!, $token: String!, $pass: String!, $rePass: String, $show: Boolean!) {
        password(id: $id, token: $token, pass: $pass, rePass: $rePass, show: $show)
    }
`