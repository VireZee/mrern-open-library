import { gql } from '@apollo/client'
export const HOME = gql`
    query Home($search: String, $page: Int!) {
        home(search: $search, page: $page) {
            numFound
            docs {
                author_key
                cover_edition_key
                cover_i
                title
                author_name
            }
        }
    }
`
export const FETCH = gql`
    query Fetch($author_key: [String!]!, $cover_edition_key: String!, $cover_i: Int!) {
        fetch(author_key: $author_key, cover_edition_key: $cover_edition_key, cover_i: $cover_i) {
            id
            added
        }
    }
`