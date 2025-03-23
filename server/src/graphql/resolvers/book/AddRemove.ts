import type { Request } from 'express'
import Collection from '../../../models/Collection.ts'
import { verifyToken } from '../../../utils/Validation.ts'

const AddRemove = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number, title: string, author_name: string[] }, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const bookCollection = await Collection.findOne({
            user_id: id,
            author_key: { $in: author_key },
            cover_edition_key,
            cover_i
        })
        if (bookCollection) await Collection.deleteOne({ _id: bookCollection._id })
        else {
            await Collection.create({
                user_id: id,
                author_key,
                cover_edition_key,
                cover_i,
                title,
                author_name,
                created: new Date()
            })
        }
        return true
    } catch (e) {
        throw e
    }
}
export default AddRemove