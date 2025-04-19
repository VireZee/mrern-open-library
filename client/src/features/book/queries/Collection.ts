import { gql } from '@apollo/client'

export default gql`
    query Collection($search: String, $page: Int!) {
        collection(search: $search, page: $page) {
            found
            collection {
                author_key
                cover_edition_key
                cover_i
                title
                author_name
            }
            totalCollection
        }
    }
`