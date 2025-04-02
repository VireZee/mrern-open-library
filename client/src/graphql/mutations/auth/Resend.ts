import { gql } from '@apollo/client'

const RESEND = gql`
    mutation Verify {
        resend
    }
`
export default RESEND