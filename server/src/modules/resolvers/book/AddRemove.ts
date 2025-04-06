import Collection from '../../../models/Collection.ts'

const AddRemove = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number, title: string, author_name: string[] }, context: { user: any }) => {
    const { user } = context
    try {
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const bookCollection = await Collection.findOne({
            user_id: user.id,
            author_key: { $in: author_key },
            cover_edition_key,
            cover_i
        })
        if (bookCollection) await Collection.deleteOne({ _id: bookCollection._id })
        else {
            await Collection.create({
                user_id: user.id,
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