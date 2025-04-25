import { gql } from '@apollo/client'

export default gql`
    mutation Reset($id: String!, $token: String!, $pass: String!, $rePass: String, $show: Boolean!) {
        reset(id: $id, token: $token, pass: $pass, rePass: $rePass, show: $show)
    }
`