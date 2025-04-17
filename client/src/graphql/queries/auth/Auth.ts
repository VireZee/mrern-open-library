import { gql } from '@apollo/client'

const AUTH = gql`
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
export default AUTH