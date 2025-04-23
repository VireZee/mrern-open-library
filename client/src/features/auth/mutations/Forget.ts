import { gql } from '@apollo/client'

export default gql`
    mutation Forget($email: String!) {
        forget(email: $email)
    }
`