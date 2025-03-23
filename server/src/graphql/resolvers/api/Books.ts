import { Types } from 'mongoose'
import Collection from '../../../models/Collection.ts'

const Books = async (parent: { id: Types.ObjectId }) => {
    try {
        const { id } = parent
        const books = await Collection.find({ user_id: id })
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
export default Books