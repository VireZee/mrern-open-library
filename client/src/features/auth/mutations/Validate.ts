import { gql } from '@apollo/client'

export default gql`
    mutation Validate($id: String!, $token: String!) {
        validate(id: $id, token: $token)
    }
`