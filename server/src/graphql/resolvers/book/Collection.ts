import type { Request } from 'express'
import { Types } from 'mongoose'
import CollectionModel from '../../../models/Collection.ts'
import { verifyToken } from '../../../utils/Validation.ts'

interface Query {
    user_id: Types.ObjectId
    title?: {
        $regex: string
        $options: 'i'
    }
}
const Collection = async (_: null, args: { search: string, page: number }, context: { req: Request }) => {
    const t = context.req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { search = '', page } = args
        const limit = 9
        const query: Query = { user_id: id }
        if (search) query.title = { $regex: search, $options: 'i' }
        const [bookCollection, totalCollection] = await Promise.all([
            CollectionModel.find(query)
                .sort({ created: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            CollectionModel.countDocuments(query)
        ])
        return {
            found: bookCollection.length,
            collection: bookCollection.map(book => ({
                author_key: book.author_key,
                cover_edition_key: book.cover_edition_key,
                cover_i: book.cover_i,
                title: book.title,
                author_name: book.author_name
            })),
            totalCollection
        }
    } catch (e) {
        throw e
    }
}
export default Collection