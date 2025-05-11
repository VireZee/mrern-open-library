import { gql } from '@apollo/client'
export default gql`
    query Auth {
        auth {
            photo
            name
            username
            email
            verified
        }
    }
`