import { gql } from '@apollo/client'

const ADD = gql`
    mutation Remove($author_key: [String!]!, $cover_edition_key: String!, $cover_i: Int!, $title: String!, $author_name: String!) {
        add(author_key: $author_key, cover_edition_key: $cover_edition_key, cover_i: $cover_i, title: $title, author_name: $author_name)
    }
`
export default ADD