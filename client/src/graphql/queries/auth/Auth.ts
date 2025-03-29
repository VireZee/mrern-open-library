import { gql } from '@apollo/client'

const AUTH = gql`
    query Auth {
        auth {
            photo
            name
            uname
            email
            verified
        }
    }
`
export default AUTH