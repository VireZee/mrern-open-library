import { gql } from '@apollo/client'

export default gql`
    mutation Forget($email: String!) {
        verify(email: $email)
    }
`