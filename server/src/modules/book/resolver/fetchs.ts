import Collection from '@models/collection.ts'
import type { User } from '@type/models/user.d.ts'

const fetch = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number }, context: { user: User }) => {
    const { user } = context
    try {
        const { author_key, cover_edition_key, cover_i } = args
        const bookCollection = await Collection.findOne({
            user_id: user._id,
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
export default fetch