import { gql } from '@apollo/client'

const RESEND = gql`
    mutation Resend {
        resend
    }
`
export default RESEND