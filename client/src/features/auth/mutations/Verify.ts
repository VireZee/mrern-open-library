import { gql } from '@apollo/client'
export default gql`
    mutation Verify($code: String!) {
        verify(code: $code)
    }
`