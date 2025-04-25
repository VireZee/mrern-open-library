import type Collection from '@type/models/collection.d.ts'
export const formatBooksMap = (books: Collection[]) => {
    return books.map(book => ({
        author_key: book.author_key,
        cover_edition_key: book.cover_edition_key,
        cover_i: book.cover_i,
        title: book.title,
        author_name: book.author_name
    }))
}
export const formatBooksFind = (books: Collection[], author_key: string[], cover_edition_key: string, cover_i: number) => {
    return books.find(book =>
        book.author_key.length === author_key.length &&
        book.author_key.every((val, i) => val === author_key[i]) &&
        book.cover_edition_key === cover_edition_key &&
        book.cover_i === cover_i
    )
}