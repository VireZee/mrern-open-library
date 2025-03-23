import { gql } from '@apollo/client'

const GENERATE = gql`
    mutation Generate {
        generate
    }
`
export default GENERATE