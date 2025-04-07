import collection from '@models/collection.ts'
import type ICollection from '@type/models/collection.d.ts'

const books = async (parent: { id: ObjectId }) => {
    try {
        const { id } = parent
        const books: ICollection[] = await collection.find({ user_id: id })
        return books.map(book => ({
            author_key: book.author_key,
            cover_edition_key: book.cover_edition_key,
            cover_i: book.cover_i,
            title: book.title,
            author_name: book.author_name
        }))
    } catch (e) {
        throw e
    }
}
export default books