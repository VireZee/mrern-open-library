import { gql } from '@apollo/client'
export default gql`
    mutation Add($author_key: [String!]!, $cover_edition_key: String!, $cover_i: Int!, $title: String!, $author_name: [String!]!) {
        add(author_key: $author_key, cover_edition_key: $cover_edition_key, cover_i: $cover_i, title: $title, author_name: $author_name)
    }
`