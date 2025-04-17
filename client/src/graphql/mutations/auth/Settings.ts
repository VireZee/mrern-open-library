import { gql } from '@apollo/client'

export const SETTINGS = gql`
    mutation Settings($photo: String!, $name: String!, $username: String!, $email: String!, $oldPass: String, $newPass: String, $rePass: String, $show: Boolean!) {
        settings(photo: $photo, name: $name, username: $username, email: $email, oldPass: $oldPass, newPass: $newPass, rePass: $rePass, show: $show)
    }
`
export const DELETE = gql`
    mutation {
        terminate
    }
`