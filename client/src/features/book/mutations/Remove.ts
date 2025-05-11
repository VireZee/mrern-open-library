import { gql } from '@apollo/client'
export default gql`
    mutation Remove($author_key: [String!]!, $cover_edition_key: String!, $cover_i: Int!) {
        remove(author_key: $author_key, cover_edition_key: $cover_edition_key, cover_i: $cover_i)
    }
`