import { gql } from '@apollo/client'

const VERIFY = gql`
    mutation Verify($code: String!) {
        verify(code: $code)
    }
`
export default VERIFY