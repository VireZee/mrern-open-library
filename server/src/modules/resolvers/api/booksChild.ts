import userModel from '@models/user.ts'
import collection from '@models/collection.ts'
import type ICollection from '@type/models/collection.d.ts'

const booksChild = async (parent: { api: string }) => {
    try {
        const { api } = parent
        const hashBuffer = Buffer.from(api, 'hex')
        const user = await userModel.findOne({ api_key: hashBuffer })
        const books: ICollection[] = await collection.find({ user_id: user!._id })
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
export default booksChild