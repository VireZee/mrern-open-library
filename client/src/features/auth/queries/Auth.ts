import { gql } from '@apollo/client'
export default gql`
    query Auth {
        auth {
            google
            photo
            name
            username
            email
            verified
        }
    }
`