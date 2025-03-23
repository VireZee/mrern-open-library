import { gql } from '@apollo/client'

export const SETTINGS = gql`
    mutation Settings($photo: String!, $name: String!, $uname: String!, $email: String!, $oldPass: String, $newPass: String, $rePass: String, $show: Boolean!) {
        settings(photo: $photo, name: $name, uname: $uname, email: $email, oldPass: $oldPass, newPass: $newPass, rePass: $rePass, show: $show)
    }
`
export const DELETE = gql`
    mutation {
        delete
    }
`