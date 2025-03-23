import type { Request } from 'express'
import Collection from '../../../models/Collection.ts'
import { verifyToken } from '../../../utils/Validation.ts'

const Fetch = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number }, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { author_key, cover_edition_key, cover_i } = args
        const bookCollection = await Collection.findOne({
            user_id: id,
            author_key: { $in: author_key },
            cover_edition_key,
            cover_i
        })
        return {
            key: `${author_key.sort().join(',')}|${cover_edition_key}|${cover_i}`,
            added: !!bookCollection
        }
    } catch (e) {
        throw e
    }
}
export default Fetch