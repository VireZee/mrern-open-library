import type Collection from '@type/models/collection.js'

export default async (data: Collection[]) => {
    return data.map(book => ({
        author_key: book.author_key,
        cover_edition_key: book.cover_edition_key,
        cover_i: book.cover_i,
        title: book.title,
        author_name: book.author_name
    }))
}