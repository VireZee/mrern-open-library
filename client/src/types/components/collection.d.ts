export type CollectionProps = {
    search: string
}
export type CollectionData = {
    found: number
    collection: {
        author_key: string[]
        cover_edition_key: string
        cover_i: number
        title: string
        author_name: string[]
    }[]
    totalCollection: number
}