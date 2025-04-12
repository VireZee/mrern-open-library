import userModel from '@models/users.ts'
import collection from '@models/collections.ts'
import type ICollection from '@type/models/collection.d.ts'
import type ICollection from '@type/models/collection.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'

const booksChild = async (parent: { api: string }, _: null, context: { user: User } ) => {
    try {
        const { api } = parent
        const { user: authUser } = context
        const hashBuffer = Buffer.from(api, 'hex')
        const key = sanitizeRedisKey('collection', authUser.id)
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